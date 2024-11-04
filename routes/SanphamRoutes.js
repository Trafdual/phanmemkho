const router = require('express').Router()
const SanPham = require('../models/SanPhamModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const Depot = require('../models/DepotModel')
const momenttimezone = require('moment-timezone')
const moment = require('moment')
const DieuChuyen = require('../models/DieuChuyenModel')
const mongoose = require('mongoose')
let clients = []
let hasSentMessage = false
const DungLuongSku = require('../models/DungluongSkuModel')

router.get('/events', (req, res) => {
  console.log('Client connected to events API') // Thông báo khi có client kết nối
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()
  try {
    clients.push(res)

    // Dọn dẹp khi client ngắt kết nối
    req.on('close', () => {
      clients = clients.filter(client => client !== res)
      console.log('Client disconnected from events API')
    })
  } catch (error) {
    console.error('Error in events API:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Hàm gửi sự kiện cho tất cả client
const sendEvent = data => {
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(data)}\n\n`)
  })
}

router.get('/getsanpham/:idloaisanpham', async (req, res) => {
  try {
    const idloai = req.params.idloaisanpham
    const loaisanpham = await LoaiSanPham.findById(idloai)
    const sanpham = await Promise.all(
      loaisanpham.sanpham.map(async sp => {
        const sp1 = await SanPham.findById(sp._id)
        const sku = await DungLuongSku.findById(sp1.dungluongsku)
        return {
          masp: sp1.masp,
          masku: sku.madungluong,
          _id: sp1._id,
          imel: sp1.imel,
          name: sp1.name,
          price: sp1.price,
          quantity: 1, // Khởi tạo số lượng mặc định là 1
          xuat: sp1.xuat
        }
      })
    )

    // Gộp thông tin theo mã SKU
    const groupedProducts = sanpham.reduce((acc, product) => {
      const { masku, imel, price, name } = product

      if (!acc[masku]) {
        acc[masku] = {
          ...product,
          imel: new Set([imel]), // Bắt đầu với Set để lưu các imel duy nhất
          quantity: 0, // Tổng số lượng
          total: 0 // Tổng thành tiền
        }
      }

      acc[masku].imel.add(imel) // Thêm imel vào Set
      acc[masku].quantity += product.quantity // Cộng dồn số lượng
      acc[masku].total += price * product.quantity // Tính thành tiền

      return acc
    }, {})

    // Chuyển đổi đối tượng gộp về mảng
    const result = Object.values(groupedProducts).map(product => ({
      masku: product.masku,
      name: product.name,
      imel: Array.from(product.imel).join(','), // Chuyển Set thành mảng và kết hợp imel thành chuỗi
      quantity: product.quantity,
      price: parseFloat(product.total / product.quantity),
      total: product.total
    }))

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getsanphambySKU/:sku/:idloaisanpham', async (req, res) => {
  try {
    const skuCode = req.params.sku
    const idloaisanpham = req.params.idloaisanpham

    // Lấy loại sản phẩm và kiểm tra tồn tại
    const loaisanpham = await LoaiSanPham.findById(idloaisanpham).populate(
      'sanpham'
    )

    if (!loaisanpham) {
      return res.status(404).json({ message: 'Không tìm thấy loại sản phẩm.' })
    }

    // Lọc sản phẩm trong loại sản phẩm với mã SKU
    const matchingProducts = await Promise.all(
      loaisanpham.sanpham.map(async sp => {
        const spDetails = await SanPham.findById(sp._id).populate(
          'dungluongsku'
        )

        // Kiểm tra SKU
        if (spDetails.dungluongsku.madungluong === skuCode) {
          return {
            _id: spDetails._id,
            masp: spDetails.masp,
            imel: spDetails.imel,
            name: spDetails.name,
            price: spDetails.price,
            xuat: spDetails.xuat
          }
        }
      })
    )

    // Loại bỏ các giá trị không hợp lệ
    const result = matchingProducts.filter(product => product !== undefined)

    if (result.length === 0) {
      return res.status(404).json({
        message: 'Không có sản phẩm nào với SKU này trong loại sản phẩm.'
      })
    }

    res.json(result)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Đã xảy ra lỗi khi lấy sản phẩm theo SKU.' })
  }
})

router.post('/postsp/:idloaisanpham', async (req, res) => {
  try {
    const idloai = req.params.idloaisanpham
    const { imelList, name, price, madungluongsku } = req.body // imelList là danh sách imel
    const loaisanpham = await LoaiSanPham.findById(idloai)
    const kho = await Depot.findById(loaisanpham.depot)
    const dungluongsku = await DungLuongSku.findOne({
      madungluong: madungluongsku
    })

    const addedProducts = []

    for (const imel of imelList) {
      const sp = await SanPham.findOne({ imel })
      if (sp) {
        continue
      }

      const sanpham = new SanPham({
        name,
        imel,
        datenhap: loaisanpham.date,
        price
      })

      const masp = 'SP' + sanpham._id.toString().slice(-5)
      kho.sanpham.push(sanpham._id)
      sanpham.kho = kho._id
      sanpham.masp = masp
      sanpham.datexuat = ''
      sanpham.xuat = false
      sanpham.loaisanpham = loaisanpham._id
      dungluongsku.sanpham.push(sanpham._id)
      sanpham.dungluongsku = dungluongsku._id
      await sanpham.save()
      loaisanpham.sanpham.push(sanpham._id)
      await loaisanpham.save()
      await kho.save()
      await dungluongsku.save()

      sendEvent({ message: `Sản phẩm mới đã được thêm: ${imel}` })

      addedProducts.push(sanpham)
    }

    res.json(addedProducts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postsp1/:idloaisanpham', async (req, res) => {
  try {
    const idloai = req.params.idloaisanpham
    const { products } = req.body // `name` và `price` được gửi trong từng sản phẩm trong `products`

    const loaisanpham = await LoaiSanPham.findById(idloai)
    const kho = await Depot.findById(loaisanpham.depot)
    const addedProducts = []

    for (const product of products) {
      const { madungluongsku, imelList, name, price } = product
      const dungluongsku = await DungLuongSku.findOne({
        madungluong: madungluongsku
      })

      for (const imel of imelList) {
        const sp = await SanPham.findOne({ imel })
        if (sp) continue

        const sanpham = new SanPham({
          name,
          imel,
          datenhap: loaisanpham.date,
          price
        })

        const masp = 'SP' + sanpham._id.toString().slice(-5)
        kho.sanpham.push(sanpham._id)
        sanpham.kho = kho._id
        sanpham.masp = masp
        sanpham.datexuat = ''
        sanpham.xuat = false
        sanpham.loaisanpham = loaisanpham._id
        dungluongsku.sanpham.push(sanpham._id)
        sanpham.dungluongsku = dungluongsku._id

        await sanpham.save()
        loaisanpham.sanpham.push(sanpham._id)
        await loaisanpham.save()
        await kho.save()
        await dungluongsku.save()

        sendEvent({ message: `Sản phẩm mới đã được thêm: ${imel}` })

        addedProducts.push(sanpham)
      }
    }

    res.json(addedProducts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postsp', async (req, res) => {
  try {
    const { imel, name, capacity, color, tenloai } = req.body
    const vietnamTime = momenttimezone().toDate()
    const loaisanpham = await LoaiSanPham.findOne({ name: tenloai })
    const sanpham = new SanPham({
      name,
      capacity,
      color,
      imel,
      datenhap: vietnamTime
    })
    sanpham.datexuat = ''
    sanpham.loaisanpham = loaisanpham._id
    await sanpham.save()
    loaisanpham.sanpham.push(sanpham._id)
    await loaisanpham.save()
    res.json(sanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.get('/getloaisanpham', async (req, res) => {
  try {
    const depotId = req.session.depotId
    const depot = await Depot.findById(depotId)
    const loaisanpham = await Promise.all(
      depot.loaisanpham.map(async loai => {
        const loaisp = await LoaiSanPham.findById(loai._id)
        return {
          _id: loaisp._id,
          name: loaisp.name
        }
      })
    )
    res.render('nhapkho', { loaisanpham })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/putsp/:idsanpham', async (req, res) => {
  try {
    const idsanpham = req.params.idsanpham
    const { imel, name, capacity, color } = req.body
    const sanpham = await SanPham.findByIdAndUpdate(idsanpham, {
      imel,
      name,
      capacity,
      color
    })
    await sanpham.save()
    res.json(sanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getchitietsp/:idsanpham', async (req, res) => {
  try {
    const idsanpham = req.params.idsanpham
    const sanpham = await SanPham.findById(idsanpham)
    const sanphamjson = {
      _id: sanpham._id,
      imel: sanpham.imel,
      name: sanpham.name,
      capacity: sanpham.capacity,
      color: sanpham.color,
      xuat: sanpham.xuat
    }
    res.json(sanphamjson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/deletesp/:idsanpham', async (req, res) => {
  try {
    const idsanpham = req.params.idsanpham
    const sanpham = await SanPham.findById(idsanpham)
    const loaisanpham = await LoaiSanPham.findById(sanpham.loaisanpham)
    loaisanpham.sanpham = loaisanpham.sanpham.filter(sp => sp._id != idsanpham)
    await loaisanpham.save()
    await SanPham.deleteOne({ _id: idsanpham })
    res.json(sanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postest', async (req, res) => {
  try {
    const { imel } = req.body
    const sanpham = new SanPham({ imel })
    await sanpham.save()
    res.json(sanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.post('/xuatkho/:idsanpham/:idloaisp/:khoid', async (req, res) => {
  try {
    const idsanpham = req.params.idsanpham
    const idloaisp = req.params.idloaisp
    const khoid = req.params.khoid

    const sanpham1 = await SanPham.findById(idsanpham)
    const loaisanpham = await LoaiSanPham.findById(idloaisp)
    const kho = await Depot.findById(khoid)
    const sanpham = await Promise.all(
      loaisanpham.sanpham.map(async sp => {
        const sp1 = await SanPham.findById(sp._id)
        return {
          masp: sp1.masp,
          _id: sp1._id,
          imel: sp1.imel,
          name: sp1.name,
          capacity: sp1.capacity,
          color: sp1.color,
          xuatStatus: sp1.xuat ? 'Đã xuất' : 'tồn kho'
        }
      })
    )
    loaisanpham.sanpham = loaisanpham.sanpham.filter(sp => sp._id != idsanpham)

    const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').toDate()

    sanpham1.xuat = true
    sanpham1.datexuat = moment(vietnamTime).format('YYYY-MM-DD HH:mm:ss')
    kho.xuatkho.push(sanpham1._id)
    await sanpham1.save()
    await loaisanpham.save()
    await kho.save()
    res.json(sanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/xuatkho1/:idloaisp/:khoid', async (req, res) => {
  try {
    const { idsanpham1 } = req.body
    const idloaisp = req.params.idloaisp
    const khoid = req.params.khoid
    const sanphamList = []
    for (const idsanpham of idsanpham1) {
      const sanpham1 = await SanPham.findById(idsanpham)
      const loaisanpham = await LoaiSanPham.findById(idloaisp)
      const kho = await Depot.findById(khoid)
      const sanpham = await Promise.all(
        loaisanpham.sanpham.map(async sp => {
          const sp1 = await SanPham.findById(sp._id)
          return {
            masp: sp1.masp,
            _id: sp1._id,
            imel: sp1.imel,
            name: sp1.name,
            capacity: sp1.capacity,
            color: sp1.color,
            xuatStatus: sp1.xuat ? 'Đã xuất' : 'tồn kho'
          }
        })
      )
      loaisanpham.sanpham = loaisanpham.sanpham.filter(
        sp => sp._id != idsanpham
      )

      const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').toDate()

      sanpham1.xuat = true
      sanpham1.datexuat = moment(vietnamTime).format('YYYY-MM-DD HH:mm:ss')
      kho.xuatkho.push(sanpham1._id)
      await sanpham1.save()
      await kho.save()
      await loaisanpham.save()
      sanphamList.push(...sanpham)
    }
    res.json(sanphamList)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/chuyenkho/:idsanpham', async (req, res) => {
  try {
    const idsanpham = req.params.idsanpham
    const { tenkho } = req.body
    const kho = await Depot.findOne({ name: tenkho }).populate('loaisanpham')
    const sanpham = await SanPham.findById(idsanpham)
    const loaisp = await LoaiSanPham.findById(sanpham.loaisanpham)
    const kho1 = await Depot.findById(loaisp.depot)
    loaisp.sanpham = loaisp.sanpham.filter(sp => sp._id != idsanpham)
    const isLoaiSPInKho = kho.loaisanpham.find(
      item => item.malsp === loaisp.malsp
    )

    const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').toDate()
    const dieuchuyen = new DieuChuyen({
      sanpham: sanpham._id,
      loaisanpham: loaisp._id,
      nhacungcap: loaisp.nhacungcap,
      depot: kho1._id,
      trangthai: `Điều chuyển từ kho ${kho1.name} sang kho ${kho.name}`,
      date: moment(vietnamTime).format('YYYY-MM-DD HH:mm:ss')
    })
    kho1.dieuchuyen.push(dieuchuyen._id)

    if (!isLoaiSPInKho) {
      const lsp = new LoaiSanPham({
        name: loaisp.name,
        depot: kho._id,
        date: moment(loaisp.date).format('YYYY-MM-DD'),
        malsp: loaisp.malsp,
        nhacungcap: loaisp.nhacungcap
      })
      lsp.sanpham.push(sanpham._id)
      lsp.soluong = lsp.sanpham.length
      lsp.tongtien = parseFloat((loaisp.tongtien / loaisp.soluong).toFixed(1))
      lsp.average = parseFloat((loaisp.tongtien / loaisp.soluong).toFixed(1))
      kho.loaisanpham.push(lsp._id)

      await lsp.save()
      await kho.save()
    } else {
      const loaiSPInKho = await LoaiSanPham.findById(isLoaiSPInKho._id)
      console.log(isLoaiSPInKho._id)
      loaiSPInKho.sanpham.push(sanpham._id)
      loaiSPInKho.soluong = loaiSPInKho.sanpham.length
      loaiSPInKho.tongtien = parseFloat(
        (loaiSPInKho.tongtien + loaisp.tongtien / loaisp.soluong).toFixed(2)
      )
      loaiSPInKho.average = parseFloat(
        (loaiSPInKho.tongtien / loaiSPInKho.soluong).toFixed(1)
      )
      await loaiSPInKho.save()
    }
    await loaisp.save()
    await dieuchuyen.save()
    await kho1.save()
    res.json({ message: 'Chuyển kho thành công!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Có lỗi xảy ra.' })
  }
})

router.post('/chuyenkho1', async (req, res) => {
  try {
    const { idsanpham1, tenkho } = req.body
    const kho = await Depot.findOne({ name: tenkho }).populate('loaisanpham')
    const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').toDate()

    // Biến lưu lại loại sản phẩm vừa tạo để sử dụng lại trong vòng lặp
    let createdLoaiSP = {}

    for (const idsanpham of idsanpham1) {
      const sanpham = await SanPham.findById(idsanpham)
      const loaisp = await LoaiSanPham.findById(sanpham.loaisanpham)
      const kho1 = await Depot.findById(loaisp.depot)

      // Cập nhật điều chuyển
      const dieuchuyen = new DieuChuyen({
        sanpham: sanpham._id,
        loaisanpham: loaisp._id,
        nhacungcap: loaisp.nhacungcap,
        depot: kho1._id,
        trangthai: `Điều chuyển từ kho ${kho1.name} sang kho ${kho.name}`,
        date: moment(vietnamTime).format('YYYY-MM-DD HH:mm:ss')
      })

      kho1.dieuchuyen.push(dieuchuyen._id)

      loaisp.sanpham = loaisp.sanpham.filter(sp => sp._id != idsanpham)
      loaisp.conlai = loaisp.sanpham.length

      // Kiểm tra xem loại sản phẩm đã tồn tại trong kho đích chưa
      let loaiSPInKho = kho.loaisanpham.find(
        item => item.malsp === loaisp.malsp
      )

      if (!loaiSPInKho) {
        // Nếu chưa tồn tại, kiểm tra trong biến createdLoaiSP để tránh tạo mới nhiều lần
        if (!createdLoaiSP[loaisp.malsp]) {
          // Nếu loại sản phẩm chưa có, tạo mới và lưu vào createdLoaiSP
          const newLoaiSP = new LoaiSanPham({
            name: loaisp.name,
            depot: kho._id,
            date: moment(loaisp.date).format('YYYY-MM-DD'),
            malsp: loaisp.malsp,
            nhacungcap: loaisp.nhacungcap
          })
          newLoaiSP.sanpham.push(sanpham._id)
          newLoaiSP.soluong = loaisp.soluong
          newLoaiSP.conlai = newLoaiSP.sanpham.length
          newLoaiSP.tongtien = loaisp.tongtien
          newLoaiSP.average = loaisp.average
          kho.loaisanpham.push(newLoaiSP._id)
          kho.sanpham.push(sanpham._id)
          sanpham.kho = kho._id
          sanpham.loaisanpham = newLoaiSP._id
          await sanpham.save()
          await newLoaiSP.save()
          await kho.save()

          createdLoaiSP[loaisp.malsp] = newLoaiSP
        } else {
          // Nếu loại sản phẩm đã được tạo trong lần trước, sử dụng lại
          const existingLoaiSP = createdLoaiSP[loaisp.malsp]
          existingLoaiSP.sanpham.push(sanpham._id)
          kho.sanpham.push(sanpham._id)
          sanpham.kho = kho._id
          sanpham.loaisanpham = existingLoaiSP._id
          existingLoaiSP.conlai = existingLoaiSP.sanpham.length
          await sanpham.save()
          await kho.save()

          await existingLoaiSP.save()
        }
      } else {
        // Nếu loại sản phẩm đã tồn tại trong kho đích, chỉ cần cập nhật thông tin sản phẩm
        loaiSPInKho = await LoaiSanPham.findById(loaiSPInKho._id)
        loaiSPInKho.sanpham.push(sanpham._id)
        kho.sanpham.push(sanpham._id)
        sanpham.kho = kho._id
        sanpham.loaisanpham = loaiSPInKho._id
        loaiSPInKho.conlai = loaiSPInKho.sanpham.length
        await sanpham.save()
        await kho.save()
        await loaiSPInKho.save()
      }

      await loaisp.save()
      await dieuchuyen.save()
      await kho1.save()
    }

    res.json({ message: 'Chuyển kho hàng loạt thành công!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Có lỗi xảy ra.' })
  }
})

router.post('/chuyenkho2/:khoId', async (req, res) => {
  try {
    const { idsanpham1, tenkho, diengiai } = req.body
    const khoId = req.params.khoId
    const kho1 = await Depot.findById(khoId)
    const kho = await Depot.findOne({ name: tenkho }).populate('loaisanpham')
    const vietnamTime = moment().tz('Asia/Ho_Chi_Minh').toDate()

    const loaisp1 = new LoaiSanPham({
      diengiai: diengiai,
      date: moment(vietnamTime).format('YYYY-MM-DD HH:mm:ss'),
      hour: moment(vietnamTime).format('YYYY-MM-DD HH:mm:ss'),
      depot: kho._id,
      makhodiechuyen: kho1._id
    })
    const malsp = 'LH' + loaisp1._id.toString().slice(-5)
    loaisp1.malsp = malsp

    const dieuchuyen = new DieuChuyen({
      depot: kho1._id,
      trangthai: `Điều chuyển từ kho ${kho1.name} sang kho ${kho.name}`,
      date: moment(vietnamTime).format('YYYY-MM-DD HH:mm:ss')
    })

    for (const idsanpham of idsanpham1) {
      const sanpham = await SanPham.findById(idsanpham)
      const loaisp = await LoaiSanPham.findById(sanpham.loaisanpham)

      kho1.dieuchuyen.push(dieuchuyen._id)

      loaisp.sanpham = loaisp.sanpham.filter(sp => sp._id != idsanpham)
      loaisp.conlai = loaisp.sanpham.length
    }
    res.json({ message: 'Chuyển kho hàng loạt thành công!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Có lỗi xảy ra.' })
  }
})

router.get('/getxuatkho/:khoid', async (req, res) => {
  try {
    const khoid = req.params.khoid
    const kho = await Depot.findById(khoid)
    const sp1 = await Promise.all(
      kho.xuatkho.map(async sp => {
        const sp1 = await SanPham.findById(sp)
        const loaisp = await LoaiSanPham.findById(sp1.loaisanpham)
        return {
          _id: sp1._id,
          malohang: loaisp.malsp,
          masp: sp1.masp,
          tenmay: sp1.name,
          ngaynhap: moment(loaisp.date).format('DD/MM/YYYY'),
          ngayxuat: moment(sp1.datexuat).format('DD/MM/YYYY')
        }
      })
    )
    res.json(sp1)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.post('/deletexuatkho/:idkho', async (req, res) => {
  try {
    const { idsp } = req.body
    const idkho = req.params.idkho
    const kho = await Depot.findById(idkho)
    for (const idsp1 of idsp) {
      const sanpham = await SanPham.findById(idsp1)
      kho.xuatkho = kho.xuatkho.filter(
        sp => sp._id.toString() !== sanpham._id.toString()
      )
      await SanPham.findByIdAndDelete(sanpham._id)
      await kho.save()
    }
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/searchsanpham/:khoid', async (req, res) => {
  try {
    const { keyword, searchType } = req.body
    const khoid = req.params.khoid

    const kho = await Depot.findById(khoid)
    if (!kho) {
      return res.json({ message: 'Kho không tồn tại.' })
    }

    let query = {}
    if (searchType === '3 số đầu imel') {
      query = { imel: { $regex: `^${keyword}`, $options: 'i' } }
    } else if (searchType === '3 số cuối imel') {
      query = { imel: { $regex: `${keyword}$`, $options: 'i' } }
    } else {
      query = {
        $or: [{ name: { $regex: keyword, $options: 'i' } }]
      }
    }
    query.kho = khoid
    const products = await SanPham.find(query)
    const product = await Promise.all(
      products.map(async product => {
        const loaisp = await LoaiSanPham.findById(product.loaisanpham)
        return {
          _id: product._id,
          malohang: loaisp.malsp,
          masp: product.masp,
          name: product.name,
          imel: product.imel,
          capacity: product.capacity,
          color: product.color,
          xuat: product.xuat,
          tralai: product.tralai
        }
      })
    )
    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/putsomeproduct', async (req, res) => {
  try {
    const { products } = req.body

    const updatePromises = products.map(async product => {
      return await SanPham.findByIdAndUpdate(
        product._id,
        {
          imel: product.imel,
          price: product.price
        },
        { new: true }
      )
    })

    const updatedProducts = await Promise.all(updatePromises)

    res.status(200).json({
      message: 'Cập nhật sản phẩm thành công',
      data: updatedProducts
    })
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error)
    res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật sản phẩm.' })
  }
})

module.exports = router

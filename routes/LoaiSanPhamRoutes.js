const router = require('express').Router()
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const Depot = require('../models/DepotModel')
const NhanCungCap = require('../models/NhanCungCapModel')
const TraNo = require('../models/TraNoModel')
const NganHang = require('../models/NganHangKhoModel')
const SanPham = require('../models/SanPhamModel')
const DungLuongSku = require('../models/DungluongSkuModel')
const { sendEvent } = require('./sendEvent')

const moment = require('moment')

router.get('/getloaisanphamweb', async (req, res) => {
  try {
    const depotId = req.session.depotId
    const depot = await Depot.findById(depotId)
    const loaisanpham = await Promise.all(
      depot.loaisanpham.map(async loai => {
        const loaisp = await LoaiSanPham.findById(loai._id)
        return {
          _id: loaisp._id,
          name: loaisp.name,
          soluong: loaisp.soluong,
          tongtien: loaisp.tongtien,
          date: moment(loaisp.date).format('DD/MM/YYYY'),
          average: loaisp.average,
          conlai: loaisp.conlai
        }
      })
    )
    res.json(loaisanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.get('/getloaisanpham/:nccId', async (req, res) => {
  try {
    const nccId = req.params.nccId
    const nhacungcap = await NhanCungCap.findById(nccId)
    const loaisanpham = await Promise.all(
      nhacungcap.loaisanpham.map(async loai => {
        const loaisp = await LoaiSanPham.findById(loai._id)
        const tongtien = loaisp.sanpham.reduce(
          (sum, product) => sum + (product.price || 0),
          0
        )

        return {
          _id: loaisp._id,
          malsp: loaisp.malsp,
          name: loaisp.name,
          tongtien: tongtien,
          date: moment(loaisp.date).format('DD/MM/YYYY'),
          conlai: loaisp.sanpham.length || 0
        }
      })
    )
    res.json(loaisanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.post('/postloaisanpham/:nccId', async (req, res) => {
  try {
    const nccId = req.params.nccId

    const { name, tongtien, soluong, date } = req.body
    const nhacungcap = await NhanCungCap.findById(nccId)
    const depot = await Depot.findById(nhacungcap.depotId)
    const formattedDate = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')

    const loaisanpham = new LoaiSanPham({
      name,
      depot: depot._id,
      tongtien,
      soluong,
      date: formattedDate,
      nhacungcap: nhacungcap._id
    })
    loaisanpham.average = parseFloat((tongtien / soluong).toFixed(1))
    const malsp = 'LH' + loaisanpham._id.toString().slice(-5)
    loaisanpham.malsp = malsp

    await loaisanpham.save()
    depot.loaisanpham.push(loaisanpham._id)
    nhacungcap.loaisanpham.push(loaisanpham._id)
    await nhacungcap.save()
    await depot.save()
    const ncc = {
      _id: loaisanpham._id,
      malsp: loaisanpham.malsp,
      name: loaisanpham.name,
      soluong: loaisanpham.soluong,
      tongtien: loaisanpham.tongtien,
      date: moment(loaisanpham.date).format('DD/MM/YYYY'),
      average: loaisanpham.average
    }
    res.json(ncc)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getloaisanpham2/:depotID', async (req, res) => {
  try {
    const depotID = req.params.depotID
    const depot = await Depot.findById(depotID)
    const loaisanpham = await Promise.all(
      depot.loaisanpham.map(async loaisanpham => {
        const loaisp = await LoaiSanPham.findOne({
          _id: loaisanpham._id,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        }).populate('sanpham')

        if (!loaisp) return null

        return {
          _id: loaisp._id,
          malsp: loaisp.malsp,
          name: loaisp.name,
          tongtien: loaisp.tongtien,
          date: moment(loaisp.date).format('DD/MM/YYYY'),
          conlai: loaisp.sanpham.length
        }
      })
    )
    const filtered = loaisanpham.filter(item => item !== null)

    res.json(filtered)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postloaisanpham2', async (req, res) => {
  try {
    const {
      name,
      tongtien,
      date,
      mancc,
      ghino,
      hour,
      method,
      manganhangkho,
      loaihanghoa
    } = req.body
    const nhacungcap = await NhanCungCap.findOne({ mancc })
    const depot = await Depot.findById(nhacungcap.depotId)
    const formattedDate = moment(date).isValid() ? moment(date).toDate() : null
    if (!formattedDate) {
      return res.json({ message: 'Ngày không hợp lệ.' })
    }
    const formattedHour = moment(hour).isValid() ? moment(hour).toDate() : null
    if (!formattedHour) {
      return res.json({ message: 'Giờ không hợp lệ.' })
    }

    const nganhangkho = await NganHang.findOne({ manganhangkho: manganhangkho })
    const loaisanpham = new LoaiSanPham({
      name,
      depot: depot._id,
      tongtien,
      date: formattedDate,
      hour: formattedHour,
      nhacungcap: nhacungcap._id,
      loaihanghoa
    })
    if (ghino === 'ghino') {
      loaisanpham.ghino = true
      const trano = new TraNo({ nhacungcap: nhacungcap._id })
      let tienno = 0
      tienno += loaisanpham.tongtien
      trano.donno.push({
        loaisanpham: loaisanpham._id,
        tienno: tienno,
        tienphaitra: tienno,
        tiendatra: 0
      })
      trano.tongno = trano.donno.reduce((sum, item) => sum + item.tienno, 0)
      trano.tongtra = trano.donno.reduce((sum, item) => sum + item.tiendatra, 0)
      nhacungcap.trano.push(trano._id)
      await nhacungcap.save()
      await trano.save()
      await loaisanpham.save()
    } else {
      loaisanpham.ghino = false
      if (method === 'Tiền mặt') {
        loaisanpham.method = 'tienmat'
      }
      if (method === 'Chuyển khoản') {
        loaisanpham.method = 'chuyenkhoan'
        loaisanpham.nganhang = nganhangkho._id
      }
      await loaisanpham.save()
    }
    const malsp = 'LH' + loaisanpham._id.toString().slice(-5)
    loaisanpham.malsp = malsp
    await loaisanpham.save()
    depot.loaisanpham.push(loaisanpham._id)
    nhacungcap.loaisanpham.push(loaisanpham._id)
    await nhacungcap.save()
    await depot.save()
    const ncc = {
      _id: loaisanpham._id,
      malsp: loaisanpham.malsp,
      name: loaisanpham.name,
      tongtien: loaisanpham.tongtien,
      date: moment(loaisanpham.date).format('DD/MM/YYYY')
    }
    res.json(ncc)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/putloaisanpham/:idloai', async (req, res) => {
  try {
    const idloai = req.params.idloai
    const {
      name,
      tongtien,
      soluong,
      date,
      mancc,
      ghino,
      method,
      manganhangkho
    } = req.body

    const average = parseFloat((tongtien / soluong).toFixed(1))
    const loaisanpham = await LoaiSanPham.findById(idloai)
    const nganhang = await NganHang.findOne({ manganhangkho })
    const nhacungcap = await NhanCungCap.findOne({ mancc })
    const nhacungcap1 = await NhanCungCap.findById(loaisanpham.nhacungcap)

    loaisanpham.name = name
    loaisanpham.tongtien = tongtien
    loaisanpham.soluong = soluong
    loaisanpham.date = date
    loaisanpham.average = average

    if (loaisanpham.nhacungcap.toString() !== nhacungcap._id.toString()) {
      loaisanpham.nhacungcap = nhacungcap._id
      nhacungcap1.loaisanpham = nhacungcap1.loaisanpham.filter(
        id => id.toString() !== loaisanpham._id.toString()
      )
      nhacungcap.loaisanpham.push(loaisanpham._id)

      if (ghino === 'ghino' && loaisanpham.ghino) {
        const tranoList = await TraNo.findOne({
          'donno.loaisanpham': loaisanpham._id
        })
        nhacungcap1.trano = nhacungcap1.trano.filter(
          id => id.toString() !== tranoList._id.toString()
        )
        nhacungcap.trano.push(tranoList._id)
        tranoList.nhacungcap = nhacungcap._id

        await TraNo.findByIdAndUpdate(tranoList._id, tranoList)
        await NhanCungCap.findByIdAndUpdate(nhacungcap1._id, nhacungcap1)
        await NhanCungCap.findByIdAndUpdate(nhacungcap._id, nhacungcap)
      }

      if (ghino === 'ghino' && !loaisanpham.ghino) {
        const trano = new TraNo({ nhacungcap: nhacungcap._id })
        const tienno = loaisanpham.tongtien

        trano.donno.push({
          loaisanpham: loaisanpham._id,
          tienno: tienno,
          tienphaitra: tienno,
          tiendatra: 0
        })

        trano.tongno = tienno
        trano.tongtra = 0

        nhacungcap.trano.push(trano._id)
        await TraNo.create(trano)
        await NhanCungCap.findByIdAndUpdate(nhacungcap._id, nhacungcap)
      }
    } else {
      if (ghino === 'ghino') {
        loaisanpham.ghino = true
        loaisanpham.method = ''
        loaisanpham.nganhang = null

        const trano = new TraNo({ nhacungcap: nhacungcap1._id })
        const tienno = loaisanpham.tongtien

        trano.donno.push({
          loaisanpham: loaisanpham._id,
          tienno: tienno,
          tienphaitra: tienno,
          tiendatra: 0
        })

        trano.tongno = tienno
        trano.tongtra = 0

        nhacungcap1.trano.push(trano._id)

        // Cập nhật trano và nhacungcap1
        await TraNo.create(trano)
        await NhanCungCap.findByIdAndUpdate(nhacungcap1._id, nhacungcap1)
      } else {
        loaisanpham.ghino = false
        if (method === 'Tiền mặt') {
          loaisanpham.method = 'tienmat'
        }
        if (method === 'Chuyển khoản') {
          loaisanpham.method = 'chuyenkhoan'
          loaisanpham.nganhang = nganhang._id
        }

        const tranoList = await TraNo.findOne({
          'donno.loaisanpham': loaisanpham._id
        })

        if (tranoList) {
          await TraNo.deleteOne({ _id: tranoList._id })
          nhacungcap1.trano = nhacungcap1.trano.filter(
            id => id.toString() !== tranoList._id.toString()
          )
          await NhanCungCap.findByIdAndUpdate(nhacungcap1._id, nhacungcap1)
        }
      }
    }

    await LoaiSanPham.findByIdAndUpdate(idloai, loaisanpham)
    await NhanCungCap.findByIdAndUpdate(nhacungcap1._id, nhacungcap1)
    await NhanCungCap.findByIdAndUpdate(nhacungcap._id, nhacungcap)

    res.json(loaisanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('deletesanpham/:idloai', async (req, res) => {
  try {
    const idloai = req.params.idloai
    const loaisanpham = await LoaiSanPham.findById(idloai)
    const depot = await Depot.findById(loaisanpham.depot)
    const index = depot.loaisanpham.indexOf(idloai)
    depot.loaisanpham.splice(index, 1)
    await depot.save()
    await LoaiSanPham.deleteOne({ _id: idloai })
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getchitietloaisanpham/:idloai', async (req, res) => {
  try {
    const idloai = req.params.idloai
    const loaisanpham = await LoaiSanPham.findById(idloai)

    if (!loaisanpham) {
      return res.status(404).json({ message: 'Loại sản phẩm không tìm thấy.' })
    }

    const nhacungcap = await NhanCungCap.findById(loaisanpham.nhacungcap)

    let manganhang = ''
    if (loaisanpham.nganhang) {
      const nganhangkho = await NganHang.findById(loaisanpham.nganhang)
      if (nganhangkho) {
        manganhang = nganhangkho.manganhangkho
      }
    }

    const loaisanphamjson = {
      _id: loaisanpham._id,
      name: loaisanpham.name,
      soluong: loaisanpham.soluong,
      tongtien: loaisanpham.tongtien,
      date: loaisanpham.date,
      average: loaisanpham.average,
      method: loaisanpham.method,
      manganhang: manganhang,
      malsp: loaisanpham.malsp,
      manhacungcap: nhacungcap ? nhacungcap.mancc : '',
      ghino: loaisanpham.ghino,
      loaihanghoa: loaisanpham.loaihanghoa
    }

    // Trả về dữ liệu JSON
    res.json(loaisanphamjson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postloaisanpham3', async (req, res) => {
  try {
    const {
      name,
      date,
      mancc,
      ghino,
      hour,
      method,
      manganhangkho,
      loaihanghoa,
      products
    } = req.body
    const nhacungcap = await NhanCungCap.findOne({ mancc })
    const depot = await Depot.findById(nhacungcap.depotId)
    const formattedDate = moment(date).isValid() ? moment(date).toDate() : null
    if (!formattedDate) return res.json({ message: 'Ngày không hợp lệ.' })
    const formattedHour = moment(hour).isValid() ? moment(hour).toDate() : null
    if (!formattedHour) return res.json({ message: 'Giờ không hợp lệ.' })

    const nganhangkho = await NganHang.findOne({ manganhangkho })
    const loaisanpham = new LoaiSanPham({
      name,
      depot: depot._id,
      date: formattedDate,
      hour: formattedHour,
      nhacungcap: nhacungcap._id,
      loaihanghoa
    })

    loaisanpham.malsp = 'LH' + loaisanpham._id.toString().slice(-5)
    const addedProducts = []
    let tongtien = 0
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
          price,
          loaihanghoa
        })

        sanpham.masp = 'SP' + sanpham._id.toString().slice(-5)
        sanpham.kho = depot._id
        sanpham.loaisanpham = loaisanpham._id
        sanpham.dungluongsku = dungluongsku._id
        tongtien += Number(price)
        await sanpham.save()
        loaisanpham.sanpham.push(sanpham._id)
        depot.sanpham.push(sanpham._id)
        dungluongsku.sanpham.push(sanpham._id)
        await dungluongsku.save()
        addedProducts.push(sanpham)
      }
    }

    loaisanpham.tongtien = tongtien

    if (ghino === 'ghino') {
      loaisanpham.ghino = true
      const trano = new TraNo({ nhacungcap: nhacungcap._id })
      trano.donno.push({
        loaisanpham: loaisanpham._id,
        tienno: loaisanpham.tongtien,
        tienphaitra: loaisanpham.tongtien,
        tiendatra: 0
      })
      trano.tongno = trano.donno.reduce((sum, item) => sum + item.tienno, 0)
      trano.tongtra = trano.donno.reduce((sum, item) => sum + item.tiendatra, 0)
      nhacungcap.trano.push(trano._id)
      await trano.save()
    } else {
      loaisanpham.ghino = false
      if (method === 'Tiền mặt') loaisanpham.method = 'tienmat'
      if (method === 'Chuyển khoản') {
        loaisanpham.method = 'chuyenkhoan'
        loaisanpham.nganhang = nganhangkho._id
      }
    }

    await loaisanpham.save()
    depot.loaisanpham.push(loaisanpham._id)
    nhacungcap.loaisanpham.push(loaisanpham._id)
    await nhacungcap.save()
    await depot.save()

    const ncc = {
      _id: loaisanpham._id,
      malsp: loaisanpham.malsp,
      name: loaisanpham.name,
      tongtien: loaisanpham.tongtien,
      date: moment(loaisanpham.date).format('DD/MM/YYYY')
    }

    res.json(ncc)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postloaisanpham4', async (req, res) => {
  try {
    const {
      name,
      date,
      mancc,
      ghino,
      hour,
      method,
      manganhangkho,
      loaihanghoa,
      products
    } = req.body
    const nhacungcap = await NhanCungCap.findOne({ mancc })
    const depot = await Depot.findById(nhacungcap.depotId)
    const formattedDate = moment(date).isValid() ? moment(date).toDate() : null
    if (!formattedDate) return res.json({ message: 'Ngày không hợp lệ.' })
    const formattedHour = moment(hour).isValid() ? moment(hour).toDate() : null
    if (!formattedHour) return res.json({ message: 'Giờ không hợp lệ.' })

    const nganhangkho = await NganHang.findOne({ manganhangkho })
    const loaisanpham = new LoaiSanPham({
      name,
      depot: depot._id,
      date: formattedDate,
      hour: formattedHour,
      nhacungcap: nhacungcap._id,
      loaihanghoa
    })

    loaisanpham.malsp = 'LH' + loaisanpham._id.toString().slice(-5)
    const addedProducts = []
    let tongtien = 0
    for (const product of products) {
      const { madungluongsku, imelList, name, price, soluong } = product
      const dungluongsku = await DungLuongSku.findOne({
        madungluong: madungluongsku
      })

      if (!imelList || imelList.length === 0) {
        for (let i = 0; i < soluong; i++) {
          const sanpham = new SanPham({
            name,
            datenhap: loaisanpham.date,
            price,
            loaihanghoa
          })

          sanpham.masp = 'SP' + sanpham._id.toString().slice(-5)
          sanpham.kho = depot._id
          sanpham.loaisanpham = loaisanpham._id
          sanpham.dungluongsku = dungluongsku ? dungluongsku._id : null

          tongtien += Number(price)

          await sanpham.save()
          loaisanpham.sanpham.push(sanpham._id)
          depot.sanpham.push(sanpham._id)
          if (dungluongsku) dungluongsku.sanpham.push(sanpham._id)
          if (dungluongsku) await dungluongsku.save()

          addedProducts.push(sanpham)
        }
        continue
      }

      for (const imel of imelList) {
        const sp = await SanPham.findOne({ imel })
        if (sp) continue

        const sanpham = new SanPham({
          name,
          imel,
          datenhap: loaisanpham.date,
          price,
          loaihanghoa
        })

        sanpham.masp = 'SP' + sanpham._id.toString().slice(-5)
        sanpham.kho = depot._id
        sanpham.loaisanpham = loaisanpham._id
        sanpham.dungluongsku = dungluongsku._id
        tongtien += Number(price)
        await sanpham.save()
        loaisanpham.sanpham.push(sanpham._id)
        depot.sanpham.push(sanpham._id)
        dungluongsku.sanpham.push(sanpham._id)
        await dungluongsku.save()
        addedProducts.push(sanpham)
      }
    }

    loaisanpham.tongtien = tongtien

    if (ghino === 'ghino') {
      loaisanpham.ghino = true
      const trano = new TraNo({ nhacungcap: nhacungcap._id })
      trano.donno.push({
        loaisanpham: loaisanpham._id,
        tienno: loaisanpham.tongtien,
        tienphaitra: loaisanpham.tongtien,
        tiendatra: 0
      })
      trano.tongno = trano.donno.reduce((sum, item) => sum + item.tienno, 0)
      trano.tongtra = trano.donno.reduce((sum, item) => sum + item.tiendatra, 0)
      nhacungcap.trano.push(trano._id)
      await trano.save()
    } else {
      loaisanpham.ghino = false
      if (method === 'Tiền mặt') loaisanpham.method = 'tienmat'
      if (method === 'Chuyển khoản') {
        loaisanpham.method = 'chuyenkhoan'
        loaisanpham.nganhang = nganhangkho._id
      }
    }

    await loaisanpham.save()
    depot.loaisanpham.push(loaisanpham._id)
    nhacungcap.loaisanpham.push(loaisanpham._id)
    await nhacungcap.save()
    await depot.save()

    const ncc = {
      _id: loaisanpham._id,
      malsp: loaisanpham.malsp,
      name: loaisanpham.name,
      tongtien: loaisanpham.tongtien,
      date: moment(loaisanpham.date).format('DD/MM/YYYY')
    }

    sendEvent({ message: `Sản phẩm mới đã được thêm: ${ncc}` })
    res.json(ncc)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postloaisanpham5/:depotid', async (req, res) => {
  try {
    const depotid = req.params.depotid
    const depot = await Depot.findById(depotid)

    const loaisanpham = new LoaiSanPham({
      name: '',
      depot: depotid,
      loaihanghoa: ''
    })

    depot.loaisanpham.push(loaisanpham._id)
    loaisanpham.malsp = 'LH' + loaisanpham._id.toString().slice(-5)
    await depot.save()
    await loaisanpham.save()
    sendEvent({ message: `lô hàng mới đã được thêm` })

    res.json(loaisanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/updateloaisanpham4', async (req, res) => {
  try {
    const {
      malo,
      name,
      date,
      mancc,
      ghino,
      hour,
      method,
      manganhangkho,
      loaihanghoa,
      products
    } = req.body

    const loaisanpham = await LoaiSanPham.findOne({ malsp: malo })
    if (!loaisanpham)
      return res.status(404).json({ message: 'Loại sản phẩm không tồn tại.' })

    const nhacungcap = await NhanCungCap.findOne({ mancc })
    const depot = await Depot.findById(nhacungcap.depotId)

    const formattedDate = moment(date).isValid() ? moment(date).toDate() : null
    if (!formattedDate) return res.json({ message: 'Ngày không hợp lệ.' })

    const formattedHour = moment(hour).isValid() ? moment(hour).toDate() : null
    if (!formattedHour) return res.json({ message: 'Giờ không hợp lệ.' })

    const nganhangkho = await NganHang.findOne({ manganhangkho })

    loaisanpham.name = name
    loaisanpham.date = formattedDate
    loaisanpham.hour = formattedHour
    loaisanpham.nhacungcap = nhacungcap._id
    loaisanpham.loaihanghoa = loaihanghoa

    const updatedProducts = []
    let tongtien = 0

    for (const product of products) {
      const { iddungluongsku, imelList, name, price, soluong } = product
      const dungluongsku = await DungLuongSku.findById(iddungluongsku)

      if (!imelList || imelList.length === 0) {
        for (let i = 0; i < soluong; i++) {
          const sanpham = new SanPham({
            name,
            datenhap: loaisanpham.date,
            price,
            loaihanghoa
          })

          sanpham.masp = 'SP' + sanpham._id.toString().slice(-5)
          sanpham.kho = depot._id
          sanpham.loaisanpham = loaisanpham._id
          sanpham.dungluongsku = dungluongsku ? dungluongsku._id : null

          tongtien += Number(price)

          await sanpham.save()
          loaisanpham.sanpham.push(sanpham._id)
          depot.sanpham.push(sanpham._id)
          dungluongsku.sanpham.push(sanpham._id)
          await dungluongsku.save()

          updatedProducts.push(sanpham)
        }
        continue
      }

      const sanphamTrongKho = await SanPham.find({
        _id: { $in: depot.sanpham },
        imel: { $in: imelList }
      })

      const imelTrongKhoSet = new Set(sanphamTrongKho.map(sp => sp.imel))

      for (const imel of imelList) {
        if (imelTrongKhoSet.has(imel)) {
          return res.json({ message: 'Sản phẩm đã tồn tại trong kho' })
        } else {
          sp = new SanPham({
            name,
            imel,
            datenhap: loaisanpham.date,
            price,
            loaihanghoa
          })

          sp.masp = 'SP' + sp._id.toString().slice(-5)
          sp.kho = depot._id
          sp.loaisanpham = loaisanpham._id
          sp.dungluongsku = dungluongsku ? dungluongsku._id : null

          tongtien += Number(price)

          await sp.save()

          loaisanpham.sanpham.push(sp._id)
          depot.sanpham.push(sp._id)

          dungluongsku.sanpham.push(sp._id)
          await dungluongsku.save()
        }

        updatedProducts.push(sp)
      }
    }

    loaisanpham.tongtien = tongtien

    if (ghino === 'ghino') {
      loaisanpham.ghino = true
      const trano = await TraNo.findOne({ nhacungcap: nhacungcap._id })
      if (trano) {
        const donno = trano.donno.find(
          dn => dn.loaisanpham.toString() === loaisanpham._id.toString()
        )
        if (donno) {
          donno.tienno = loaisanpham.tongtien
          donno.tienphaitra = loaisanpham.tongtien
        } else {
          trano.donno.push({
            loaisanpham: loaisanpham._id,
            tienno: loaisanpham.tongtien,
            tienphaitra: loaisanpham.tongtien,
            tiendatra: 0
          })
        }
        trano.tongno = trano.donno.reduce((sum, item) => sum + item.tienno, 0)
        trano.tongtra = trano.donno.reduce(
          (sum, item) => sum + item.tiendatra,
          0
        )
        await trano.save()
      }
    } else {
      loaisanpham.ghino = false
      if (method === 'Tiền mặt') loaisanpham.method = 'tienmat'
      if (method === 'Chuyển khoản') {
        loaisanpham.method = 'chuyenkhoan'
        loaisanpham.nganhang = nganhangkho._id
      }
    }

    await loaisanpham.save()
    nhacungcap.loaisanpham.push(loaisanpham._id)
    await nhacungcap.save()
    await depot.save()

    const updatedData = {
      _id: loaisanpham._id,
      malsp: loaisanpham.malsp,
      name: loaisanpham.name,
      tongtien: loaisanpham.tongtien,
      date: moment(loaisanpham.date).format('DD/MM/YYYY')
    }

    sendEvent({ message: `Sản phẩm đã được cập nhật: ${updatedData}` })
    res.json(updatedData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getfullchitietlo/:malohang', async (req, res) => {
  try {
    const malohang = req.params.malohang
    const loaisanpham = await LoaiSanPham.findOne({ malsp: malohang })
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
          quantity: 1,
          xuat: sp1.xuat
        }
      })
    )

    const groupedProducts = sanpham.reduce((acc, product) => {
      const { masku, imel, price, name } = product

      if (!acc[masku]) {
        acc[masku] = {
          ...product,
          imel: new Set([imel]),
          quantity: 0,
          total: 0
        }
      }

      acc[masku].imel.add(imel)
      acc[masku].quantity += product.quantity
      acc[masku].total += price * product.quantity

      return acc
    }, {})

    const result = Object.values(groupedProducts).map(product => ({
      masku: product.masku,
      name: product.name,
      imel: Array.from(product.imel),
      soluong: product.quantity,
      price: parseFloat(product.total / product.quantity),
      tongtien: product.total
    }))

    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/deletelohang', async (req, res) => {
  try {
    const { malohang } = req.body
    const lohang = await LoaiSanPham.findOne({ malsp: malohang })
    if (!lohang) {
      return res.status(404).json({ message: 'Không tìm thấy lô hàng.' })
    }

    const depot = await Depot.findById(lohang.depot)
    if (!depot) {
      return res.status(404).json({ message: 'Không tìm thấy depot.' })
    }

    for (const sp of lohang.sanpham) {
      const sanpham = await SanPham.findById(sp._id)
      if (!sanpham) continue

      const dungluong = await DungLuongSku.findById(sanpham.dungluongsku)
      depot.sanpham.splice(depot.sanpham.indexOf(sp._id), 1)
      await depot.save()
      if (dungluong) {
        dungluong.sanpham.splice(dungluong.sanpham.indexOf(sp._id), 1)
        await dungluong.save()
      }

      await SanPham.findByIdAndDelete(sp._id)
    }

    const index = depot.loaisanpham.indexOf(lohang._id)
    if (index !== -1) {
      depot.loaisanpham.splice(index, 1)
      await depot.save()
    }

    await LoaiSanPham.findByIdAndDelete(lohang._id)

    res.json({ success: 'Xóa lô hàng thành công.' })
  } catch (error) {
    res.status(500).json({ message: `Lỗi: ${error.message}` })
    console.error(error)
  }
})

router.post('/deleteanlo', async (req, res) => {
  try {
    const { ids } = req.body
    for (const id of ids) {
      const loaisanpham = await LoaiSanPham.findById(id)
      loaisanpham.status = -1
      await loaisanpham.save()
    }
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    res.status(500).json({ message: `Lỗi: ${error.message}` })
    console.error(error)
  }
})

router.post('/postimel', async (req, res) => {
  try {
    const { malohang, products } = req.body
    const loaisanpham = await LoaiSanPham.findOne({ malsp: malohang })
    if (!loaisanpham) {
      return res.status(400).json({ message: 'Không tìm thấy lô hàng.' })
    }
    const depot = await Depot.findById(loaisanpham.depot)
    const addedProducts = []
    let tongtien = 0

    for (const product of products) {
      const { madungluongsku, imelList, name, price, soluong } = product
      const dungluongsku = await DungLuongSku.findOne({
        madungluong: madungluongsku
      })

      if (!imelList || imelList.length === 0) {
        for (let i = 0; i < soluong; i++) {
          const sanpham = new SanPham({
            name,
            datenhap: loaisanpham.date,
            price: 0
          })

          sanpham.masp = 'SP' + sanpham._id.toString().slice(-5)
          sanpham.kho = depot._id
          sanpham.loaisanpham = loaisanpham._id
          sanpham.dungluongsku = dungluongsku ? dungluongsku._id : null

          tongtien += Number(price)

          await sanpham.save()
          loaisanpham.sanpham.push(sanpham._id)
          depot.sanpham.push(sanpham._id)
          if (dungluongsku) dungluongsku.sanpham.push(sanpham._id)
          if (dungluongsku) await dungluongsku.save()

          addedProducts.push(sanpham)
        }
        continue
      }

      for (const imel of imelList) {
        const sp = await SanPham.findOne({ imel })
        if (sp) {
          return res.json({ message: 'Imel đã tồn tại' })
        }

        const sanpham = new SanPham({
          name,
          imel,
          datenhap: loaisanpham.date,
          price: 0
        })

        sanpham.masp = 'SP' + sanpham._id.toString().slice(-5)
        sanpham.kho = depot._id
        sanpham.loaisanpham = loaisanpham._id
        sanpham.dungluongsku = dungluongsku._id
        tongtien += Number(price)
        await sanpham.save()
        loaisanpham.sanpham.push(sanpham._id)
        depot.sanpham.push(sanpham._id)
        dungluongsku.sanpham.push(sanpham._id)
        await dungluongsku.save()
        addedProducts.push(sanpham)
      }
    }
    await loaisanpham.save()
    await depot.save()

    sendEvent({ message: `Thêm imel thành công` })
    res.json({ success: 'thêm imel thành công' })
  } catch (error) {
    res.status(500).json({ message: `Lỗi: ${error.message}` })
    console.error(error)
  }
})

module.exports = router

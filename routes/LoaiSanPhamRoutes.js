const router = require('express').Router()
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const Depot = require('../models/DepotModel')
const NhanCungCap = require('../models/NhanCungCapModel')
const TraNo = require('../models/TraNoModel')
const NganHang = require('../models/NganHangKhoModel')

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
        return {
          _id: loaisp._id,
          malsp: loaisp.malsp,
          name: loaisp.name,
          tongtien: loaisp.tongtien,
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
        const loaisp = await LoaiSanPham.findById(loaisanpham._id)
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
    res.json(loaisanpham)
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
      date: moment(loaisanpham.date).format('DD/MM/YYYY'),
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

    // Cập nhật loaisanpham sau tất cả các thay đổi
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

    // Tìm nhà cung cấp
    const nhacungcap = await NhanCungCap.findById(loaisanpham.nhacungcap)

    // Kiểm tra xem loaisanpham có thuộc tính nganhang hay không
    let manganhang = ''
    if (loaisanpham.nganhang) {
      const nganhangkho = await NganHang.findById(loaisanpham.nganhang)
      if (nganhangkho) {
        manganhang = nganhangkho.manganhangkho // Lấy mã ngân hàng nếu tìm thấy
      }
    }

    // Tạo đối tượng JSON cho phản hồi
    const loaisanphamjson = {
      _id: loaisanpham._id,
      name: loaisanpham.name,
      soluong: loaisanpham.soluong,
      tongtien: loaisanpham.tongtien,
      date: loaisanpham.date,
      average: loaisanpham.average,
      method: loaisanpham.method,
      manganhang: manganhang, // Mặc định rỗng nếu không có nganhang
      malsp: loaisanpham.malsp,
      manhacungcap: nhacungcap ? nhacungcap.mancc : '', // Đảm bảo nếu nhà cung cấp không tồn tại
      ghino: loaisanpham.ghino,
      loaihanghoa:loaisanpham.loaihanghoa
    }

    // Trả về dữ liệu JSON
    res.json(loaisanphamjson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

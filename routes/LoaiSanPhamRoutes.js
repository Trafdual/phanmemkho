const router = require('express').Router()
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const Depot = require('../models/DepotModel')
const NhanCungCap = require('../models/NhanCungCapModel')

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
          average: loaisp.average
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
          soluong: loaisp.soluong,
          tongtien: loaisp.tongtien,
          date: moment(loaisp.date).format('DD/MM/YYYY'),
          average: loaisp.average
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
          soluong: loaisp.soluong,
          tongtien: loaisp.tongtien,
          date: moment(loaisp.date).format('DD/MM/YYYY'),
          average: loaisp.average
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
    const { name, tongtien, soluong, date, mancc } = req.body
    const nhacungcap = await NhanCungCap.findOne({ mancc })
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

router.post('/putloaisanpham/:idloai', async (req, res) => {
  try {
    const idloai = req.params.idloai
    const { name, tongtien, soluong, date } = req.body
    const average = parseFloat((tongtien / soluong).toFixed(1))
    const loaisanpham = await LoaiSanPham.findByIdAndUpdate(idloai, {
      name,
      tongtien,
      soluong,
      date,
      average
    })
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
module.exports = router

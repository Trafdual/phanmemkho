const router = require('express').Router()
const LoaiChungTu = require('../models/LoaiChungTuModel')
const User = require('../models/UserModel')
const NhanVien = require('../models/NhanVienModel')

router.get('/getloaichungtu/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)
    const loaichungtu = await Promise.all(
      user.loaichungtu.map(async lct => {
        const lct1 = await LoaiChungTu.findOne({
          _id: lct._id,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        })
        if (!lct1) return null
        return {
          _id: lct1._id,
          maloaict: lct1.maloaict,
          name: lct1.name,
          method: lct1.method
        }
      })
    )
    const filtered = loaichungtu.filter(item => item !== null)

    res.json(filtered)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getloaichungtuadmin/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const user = await User.findById(userId)

    const loaichungtu = await Promise.all(
      user.loaichungtu.map(async lct => {
        const lct1 = await LoaiChungTu.findOne({
          _id: lct._id,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        })
        if (!lct1) return null
        return {
          _id: lct1._id,
          maloaict: lct1.maloaict,
          name: lct1.name,
          method: lct1.method
        }
      })
    )

    const filtered = loaichungtu.filter(item => item !== null)

    const paginated = filtered.slice(skip, skip + limit)

    res.json({
      data: paginated,
      currentPage: page,
      totalPages: Math.ceil(filtered.length / limit),
      totalItems: filtered.length
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postloaichungtu/:userid', async (req, res) => {
  try {
    const userId = req.params.userid
    const { name, method } = req.body
    const user = await User.findById(userId)
    const loaichungtu = new LoaiChungTu({ name, method })
    loaichungtu.maloaict = 'LCT' + loaichungtu._id.toString().slice(-5)
    loaichungtu.user = user._id
    await loaichungtu.save()

    for (const nhanvien of user.nhanvien) {
      const nv = await NhanVien.findById(nhanvien._id)
      if (!nv) continue

      const usernv = await User.findById(nv.user)
      if (!usernv) continue

      usernv.loaichungtu.push(loaichungtu._id)
      await usernv.save()
    }

    user.loaichungtu.push(loaichungtu._id)
    await user.save()
    res.json(loaichungtu)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getchitietloaichungtu/:idloaichungtu', async (req, res) => {
  try {
    const idloaichungtu = req.params.idloaichungtu

    const loaichungtu = await LoaiChungTu.findById(idloaichungtu)
    if (!loaichungtu) {
      return res.json({ error: 'không tìm thấy loại chứng từ' })
    }
    res.json(loaichungtu)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/updateloaichungtu/:idloaichungtu', async (req, res) => {
  try {
    const idloaichungtu = req.params.idloaichungtu
    const { name, method } = req.body

    const loaichungtu = await LoaiChungTu.findById(idloaichungtu)
    if (!loaichungtu) {
      return res.json({ error: 'không tìm thấy loại chứng từ' })
    }
    loaichungtu.name = name
    loaichungtu.method = method
    await loaichungtu.save()
    res.json(loaichungtu)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/deleteloaichungtu', async (req, res) => {
  try {
    const { ids } = req.body
    for (const id of ids) {
      const loaichungtu = await LoaiChungTu.findById(id)
      loaichungtu.status = -1
      await loaichungtu.save()
    }
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

const router = require('express').Router()
const NhomKhacHang = require('../models/NhomKhacHangModel')
const User = require('../models/UserModel')
const NhanVien = require('../models/NhanVienModel')

router.get('/getnhomkhachhang/:userId', async (req, res) => {
  try {
    const userid = req.params.userId
    const user = await User.findById(userid)
    const nhomkhachhang = await Promise.all(
      user.nhomkhachhang.map(async nkh => {
        const nkh1 = await NhomKhacHang.findOne({
          _id: nkh._id,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        })

        if (!nkh1) return null

        return {
          _id: nkh1._id,
          manhomkh: nkh1.manhomkh,
          name: nkh1.name
        }
      })
    )
    const filtered = nhomkhachhang.filter(item => item !== null)

    res.json(filtered)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getnhomkhachhangadmin/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const user = await User.findById(userId)
    if (!user || !user.nhomkhachhang) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy nhóm khách hàng.' })
    }

    const nhomkhachhang = await Promise.all(
      user.nhomkhachhang.map(async nkh => {
        const nkh1 = await NhomKhacHang.findOne({
          _id: nkh._id,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        })

        if (!nkh1) return null

        return {
          _id: nkh1._id,
          manhomkh: nkh1.manhomkh,
          name: nkh1.name
        }
      })
    )
    const filtered = nhomkhachhang.filter(item => item !== null)
    const total = filtered.length
    const paginated = filtered.slice(startIndex, endIndex)

    res.json({
      data: paginated,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postnhomkhachhang/:userId', async (req, res) => {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId)
    const { name } = req.body
    const nhomkhachhang = new NhomKhacHang({ name })
    nhomkhachhang.manhomkh = 'NKH' + nhomkhachhang._id.toString().slice(-4)
    nhomkhachhang.user = user._id
    await nhomkhachhang.save()

    for (const nhanvien of user.nhanvien) {
      const nv = await NhanVien.findById(nhanvien._id)
      if (!nv) continue

      const usernv = await User.findById(nv.user)
      if (!usernv) continue

      usernv.nhomkhachhang.push(nhomkhachhang._id)
      await usernv.save()
    }

    user.nhomkhachhang.push(nhomkhachhang._id)
    await user.save()
    res.json(nhomkhachhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getchitietnkh/:idnkh', async (req, res) => {
  try {
    const idnkh = req.params.idnkh
    const nhomkhachhang = await NhomKhacHang.findById(idnkh)
    if (!nhomkhachhang) {
      return res.json({ error: 'không tồn tại nhóm khách hàng' })
    }
    res.json(nhomkhachhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/updatenhomkh/:idnhomkhachhang', async (req, res) => {
  try {
    const idnhomkhachhang = req.params.idnhomkhachhang
    const nhomkhachhang = await NhomKhacHang.findById(idnhomkhachhang)
    const { name } = req.body
    if (!nhomkhachhang) {
      return res.json({ message: 'không tồn tại nhóm khách hàng' })
    }
    nhomkhachhang.name = name
    await nhomkhachhang.save()
    res.json(nhomkhachhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/deletenhomkh', async (req, res) => {
  try {
    const { ids } = req.body
    for (const id of ids) {
      const nhomkhachhang = await NhomKhacHang.findById(id)
      nhomkhachhang.status = -1
      await nhomkhachhang.save()
    }
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

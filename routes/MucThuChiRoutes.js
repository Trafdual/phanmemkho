const router = require('express').Router()
const User = require('../models/UserModel')
const MucThuChi = require('../models/MucThuChiModel')
const NhanVien = require('../models/NhanVienModel')
router.post('/postmucthuchi/:userid', async (req, res) => {
  try {
    const userid = req.params.userid
    const { name, loaimuc } = req.body
    const user = await User.findById(userid)
    const mucthuchi = new MucThuChi({ name, loaimuc })
    mucthuchi.mamuc = 'MTC' + mucthuchi._id.toString().slice(-5)
    mucthuchi.user = user._id
    await mucthuchi.save()

    for (const nhanvien of user.nhanvien) {
      const nv = await NhanVien.findById(nhanvien._id)
      if (!nv) continue

      const usernv = await User.findById(nv.user)
      if (!usernv) continue

      usernv.mucthuchi.push(mucthuchi._id)
      await usernv.save()
    }

    user.mucthuchi.push(mucthuchi._id)
    await user.save()
    res.json(mucthuchi)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getmucthuchi/:userId', async (req, res) => {
  try {
    const userid = req.params.userId
    const user = await User.findById(userid)
    const mucthuchi = await Promise.all(
      user.mucthuchi.map(async muc => {
        const mtc = await MucThuChi.findOne({
          _id: muc._id,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        })

        if (!mtc) return null

        return {
          _id: mtc._id,
          mamuc: mtc.mamuc,
          name: mtc.name,
          loaimuc: mtc.loaimuc
        }
      })
    )
    const filtered = mucthuchi.filter(item => item !== null)

    res.json(filtered)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getmucthuchiadmin/:userId', async (req, res) => {
  try {
    const userid = req.params.userId
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const user = await User.findById(userid)

    const mucthuchi = await Promise.all(
      user.mucthuchi.map(async muc => {
        const mtc = await MucThuChi.findOne({
          _id: muc._id,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        })

        if (!mtc) return null

        return {
          _id: mtc._id,
          mamuc: mtc.mamuc,
          name: mtc.name,
          loaimuc: mtc.loaimuc
        }
      })
    )

    const filtered = mucthuchi.filter(item => item !== null)

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

router.get('/getchittietmuctc/:idmucthuchi', async (req, res) => {
  try {
    const idmucthuchi = req.params.idmucthuchi

    const mucthuchi = await MucThuChi.findById(idmucthuchi)
    if (!mucthuchi) {
      return res.json({ error: 'không tìm thấy mục thu chi' })
    }

    res.json(mucthuchi)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/updatemuctc/:idmucthuchi', async (req, res) => {
  try {
    const idmucthuchi = req.params.idmucthuchi
    const { name, loaimuc } = req.body

    const mucthuchi = await MucThuChi.findById(idmucthuchi)
    if (!mucthuchi) {
      return res.json({ error: 'không tìm thấy mục thu chi' })
    }
    mucthuchi.name = name
    mucthuchi.loaimuc = loaimuc

    await mucthuchi.save()

    res.json(mucthuchi)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/deletemucthuchi', async (req, res) => {
  try {
    const { ids } = req.body
    for (const id of ids) {
      const mucthuchi = await MucThuChi.findById(id)
      mucthuchi.status = -1
      await mucthuchi.save()
    }
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

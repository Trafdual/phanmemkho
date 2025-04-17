const router = require('express').Router()
const User = require('../../models/UserModel')
const Depot = require('../../models/DepotModel')
const NhanVien = require('../../models/NhanVienModel')

router.get('/getkhochua/:iduser', async (req, res) => {
  try {
    const iduser = req.params.iduser
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const user = await User.findById(iduser)
    if (!user)
      return res.status(404).json({ message: 'Người dùng không tồn tại' })

    const totalKho = user.depot.length
    const paginatedDepots = user.depot.slice(skip, skip + limit)

    const kho = await Promise.all(
      paginatedDepots.map(async khochua => {
        const kho1 = await Depot.findById(khochua._id)
        return {
          _id: kho1._id,
          name: kho1.name,
          address: kho1.address,
          user: kho1.user.length
        }
      })
    )

    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalKho / limit),
      totalItems: totalKho,
      data: kho
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.get('/getnhanvienadmin/:idkho', async (req, res) => {
  try {
    const idkho = req.params.idkho
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const kho = await Depot.findById(idkho)
    if (!kho) return res.status(404).json({ message: 'Không tìm thấy kho' })

    const totalUsers = kho.user.length
    const paginatedUsers = kho.user.slice(skip, skip + limit)

    const user = await Promise.all(
      paginatedUsers.map(async user => {
        const user1 = await User.findById(user._id)
        return {
          _id: user1._id,
          name: user1.name,
          email: user1.email,
          phone: user1.phone,
          birthday: user1.birthday,
          ngaydangky: user1.date,
          role: user1.role
        }
      })
    )

    res.json({
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalItems: totalUsers,
      data: user
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/khoauser', async (req, res) => {
  try {
    const { ids } = req.body

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Danh sách user rỗng' })
    }

    await Promise.all(
      ids.map(async iduser => {
        const user = await User.findById(iduser)
        if (!user) return

        await Promise.all(
          (user.nhanvien || []).map(async nv => {
            const nhanvien = await NhanVien.findById(nv._id)
            if (!nhanvien) return
            const usernv = await User.findById(nhanvien.user)
            if (usernv) {
              usernv.khoa = true
              await usernv.save()
            }
          })
        )

        user.khoa = true
        await user.save()
      })
    )

    res.json({ message: 'Đã khóa tất cả user thành công' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/mokhoauser', async (req, res) => {
  try {
    const { ids } = req.body

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Danh sách user rỗng' })
    }

    await Promise.all(
      ids.map(async iduser => {
        const user = await User.findById(iduser)
        if (!user) return
        user.khoa = false
        await user.save()
      })
    )

    res.json({ message: 'Đã mở khóa tất cả user thành công' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

module.exports = router

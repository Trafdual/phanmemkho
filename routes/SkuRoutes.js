const router = require('express').Router()
const Sku = require('../models/SkuModel')
const DungLuongSku = require('../models/DungluongSkuModel')
const User = require('../models/UserModel')
const NhanVien = require('../models/NhanVienModel')

router.get('/getdungluongsku/:userID', async (req, res) => {
  try {
    const userID = req.params.userID
    const user = await User.findById(userID)

    const skujson = await Promise.all(
      user.sku.map(async sk => {
        const sku = await Sku.findOne({
          _id: sk._id,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        })

        if (!sku) return null // Bỏ qua SKU không hợp lệ

        const dungluong = await Promise.all(
          sku.dungluong.map(async dl => {
            const dlsku = await DungLuongSku.findOne({
              _id: dl._id,
              $or: [{ status: 1 }, { status: { $exists: false } }]
            })

            if (!dlsku) return null // Bỏ qua nếu không hợp lệ

            return {
              _id: dlsku._id,
              name:
                dlsku.name === '' ? sku.name : `${sku.name} (${dlsku.name})`,
              madungluong: dlsku.madungluong
            }
          })
        )

        return dungluong.filter(item => item !== null) // Lọc null ra
      })
    )

    res.json(skujson.flat().filter(item => item !== null)) // Lọc lần cuối
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getsku/:userID', async (req, res) => {
  try {
    const userID = req.params.userID
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const user = await User.findById(userID)

    const skujson = await Promise.all(
      user.sku.map(async sk => {
        const sku = await Sku.findOne({
          _id: sk._id,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        })

        if (!sku) return null

        return {
          _id: sku._id,
          masku: sku.masku,
          name: sku.name
        }
      })
    )

    const filtered = skujson.filter(item => item !== null)
    const total = filtered.length
    const paginated = filtered.slice(startIndex, endIndex)

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: paginated
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getdungluongsku2/:idsku', async (req, res) => {
  try {
    const idsku = req.params.idsku
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const sku = await Sku.findById(idsku)
    if (!sku) {
      return res.json({ error: 'không tìm thấy mã sku' })
    }

    const skujson = await Promise.all(
      sku.dungluong.map(async dl => {
        const dlsku = await DungLuongSku.findOne({
          _id: dl._id,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        })

        if (!dlsku) return null

        return {
          _id: dlsku._id,
          name: dlsku.name,
          madungluong: dlsku.madungluong
        }
      })
    )

    const filtered = skujson.filter(item => item !== null)
    const total = filtered.length
    const paginated = filtered.slice(startIndex, endIndex)

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: paginated
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postsku/:iduser', async (req, res) => {
  try {
    const iduser = req.params.iduser
    const { name, namedungluong } = req.body

    const user = await User.findById(iduser).populate('sku')

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' })
    }

    let lastSku = null
    if (user.sku.length > 0) {
      lastSku = await Sku.findById(user.sku[user.sku.length - 1])
    }

    let newSkuCode = 'SKU001'
    if (lastSku) {
      const lastCode = lastSku.masku.replace('SKU', '')
      const newCodeNumber = parseInt(lastCode) + 1
      newSkuCode = `SKU${newCodeNumber.toString().padStart(3, '0')}`
    }

    const sku = new Sku({
      name,
      masku: newSkuCode,
      dungluong: []
    })

    await sku.save()

    if (!namedungluong || namedungluong.length === 0) {
      const dl = new DungLuongSku({
        name: '',
        madungluong: newSkuCode,
        sku: sku._id
      })
      await dl.save()
      sku.dungluong.push(dl._id)
    } else {
      for (const dlName of namedungluong) {
        const dl = new DungLuongSku({
          name: dlName,
          madungluong: `${newSkuCode}-${dlName}`,
          sku: sku._id
        })
        await dl.save()
        sku.dungluong.push(dl._id)
      }
    }

    for (const nhanvien of user.nhanvien) {
      const nv = await NhanVien.findById(nhanvien._id)
      if (!nv) continue

      const usernv = await User.findById(nv.user)
      if (!usernv) continue

      usernv.sku.push(sku._id)
      await usernv.save()
    }

    user.sku.push(sku._id)
    sku.userId = user._id
    await Promise.all([user.save(), sku.save()])

    res.json(sku)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postsku2/:idsku', async (req, res) => {
  try {
    const iduser = req.params.iduser
    const { name, namedungluong } = req.body

    const user = await User.findById(iduser).populate('sku')

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' })
    }

    let lastSku = null
    if (user.sku.length > 0) {
      lastSku = await Sku.findById(user.sku[user.sku.length - 1])
    }

    let newSkuCode = 'SKU001'
    if (lastSku) {
      const lastCode = lastSku.masku.replace('SKU', '')
      const newCodeNumber = parseInt(lastCode) + 1
      newSkuCode = `SKU${newCodeNumber.toString().padStart(3, '0')}`
    }

    const sku = new Sku({
      name,
      masku: newSkuCode,
      dungluong: []
    })

    await sku.save()

    if (!namedungluong || namedungluong.length === 0) {
      const dl = new DungLuongSku({
        name: '',
        madungluong: newSkuCode,
        sku: sku._id
      })
      await dl.save()
      sku.dungluong.push(dl._id)
    } else {
      for (const dlName of namedungluong) {
        const dl = new DungLuongSku({
          name: dlName,
          madungluong: `${newSkuCode}-${dlName}`,
          sku: sku._id
        })
        await dl.save()
        sku.dungluong.push(dl._id)
      }
    }

    for (const nhanvien of user.nhanvien) {
      const nv = await NhanVien.findById(nhanvien._id)
      if (!nv) continue

      const usernv = await User.findById(nv.user)
      if (!usernv) continue

      usernv.sku.push(sku._id)
      await usernv.save()
    }

    user.sku.push(sku._id)
    sku.userId = user._id
    await Promise.all([user.save(), sku.save()])

    res.json(sku)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/updatesku/:idsku', async (req, res) => {
  try {
    const idsku = req.params.idsku
    const { name } = req.body
    const sku = await Sku.findById(idsku)
    if (!sku) {
      return res.json({ error: 'sku không tồn tại' })
    }
    sku.name = name
    await sku.save()
    res.json({ message: 'cập nhật thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getchitietsku/:idsku', async (req, res) => {
  try {
    const idsku = req.params.idsku
    const sku = await Sku.findById(idsku)
    if (!sku) {
      return res.json({ error: 'sku không tồn tại' })
    }
    res.json(sku)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/deletesku', async (req, res) => {
  try {
    const { ids } = req.body
    for (const id of ids) {
      const sku = await Sku.findById(id)
      sku.status = -1
      await sku.save()
    }
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/deletedungluongsku', async (req, res) => {
  try {
    const { ids } = req.body
    for (const id of ids) {
      const dungluongsku = await DungLuongSku.findById(id)
      dungluongsku.status = -1
      await dungluongsku.save()
    }
    res.json({ message: 'xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postdungluongsku/:idsku', async (req, res) => {
  try {
    const idsku = req.params.idsku
    const { namedungluong } = req.body

    const sku = await Sku.findById(idsku)

    if (!sku) {
      return res.status(404).json({ message: 'sku không tồn tại.' })
    }

    if (!namedungluong || namedungluong.length === 0) {
      const dl = new DungLuongSku({
        name: '',
        madungluong: sku.masku,
        sku: sku._id
      })
      await dl.save()
      sku.dungluong.push(dl._id)
    } else {
      for (const dlName of namedungluong) {
        const dl = new DungLuongSku({
          name: dlName,
          madungluong: `${sku.masku}-${dlName}`,
          sku: sku._id
        })
        await dl.save()
        sku.dungluong.push(dl._id)
      }
    }

    await sku.save()

    res.json(sku)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/editdungluongsku/:iddungluongsku', async (req, res) => {
  try {
    const iddungluongsku = req.params.iddungluongsku
    const { namedungluong } = req.body

    const dungluongsku = await DungLuongSku.findById(iddungluongsku)

    if (!dungluongsku) {
      return res.status(404).json({ message: 'dung lượng sku không tồn tại.' })
    }

    const sku = await Sku.findById(dungluongsku.sku)
    if (!sku) {
      return res.status(404).json({ message: 'sku không tồn tại.' })
    }

    dungluongsku.name = namedungluong
    dungluongsku.madungluong = `${sku.masku}-${namedungluong}`
    await dungluongsku.save()

    res.json(dungluongsku)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getchitietdl/:iddlsku', async (req, res) => {
  try {
    const iddlsku = req.params.iddlsku
    const dungluongsku = await DungLuongSku.findById(iddlsku)
    res.json(dungluongsku)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

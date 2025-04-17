const router = require('express').Router()

const TheloaiTrogiup = require('../../models/TheLoaiTroGiupModel')
const TroGiup = require('../../models/TroGiupModel')

function toSlug (str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
}

router.get('/theloaitrogiup', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const total = await TheloaiTrogiup.countDocuments()

    const theloaitg = await TheloaiTrogiup.find().skip(skip).limit(limit).lean()

    res.json({
      data: theloaitg,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/posttheloaitrogiup', async (req, res) => {
  try {
    const { name } = req.body
    const theloaitg = new TheloaiTrogiup({
      name,
      namekhongdau: toSlug(name)
    })
    await theloaitg.save()
    res.json(theloaitg)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/updatetrogiup/:idtltrogiup', async (req, res) => {
  try {
    const idtltrogiup = req.params.idtltrogiup
    const { name } = req.body
    const theloaitrogiup = await TheloaiTrogiup.findById(idtltrogiup)
    if (!theloaitrogiup) {
      return res.json({ error: 'không tìm thấy thể loại trợ giúp' })
    }
    if (name) {
      theloaitrogiup.name = name
    }
    await theloaitrogiup.save()
    res.json(theloaitrogiup)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

router.post('/deletetheloaitg/:idtltrogiup', async (req, res) => {
  try {
    const idtltrogiup = req.params.idtltrogiup
    const theloaitrogiup = await TheloaiTrogiup.findById(idtltrogiup)

    await Promise.all(
      theloaitrogiup.trogiup.map(async tg => {
        await TroGiup.findByIdAndDelete(tg._id)
      })
    )

    await TheloaiTrogiup.findByIdAndDelete(idtltrogiup)
    res.json({message:'xóa thành công'})
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
})

module.exports = router

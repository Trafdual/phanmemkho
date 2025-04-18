const router = require('express').Router()
const TroGiup = require('../../models/TroGiupModel')
const TheLoaiTroGiup = require('../../models/TheLoaiTroGiupModel')
const uploads = require('../uploads')

router.post('/upload', uploads.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  const fileUrl = `${req.file.filename}`
  res.json({ url: fileUrl })
})

router.get('/getalltrogiup', async (req, res) => {
  try {
    const trogiup = await TroGiup.find().lean()
    const trogiupjson = await Promise.all(
      trogiup.map(async tg => {
        return {
          _id: tg._id,
          tieude: tg.tieude,
          image: tg.image || ''
        }
      })
    )
    res.json(trogiupjson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post(
  '/posttrogiup/:idtheloaitrogiup',
  uploads.fields([{ name: 'image', maxCount: 1 }]),
  async (req, res) => {
    try {
      const idtheloaitrogiup = req.params.idtheloaitrogiup
      const theloaitrogiup = await TheLoaiTroGiup.findById(idtheloaitrogiup)
      const { tieude, noidung } = req.body

      const image = req.files['image']
        ? `${req.files['image'][0].filename}`
        : null

      const trogiup = new TroGiup({
        tieude,
        noidung,
        image,
        theloaitrogiup: theloaitrogiup._id
      })
      theloaitrogiup.trogiup.push(trogiup._id)

      await trogiup.save()
      await theloaitrogiup.save()
      res.json({ message: 'thêm thành công' })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Đã xảy ra lỗi.' })
    }
  }
)

router.get('/gettrogiup/:id', async (req, res) => {
  try {
    const id = req.params.id
    const trogiup = await TroGiup.findById(id)
    res.json(trogiup)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
router.post('/deletetrogiup/:idtheloai', async (req, res) => {
  try {
    const { ids } = req.body
    const idtheloai = req.params.idtheloai
    const theloai = await TheLoaiTroGiup.findById(idtheloai)
    theloai.trogiup = theloai.trogiup.filter(
      tg => !ids.includes(tg._id.toString())
    )

    await theloai.save()

    await TroGiup.deleteMany({ _id: { $in: ids } })
    res.json({ message: 'Xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post(
  '/updatetrogiup/:idtrogiup',
  uploads.fields([{ name: 'image', maxCount: 1 }]),
  async (req, res) => {
    try {
      const idtrogiup = req.params.idtrogiup
      const { tieude, noidung } = req.body
      const image = req.files['image']
        ? `${req.files['image'][0].filename}`
        : null

      const trogiup = await TroGiup.findById(idtrogiup)

      if (image) {
        trogiup.image = image
      }
      if (tieude) {
        trogiup.tieude = tieude
      }
      if (noidung) {
        trogiup.noidung = noidung
      }
      await trogiup.save()
      res.json(trogiup)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Đã xảy ra lỗi.' })
    }
  }
)

router.post('/updatetl/:idtg', async (req, res) => {
  try {
    const idtg = req.params.idtg
    const { idtheloaitrogiup } = req.body
    const trogiup = await TroGiup.findById(idtg)
    const theloaitg = await TheLoaiTroGiup.findById(trogiup.theloaitrogiup)
    if (!theloaitg) {
      return res.json({ error: 'Thể loại không tồn tại' })
    }
    const theloaitgsua = await TheLoaiTroGiup.findById(idtheloaitrogiup)
    if (!theloaitgsua) {
      return res.json({ error: 'Thể loại sửa không tồn tại' })
    }

    theloaitg.trogiup = theloaitg.trogiup.filter(
      tg => tg._id.toString() !== trogiup._id.toString()
    )

    await theloaitg.save()
    theloaitgsua.trogiup.push(trogiup._id)
    await theloaitgsua.save()
    res.json({ message: 'update thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/gettrogiuptl/:idtheloaitrogiup', async (req, res) => {
  try {
    const idtheloaitrogiup = req.params.idtheloaitrogiup
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const theloaitrogiup = await TheLoaiTroGiup.findById(idtheloaitrogiup)

    if (!theloaitrogiup) {
      return res
        .status(404)
        .json({ message: 'Không tìm thấy thể loại trợ giúp' })
    }

    const totalItems = theloaitrogiup.trogiup.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    const trogiupIds = theloaitrogiup.trogiup.slice(startIndex, endIndex)

    const trogiupjson = await Promise.all(
      trogiupIds.map(async tg => {
        const trogiup = await TroGiup.findById(tg._id)
        return {
          _id: trogiup._id,
          tieude: trogiup.tieude,
          image: trogiup.image
        }
      })
    )

    res.json({
      page,
      totalPages,
      total: totalItems,
      data: trogiupjson
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

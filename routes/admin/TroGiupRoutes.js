const router = require('express').Router()
const TroGiup = require('../../models/TroGiupModel')
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
  '/posttrogiup',
  uploads.fields([{ name: 'image', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { tieude, noidung } = req.body

      const image = req.files['image']
        ? `${req.files['image'][0].filename}`
        : null

      const trogiup = new TroGiup({ tieude, noidung, image })
      await trogiup.save()
      res.render('trogiup')
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
router.post('/deletetrogiup', async (req, res) => {
  try {
    const { ids } = req.body
    await TroGiup.deleteMany({ _id: { $in: ids } })
    res.json({ message: 'Xóa thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

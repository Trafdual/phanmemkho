const router = require('express').Router()
const TroGiup = require('../models/TroGiupModel')
const uploads = require('./uploads')

router.post('/upload', uploads.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  const fileUrl = `http://localhost:8080/${req.file.filename}`
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
router.get('/getthemtrogiup', async (req, res) => {
  res.render('themtrogiup')
})
router.post('/posttrogiup', async (req, res) => {
  try {
    const { tieude, noidung } = req.body
    const trogiup = new TroGiup({ tieude, noidung })
    await trogiup.save()
    res.render('trogiup')
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
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

module.exports = router

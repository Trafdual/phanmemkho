const router = require('express').Router()
const Depot =require('../models/DepotModel')
const ThuChi =require('../models/ThuChiModel')
router.get('/getdoanhthu/:depotid', async (req, res) => {
  try {
    const depotId= req.params.depotid
    const depot = await Depot.findById(depotId)
    const { fromDate, endDate } = req.query
    const from = new Date(fromDate) 
    const end = new Date(endDate)
    
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})
module.exports = router

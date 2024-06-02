const router = require("express").Router();
const SanPham=require('../models/SanPhamModel');
router.get('/gettest',async(req,res)=>{
    try {
      const sanpham=await SanPham.find().lean();
      res.json(sanpham);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
  })

  router.get('/getsanpham',async(req,res)=>{
    try {
      res.render('nhapkho');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
  })

  router.post('/postest',async(req,res)=>{
    try {
        const{imel}=req.body;
        const sanpham=new SanPham({imel});
        await sanpham.save();
        res.json(sanpham);
    } catch (error) {
        console.error(error);
    res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
  })
  module.exports=router;
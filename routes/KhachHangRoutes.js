const router = require("express").Router();
const KhachHang=require('../models/KhachHangModel');
router.get('/khachhang',async(req,res)=>{
    try {
        const khachhang =await KhachHang.find().lean();
        res.json(khachhang);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})
router.post('/postkhachhang',async(req,res)=>{
    try {
        const {name,phone,email,cancuoc,address,date}=req.body;
        const khachhang=new KhachHang({name,phone,email,cancuoc,address,date});
        await khachhang.save();
        res.json(khachhang);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})

router.post('/putkhachhang/:idkhachhang',async(req,res)=>{
    try {
        const idkhachhang=req.params.idkhachhang;
        const {name,phone,email,cancuoc,address,date}=req.body;
        const khachhang=await KhachHang.findById(idkhachhang);
        khachhang.name=name;
        khachhang.phone=phone;
        khachhang.email=email;
        khachhang.cancuoc=cancuoc;
        khachhang.address=address;
        khachhang.date=date;
        await khachhang.save();
        res.json(khachhang);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})

router.post('/ngunghdkhachhang/:idkhachhang',async(req,res)=>{
    try {
        const idkhachhang=req.params.idkhachhang;
        const khachhang=await KhachHang.findById(idkhachhang);
        khachhang.isActivity=false;
        await khachhang.save();
        res.json(khachhang);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})
module.exports=router;
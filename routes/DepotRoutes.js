const router = require("express").Router();
const User = require('../models/UserModel');
const Depot=require('../models/DepotModel');
const multer = require('multer')
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post('/postdepot/:iduser',async(req,res)=>{
    try {
        const iduser=req.params.iduser;
        const{name,address}=req.body;
        const user=await User.findById(iduser);
        const depot=new Depot({name,address});
        user.depot=depot._id;
        depot.user.push(user._id);
        await depot.save();
        await user.save();
        res.json(depot);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})

router.get('/admin',async(req,res)=>{
    try {
        res.render('admin')
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})

module.exports=router;
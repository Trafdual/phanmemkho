const router = require("express").Router();
const User = require('../models/UserModel');
const Company = require('../models/CompanyModel');
const Depot=require('../models/DepotModel');
const multer = require('multer')
const User=require('../models/UserModel');

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post('/postdepot/:iduser',async(req,res)=>{
    try {
        const iduser=req.params.iduser;
        const{name,address}=req.body;
        const user=await User.findById(iduser);
        const company= new Company({name,address});
        company.user.push(user._id);
        await company.save();
        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})

module.exports=router;
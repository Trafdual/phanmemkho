const router = require("express").Router();
const HoaDon = require('../models/HoaDonModel');
const User = require('../models/UserModel');
const KhachHang = require('../models/KhachHangModel');
const LoaiSanPham = require('../models/LoaiSanPhamModel');
const moment = require('moment');
const momenttimezone = require('moment-timezone');
router.get('/hoadon', async (req, res) => {
    try {
        const hoadon = await HoaDon.find().lean();
        const hoadonjson = await Promise.all(hoadon.map(async (hd) => {
            const user = await User.findById(hd.nhanvien);
            const khachhang = await KhachHang.findById(hd.khachhang);
            const loaisanpham = await Promise.all(hd.loaisanpham.map(async (loaisp) => {
                const loai = await LoaiSanPham.findById(loaisp.id);
                return {
                    _id: loai._id,
                    soluong: loaisp.soluong
                }
            }))
            return {
                _id: hd._id,
                manhanvien: user._id,
                nhanvien: user.name,
                makhachhang: khachhang._id,
                khachhang: khachhang.name,
                loaisanpham: loaisanpham,
                date: moment(hd.date).format('DD/MM/YYYY'),
                tongtien: hd.tongtien
            }
        }))
        res.json(hoadonjson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})
router.get('/getchitiethoadon/:idhoadon', async (req, res) => {
    try {
        const idhoadon = req.params.idhoadon;
        const hoadon = await HoaDon.findById(idhoadon);
        const user = await User.findById(hoadon.nhanvien);
        const khachhang = await KhachHang.findById(hoadon.khachhang);
        const loaisanpham = await Promise.all(hoadon.loaisanpham.map(async (loaisp) => {
            const loai = await LoaiSanPham.findById(loaisp.id);
            return {
                _id: loai._id,
                soluong: loaisp.soluong
            }
        }))
        const hoadonjson = {
            _id: hd._id,
            manhanvien: user._id,
            nhanvien: user.name,
            makhachhang: khachhang._id,
            khachhang: khachhang.name,
            loaisanpham: loaisanpham,
            date: moment(hd.date).format('DD/MM/YYYY'),
            tongtien: hd.tongtien
        }
        res.json(hoadonjson);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})

router.post('/posthoadon', async (req, res) => {
    try {
        const { khachhang, loaisanpham, soluong } = req.body;
        const userid=req.session.userId;
        const vietnamTime = momenttimezone().toDate();
        const user= await User.findById(userid);
        const kh = await KhachHang.findOne({ name: khachhang });
        const loaisp = await LoaiSanPham.findOne({ name: loaisanpham });
        const hoadon = new HoaDon({ khachhang: kh._id,date:vietnamTime,nhanvien:user._id });
        hoadon.loaisanpham.push({ id: loaisp._id, soluong: soluong });
        hoadon.tongtien = loaisp.average * soluong;
        loaisp.soluong = loaisp.soluong - soluong;
        await hoadon.save();
        await loaisp.save();
        res.json(hoadon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})

// router.post('/puthoadon/:idhoadon', async (req, res) => {
//     try {
//         const idhoadon=req.params.idhoadon;
//         const { khachhang, loaisanpham, soluong } = req.body;
//         const kh = await KhachHang.findOne({ name: khachhang });
//         const loaisp = await LoaiSanPham.findOne({ name: loaisanpham });
//         const hoadon = await HoaDon.findById(idhoadon);
//         hoadon.khachhang=kh._id;

//         hoadon.tongtien = loaisp.average * soluong;
//         loaisp.soluong = loaisp.soluong - soluong;
//         await hoadon.save();
//         await loaisp.save();
//         res.json(hoadon);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Đã xảy ra lỗi.' });
//     }
// })
module.exports = router;
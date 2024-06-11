const router = require("express").Router();
const LoaiSanPham = require('../models/LoaiSanPhamModel');
const Depot = require('../models/DepotModel')
const moment = require('moment');

router.get('/getloaisanphamweb', async(req, res) => {
    try {
        const depotId = req.session.depotId;
        const depot = await Depot.findById(depotId);
        const loaisanpham = await Promise.all(depot.loaisanpham.map(async(loai) => {
            const loaisp = await LoaiSanPham.findById(loai._id);
            return {
                _id: loaisp._id,
                name: loaisp.name,
                soluong: loaisp.soluong,
                tongtien: loaisp.tongtien,
                date: moment(loaisp.date).format('DD/MM/YYYY'),
                average: loaisp.average
            }
        }))
        res.json(loaisanpham);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})
router.get('/getloaisanpham/:depotId', async(req, res) => {
    try {
        const depotId = req.params.depotId;
        const depot = await Depot.findById(depotId);
        const loaisanpham = await Promise.all(depot.loaisanpham.map(async(loai) => {
            const loaisp = await LoaiSanPham.findById(loai._id);
            return {
                _id: loaisp._id,
                name: loaisp.name,
                soluong: loaisp.soluong,
                tongtien: loaisp.tongtien,
                date: moment(loaisp.date).format('DD/MM/YYYY'),
                average: loaisp.average
            }
        }))
        res.json(loaisanpham);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})
router.post('/postloaisanpham', async(req, res) => {
    try {
        const depotId = req.session.depotId;
        const { name, tongtien, soluong, date } = req.body;
        const depot = await Depot.findById(depotId);
        const loaisanpham = new LoaiSanPham({ name, depot: depot._id, tongtien, soluong, date });
        loaisanpham.average = parseFloat((tongtien / soluong).toFixed(1));
        await loaisanpham.save();
        depot.loaisanpham.push(loaisanpham._id);
        await depot.save();
        res.json(loaisanpham);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})

router.post('/postloaisanpham/:depotId', async(req, res) => {
    try {
        const depotId = req.params.depotId;
        const { name } = req.body;
        const depot = await Depot.findById(depotId);
        const loaisanpham = new LoaiSanPham({ name, depot: depot._id });
        await loaisanpham.save();
        depot.loaisanpham.push(loaisanpham._id);
        await depot.save();
        res.json(loaisanpham);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})
router.post('/putloaisanpham/:idloai', async(req, res) => {
    try {
        const idloai = req.params.idloai;
        const { name, tongtien, soluong, date } = req.body;
        const average = parseFloat((tongtien / soluong).toFixed(1));
        const loaisanpham = await LoaiSanPham.findByIdAndUpdate(idloai, { name, tongtien, soluong, date, average });
        res.json(loaisanpham);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})
router.post('deletesanpham/:idloai', async(req, res) => {
    try {
        const idloai = req.params.idloai;
        const loaisanpham = await LoaiSanPham.findById(idloai);
        const depot = await Depot.findById(loaisanpham.depot);
        const index = depot.loaisanpham.indexOf(idloai);
        depot.loaisanpham.splice(index, 1);
        await depot.save();
        await LoaiSanPham.deleteOne({ _id: idloai });
        res.json({ message: 'xóa thành công' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Đã xảy ra lỗi.' });
    }
})
module.exports = router;
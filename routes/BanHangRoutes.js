const router = require('express').Router()
const SanPham = require('../models/SanPhamModel')
const Depot = require('../models/DepotModel')
const DungLuongSku = require('../models/DungluongSkuModel')
const Sku = require('../models/SkuModel')
const User = require('../models/UserModel')
const HoaDon = require('../models/HoaDonModel')
const momenttimezone = require('moment-timezone')
const moment = require('moment')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const KhachHang = require('../models/KhachHangModel')
const LenhDieuChuyen = require('../models/LenhDieuChuyenModel')
const CongNo = require('../models/CongNoModel')
const NhomKhacHang = require('../models/NhomKhacHangModel')

const parseDate = dateString => {
  return moment(dateString, 'DD/MM/YYYY').isValid()
    ? moment(dateString, 'DD/MM/YYYY').toDate()
    : null
}

router.get('/banhang/:idsku/:idkho/:userid', async (req, res) => {
  try {
    const { idsku, idkho, userid } = req.params

    const user = await User.findById(userid).populate('depot')
    if (!user || !user.depot.length) {
      return res.status(404).json({ message: 'Người dùng không có kho nào.' })
    }

    const allKho = user.depot

    const khoHienTai = allKho.find(kho => kho._id.toString() === idkho)
    if (!khoHienTai) {
      return res.status(404).json({ message: 'Kho hiện tại không tồn tại.' })
    }

    const cacKhoKhac = allKho.filter(kho => kho._id.toString() !== idkho)

    const sku = await Sku.findById(idsku)
    if (!sku) {
      return res.status(404).json({ message: 'SKU không tồn tại.' })
    }

    const dungluongskujson = await Promise.all(
      sku.dungluong.map(async dungluong => {
        const dl = await DungLuongSku.findOne({
          _id: dungluong._id,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        })
        if (!dl) return null

        const sku1 = await Sku.findOne({
          _id: dl.sku,
          $or: [{ status: 1 }, { status: { $exists: false } }]
        })
        let loaihanghoa

        const sanpham = await Promise.all(
          dl.sanpham.map(async sp => {
            const sp1 = await SanPham.findById(sp._id)
            const loaisanpham = await LoaiSanPham.findById(sp1.loaisanpham)
            loaihanghoa = loaisanpham.loaihanghoa

            if (sp1.xuat === false) {
              return {
                _id: sp1._id,
                name: sp1.name,
                idsku: sp1._id,
                masku: dl.madungluong,
                price: sp1.price,
                kho: sp1.kho.toString()
              }
            }
            return null
          })
        )

        const filteredSanpham = sanpham.filter(Boolean)

        const tonkho = filteredSanpham.reduce((acc, sp) => {
          acc[sp.kho] = (acc[sp.kho] || 0) + 1
          return acc
        }, {})

        const soluongTrongKhoHienTai = tonkho[idkho] || 0

        const totalSoLuongCacKhoKhac = cacKhoKhac.reduce((acc, kho) => {
          acc += tonkho[kho._id.toString()] || 0
          return acc
        }, 0)

        const soLuongCacKhoKhac = cacKhoKhac.map(kho => ({
          khoId: kho._id,
          tenkho: kho.name,
          soluong: tonkho[kho._id.toString()] || 0
        }))

        return {
          masku: dl.madungluong,
          idsku: dl._id,
          name: dl.name,
          loaihanghoa: loaihanghoa,
          tenkhohientai: khoHienTai.name,
          tensp: dl.name === '' ? sku1.name : `${sku1.name} (${dl.name})`,
          tonkho: soluongTrongKhoHienTai,
          cacKhoKhac: soLuongCacKhoKhac,
          tongSoLuongCacKhoKhac: totalSoLuongCacKhoKhac
        }
      })
    )

    res.json(dungluongskujson.filter(Boolean))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/banhangtest/:idsku/:idkho/:userid', async (req, res) => {
  try {
    const { idsku, idkho, userid } = req.params

    const user = await User.findById(userid).populate('depot')
    if (!user || !user.depot.length) {
      return res.status(404).json({ message: 'Người dùng không có kho nào.' })
    }

    const allKho = user.depot
    const khoHienTai = allKho.find(kho => kho._id.toString() === idkho)
    if (!khoHienTai) {
      return res.status(404).json({ message: 'Kho hiện tại không tồn tại.' })
    }
    const cacKhoKhac = allKho.filter(kho => kho._id.toString() !== idkho)

    const sku = await Sku.findById(idsku)
    if (!sku) {
      return res.status(404).json({ message: 'SKU không tồn tại.' })
    }

    const dungluongskujson = await Promise.all(
      sku.dungluong.map(async dungluong => {
        const dl = await DungLuongSku.findById(dungluong._id)
        if (!dl) return null

        const sku1 = await Sku.findById(dl.sku)
        let loaihanghoa
        const sanphamLinhKien = await Promise.all(
          dl.sanpham.map(async sp => {
            const sp1 = await SanPham.findById(sp._id)
            const loaisanpham = await LoaiSanPham.findById(sp1.loaisanpham)
            loaihanghoa = loaisanpham.loaihanghoa
            if (!sp1 || !loaisanpham) return null

            if (sp1.xuat === false && loaisanpham.loaihanghoa === 'Linh kiện') {
              return {
                _id: sp1._id,
                name: sp1.name,
                masku: dl.madungluong,
                price: sp1.price,
                kho: sp1.kho.toString()
              }
            }
            return null
          })
        )

        const filteredSanpham = sanphamLinhKien.filter(Boolean)

        if (filteredSanpham.length === 0) return null

        const tonkho = filteredSanpham.reduce((acc, sp) => {
          acc[sp.kho] = (acc[sp.kho] || 0) + 1
          return acc
        }, {})

        const soluongTrongKhoHienTai = tonkho[idkho] || 0

        const soLuongCacKhoKhac = cacKhoKhac.map(kho => ({
          khoId: kho._id,
          tenkho: kho.name,
          soluong: tonkho[kho._id.toString()] || 0
        }))

        const totalSoLuongCacKhoKhac = soLuongCacKhoKhac.reduce(
          (acc, kho) => acc + kho.soluong,
          0
        )

        return {
          idsku: dl._id,
          name: dl.name,
          tenkhohientai: khoHienTai.name,
          loaihanghoa: loaihanghoa,
          tensp: dl.name === '' ? sku1.name : `${sku1.name} (${dl.name})`,
          tonkho: soluongTrongKhoHienTai,
          cacKhoKhac: soLuongCacKhoKhac,
          tongSoLuongCacKhoKhac: totalSoLuongCacKhoKhac
        }
      })
    )

    res.json(dungluongskujson.filter(Boolean))
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getspbanhang/:iduser', async (req, res) => {
  try {
    const iduser = req.params.iduser
    const user = await User.findById(iduser)
    const skujson = await Promise.all(
      user.sku.map(async sku => {
        const sku1 = await Sku.findById(sku._id)
        return {
          _id: sku1._id,
          name: sku1.name
        }
      })
    )
    res.json(skujson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postchonsanpham/:idkho', async (req, res) => {
  try {
    const { products, idnganhang, method, makh, datcoc, tienkhachtra, ghino } =
      req.body
    const idkho = req.params.idkho
    const depot = await Depot.findById(idkho)

    const khachhang = await KhachHang.findOne({ makh: makh })
    const nhomkhachhang = await NhomKhacHang.findById(khachhang.nhomkhachhang)

    if (!khachhang) {
      return res.status(404).json({ message: 'Khách hàng không tồn tại.' })
    }

    const hoadon = new HoaDon({
      date: momenttimezone().toDate(),
      method,
      khachhang: khachhang._id,
      tongtien: 0
    })

    if (method === 'chuyển khoản') {
      hoadon.nganhang = idnganhang
    }

    const processedDepots = new Set()

    for (const product of products) {
      const { dongia, imelist, soluong, idsku } = product
      hoadon.tongtien += dongia * soluong

      if (!imelist || !Array.isArray(imelist)) {
        const sanpham = await Promise.all(
          depot.sanpham.map(async sp => {
            const sp1 = await SanPham.findById(sp._id)
            if (sp1.dungluongsku.toString() === idsku.toString()) {
              return sp1
            }
          })
        )
        const sortedSanpham = sanpham
          .filter(sp => sp !== undefined)
          .sort((a, b) => {
            return a._id > b._id ? 1 : -1
          })

        const selectedSanpham = sortedSanpham.slice(0, soluong)

        for (const sp of selectedSanpham) {
          const loaisanpham = await LoaiSanPham.findById(sp.loaisanpham)
          if (!loaisanpham) continue

          const kho = await Depot.findById(loaisanpham.depot)
          if (!kho) continue

          loaisanpham.sanpham = loaisanpham.sanpham.filter(
            spItem => spItem._id.toString() !== sp._id.toString()
          )

          hoadon.sanpham.push({ sp: sp._id, dongia: dongia })
          sp.xuat = true
          sp.datexuat = momenttimezone().toDate()

          kho.xuatkho.push(sp._id)

          if (!processedDepots.has(kho._id.toString())) {
            kho.hoadon.push(hoadon._id)
            processedDepots.add(kho._id.toString())
          }

          await kho.save()
          await loaisanpham.save()
          await sp.save()
        }
      } else {
        for (const imel of imelist) {
          const sanpham = await SanPham.findOne({ imel })
          if (!sanpham) continue

          const loaisanpham = await LoaiSanPham.findById(sanpham.loaisanpham)
          if (!loaisanpham) continue

          const kho = await Depot.findById(loaisanpham.depot)
          if (!kho) continue

          loaisanpham.sanpham = loaisanpham.sanpham.filter(
            sp => sp._id.toString() !== sanpham._id.toString()
          )

          hoadon.sanpham.push({ sp: sanpham._id, dongia: dongia })
          sanpham.xuat = true
          sanpham.datexuat = momenttimezone().toDate()

          kho.xuatkho.push(sanpham._id)

          if (!processedDepots.has(kho._id.toString())) {
            kho.hoadon.push(hoadon._id)
            processedDepots.add(kho._id.toString())
          }

          await kho.save()
          await loaisanpham.save()
          await sanpham.save()
        }
      }
    }

    hoadon.mahoadon = 'HD' + hoadon._id.toString().slice(-4)

    hoadon.soluong = hoadon.sanpham.length
    hoadon.datcoc = datcoc
    hoadon.tienkhachtra = tienkhachtra
    hoadon.tientralaikhach = hoadon.tienkhachtra - hoadon.tongtien
    khachhang.donhang.push(hoadon._id)

    await hoadon.save()
    await khachhang.save()
    const sanpham = await Promise.all(
      hoadon.sanpham.map(async sp => {
        const sp1 = await SanPham.findById(sp.sp._id)
        const dungluong = await DungLuongSku.findById(sp1.dungluongsku)
        return {
          tensanpham: sp1.name,
          madungluong: dungluong.madungluong,
          dongia: sp.dongia
        }
      })
    )
    const groupedSanpham = sanpham.reduce((acc, item) => {
      const key = item.tensanpham
      if (!acc[key]) {
        acc[key] = {
          tensanpham: item.tensanpham,
          soluong: 0,
          dongia: item.dongia,
          thanhtien: 0
        }
      }
      acc[key].soluong += 1
      acc[key].thanhtien = acc[key].dongia * acc[key].soluong
      return acc
    }, {})

    const result = Object.values(groupedSanpham)
    if (ghino === true) {
      hoadon.ghino = true
      const congno = new CongNo({
        khachhang: khachhang._id,
        tongtien: hoadon.tongtien - hoadon.datcoc,
        date: momenttimezone().toDate(),
        depot: depot._id
      })
      nhomkhachhang.congno.push(congno)
      khachhang.congno.push(congno._id)
      depot.congno.push(congno._id)
      await congno.save()
      await hoadon.save()
      await depot.save()
      await khachhang.save()
      await nhomkhachhang.save()
    }
    const hoadonjson = {
      mahoadon: hoadon.mahoadon,
      makh: makh,
      tenkhach: khachhang.name,
      phone: khachhang.phone,
      address: khachhang.address,
      date: moment(hoadon.date).format('DD/MM/YYYY HH:mm:ss'),
      method: hoadon.method,
      tongtien: hoadon.tongtien,
      datcoc: hoadon.datcoc,
      tienkhachtra: hoadon.tienkhachtra,
      tientralaikhach: hoadon.tientralaikhach,
      sanpham: result
    }
    res.json(hoadonjson)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getsanphamchon/:idkho/:idsku', async (req, res) => {
  try {
    const idkho = req.params.idkho
    const idsku = req.params.idsku
    const kho = await Depot.findById(idkho)
    const sanphamjson = await Promise.all(
      kho.sanpham.map(async sp => {
        const sp1 = await SanPham.findById(sp._id)
        if (
          sp1.dungluongsku.toString() === idsku.toString() &&
          sp1.xuat === false
        ) {
          return {
            _id: sp1._id,
            imel: sp1.imel
          }
        }
        return null
      })
    )
    const filteredSanpham = sanphamjson.filter(Boolean)
    res.json(filteredSanpham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/postyeucaudc/:idkho', async (req, res) => {
  try {
    const idkho = req.params.idkho
    const { idsku, soluong, idkhochuyen, lido } = req.body
    const khonhan = await Depot.findById(idkho)
    const khochuyen = await Depot.findById(idkhochuyen)
    const dungluongsku = await DungLuongSku.findById(idsku)
    const sku = await Sku.findById(dungluongsku.sku)
    const tensanpham =
      dungluongsku.name === '' ? sku.name : `${sku.name} (${dungluongsku.name})`

    const lenhdc = new LenhDieuChuyen({
      khonhan: khonhan._id,
      khochuyen: khochuyen._id,
      soluong,
      lido,
      sku: dungluongsku._id,
      tensanpham,
      date: momenttimezone().toDate()
    })
    const malenhdc = 'LDC' + lenhdc._id.toString().slice(-4)
    lenhdc.malenhdc = malenhdc
    khochuyen.lenhdieuchuyen.push(lenhdc._id)
    await lenhdc.save()
    await khochuyen.save()
    res.json(lenhdc)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getlenhdieuchuyen/:idkho', async (req, res) => {
  try {
    const idkho = req.params.idkho
    const kho = await Depot.findById(idkho)
    const lenhdieuchuyen = await Promise.all(
      kho.lenhdieuchuyen.map(async lenhdc => {
        const lenhdc1 = await LenhDieuChuyen.findById(lenhdc._id)
        const khochuyen = await Depot.findById(lenhdc1.khochuyen)
        const khonhan = await Depot.findById(lenhdc1.khonhan)
        const dungluongsku = await DungLuongSku.findById(lenhdc1.sku)
        if (lenhdc1.duyet === false) {
          return {
            _id: lenhdc1._id,
            malenhdc: lenhdc1.malenhdc,
            tensanpham: lenhdc1.tensanpham,
            khochuyen: khochuyen.name,
            khonhan: khonhan.name,
            lido: lenhdc1.lido,
            sku: dungluongsku.madungluong,
            soluong: lenhdc1.soluong,
            date: moment(lenhdc1.date).format('DD/MM/YYYY HH:mm:ss'),
            duyet: lenhdc1.duyet
          }
        }
        return null
      })
    )
    const filteredLenhdieuchuyen = lenhdieuchuyen.filter(item => item !== null)

    res.json(filteredLenhdieuchuyen)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/huylenhdieuchuyen/:idlenhdieuchuyen', async (req, res) => {
  try {
    const idlenhdieuchuyen = req.params.idlenhdieuchuyen
    const lenhdc = await LenhDieuChuyen.findById(idlenhdieuchuyen)
    const depot = await Depot.findById(lenhdc.khochuyen)
    depot.lenhdieuchuyen = depot.lenhdieuchuyen.filter(
      id => id.toString() !== idlenhdieuchuyen.toString()
    )
    await LenhDieuChuyen.findByIdAndDelete(idlenhdieuchuyen)

    await depot.save()

    res.json({ message: 'Hủy lệnh điều chuyển thành công' })
  } catch (error) {
    console.error(error)
  }
})

router.get('/soluonglenh/:idkho', async (req, res) => {
  try {
    const idkho = req.params.idkho
    if (!idkho || idkho === 'null' || idkho === 'undefined') {
      return res.status(400).json({ error: 'ID kho không hợp lệ' })
    }

    if (!idkho.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'ID kho không hợp lệ' })
    }

    const kho = await Depot.findById(idkho).populate('lenhdieuchuyen')
    const lenhFalse = kho.lenhdieuchuyen.filter(lenh => lenh.duyet === false)
    res.json({ soluonglenh: lenhFalse.length })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' })
  }
})

router.post('/duyetdieuchuyen/:idlenh', async (req, res) => {
  try {
    const idlenh = req.params.idlenh
    const lenhdc = await LenhDieuChuyen.findById(idlenh)
    lenhdc.duyet = true
    await lenhdc.save()
    res.json(lenhdc)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.post('/huydieuchuyen/:idlenh', async (req, res) => {
  try {
    const idlenh = req.params.idlenh
    await LenhDieuChuyen.findByIdAndDelete(idlenh)
    res.json({ message: 'Hủy thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getlenhdctheongay/:idkho', async (req, res) => {
  try {
    const idkho = req.params.idkho

    const begintime = parseDate(req.query.begintime)
    const endtime = parseDate(req.query.endtime)

    if (!begintime || !endtime) {
      return res.status(400).json({
        error: 'Thiếu thông tin khoảng thời gian.'
      })
    }

    if (!idkho || isNaN(begintime) || isNaN(endtime)) {
      return res.status(400).json({
        error: 'Thiếu thông tin idkho hoặc khoảng thời gian không hợp lệ.'
      })
    }

    const onlyDate = date =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const begintimeOnly = onlyDate(begintime)
    const endtimeOnly = onlyDate(endtime)

    const kho = await Depot.findById(idkho)
    if (!kho) {
      return res.status(404).json({ error: 'Không tìm thấy kho.' })
    }

    const lenhdieuchuyenjson = await Promise.all(
      kho.lenhdieuchuyen.map(async lenhdc => {
        const lenh = await LenhDieuChuyen.findById(lenhdc._id)
        const khochuyen = await Depot.findById(lenh.khochuyen)
        const khonhan = await Depot.findById(lenh.khonhan)
        const dungluongsku = await DungLuongSku.findById(lenh.sku)
        const lenhDateOnly = onlyDate(new Date(lenh.date))

        if (lenhDateOnly >= begintimeOnly && lenhDateOnly <= endtimeOnly) {
          return {
            _id: lenh._id,
            malenhdc: lenh.malenhdc,
            tensanpham: lenh.tensanpham,
            khochuyen: khochuyen.name,
            khonhan: khonhan.name,
            lido: lenh.lido,
            sku: dungluongsku.madungluong,
            soluong: lenh.soluong,
            date: moment(lenh.date).format('DD/MM/YYYY HH:mm:ss'),
            duyet: lenh.duyet
          }
        }
        return null
      })
    )
    const filteredLenhdieuchuyen = lenhdieuchuyenjson.filter(
      item => item !== null
    )

    return res.status(200).json(filteredLenhdieuchuyen)
  } catch (error) {
    console.error('Lỗi khi lấy lệnh điều chuyển:', error)
    return res
      .status(500)
      .json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau.' })
  }
})
router.get('/soluonglenhchuaduyet/:idkho', async (req, res) => {
  try {
    const idkho = req.params.idkho
    const kho = await Depot.findById(idkho)
    const lenhdieuchuyen = await Promise.all(
      kho.lenhdieuchuyen.map(async lenhdc => {
        const lenhdc1 = await LenhDieuChuyen.findById(lenhdc._id)
        if (lenhdc1.duyet === false) {
          return lenhdc1
        }
        return null
      })
    )
    const filteredLenhdieuchuyen = lenhdieuchuyen.filter(item => item !== null)
    const soluonglenh = filteredLenhdieuchuyen.length
    res.json({ soluonglenh: soluonglenh })
  } catch (error) {
    console.error('Lỗi khi lấy lệnh điều chuyển:', error)
    return res
      .status(500)
      .json({ error: 'Có lỗi xảy ra, vui lòng thử lại sau.' })
  }
})

module.exports = router

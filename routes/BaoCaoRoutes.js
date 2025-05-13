const router = require('express').Router()
const SanPham = require('../models/SanPhamModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const mongoose = require('mongoose')
const DePot = require('../models/DepotModel')
const DungLuongSku = require('../models/DungluongSkuModel')
const Sku = require('../models/SkuModel')
const CongNo = require('../models/CongNoModel')
const KhachHang = require('../models/KhachHangModel')
const NhomKhacHang = require('../models/NhomKhacHangModel')
const MucThuChi = require('../models/MucThuChiModel')
const ThuChi = require('../models/ThuChiModel')
const HoaDon = require('../models/HoaDonModel')
const DieuChuyen = require('../models/DieuChuyenModel')
const moment = require('moment')

// router.get('/getsptest/:khoID', async (req, res) => {
//   try {
//     const khoId = req.params.khoID
//     const { fromDate, endDate } = req.query

//     const from = new Date(fromDate)
//     const end = new Date(endDate)

//     const prevDay = new Date(fromDate)
//     prevDay.setDate(prevDay.getDate() - 1)

//     const dieuchuyen = await DieuChuyen.find({
//       depot: khoId,
//       date: { $gte: from, $lte: end }
//     })

//     console.log(dieuchuyen)

//     const depot = await DePot.findById(khoId)
//     const sanPhamDieuChuyen = []
//     for (const dc of dieuchuyen) {
//       for (const spId of dc.sanpham) {
//         sanPhamDieuChuyen.push(spId)
//       }
//     }

//     const allSanPhamIds = [
//       ...depot.sanpham.map(sp => sp._id.toString()),
//       ...sanPhamDieuChuyen.map(id => id.toString())
//     ]

//     const uniqueSanPhamIds = [...new Set(allSanPhamIds)]

//     const sanphamtest = await Promise.all(
//       uniqueSanPhamIds.map(async spId => {
//         const sanpham1 = await SanPham.findById(spId)
//         const dungluongsku = await DungLuongSku.findById(sanpham1.dungluongsku)
//         const sku = await Sku.findById(dungluongsku.sku)

//         const sanphamjson = {
//           _id: sanpham1._id,
//           masp: sanpham1.masp,
//           madungluongsku: dungluongsku.madungluong,
//           name: sanpham1.name,
//           datenhap: sanpham1.datenhap,
//           price: sanpham1.price,
//           datexuat: sanpham1.datexuat,
//           xuat: sanpham1.xuat
//         }

//         return {
//           masku: sku.masku,
//           namesku: sku.name,
//           sanpham: sanphamjson
//         }
//       })
//     )

//     const gopSanPham = sanphamtest.reduce((acc, item) => {
//       let existingSku = acc.find(x => x.masku === item.masku)
//       if (existingSku) {
//         existingSku.sanpham.push(item.sanpham)
//       } else {
//         acc.push({
//           masku: item.masku,
//           namesku: item.namesku,
//           sanpham: [item.sanpham]
//         })
//       }
//       return acc
//     }, [])

//     gopSanPham.forEach(skuItem => {
//       const gopDungLuong = skuItem.sanpham.reduce((acc, product) => {
//         let existingDungLuong = acc.find(
//           p => p.madungluongsku === product.madungluongsku
//         )
//         const datenhapArray = Array.isArray(product.datenhap)
//           ? product.datenhap
//           : [product.datenhap]

//         if (existingDungLuong) {
//           existingDungLuong.datenhap.push(...datenhapArray)
//         } else {
//           acc.push({
//             madungluongsku: product.madungluongsku,
//             name: product.name,
//             datenhap: [...datenhapArray],
//             soluongsp: 0,
//             price: 0,
//             tondauky: {
//               soluong: 0,
//               price: 0
//             },
//             nhaptrongky: {
//               soluong: 0,
//               price: 0
//             },
//             xuattrongky: {
//               soluong: 0,
//               price: 0
//             },
//             toncuoiky: {
//               soluong: 0,
//               price: 0
//             }
//           })
//           existingDungLuong = acc[acc.length - 1]
//         }

//         datenhapArray.forEach(date => {
//           const dateObj = new Date(date)
//           if (dateObj >= from && dateObj <= end) {
//             existingDungLuong.price += product.price
//           }
//         })

//         return acc
//       }, [])

//       gopDungLuong.forEach(dungluong => {
//         dungluong.datenhap = dungluong.datenhap.filter(date => {
//           const dateObj = new Date(date)
//           return dateObj
//         })

//         if (dungluong.datenhap.length > 0) {
//           dungluong.soluongsp = dungluong.datenhap.length
//           // dungluong.nhaptrongky.soluong = dungluong.datenhap.filter(date => {
//           //   return (
//           //     new Date(date).setHours(0, 0, 0, 0) >=
//           //       from.setHours(0, 0, 0, 0) &&
//           //     new Date(date).setHours(0, 0, 0, 0) <= end.setHours(0, 0, 0, 0)
//           //   )
//           // }).length
//           let productsOnPrevDay = []

//           skuItem.sanpham.forEach(product => {
//             if (product.madungluongsku === dungluong.madungluongsku) {
//               const productDate = new Date(product.datenhap).setHours(
//                 0,
//                 0,
//                 0,
//                 0
//               )
//               const productdatexuat = new Date(product.datexuat).setHours(
//                 0,
//                 0,
//                 0,
//                 0
//               )
//               const fromdate = new Date(from).setHours(0, 0, 0, 0)
//               const enddate = new Date(end).setHours(0, 0, 0, 0)
//               const prevDayDate = new Date(prevDay).setHours(0, 0, 0, 0)

//               if (productDate >= fromdate && productDate <= enddate) {

//                 dungluong.nhaptrongky.soluong++
//                 dungluong.nhaptrongky.price += product.price
//               }
//               if (productDate === prevDayDate) {
//                 if (product.xuat === false) {
//                   dungluong.tondauky.price += product.price
//                   productsOnPrevDay.push(product)
//                 }
//               }
//               if (productdatexuat >= fromdate && productdatexuat <= enddate) {
//                 const isDieuChuyen = dieuchuyen.some(dc =>
//                   dc.sanpham.some(
//                     spId => spId.toString() === product._id.toString()
//                   )
//                 )

//                 if (product.xuat === true || isDieuChuyen) {
//                   console.log(product)
//                   dungluong.xuattrongky.soluong++
//                   dungluong.xuattrongky.price += product.price
//                 }
//               }
//             }
//           })

//           dungluong.tondauky.soluong = productsOnPrevDay.length

//           dungluong.toncuoiky.soluong =
//             dungluong.tondauky.soluong +
//             dungluong.nhaptrongky.soluong -
//             dungluong.xuattrongky.soluong

//           dungluong.toncuoiky.price =
//             dungluong.tondauky.price +
//             dungluong.nhaptrongky.price -
//             dungluong.xuattrongky.price
//         }
//       })
//       skuItem.tongtondau = skuItem.tongtondau || { soluong: 0, price: 0 }
//       skuItem.tongnhaptrong = skuItem.tongnhaptrong || { soluong: 0, price: 0 }
//       skuItem.tongxuattrong = skuItem.tongxuattrong || { soluong: 0, price: 0 }
//       skuItem.tongtoncuoiky = skuItem.tongtoncuoiky || { soluong: 0, price: 0 }

//       skuItem.soluongsanpham = gopDungLuong.reduce(
//         (total, product) => total + product.soluongsp,
//         0
//       )
//       skuItem.tongtondau.price = gopDungLuong.reduce(
//         (total, product) => total + product.tondauky.price,
//         0
//       )
//       skuItem.tongnhaptrong.price = gopDungLuong.reduce(
//         (total, product) => total + product.nhaptrongky.price,
//         0
//       )

//       skuItem.tongxuattrong.price = gopDungLuong.reduce(
//         (total, product) => total + product.xuattrongky.price,
//         0
//       )
//       skuItem.tongtoncuoiky.price = gopDungLuong.reduce(
//         (total, product) => total + product.toncuoiky.price,
//         0
//       )

//       skuItem.tongtondau.soluong = gopDungLuong.reduce(
//         (total, product) => total + product.tondauky.soluong,
//         0
//       )
//       skuItem.tongnhaptrong.soluong = gopDungLuong.reduce(
//         (total, product) => total + product.nhaptrongky.soluong,
//         0
//       )
//       skuItem.tongxuattrong.soluong = gopDungLuong.reduce(
//         (total, product) => total + product.xuattrongky.soluong,
//         0
//       )
//       skuItem.tongtoncuoiky.soluong = gopDungLuong.reduce(
//         (total, product) => total + product.toncuoiky.soluong,
//         0
//       )

//       skuItem.sanpham = gopDungLuong
//     })

//     res.json(gopSanPham)
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: 'Đã xảy ra lỗi.' })
//   }
// })

router.get('/getsptest2/:khoID', async (req, res) => {
  try {
    const khoId = req.params.khoID
    const { fromDate, endDate } = req.query

    const from = new Date(fromDate)
    const end = new Date(endDate)
    const prevDay = new Date(fromDate)
    prevDay.setDate(prevDay.getDate() - 1)

    const dieuchuyen = await DieuChuyen.find({
      depot: khoId,
      date: { $gte: from, $lte: end }
    }).populate('sanpham', 'datenhap')

    const depot = await DePot.findById(khoId).populate('sanpham')

    const sanPhamDieuChuyenMap = new Map()
    dieuchuyen.forEach(dc => {
      dc.sanpham.forEach(sp => {
        sanPhamDieuChuyenMap.set(sp._id.toString(), sp.datenhap)
      })
    })

    const allSanPhamIds = new Set([
      ...depot.sanpham.map(sp => sp._id.toString()),
      ...sanPhamDieuChuyenMap.keys()
    ])
    const sanphamList = await SanPham.find({
      _id: { $in: [...allSanPhamIds] }
    }).lean()
    const dungluongskuIds = sanphamList.map(sp => sp.dungluongsku)
    const dungluongskuList = await DungLuongSku.find({
      _id: { $in: dungluongskuIds }
    }).lean()
    const skuIds = dungluongskuList.map(dls => dls.sku)
    const skuList = await Sku.find({ _id: { $in: skuIds } }).lean()

    const dungluongskuMap = new Map(
      dungluongskuList.map(dls => [dls._id.toString(), dls])
    )
    const skuMap = new Map(skuList.map(sku => [sku._id.toString(), sku]))

    const sanphamtest = sanphamList.map(sp => {
      const dls = dungluongskuMap.get(sp.dungluongsku.toString())
      const sku = skuMap.get(dls.sku.toString())

      return {
        masku: sku.masku,
        namesku: sku.name,
        sanpham: {
          _id: sp._id,
          masp: sp.masp,
          madungluongsku: dls.madungluong,
          name: sp.name,
          datenhap: sp.datenhap,
          price: sp.price,
          datexuat: sp.datexuat,
          xuat: sp.xuat
        }
      }
    })

    const gopSanPham = sanphamtest.reduce((acc, item) => {
      let skuGroup = acc.get(item.masku)
      if (!skuGroup) {
        skuGroup = {
          masku: item.masku,
          namesku: item.namesku,
          sanpham: []
        }
        acc.set(item.masku, skuGroup)
      }
      skuGroup.sanpham.push(item.sanpham)
      return acc
    }, new Map())

    for (const skuItem of gopSanPham.values()) {
      const dungluongMap = new Map()

      for (const product of skuItem.sanpham) {
        let dungluong = dungluongMap.get(product.madungluongsku)
        if (!dungluong) {
          dungluong = {
            madungluongsku: product.madungluongsku,
            name: product.name,
            datenhap: [],
            soluongsp: 0,
            price: 0,
            tondauky: { soluong: 0, price: 0 },
            nhaptrongky: { soluong: 0, price: 0 },
            xuattrongky: { soluong: 0, price: 0 },
            toncuoiky: { soluong: 0, price: 0 }
          }
          dungluongMap.set(product.madungluongsku, dungluong)
        }

        const datenhapArray = Array.isArray(product.datenhap)
          ? product.datenhap
          : [product.datenhap]
        dungluong.datenhap.push(...datenhapArray)
      }

      for (const dungluong of dungluongMap.values()) {
        dungluong.datenhap = dungluong.datenhap.filter(date => new Date(date))

        if (dungluong.datenhap.length > 0) {
          dungluong.soluongsp = dungluong.datenhap.length
          const productsOnPrevDay = []

          for (const product of skuItem.sanpham) {
            if (product.madungluongsku === dungluong.madungluongsku) {
              const productDate = new Date(product.datenhap).setHours(
                0,
                0,
                0,
                0
              )
              const productdatexuat = product.datexuat
                ? new Date(product.datexuat).setHours(0, 0, 0, 0)
                : null
              const fromdate = from.setHours(0, 0, 0, 0)
              const enddate = end.setHours(0, 0, 0, 0)
              const prevDayDate = prevDay.setHours(0, 0, 0, 0)

              if (productDate >= fromdate && productDate <= enddate) {
                dungluong.nhaptrongky.soluong++
                dungluong.nhaptrongky.price += product.price
              }

              if (productDate === prevDayDate && !product.xuat) {
                dungluong.tondauky.price += product.price
                productsOnPrevDay.push(product)
              }

              if (
                productdatexuat &&
                productdatexuat >= fromdate &&
                productdatexuat <= enddate
              ) {
                const isDieuChuyen = sanPhamDieuChuyenMap.has(
                  product._id.toString()
                )
                if (product.xuat || isDieuChuyen) {
                  dungluong.xuattrongky.soluong++
                  dungluong.xuattrongky.price += product.price
                }
              }
            }
          }

          dungluong.tondauky.soluong = productsOnPrevDay.length
          dungluong.toncuoiky.soluong =
            dungluong.tondauky.soluong +
            dungluong.nhaptrongky.soluong -
            dungluong.xuattrongky.soluong
          dungluong.toncuoiky.price =
            dungluong.tondauky.price +
            dungluong.nhaptrongky.price -
            dungluong.xuattrongky.price
        }
      }

      const gopDungLuong = [...dungluongMap.values()]
      skuItem.sanpham = gopDungLuong
      skuItem.tongtondau = {
        soluong: gopDungLuong.reduce((sum, p) => sum + p.tondauky.soluong, 0),
        price: gopDungLuong.reduce((sum, p) => sum + p.tondauky.price, 0)
      }
      skuItem.tongnhaptrong = {
        soluong: gopDungLuong.reduce(
          (sum, p) => sum + p.nhaptrongky.soluong,
          0
        ),
        price: gopDungLuong.reduce((sum, p) => sum + p.nhaptrongky.price, 0)
      }
      skuItem.tongxuattrong = {
        soluong: gopDungLuong.reduce(
          (sum, p) => sum + p.xuattrongky.soluong,
          0
        ),
        price: gopDungLuong.reduce((sum, p) => sum + p.xuattrongky.price, 0)
      }
      skuItem.tongtoncuoiky = {
        soluong: gopDungLuong.reduce((sum, p) => sum + p.toncuoiky.soluong, 0),
        price: gopDungLuong.reduce((sum, p) => sum + p.toncuoiky.price, 0)
      }
      skuItem.soluongsanpham = gopDungLuong.reduce(
        (sum, p) => sum + p.soluongsp,
        0
      )
    }

    res.json([...gopSanPham.values()])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/getcongno3/:idkho', async (req, res) => {
  try {
    const idkho = req.params.idkho
    const depot = await DePot.findById(idkho)
    const { fromdate, enddate } = req.query
    const from = new Date(fromdate)
    const end = new Date(enddate)
    end.setUTCHours(23, 59, 59, 999)

    const previousFrom = new Date(from)
    previousFrom.setDate(
      previousFrom.getDate() - (end.getDate() - from.getDate())
    )
    const previousEnd = new Date(from)
    previousEnd.setDate(previousEnd.getDate() - 1)
    console.log(previousFrom)

    const mucThuChiCongNo = await MucThuChi.find({ name: 'công nợ' })

    const giamTrongKyThuChi = await ThuChi.find({
      depot: depot._id,
      date: { $gte: from, $lte: end },
      'chitiet.mucthuchi': { $in: mucThuChiCongNo.map(muc => muc._id) },
      loaitien: 'Tiền thu'
    })

    const giamTrongKyTruoc = await ThuChi.find({
      depot: depot._id,
      date: { $gte: previousFrom, $lte: previousEnd },
      'chitiet.mucthuchi': { $in: mucThuChiCongNo.map(muc => muc._id) },
      loaitien: 'Tiền thu'
    })

    const congnoAllPreviousMonths = await CongNo.find({
      depot: depot._id,
      date: { $lt: from }
    })

    const congnoCurrentMonth = await CongNo.find({
      depot: depot._id,
      date: { $gte: from, $lte: end }
    })

    const khachhang = await Promise.all(
      depot.khachang.map(async kh => {
        const khachhang = await KhachHang.findById(kh._id)
        const nhomkhachhang = await NhomKhacHang.findById(
          khachhang.nhomkhachhang
        )

        let totalTanggtrongky = 0
        let customerTotalNodauky = 0
        let totalGiamtrongky = 0

        const customerCongnoPreviousMonths = congnoAllPreviousMonths.filter(
          cn => cn.khachhang.toString() === khachhang._id.toString()
        )
        customerTotalNodauky = customerCongnoPreviousMonths.reduce(
          (sum, cn) => sum + cn.tongtien,
          0
        )

        const customerCongnoCurrentMonth = congnoCurrentMonth.filter(
          cn => cn.khachhang.toString() === khachhang._id.toString()
        )

        totalTanggtrongky = customerCongnoCurrentMonth.reduce(
          (sum, cn) => sum + cn.tongtien,
          0
        )

        const customerThuChi = giamTrongKyThuChi.filter(
          tc => tc.doituong.toString() === khachhang._id.toString()
        )
        totalGiamtrongky = customerThuChi.reduce(
          (sum, tc) =>
            sum +
            tc.chitiet.reduce(
              (detailSum, detail) =>
                mucThuChiCongNo.some(
                  muc => muc._id.toString() === detail.mucthuchi.toString()
                )
                  ? detailSum + detail.sotien
                  : detailSum,
              0
            ),
          0
        )

        const customerThuChiTruoc = giamTrongKyTruoc.filter(
          tc => tc.doituong.toString() === khachhang._id.toString()
        )

        const totalGiamtrongkyTruocDo = customerThuChiTruoc.reduce(
          (sum, tc) =>
            sum +
            tc.chitiet.reduce(
              (detailSum, detail) =>
                mucThuChiCongNo.some(
                  muc => muc._id.toString() === detail.mucthuchi.toString()
                )
                  ? detailSum + detail.sotien
                  : detailSum,
              0
            ),
          0
        )

        customerTotalNodauky = customerTotalNodauky - totalGiamtrongkyTruocDo

        return {
          makh: khachhang.makh,
          namekhach: khachhang.name,
          nhomkhachhang: nhomkhachhang.name,
          phone: khachhang.phone,
          nodauky: customerTotalNodauky,
          tangtrongky: totalTanggtrongky,
          giamtrongky: totalGiamtrongky
        }
      })
    )

    res.json(khachhang)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

router.get('/baocaobanhang/:idkho', async (req, res) => {
  try {
    const { fromdate, enddate } = req.query
    const idkho = req.params.idkho
    const kho = await DePot.findById(idkho).populate(['hoadon', 'sanpham'])

    const from = new Date(fromdate)
    const end = new Date(enddate)
    end.setUTCHours(23, 59, 59, 999)

    const hoaDons = await HoaDon.find({
      _id: { $in: kho.hoadon },
      date: {
        $gte: from,
        $lte: end
      }
    })
    console.log(hoaDons)

    const hoaDonReport = hoaDons.reduce((acc, hoaDon) => {
      const dateKey = hoaDon.date.toISOString().split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = 0
      }
      acc[dateKey] += hoaDon.tongtien || 0
      return acc
    }, {})

    const sanPhams = await SanPham.find({
      _id: {
        $in: kho.sanpham
      },
      datexuat: {
        $gte: from,
        $lte: end
      },
      xuat: true
    })

    const nhapHangReport = sanPhams.reduce((acc, sanPham) => {
      const dateKey = sanPham.datexuat.toISOString().split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = 0
      }
      acc[dateKey] += sanPham.price || 0
      return acc
    }, {})

    const congNoHoaDons = await CongNo.find({
      depot: idkho,
      date: {
        $gte: from,
        $lte: end
      }
    }).populate('khachhang', 'ten')

    const tienmatHoaDons = await HoaDon.find({
      _id: { $in: kho.hoadon },
      date: {
        $gte: from,
        $lte: end
      },
      method: 'Tiền mặt'
    }).populate('khachhang', 'ten')

    const chuyenkhoanHoaDons = await HoaDon.find({
      _id: { $in: kho.hoadon },
      date: {
        $gte: from,
        $lte: end
      },
      method: 'Chuyển khoản'
    }).populate('khachhang', 'ten')

    const congNoReport = congNoHoaDons.reduce((acc, hoaDon) => {
      const dateKey = hoaDon.date.toISOString().split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = 0
      }

      acc[dateKey] += hoaDon.tongtien || 0

      return acc
    }, {})

    const tienmatReport = tienmatHoaDons.reduce((acc, hoaDon) => {
      const dateKey = hoaDon.date.toISOString().split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = 0
      }

      acc[dateKey] += hoaDon.tongtien || 0

      return acc
    }, {})

    const chuyenkhoanReport = chuyenkhoanHoaDons.reduce((acc, hoaDon) => {
      const dateKey = hoaDon.date.toISOString().split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = 0
      }

      acc[dateKey] += hoaDon.tongtien || 0

      return acc
    }, {})

    const combinedReport = []

    const allDates = [
      ...new Set([
        ...Object.keys(hoaDonReport),
        ...Object.keys(nhapHangReport),
        ...Object.keys(congNoReport),
        ...Object.keys(tienmatReport),
        ...Object.keys(chuyenkhoanReport)
      ])
    ]

    allDates.forEach(date => {
      combinedReport.push({
        date: moment(date).format('DD/MM/YYYY'),
        hoaDon: hoaDonReport[date] || 0,
        nhapHang: nhapHangReport[date] || 0,
        congNo: congNoReport[date] || 0,
        tienmat: tienmatReport[date] || 0,
        chuyenkhoan: chuyenkhoanReport[date] || 0
      })
    })

    res.status(200).json(combinedReport)
  } catch (error) {
    console.error('Lỗi khi tạo báo cáo:', error)
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ. Không thể tạo báo cáo.'
    })
  }
})

module.exports = router

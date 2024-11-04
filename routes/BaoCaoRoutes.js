const router = require('express').Router()
const SanPham = require('../models/SanPhamModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const mongoose = require('mongoose')

router.get('/getbaocaokho/:khoID', async (req, res) => {
  try {
    const { khoID } = req.params
    const { fromDate, toDate } = req.query // Lấy ngày từ yêu cầu

    // Tạo điều kiện lọc ngày từ fromDate đến toDate
    const startDate = new Date(`${fromDate}T00:00:00.000Z`)
    const endDate = new Date(`${toDate}T23:59:59.999Z`)

    const dateFilter = {
      $gte: startDate,
      $lte: endDate
    }
    console.log(dateFilter)

    // Tìm ngày nhập đầu tiên cho từng SKU trong khoảng thời gian
    const firstEntries = await SanPham.aggregate([
      {
        $match: {
          kho: new mongoose.Types.ObjectId(khoID),
          datenhap: { $gte: startDate, $lte: endDate } 
        }
      },
      {
        $group: {
          _id: '$dungluongsku', // Nhóm theo dungluongsku
          firstEntryDate: { $min: '$datenhap' } // Lấy ngày nhập đầu tiên
        }
      }
    ])

    // Nếu không có SKU nào, trả về thông báo
    if (firstEntries.length === 0) {
      return res.json({
        báo_cáo: [],
        message: 'Không có dữ liệu trong khoảng thời gian đã chọn'
      })
    }

    // Lấy dữ liệu tồn đầu kỳ cho từng SKU
    const initialDataPromises = firstEntries.map(async entry => {
      return await SanPham.aggregate([
        {
          $match: {
            kho: new mongoose.Types.ObjectId(khoID),
            datenhap: { $eq: entry.firstEntryDate }, // Lấy dữ liệu của ngày nhập đầu tiên cho SKU
            dungluongsku: entry._id // Chỉ lấy dữ liệu cho SKU này
          }
        },
        {
          $lookup: {
            from: 'loaisanphams',
            localField: 'loaisanpham',
            foreignField: '_id',
            as: 'loaisanpham'
          }
        },
        { $unwind: '$loaisanpham' },
        {
          $lookup: {
            from: 'dungluongs',
            localField: 'dungluongsku',
            foreignField: '_id',
            as: 'dungluongsku'
          }
        },
        { $unwind: '$dungluongsku' },
        {
          $project: {
            masp: 1,
            price: 1,
            xuat: 1,
            'loaisanpham.name': 1,
            'dungluongsku.madungluong': 1
          }
        }
      ])
    })

    const initialDataResults = await Promise.all(initialDataPromises)

    // Lấy dữ liệu nhập trong kỳ từ ngày tiếp theo đến toDate
    const reportData = await SanPham.aggregate([
      {
        $match: {
          kho: new mongoose.Types.ObjectId(khoID),
          datenhap: {
            $gt: firstEntries[0].firstEntryDate,
            $lte: new Date(toDate)
          } // Lấy dữ liệu sau ngày nhập đầu tiên
        }
      },
      {
        $lookup: {
          from: 'loaisanphams',
          localField: 'loaisanpham',
          foreignField: '_id',
          as: 'loaisanpham'
        }
      },
      { $unwind: '$loaisanpham' },
      {
        $lookup: {
          from: 'dungluongs',
          localField: 'dungluongsku',
          foreignField: '_id',
          as: 'dungluongsku'
        }
      },
      { $unwind: '$dungluongsku' },
      {
        $project: {
          masp: 1,
          name: 1,
          imel: 1,
          price: 1,
          datenhap: 1,
          datexuat: 1,
          xuat: 1,
          tralai: 1,
          'loaisanpham.name': 1,
          'dungluongsku.madungluong': 1
        }
      },
      { $sort: { datenhap: 1 } }
    ])

    const summarizedData = {}

    // Cập nhật dữ liệu tồn đầu kỳ
    for (const initialData of initialDataResults) {
      for (const item of initialData) {
        const sku = item.dungluongsku.madungluong
        const productName = item.loaisanpham.name
        const value = item.price

        if (!summarizedData[sku]) {
          summarizedData[sku] = {
            mã_sku: sku,
            tên_hàng_hóa: productName,
            đơn_vị_tính: 'Chiếc',
            tồn_đầu_kỳ: { số_lượng: 1, giá_trị: value },
            nhập_trong_kỳ: { số_lượng: 0, giá_trị: 0 },
            xuất_trong_kỳ: { số_lượng: 0, giá_trị: 0 },
            tồn_cuối_kỳ: { số_lượng: 0, giá_trị: 0 }
          }
        } else {
          summarizedData[sku]['tồn_đầu_kỳ'].số_lượng += 1
          summarizedData[sku]['tồn_đầu_kỳ'].giá_trị += value
        }
      }
    }

    // Duyệt qua từng sản phẩm trong reportData và cập nhật dữ liệu
    for (const item of reportData) {
      const sku = item.dungluongsku.madungluong
      const productName = item.loaisanpham.name
      const value = item.price

      if (!summarizedData[sku]) {
        summarizedData[sku] = {
          mã_sku: sku,
          tên_hàng_hóa: productName,
          đơn_vị_tính: 'Chiếc',
          tồn_đầu_kỳ: { số_lượng: 0, giá_trị: 0 },
          nhập_trong_kỳ: { số_lượng: 1, giá_trị: value },
          xuất_trong_kỳ: { số_lượng: 0, giá_trị: 0 },
          tồn_cuối_kỳ: { số_lượng: 0, giá_trị: 0 }
        }
      } else {
        summarizedData[sku]['nhập_trong_kỳ'].số_lượng += 1
        summarizedData[sku]['nhập_trong_kỳ'].giá_trị += value
      }

      if (item.xuat) {
        summarizedData[sku]['xuất_trong_kỳ'].số_lượng += 1
        summarizedData[sku]['xuất_trong_kỳ'].giá_trị += value
      }
    }

    // Kiểm tra lại số lượng sản phẩm đã được tổng hợp
    console.log('Số lượng SKU đã tổng hợp:', Object.keys(summarizedData).length)

    // Tính tồn cuối kỳ
    for (const sku in summarizedData) {
      const data = summarizedData[sku]
      data['tồn_cuối_kỳ'].số_lượng =
        data['tồn_đầu_kỳ'].số_lượng +
        data['nhập_trong_kỳ'].số_lượng -
        data['xuất_trong_kỳ'].số_lượng;
      data['tồn_cuối_kỳ'].giá_trị =
        data['tồn_đầu_kỳ'].giá_trị +
        data['nhập_trong_kỳ'].giá_trị -
        data['xuất_trong_kỳ'].giá_trị
    }

    // Trả về dữ liệu báo cáo
    const reportArray = Object.values(summarizedData)
    res.json({ báo_cáo: reportArray })
  } catch (error) {
    res.status(500).json({ error: 'Lỗi máy chủ', details: error.message })
  }
})

router.get('/locsanpham/:khoId', async (req, res) => {
  try {
    const { khoId } = req.params
    const { fromDate, toDate } = req.query

    const startDate = new Date(fromDate)
    const endDate = new Date(toDate)

    const dateFilter = {
      $gte: startDate,
      $lte: endDate
    }

    const products = await SanPham.find({
      kho: new mongoose.Types.ObjectId(khoId),
      datenhap: dateFilter
    })
      .populate('loaisanpham')
      .populate('dungluongsku')

    if (products.length === 0) {
      return res.json({
        message: 'Không có sản phẩm nào trong khoảng thời gian đã chọn'
      })
    }

    // Gộp sản phẩm theo dungluongsku
    const groupedProducts = products.reduce((acc, product) => {
      const dungluongsku = product.dungluongsku.name // Thay 'name' bằng tên trường tương ứng trong mô hình dung lượng SKU của bạn
      const tensp = product.name // Thay 'name' bằng tên trường tương ứng trong mô hình sản phẩm của bạn

      if (!acc[dungluongsku]) {
        acc[dungluongsku] = {
          tensku: dungluongsku,
          soluongsanpham: 0,
          products: [] // Khởi tạo danh sách sản phẩm
        }
      }

      // Kiểm tra xem sản phẩm đã có trong danh sách chưa
      const existingProduct = acc[dungluongsku].products.find(
        p => p.tensp === tensp
      )
      if (existingProduct) {
        existingProduct.soluong += 1 // Tăng số lượng nếu sản phẩm đã tồn tại
      } else {
        acc[dungluongsku].products.push({ tensp, soluong: 1 }) // Thêm sản phẩm mới vào danh sách
      }

      acc[dungluongsku].soluongsanpham += 1 // Tăng tổng số lượng sản phẩm

      return acc
    }, {})

    const resultArray = Object.values(groupedProducts)

    res.json({ products: resultArray })
  } catch (error) {
    res.status(500).json({ error: 'Lỗi máy chủ', details: error.message })
  }
})

module.exports = router

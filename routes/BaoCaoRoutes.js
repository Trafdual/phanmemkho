const router = require('express').Router()
const SanPham = require('../models/SanPhamModel')
const LoaiSanPham = require('../models/LoaiSanPhamModel')
const mongoose = require('mongoose')
const DePot = require('../models/DepotModel')
const DungLuongSku = require('../models/DungluongSkuModel')
const Sku = require('../models/SkuModel')

router.get('/getsptest/:khoID', async (req, res) => {
  try {
    const khoId = req.params.khoID
    const { fromDate, endDate } = req.query // Nhận `fromDate` và `endDate` từ query

    const from = new Date(fromDate)
    const end = new Date(endDate)

    const depot = await DePot.findById(khoId)
    const sanphamtest = await Promise.all(
      depot.sanpham.map(async sanpham => {
        const sanpham1 = await SanPham.findById(sanpham._id)
        const dungluongsku = await DungLuongSku.findById(sanpham1.dungluongsku)
        const sku = await Sku.findById(dungluongsku.sku)

        const sanphamjson = {
          madungluongsku: dungluongsku.madungluong,
          name: sanpham1.name,
          datenhap: sanpham1.datenhap,
          price: sanpham1.price,
          datexuat: sanpham1.datexuat,
          xuat: sanpham1.xuat
        }

        return {
          masku: sku.masku,
          namesku: sku.name,
          sanpham: sanphamjson
        }
      })
    )

    const gopSanPham = sanphamtest.reduce((acc, item) => {
      let existingSku = acc.find(x => x.masku === item.masku)
      if (existingSku) {
        existingSku.sanpham.push(item.sanpham)
      } else {
        acc.push({
          masku: item.masku,
          namesku: item.namesku,
          sanpham: [item.sanpham]
        })
      }
      return acc
    }, [])

    gopSanPham.forEach(skuItem => {
      const gopDungLuong = skuItem.sanpham.reduce((acc, product) => {
        let existingDungLuong = acc.find(
          p => p.madungluongsku === product.madungluongsku
        )
        const datenhapArray = Array.isArray(product.datenhap)
          ? product.datenhap
          : [product.datenhap]

        if (existingDungLuong) {
          // Nếu đã có `existingDungLuong`, thêm các ngày nhập từ `datenhapArray`
          existingDungLuong.datenhap.push(...datenhapArray)
        } else {
          // Nếu chưa có, thêm mới `dungluong` với `datenhapArray`
          acc.push({
            madungluongsku: product.madungluongsku,
            name: product.name,
            datenhap: [...datenhapArray], // Sử dụng `datenhapArray` trực tiếp
            soluongsp: 0,
            price: 0,
            tondauky: {
              soluong: 0,
              price: 0
            }, // Thêm tondauky vào đây
            nhaptrongky: {
              soluong: 0,
              price: 0
            },
            xuattrongky: {
              soluong: 0,
              price: 0
            }, // Thêm tondauky vào đây
            toncuoiky: {
              soluong: 0,
              price: 0
            }
          })
          existingDungLuong = acc[acc.length - 1]
        }

        datenhapArray.forEach(date => {
          const dateObj = new Date(date)
          if (dateObj >= from && dateObj <= end) {
            existingDungLuong.price += product.price // Cộng price tương ứng với ngày nhập
          }
        })

        return acc
      }, [])

      gopDungLuong.forEach(dungluong => {
        dungluong.datenhap = dungluong.datenhap.filter(date => {
          const dateObj = new Date(date)
          return dateObj >= from && dateObj <= end
        })

        // Tìm ngày nhỏ nhất và tính tồn đầu kỳ
        if (dungluong.datenhap.length > 0) {
          const minDate = new Date(
            Math.min(...dungluong.datenhap.map(date => new Date(date)))
          )
          dungluong.soluongsp = dungluong.datenhap.length

          dungluong.tondauky = {
            soluong: dungluong.datenhap.filter(date => {
              return new Date(date).toDateString() === minDate.toDateString()
            }).length,
            price: 0 // Khởi tạo giá trị mặc định
          }

          dungluong.nhaptrongky.soluong = dungluong.datenhap.filter(date => {
            return new Date(date).toDateString() !== minDate.toDateString()
          }).length

          skuItem.sanpham.forEach(product => {
            if (product.madungluongsku === dungluong.madungluongsku) {
              // Tồn đầu kỳ
              if (
                new Date(product.datenhap).setHours(0, 0, 0, 0) ===
                minDate.setHours(0, 0, 0, 0)
              ) {
                dungluong.tondauky.price += product.price // Cộng giá sản phẩm vào tondauky.price
              }
              // Nhập trong kỳ
              else if (
                new Date(product.datenhap).setHours(0, 0, 0, 0) >
                minDate.setHours(0, 0, 0, 0)
              ) {
                console.log(product)
                dungluong.nhaptrongky.price += product.price
              }

              if (product.xuat && product.datexuat) {
                const datexuatObj = new Date(product.datexuat)
                if (datexuatObj >= from && datexuatObj <= end) {
                  dungluong.xuattrongky.soluong += 1
                  dungluong.xuattrongky.price += product.price
                }
              }
            }
          })

          dungluong.toncuoiky.soluong =
            dungluong.tondauky.soluong +
            dungluong.nhaptrongky.soluong -
            dungluong.xuattrongky.soluong

          dungluong.toncuoiky.price =
            dungluong.tondauky.price +
            dungluong.nhaptrongky.price -
            dungluong.xuattrongky.price
        }
      })
      skuItem.tongtondau = skuItem.tongtondau || { soluong: 0, price: 0 }
      skuItem.tongnhaptrong = skuItem.tongnhaptrong || { soluong: 0, price: 0 }
      skuItem.tongxuattrong = skuItem.tongxuattrong || { soluong: 0, price: 0 }
      skuItem.tongtoncuoiky = skuItem.tongtoncuoiky || { soluong: 0, price: 0 }

      skuItem.soluongsanpham = gopDungLuong.reduce(
        (total, product) => total + product.soluongsp,
        0
      )
      skuItem.tongtondau.price = gopDungLuong.reduce(
        (total, product) => total + product.tondauky.price,
        0
      )
      skuItem.tongnhaptrong.price = gopDungLuong.reduce(
        (total, product) => total + product.nhaptrongky.price,
        0
      )

      skuItem.tongxuattrong.price = gopDungLuong.reduce(
        (total, product) => total + product.xuattrongky.price,
        0
      )
      skuItem.tongtoncuoiky.price = gopDungLuong.reduce(
        (total, product) => total + product.toncuoiky.price,
        0
      )

      skuItem.tongtondau.soluong = gopDungLuong.reduce(
        (total, product) => total + product.tondauky.soluong,
        0
      )
      skuItem.tongnhaptrong.soluong = gopDungLuong.reduce(
        (total, product) => total + product.nhaptrongky.soluong,
        0
      )
      skuItem.tongxuattrong.soluong = gopDungLuong.reduce(
        (total, product) => total + product.xuattrongky.soluong,
        0
      )
      skuItem.tongtoncuoiky.soluong = gopDungLuong.reduce(
        (total, product) => total + product.toncuoiky.soluong,
        0
      )

      skuItem.sanpham = gopDungLuong
    })

    res.json(gopSanPham)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Đã xảy ra lỗi.' })
  }
})

module.exports = router

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
    const { fromDate, endDate } = req.query

    const from = new Date(fromDate)
    const end = new Date(endDate)

    const prevDay = new Date(fromDate)
    prevDay.setDate(prevDay.getDate() - 1)

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
          existingDungLuong.datenhap.push(...datenhapArray)
        } else {
          acc.push({
            madungluongsku: product.madungluongsku,
            name: product.name,
            datenhap: [...datenhapArray], 
            soluongsp: 0,
            price: 0,
            tondauky: {
              soluong: 0,
              price: 0
            },
            nhaptrongky: {
              soluong: 0,
              price: 0
            },
            xuattrongky: {
              soluong: 0,
              price: 0
            },
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
            existingDungLuong.price += product.price 
          }
        })

        return acc
      }, [])

      gopDungLuong.forEach(dungluong => {
        dungluong.datenhap = dungluong.datenhap.filter(date => {
          const dateObj = new Date(date)
          return dateObj
        })

        if (dungluong.datenhap.length > 0) {
          dungluong.soluongsp = dungluong.datenhap.length
          dungluong.nhaptrongky.soluong = dungluong.datenhap.filter(date => {
            return (
              new Date(date).setHours(0, 0, 0, 0) >=
                from.setHours(0, 0, 0, 0) &&
              new Date(date).setHours(0, 0, 0, 0) <= end.setHours(0, 0, 0, 0)
            )
          }).length
          let productsOnPrevDay = []

          skuItem.sanpham.forEach(product => {
            if (product.madungluongsku === dungluong.madungluongsku) {
              const productDate = new Date(product.datenhap).setHours(
                0,
                0,
                0,
                0
              )
              if (
                productDate >= from.setHours(0, 0, 0, 0) &&
                productDate <= end.setHours(0, 0, 0, 0)
              ) {
                dungluong.nhaptrongky.price += product.price
                if(product.xuat === true){
                  dungluong.xuattrongky.soluong++
                  dungluong.xuattrongky.price += product.price
                }
              }
              if (productDate === prevDay.setHours(0, 0, 0, 0)) {
                dungluong.tondauky.price += product.price
                productsOnPrevDay.push(product)
              }

            }
          })
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

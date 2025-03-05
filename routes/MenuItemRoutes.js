const router = require('express').Router()
const MenuItem = require('../models/MenuItemModel')

router.get('/getmenu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find()
    res.json(menuItems)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

router.post('/menu', async (req, res) => {
  try {
    const menuData = [
      {
        path: '/home',
        title: 'Tổng quan',
        icon: 'faHouse'
      },
      {
        title: 'Báo cáo',
        icon: 'faChartPie',
        dropdownKey: 'isDropdownOpenBaoCao',
        children: [
          { path: '/doanhthu', title: 'Doanh Thu', icon: 'faMoneyBillTrendUp' },
          { path: '/baocaokho', title: 'Kho', icon: 'faLandmark' },
          { path: '/baocaobanhang', title: 'Bán hàng', icon: 'faCartShopping' },
          { path: '/baocaocongno', title: 'Công nợ', icon: 'faMoneyBill' }
        ]
      },
      {
        path: '/nhacungcap',
        title: 'Nhà cung cấp',
        icon: 'faHandshake'
      },
      {
        title: 'Kho',
        icon: 'faLandmark',
        dropdownKey: 'isDropdownOpenKho',
        children: [
          { path: '/nhapkho', title: 'Nhập Kho', icon: 'faLandmark' },
          { path: '/xuatkho', title: 'Xuất Kho', icon: 'faWarehouse' },
          {
            path: '/lenhdieuchuyen',
            title: 'Lệnh điều chuyển',
            icon: 'faTruckFast',
            badge: true
          }
        ]
      },
      {
        title: 'Quỹ tiền',
        icon: 'faWallet',
        dropdownKey: 'isDropdownOpenQuyTien',
        children: [
          {
            path: '/quytienmat',
            title: 'Thu, chi tiền mặt',
            icon: 'faMoneyBill'
          },
          {
            path: '/quytiengui',
            title: 'Thu, chi tiền gửi',
            icon: 'faMoneyCheck'
          }
        ]
      },
      {
        path: '/banhang',
        title: 'Bán Hàng',
        icon: 'faCartShopping'
      },
      {
        path: '/trogiuptongquan',
        title: 'Trợ giúp',
        icon: 'faCircleQuestion'
      },
      {
        title: 'Thiết lập',
        icon: 'faGear',
        dropdownKey: 'isDropdownOpen',
        children: [
          { path: '/thietlap', title: 'Cấu hình', icon: 'faWrench' },
          { path: '/thietlap/baomat', title: 'Bảo mật', icon: 'faShieldHalved' }
        ]
      },
      {
        title: 'Đăng Xuất',
        icon: 'faRightFromBracket',
        onClick: 'setIsModalDangXuat(true)'
      }
    ]

    await MenuItem.insertMany(menuData)
    res.json({ message: 'Thêm menu thành công' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Lỗi server' })
  }
})

module.exports = router

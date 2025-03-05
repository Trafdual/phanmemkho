"use strict";

var router = require('express').Router();

var MenuItem = require('../models/MenuItemModel');

router.get('/getmenu', function _callee(req, res) {
  var menuItems;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(MenuItem.find());

        case 3:
          menuItems = _context.sent;
          res.json(menuItems);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(500).json({
            error: 'Lỗi server'
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.post('/menu', function _callee2(req, res) {
  var menuData;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          menuData = [{
            path: '/home',
            title: 'Tổng quan',
            icon: 'faHouse'
          }, {
            title: 'Báo cáo',
            icon: 'faChartPie',
            dropdownKey: 'isDropdownOpenBaoCao',
            children: [{
              path: '/doanhthu',
              title: 'Doanh Thu',
              icon: 'faMoneyBillTrendUp'
            }, {
              path: '/baocaokho',
              title: 'Kho',
              icon: 'faLandmark'
            }, {
              path: '/baocaobanhang',
              title: 'Bán hàng',
              icon: 'faCartShopping'
            }, {
              path: '/baocaocongno',
              title: 'Công nợ',
              icon: 'faMoneyBill'
            }]
          }, {
            path: '/nhacungcap',
            title: 'Nhà cung cấp',
            icon: 'faHandshake'
          }, {
            title: 'Kho',
            icon: 'faLandmark',
            dropdownKey: 'isDropdownOpenKho',
            children: [{
              path: '/nhapkho',
              title: 'Nhập Kho',
              icon: 'faLandmark'
            }, {
              path: '/xuatkho',
              title: 'Xuất Kho',
              icon: 'faWarehouse'
            }, {
              path: '/lenhdieuchuyen',
              title: 'Lệnh điều chuyển',
              icon: 'faTruckFast',
              badge: true
            }]
          }, {
            title: 'Quỹ tiền',
            icon: 'faWallet',
            dropdownKey: 'isDropdownOpenQuyTien',
            children: [{
              path: '/quytienmat',
              title: 'Thu, chi tiền mặt',
              icon: 'faMoneyBill'
            }, {
              path: '/quytiengui',
              title: 'Thu, chi tiền gửi',
              icon: 'faMoneyCheck'
            }]
          }, {
            path: '/banhang',
            title: 'Bán Hàng',
            icon: 'faCartShopping'
          }, {
            path: '/trogiuptongquan',
            title: 'Trợ giúp',
            icon: 'faCircleQuestion'
          }, {
            title: 'Thiết lập',
            icon: 'faGear',
            dropdownKey: 'isDropdownOpen',
            children: [{
              path: '/thietlap',
              title: 'Cấu hình',
              icon: 'faWrench'
            }, {
              path: '/thietlap/baomat',
              title: 'Bảo mật',
              icon: 'faShieldHalved'
            }]
          }, {
            title: 'Đăng Xuất',
            icon: 'faRightFromBracket',
            onClick: 'setIsModalDangXuat(true)'
          }];
          _context2.next = 4;
          return regeneratorRuntime.awrap(MenuItem.insertMany(menuData));

        case 4:
          res.json({
            message: 'Thêm menu thành công'
          });
          _context2.next = 11;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            error: 'Lỗi server'
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;
"use strict";

var express = require('express');

var mongoose = require('mongoose');

var bodyParser = require('body-parser');

var session = require('express-session');

var methodOverride = require('method-override');

var cors = require('cors');

var cookieParser = require('cookie-parser');

var nodemailer = require('nodemailer');

var _require = require('googleapis'),
    google = _require.google;

var MongoStore = require('connect-mongo');

var passport = require('passport');

var JavaScriptObfuscator = require('javascript-obfuscator');

var puppeteer = require('puppeteer');

var fs = require('fs');

var userRoutes = require('./routes/UserRoutes');

var depotroutes = require('./routes/DepotRoutes');

var sanphamRoutes = require('./routes/SanphamRoutes');

var loaisanphamRoutes = require('./routes/LoaiSanPhamRoutes');

var khachhangRoutes = require('./routes/KhachHangRoutes');

var hoadonRoutes = require('./routes/HoaDonRoutes');

var nhanvienRoutes = require('./routes/NhanvienRoutes');

var nhacungcapRoutes = require('./routes/NhanCungCapRoutes');

var dieuchuyenRoutes = require('./routes/DieuChuyenRoutes');

var nganhangRoutes = require('./routes/NganHangRoutes');

var skuroutes = require('./routes/SkuRoutes');

var trahangroutes = require('./routes/TraHangRoutes');

var baocaoroutes = require('./routes/BaoCaoRoutes');

var banhangRoutes = require('./routes/BanHangRoutes');

var trogiupRoutes = require('./routes/TroGiupRoutes');

var thuchiRoutes = require('./routes/ThuChiRoutes');

var mucthuchiRoutes = require('./routes/MucThuChiRoutes');

var loaichungtuRoutes = require('./routes/LoaiChungTuRoutes');

var doanhthuRoutes = require('./routes/DoanhThuRoutes');

var nhomkhachang = require('./routes/NhomKhachHangRoutes');

var tranoroutes = require('./routes/TraNoRoutes');

var trangchuroutes = require('./routes/TrangChuRoutes');

var apiadminRoutes = require('./routes/ApiAdminRoutes');

var _require2 = require('./routes/sendEvent'),
    router = _require2.router;

require('./routes/passport');

require('./routes/passportface');

var path = require('path');

var app = express();
app.use(methodOverride('_method'));
var uri = 'mongodb+srv://trafdual0810:Kv39w3Cv7yirfP9q@cluster0.zeqquh2.mongodb.net/phanmemkho?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(console.log('kết nối thành công'));
var mongoStoreOptions = {
  mongooseConnection: mongoose.connection,
  mongoUrl: uri,
  collection: 'sessions'
};
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express["static"](path.join(__dirname, '/public')));
app.use(express["static"](path.join(__dirname, '/uploads')));
app.use(express["static"](path.join(__dirname, '/images')));
app.use(express["static"](path.join(__dirname, '/javascript'), {
  maxAge: '1s',
  setHeaders: function setHeaders(res, path, stat) {
    if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));
app.use(express["static"](path.join(__dirname, '/style')));
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create(mongoStoreOptions),
  cookie: {
    secure: false
  }
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use('/', userRoutes);
app.use('/', depotroutes);
app.use('/', sanphamRoutes);
app.use('/', loaisanphamRoutes);
app.use('/', khachhangRoutes);
app.use('/', hoadonRoutes);
app.use('/', nhanvienRoutes);
app.use('/', nhacungcapRoutes);
app.use('/', dieuchuyenRoutes);
app.use('/', nganhangRoutes);
app.use('/', skuroutes);
app.use('/', trahangroutes);
app.use('/', baocaoroutes);
app.use('/', banhangRoutes);
app.use('/', trogiupRoutes);
app.use('/', thuchiRoutes);
app.use('/', mucthuchiRoutes);
app.use('/', loaichungtuRoutes);
app.use('/', doanhthuRoutes);
app.use('/', nhomkhachang);
app.use('/', router);
app.use('/', tranoroutes);
app.use('/', trangchuroutes);
app.use('/', apiadminRoutes);
var port = process.env.PORT || 3015;
app.use(function (req, res, next) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});
app.listen(port, function () {
  try {
    console.log('kết nối thành công 3015');
  } catch (error) {
    console.log('kết nối thất bại 3015', error);
  }
});
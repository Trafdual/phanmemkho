const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/UserRoutes')
const depotroutes = require('./routes/DepotRoutes');
const sanphamRoutes = require('./routes/SanphamRoutes');
const loaisanphamRoutes = require('./routes/LoaiSanPhamRoutes');
const khachhangRoutes = require('./routes/KhachHangRoutes');
const hoadonRoutes = require('./routes/HoaDonRoutes');
const nhanvienRoutes = require('./routes/NhanvienRoutes');

var path = require('path');

var app = express();
app.use(methodOverride('_method'));

const uri = "mongodb+srv://trafdual0810:Kv39w3Cv7yirfP9q@cluster0.zeqquh2.mongodb.net/phanmemkho?retryWrites=true&w=majority";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("kết nối thành công"));

const mongoStoreOptions = {
    mongooseConnection: mongoose.connection,
    mongoUrl: uri,
    collection: 'sessions',
};

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, '/javascript')));
app.use(express.static(path.join(__dirname, '/style')));



app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(mongoStoreOptions),
    cookie: {
        secure: false,
    }
}));
app.use(cors());

app.use('/', userRoutes);
app.use('/', depotroutes);
app.use('/', sanphamRoutes);
app.use('/', loaisanphamRoutes);
app.use('/', khachhangRoutes);
app.use('/', hoadonRoutes);
app.use('/', nhanvienRoutes);

const port = process.env.PORT || 8080

app.listen(port, () => {
    try {
        console.log('kết nối thành công 8080')
    } catch (error) {
        console.log('kết nối thất bại 8080', error)
    }
});
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const JavaScriptObfuscator = require('javascript-obfuscator')
const puppeteer = require('puppeteer')
const fs = require('fs')
const cron = require('node-cron')
const User = require('./models/UserModel')
const { verifyHMAC } = require('./checkKhoaDuLIEU/hmac')
const userRoutes = require('./routes/UserRoutes')

const depotroutes = require('./routes/DepotRoutes')
const sanphamRoutes = require('./routes/SanphamRoutes')
const loaisanphamRoutes = require('./routes/LoaiSanPhamRoutes')
const khachhangRoutes = require('./routes/KhachHangRoutes')
const hoadonRoutes = require('./routes/HoaDonRoutes')
const nhanvienRoutes = require('./routes/NhanvienRoutes')
const nhacungcapRoutes = require('./routes/NhanCungCapRoutes')
const dieuchuyenRoutes = require('./routes/DieuChuyenRoutes')
const nganhangRoutes = require('./routes/NganHangRoutes')
const skuroutes = require('./routes/SkuRoutes')
const trahangroutes = require('./routes/TraHangRoutes')
const baocaoroutes = require('./routes/BaoCaoRoutes')
const banhangRoutes = require('./routes/BanHangRoutes')
const trogiupRoutes = require('./routes/admin/TroGiupRoutes')
const thuchiRoutes = require('./routes/ThuChiRoutes')
const mucthuchiRoutes = require('./routes/MucThuChiRoutes')
const loaichungtuRoutes = require('./routes/LoaiChungTuRoutes')
const doanhthuRoutes = require('./routes/DoanhThuRoutes')
const nhomkhachang = require('./routes/NhomKhachHangRoutes')
const tranoroutes = require('./routes/TraNoRoutes')
const trangchuroutes = require('./routes/TrangChuRoutes')
const apiadminRoutes = require('./routes/ApiAdminRoutes')
const menuitemroutes = require('./routes/MenuItemRoutes')
const useradminroutes = require('./routes/admin/UserAdminRoutes')
const theloaitrogiuproutes = require('./routes/admin/TheLoaiTroGiupRoutes')
const { checkKhoaDuLieu } = require('./checkKhoaDuLIEU/checkkhoa')
const { router } = require('./routes/sendEvent')
require('./routes/passport')
require('./routes/passportface')
var path = require('path')

var app = express()
app.use(methodOverride('_method'))

const uri =
  'mongodb+srv://trafdual0810:Kv39w3Cv7yirfP9q@cluster0.zeqquh2.mongodb.net/phanmemkho?retryWrites=true&w=majority'

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log('kết nối thành công'))

const mongoStoreOptions = {
  mongooseConnection: mongoose.connection,
  mongoUrl: uri,
  collection: 'sessions'
}
const originalLog = console.log

console.log = (...args) => {
  const stack = new Error().stack.split('\n')[2].trim() // Lấy dòng gọi console.log
  originalLog(`[LOG from ${stack}]`, ...args)
}

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.static(path.join(__dirname, '/uploads')))
app.use(express.static(path.join(__dirname, '/images')))

app.use(
  express.static(path.join(__dirname, '/javascript'), {
    maxAge: '1s',
    setHeaders: function (res, path, stat) {
      if (path.endsWith('.js')) {
        res.setHeader('Cache-Control', 'no-cache')
      }
    }
  })
)
app.use(express.static(path.join(__dirname, '/style')))

const allowedOrigins = ['http://localhost:3006', 'https://baotech.vn']
const allowedIPs = ['::1', '171.241.24.194']

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Signature',
      'X-Timestamp'
    ],
    credentials: true
  })
)

app.use(
  session({
    secret: 'adscascd8saa8sdv87ds78v6dsv87asvdasv8',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(mongoStoreOptions)
    // ,cookie: { secure: true }
  })
)

app.use(passport.initialize())
app.use(passport.session())

const normalizeIP = ip => {
  if (ip?.startsWith('::ffff:')) {
    return ip.split('::ffff:')[1]
  }
  return ip
}

app.use((req, res, next) => {
  const origin = req.headers.origin
  const clientIP = normalizeIP(req.ip)

  if (origin && allowedOrigins.includes(origin)) {
    return next()
  }

  if (allowedIPs.includes(clientIP)) {
    return next()
  }

  return res.status(403).json({ message: 'Bạn không có quyền truy cập API' })
})

app.use('/', userRoutes)
app.use('/', depotroutes)
app.use('/', sanphamRoutes)
app.use('/', loaisanphamRoutes)
app.use('/', khachhangRoutes)
app.use('/', hoadonRoutes)
app.use('/', nhanvienRoutes)
app.use('/', nhacungcapRoutes)
app.use('/', dieuchuyenRoutes)
app.use('/', nganhangRoutes)
app.use('/', skuroutes)
app.use('/', trahangroutes)
app.use('/', baocaoroutes)
app.use('/', banhangRoutes)
app.use('/', trogiupRoutes)
app.use('/', thuchiRoutes)
app.use('/', mucthuchiRoutes)
app.use('/', loaichungtuRoutes)
app.use('/', doanhthuRoutes)
app.use('/', nhomkhachang)
app.use('/', router)
app.use('/', tranoroutes)
app.use('/', trangchuroutes)
app.use('/', verifyHMAC, apiadminRoutes)
app.use('/', menuitemroutes)
app.use('/admin', theloaitrogiuproutes)
app.use('/admin', useradminroutes)

const port = process.env.PORT || 3015

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  next()
})
// const inputPath = path.join(__dirname, '/javascript/register.js'); // Đường dẫn tới tệp JS của bạn
// const outputPath = path.join(__dirname, '/javascript/register.obfuscated.js'); // Đường dẫn tới tệp JS sau khi obfuscate

// // Đọc tệp JS gốc
// fs.readFile(inputPath, 'utf8', (err, data) => {
//     if (err) {
//         return console.log('Error reading file:', err);
//     }

//     // Obfuscate mã JS
//     const obfuscatedCode = JavaScriptObfuscator.obfuscate(data, {
//         compact: true,
//         controlFlowFlattening: true,
//         controlFlowFlatteningThreshold: 0.75,
//         numbersToExpressions: true,
//         simplify: true,
//         shuffleStringArray: true,
//         splitStrings: true,
//         stringArrayThreshold: 0.75
//     }).getObfuscatedCode();

//     // Ghi tệp JS đã obfuscate
//     fs.writeFile(outputPath, obfuscatedCode, (err) => {
//         if (err) {
//             return console.log('Error writing file:', err);
//         }
//         console.log('The file was obfuscated and saved as', outputPath);
//     });
// });
//

// async function fetchLinks (url) {
//   const browser = await puppeteer.launch()
//   const page = await browser.newPage()

//   await page.goto(url, { waitUntil: 'networkidle2' })

//   const links = await page.evaluate(() => {
//     const anchors = Array.from(document.querySelectorAll('a'))
//     return anchors
//       .map(anchor => anchor.href)
//       .filter(href => href.startsWith('http'))
//   })

//   await browser.close()
//   return links
// }

// function createSitemap (links, filePath) {
//   const urlSet = links
//     .map(
//       link => `
//     <url>
//       <loc>${link}</loc>
//       <changefreq>daily</changefreq>
//       <priority>0.7</priority>
//     </url>
//   `
//     )
//     .join('\n')

//   const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
//   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//     ${urlSet}
//   </urlset>`

//   fs.writeFileSync(filePath, sitemap)
// }

// const websiteUrl = 'https://baominhmobile.com/'
// fetchLinks(websiteUrl).then(links => {
//   createSitemap(links, 'sitemap.xml')
//   console.log('Sitemap created')
// })

cron.schedule('0 * * * *', async () => {
  const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const usersToRemove = await User.find({
    isVerified: false,
    otpCreatedAt: { $lt: expiredDate }
  })

  for (const user of usersToRemove) {
    await User.deleteOne({ _id: user._id })
    console.log(`Đã xóa user ${user.email} vì không xác minh OTP trong 24h.`)
  }
})

app.listen(port, () => {
  try {
    console.log('kết nối thành công 3015')
  } catch (error) {
    console.log('kết nối thất bại 3015', error)
  }
})

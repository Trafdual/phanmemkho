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
const userRoutes = require('./routes/UserRoutes')
const depotroutes = require('./routes/DepotRoutes')
const sanphamRoutes = require('./routes/SanphamRoutes')
const loaisanphamRoutes = require('./routes/LoaiSanPhamRoutes')
const khachhangRoutes = require('./routes/KhachHangRoutes')
const hoadonRoutes = require('./routes/HoaDonRoutes')
const nhanvienRoutes = require('./routes/NhanvienRoutes')
const nhacungcapRoutes = require('./routes/NhanCungCapRoutes')
const dieuchuyenRoutes=require('./routes/DieuChuyenRoutes')
const nganhangRoutes=require('./routes/NganHangRoutes')
const skuroutes=require('./routes/SkuRoutes')
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

app.use(
  session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create(mongoStoreOptions),
    cookie: {
      secure: false
    }
  })
)
app.use(cors())
app.use(passport.initialize())
app.use(passport.session())

app.use('/', userRoutes)
app.use('/', depotroutes)
app.use('/', sanphamRoutes)
app.use('/', loaisanphamRoutes)
app.use('/', khachhangRoutes)
app.use('/', hoadonRoutes)
app.use('/', nhanvienRoutes)
app.use('/', nhacungcapRoutes)
app.use('/',dieuchuyenRoutes)
app.use('/',nganhangRoutes)
app.use('/',skuroutes)

const port = process.env.PORT || 8080

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

app.listen(port, () => {
  try {
    console.log('kết nối thành công 8080')
  } catch (error) {
    console.log('kết nối thất bại 8080', error)
  }
})

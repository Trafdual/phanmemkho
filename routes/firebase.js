const admin = require('firebase-admin');
const serviceAccount = require('../appgiapha-firebase-adminsdk-z9uh9-aa3fef5e78.json'); // Đường dẫn tới tệp JSON khóa dịch vụ

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
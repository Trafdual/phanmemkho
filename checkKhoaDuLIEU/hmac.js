const crypto = require('crypto')

require('dotenv').config()

const SECRET_KEY = process.env.secretkey

const verifyHMAC = (req, res, next) => {
  const signature = req.headers['x-signature']
  const timestamp = req.headers['x-timestamp']
  if (!signature || !timestamp) {
    return res.status(401).json({ message: 'Missing signature or timestamp' })
  }

  const currentTimestamp = Date.now()
  const requestTimestamp = parseInt(timestamp)
  const maxTimeDiff = 5 * 60 * 1000 // 5 phút

  if (Math.abs(currentTimestamp - requestTimestamp) > maxTimeDiff) {
    return res.status(401).json({ message: 'Timestamp expired' })
  }

  const payload = req.method === 'GET' ? '' : JSON.stringify(req.body || {})

  const message = `${timestamp}:${payload}`
  const expectedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(message)
    .digest('hex')

  if (expectedSignature !== signature) {
    return res.status(401).json({ message: 'Invalid signature' })
  }

  next()
}

module.exports = { verifyHMAC }

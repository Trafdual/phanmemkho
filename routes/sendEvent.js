const router = require('express').Router()

let clients = []

router.get('/events', (req, res) => {
  console.log('Client connected to events API')
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()
  try {
    clients.push(res)

    req.on('close', () => {
      clients = clients.filter(client => client !== res)
      console.log('Client disconnected from events API')
    })
  } catch (error) {
    console.error('Error in events API:', error)
    res.status(500).send('Internal Server Error')
  }
})

const sendEvent = data => {
  console.log('Sending event:', data)

  clients.forEach(client => {
    console.log(data)
    client.write(`data: ${JSON.stringify(data)}\n\n`)
  })
}

module.exports = { router, sendEvent }

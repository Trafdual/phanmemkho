"use strict";

var router = require('express').Router();

var clients = [];
router.get('/events', function (req, res) {
  console.log('Client connected to events API');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    clients.push(res);
    req.on('close', function () {
      clients = clients.filter(function (client) {
        return client !== res;
      });
      console.log('Client disconnected from events API');
    });
  } catch (error) {
    console.error('Error in events API:', error);
    res.status(500).send('Internal Server Error');
  }
});

var sendEvent = function sendEvent(data) {
  console.log('Sending event:', data);
  clients.forEach(function (client) {
    console.log(data);
    client.write("data: ".concat(JSON.stringify(data), "\n\n"));
  });
};

module.exports = {
  router: router,
  sendEvent: sendEvent
};
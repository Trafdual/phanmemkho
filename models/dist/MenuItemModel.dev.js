"use strict";

var mongoose = require('mongoose');

var MenuItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  path: {
    type: String,
    "default": null
  },
  icon: {
    type: String,
    required: true
  },
  dropdownKey: {
    type: String,
    "default": null
  },
  children: [{
    title: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    badge: {
      type: Boolean,
      "default": false
    }
  }],
  onClick: {
    type: String,
    "default": null
  }
});
var MenuItem = mongoose.model('menuItem', MenuItemSchema);
module.exports = MenuItem;
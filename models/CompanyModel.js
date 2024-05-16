const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
name:{type:String},
user:[{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
depot:[{type: mongoose.Schema.Types.ObjectId, ref: 'depot'}]
});

const Company = mongoose.model('company', companySchema);
module.exports = Company;
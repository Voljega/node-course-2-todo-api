var mongoose = require('mongoose');
var mongodbURl = process.env.MONGODB_URL;

mongoose.Promise = global.Promise;
mongoose.connect(mongodbURl);

module.exports = {mongoose};

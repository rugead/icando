var mongoose = require('mongoose');

var regionSchema = new mongoose.Schema({
  
    name: { type: String, default: '' },
    user_id: { type: String, default: '' }
});

module.exports = mongoose.model('Region', regionSchema);
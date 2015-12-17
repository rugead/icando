var mongoose = require('mongoose');

var countrySchema = new mongoose.Schema({
  
    name: { type: String, default: '' },
    user_id: { type: String, default: '' }
  
});

module.exports = mongoose.model('Country', countrySchema);
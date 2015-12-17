var mongoose = require('mongoose');

var canyonSchema = new mongoose.Schema({
  
    name: { type: String, default: '' },
    user_id: { type: String, default: '' },
    region: {type: String, default: ''},
    country: {type: String, default: ''}
});

module.exports = mongoose.model('Canyon', canyonSchema);
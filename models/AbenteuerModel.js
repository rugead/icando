var mongoose = require('mongoose');

var abenteuerSchema = new mongoose.Schema({
  
    user_id: { type: String, default: '' },
    name: { type: String, default: '' },
    city: String,
    region: {type: String, default: ''},
    country: {type: String, default: ''},
    price: Number,
    dwd: Date,
    pax_max: {type: Number, default: 5 },
    pax_booked: {type: Number, default: 0 },
   
    description: String,
    latitude: Number,
    longitude: Number
});

    abenteuerSchema.methods.prettyPrice = function () {
        return (this && this.price) ? this.price.toFixed(2) + ' EUR' : '$ ';
    };
    abenteuerSchema.methods.prettyEditPrice = function () {
        return (this && this.price) ? this.price.toFixed(2) : '199';
    };
    abenteuerSchema.methods.prettyDwd = function() {
        return (this && this.dwd) ? this.dwd.getDate() + "/"  + (this.dwd.getMonth() + 1) + "/"  +  + this.dwd.getFullYear() : ' fuckoff';
    };

    abenteuerSchema.methods.wochenTag = function () {
        var days = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
        return (this && this.dwd) ? days[this.dwd.getDay()] : 'lllllllll';
    };

module.exports = mongoose.model('Abenteuer', abenteuerSchema);
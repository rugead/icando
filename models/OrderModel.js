'use strict';

var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({

        order_id: String, 
        payment_id: String,
        state: String,
        total_amount: String,
        created_time: String,
        transactions: Array,
        item_list: Array,
        paypal_email: { type: String, lowercase: true },
        paypal_first_name: String,
        paypal_last_name: String,
        paypal_payer_id: String,
        paypal_recipient_name: String,
        paypal_line1: String,
        paypal_city: String,
        paypal_state: String,
        paypal_postal_code: String,
        paypal_country_code: String,
        paypal_phone: String,
        paypal_transactions: Array
        

    });
    
     orderSchema.methods.prettyPrice = function () {
        return (this && this.price) ? this.price.toFixed(2) + ' EUR' : '$ ';
    };
    
    // orderSchema.methods.wochenTag = function () {
    //     var days = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
    //     return (this && this.dwd) ? days[this.dwd.getDay()] : 'lllllllll';
    // };

module.exports = mongoose.model('Order', orderSchema);
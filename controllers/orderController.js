'use strict';

var Order = require('../models/OrderModel');
var nodemailer = require('nodemailer');
var secrets = require('../config/secrets');
//var Abenteuer = require('../models/abenteuerModel');
var paypal = require('paypal-rest-sdk');
var uuid = require('node-uuid');
//var paypal = secrets.paypal;
var transporter = nodemailer.createTransport({
    service: secrets.mail.service,
    auth: {
        user: secrets.mail.user,
        pass: secrets.mail.pass
    }
});



  paypal.configure({
    mode: 'sandbox',
    client_id: secrets.paypal.client_id,
    client_secret: secrets.paypal.client_secret
  });


exports.order = function (req, res) {
    res.locals.session = req.session;
    var cart = req.session.cart;
    
    var order_items = {items: []};
    var item_list = {items: []};
    var total = 0;
    var tax = 0;
    
    //Ready the item list for paypal 
    for (var item in cart) {
      //item_list.items.push({name: cart[item].name});
      //item_list.items.push(cart[item].sku);
      item_list.items.push({
        name: cart[item].name, 
        price: cart[item].price,
        quantity: cart[item].qty,
        sku: cart[item].sku,
        //tax: cart[item].tax,
        currency: "EUR"
      });
    }

    for (var item in cart) {
      order_items.items.push({
        name: cart[item].name, 
        price: cart[item].price,
        quantity: cart[item].qty,
        sku: cart[item].sku,
        dwd: cart[item].dwd,
        currency: "EUR"
      });
      // item_list.items.push({quantity: cart[item].qty});
      // item_list.items.push({currency: "EUR"});
      total += (cart[item].qty * cart[item].price);
      //tax = (total / 119 * 19).toFixed(2);
      //paxavailable = (cart[item].pax_max - cart[item].pax_booked)
    }
    
    //var subtotal = total - tax;
    var info = JSON.stringify(order_items);
    console.log('~~~~~~~~~~~~~~~~~~  ' + order_items + '  ~~~~~~~~~~~~');
    console.log('############kkk  ' + info + '  kkk###################');
    console.log(tax);
    var abenteuer_id = req.query.abenteuer_id;
    var order_id = uuid.v4();
    var paypalPayment = {
          "intent": "sale",
          "payer": {
            "payment_method": "paypal"
          },
          "redirect_urls": {},
          "transactions": [{
            "item_list": item_list,
            "amount": {
              "currency": "EUR",
              "total": total
            },
            "description": "xxxxxxx have fun xxxxxxx"
          }]
        };
          
        
    // paypalPayment.transactions[0].amount.total = req.query.order_amount;
    // paypalPayment.transactions[0].item_listamount.total = req.query.order_amount;
    paypalPayment.redirect_urls.return_url = "https://hackathon-rugead.c9users.io/execute?order_id=" + order_id;
    paypalPayment.redirect_urls.cancel_url = "https://hackathon-rugead.c9users.io/cancel?status=cancel&order_id=" + order_id;
    // paypalPayment.transactions[0].description = req.session.desc;
    paypal.payment.create(paypalPayment, {}, function (err, resp) {
      if (err) {
        res.render('home', { message: err});
      }
      var py = JSON.stringify(resp);
      if (resp) {
        var now = (new Date()).toISOString().replace(/\.[\d]{3}Z$/, 'Z ');
        console.log('-------------' + py + '-------------');
       
        var newOrder = new Order({
          order_id: order_id, 
          payment_id: (resp.id),
          state: (resp.state), 
          total_amount: total,
          created_time: now,
          transactions: (resp.transactions),
          item_list: order_items.items

      });
  
        newOrder.save(function(err) {
        if(err) { console.log('save error', err); 
        } else {
          var link = resp.links;
          for (var i = 0; i < link.length; i++) {
            if (link[i].rel === 'approval_url') {
              res.redirect(link[i].href);
             }
            }
          }   
        });
        }
    });
};

exports.execute = function (req, res){
    res.locals.session = req.session;
    var payer = { payer_id : req.query.PayerID };
    var payer_id = req.query.PayerID;
    var payment_id = req.query.paymentId;
    console.log(payer_id + 'ööööööööööö');
    console.log(payment_id + 'ssssssssss');
    var bbb = JSON.stringify(req.query);
    console.log(bbb);

    paypal.payment.execute(payment_id, payer, {}, function (err, resp) {
        if (err) {
            console.log(err);
        }
        
        if (resp) {
          Order.update({order_id : req.query.order_id}, 
            {$set : {
              state : resp.state,
              created_time : resp.create_time ,
              paypal_email: resp.payer.payer_info.email,
              paypal_first_name: resp.payer.payer_info.first_name,
              paypal_last_name: resp.payer.payer_info.last_name,
              paypal_payer_id: resp.payer.payer_info.payer_id,
              paypal_recipient_name: resp.payer.payer_info.shipping_address.recipient_name,
              paypal_line1: resp.payer.payer_info.shipping_address.line1,
              paypal_city: resp.payer.payer_info.shipping_address.city,
              paypal_state: resp.payer.payer_info.shipping_address.state,
              paypal_postal_code: resp.payer.payer_info.shipping_address.postal_code,
              paypal_country_code: resp.payer.payer_info.shipping_address.country_code,
              paypal_phone: resp.payer.payer_info.phone,
              paypal_transactions: resp.transactions
              
            }},        
            function (err, updated) {
              if (err) { console.log(err); } 
              
              Order.findOne({order_id: req.query.order_id}, function (err, result) {
                if (err) { console.log('edit error: ', err); }
                
                // console.log('item_list ------- ', result.item_list);
                
                // var tx = '';
                // for (var i=0; i < result.item_list.length; i++) {
                //   tx = tx + i + 'gebucht am\n'; 
                // }
                
                var buchungen = "";
                for (var i = 0; i < result.item_list.length; i++) {
                  buchungen = buchungen +  result.item_list[i].quantity + ' x ' + result.item_list[i].name + ' für ' + result.item_list[i].price + ' EUR pro Person am ' + result.item_list[i].dwd + '\n\n' ;
                }
          
                console.log('tx ------- ', buchungen);
                
                var mailOptions = {
                    from: 'Rudolf Vogel <rudolf.vogel@icando.de>', // sender address
                    to: result.paypal_email, // list of receivers
                    subject:  'icando.de - Buchungstatus Canyoningtour:' + ' ' + result.state , // Subject line
                   
                    text: 'Hallo ' + result.paypal_recipient_name + 
                    '\n\n vielen Dank für die Buchung.\n\n Die Buchungsnummer lautet:'  + result.order_id +
                    '\n\n Die Payment ID lautet' + result.payment_id +
                    '\n\n Folgende Toure(n) wurden gebucht:\n' + buchungen +
                    '\n\n Die Geamtsumme der Buchung beläuft sich auf: ' + result.total_amount + " EUR" +
                    '\n\n Den genauen Treffpunkt und weiter Einzelheiten erhalten Sie in einer separaten Email.' +
                    '\n\n\n\n Vielen Dank. Ich freue mich auf die Tour' +
                    '\n\n\n\n Rudol Vogel' +
                    '\n An der Fleschermühle 14' +
                    '\n 87509 Immenstadt' +
                    '\n\n Fon 01795065804'  +
                    '\n Email rudolf.vogel@icando.de'
                    
                    
                  
                };
                // send mail with defined transport object
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                
                });
                
                res.render('order_detail', {'order' : result});
              });
            }
          );
        }
    });
};

exports.cancel = function (req, res){
    res.send('cancled');
};
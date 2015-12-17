'use strict';

var Abenteuer = require('../models/AbenteuerModel');
//var getBundle = require('../../lib/getBundle');

exports.cart = function (req, res) {

		//Retrieve the shopping cart from memory
		var cart = req.session.cart;	
			console.log('ttt', cart);
		var	displayCart = {items: [], total: 0};
		var	total = 0;
		var cartLength;
		
		if (!cart) {
				req.flash('success', { msg: 'Warenkorb ist leer' });
				res.render('result', { continueMessage: 'Weiter einkaufen?'});
			return;
		}

		//Ready the products for display
		for (var item in cart) {
			displayCart.items.push(cart[item]);
			total += (cart[item].qty * cart[item].price);
		}

		req.session.total = displayCart.total = total.toFixed(2);
		cartLength = Object.keys(cart).length;
		var model = { cart: displayCart	};
		console.log('ccc', cart);
		console.log('mmm', model);
		res.render('cart', model);
};

exports.remove_item = function (req, res) {
		req.session.cart = null;
		res.redirect('/abenteuer');
};

	// Add an item to the shopping cart
exports.add_item = function (req, res) {

		//Load (or initialize) the cart
		req.session.cart = req.session.cart || {};
		var cart = req.session.cart;
		console.log(cart);
		//Read the incoming product data
		var id = req.body.item_id;
		
		//Locate the product to be added
		Abenteuer.findById(id, function (err, result) {
			console.log(result);
			if (err) {
				console.log('Error adding product to cart: ', err);
				res.redirect('/cart');
				return;
			}
			//Add or increase the product quantity in the shopping cart.
			if (cart[id] ) {
				cart[id].qty++;
			}
			else {
				cart[id] = {
					xid: id,
					name: result.name,
					price: result.price,
					prettyPrice: result.prettyPrice(),
					qty: 1,
					city: result.city,
					region: result.region,
					country: result.country,
					dwd: result.prettyDwd(),
					wochentag: result.wochenTag(),
					pax_max: result.pax_max,
					pax_booked: result.pax_booked,
					pax_available: result.pax_max - result.pax_booked
				};		
			}
			res.redirect('/cart');
		});
};


exports.plus = function (req, res) {

		//Load (or initialize) the cart
		req.session.cart = req.session.cart || {};
		var cart = req.session.cart;

		//Read the incoming product data
		var id = req.param('item_id');
		
		//Locate the product to be added
		Abenteuer.findById(id, function (err, prod) {
			if (err) {
				console.log('Error adding product to cart: ', err);
				res.redirect('/cart');
				return;
			}

			// increase the product quantity in the shopping cart.
			if (cart[id]) {
				cart[id].qty++;
			}

			res.redirect('/cart');
		});
};

exports.remove = function (req, res) {

		//Load (or initialize) the cart
		req.session.cart = req.session.cart || {};
		var cart = req.session.cart;

		//Read the incoming product data
		var id = req.param('item_id');
		
		//Locate the product to be added
		Abenteuer.findById(id, function (err, prod) {
			if (err) {
				console.log('Error adding product to cart: ', err);
				res.redirect('/cart');
				return;
			}

			// increase the product quantity in the shopping cart.
			if (cart[id]) {
				delete cart[id];
			}

			res.redirect('/cart');
		});
};

exports.minus = function (req, res) {

		//Load (or initialize) the cart
		req.session.cart = req.session.cart || {};
		var cart = req.session.cart;

		//Read the incoming product data
		var id = req.param('item_id');

		//Locate the product to be added
		Abenteuer.findById(id, function (err, prod) {
			if (err) {
				console.log('Error adding product to cart: ', err);
				res.redirect('/cart');
				return;
			}

			// decrease the product quantity in the shopping cart.
			if (cart[id]) {
				cart[id].qty--;
			}
			
			if (cart[id].qty == 0) {
				delete cart[id];
			}
			
			res.redirect('/cart');
		});
};
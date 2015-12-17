'use strict';

var Canyon = require('../models/CanyonModel');
var Abenteuer = require('../models/AbenteuerModel');

exports.new = function(req, res) {
		// var body = req.body;
		var name = req.body.name && req.body.name.trim();
	    var region = req.body.region && req.body.region.trim();
	    var country = req.body.country && req.body.country.trim();
	    
	    
		res.render('abenteuer/abenteuer_new', {
    		title: 'Ein neues Abenteuer',
    		name: name,
    		region: region,
    		country: country
		});
 
  
};

exports.create = function(req, res) {
    
    var user_id = req.session.passport.user;
    var name = req.body.name && req.body.name.trim();
    var city  = req.body.city && req.body.city.trim();
    var region = req.body.region && req.body.region.trim();
    var country = req.body.country && req.body.country.trim();
    var dwd = req.body.dwd && req.body.dwd.trim();
    var price = req.body.price && req.body.price.trim();
    var pax_max = req.body.pax_max && req.body.pax_max.trim();
    var pax_booked = req.body.pax_booked && req.body.pax_booked.trim();
    
    

		//Some very lightweight input checking
		if (name === '' ) {
			res.redirect('/abenteuer#BadInput');
			return;
		}

		var newAbenteuer = new Abenteuer({
			user_id: user_id,
			name: name, 
			city: city,
			region: region,
			country: country,
			dwd: dwd,
			price: price,
			pax_max: pax_max,
			pax_booked: pax_booked
		});

		newAbenteuer.save(function(err) {
			if(err) { console.log('save error', err); }
			res.redirect('/abenteuer');
		});
    
};

exports.show = function(req, res) {
	Abenteuer.findById(req.params.id, function(err, result){
    	if (err) { console.log('show error' + err); }
		res.render('abenteuer/abenteuer_show', {'abenteuer' : result});
  });
	
};

exports.edit = function(req, res) {
	Abenteuer.findById(req.params.id, function(err, result){
    	if (err) { console.log('edit error:' + err); }
    	
    	result.prettyEditPrice = result.prettyEditPrice();
		result.prettyDwd = result.prettyDwd();
		result.wochenTag = result.wochenTag();
		console.log(result);
				
    	
		res.render('abenteuer/abenteuer_edit', {'abenteuer' : result});
  });
	
};


exports.update = function(req, res) {
	Abenteuer.update({_id: req.body.id}, 
		{ $set: { 
			name: req.body.name && req.body.name.trim(),
			city: req.body.city && req.body.city.trim(),
			region: req.body.region && req.body.region.trim(),
			country: req.body.country && req.body.country.trim(),
			dwd: req.body.dwd && req.body.dwd.trim(),
			price: req.body.price && req.body.price.trim(),
			pax_max: req.body.pax_max && req.body.pax_max.trim(),
			pax_booked: req.body.pax_booked && req.body.pax_booked.trim()
			
   //     	description: req.body.description && req.body.description.trim(),
   //     	latitude: req.body.latitude && req.body.latitude.trim(),
   //     	longitude: req.body.longitude && req.body.longitude.trim()

		}}, function (err) {
			if (err) {
				console.log('update error: ', err);
			}
			res.redirect('/abenteuer');
		});
};

exports.index = function(req, res) {
		
		Abenteuer.find(function (err, result) {
			if (err) { console.log(err); }
			
			result.forEach(function(yyy) {
				yyy.prettyPrice = yyy.prettyPrice();
				yyy.prettyDwd = yyy.prettyDwd();
				yyy.wochenTag = yyy.wochenTag();
				
			});

			res.render('abenteuer/abenteuer', {'abenteuers': result});
		});
};

exports.delete = function(req, res) {

	Abenteuer.remove({_id: req.params.id}, function (err) {
		if (err) { console.log('Remove error: ', err); 	}
			res.redirect('/abenteuer');
		});
};
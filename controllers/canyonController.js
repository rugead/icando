'use strict';

var Canyon = require('../models/CanyonModel');
var Region = require('../models/RegionModel');
var Country = require('../models/CountryModel');


exports.new = function(req, res) {

	Country.find(function (err, countries) {
		if (err) { console.log(err); }

		Region.find(function (err, result) {
			if (err) { console.log(err); }

			res.render('canyon/canyon_new', {
	    		title: 'neue Schlucht',
	    		regions: result, countries: countries
			});
		});
    });
};

exports.create = function(req, res) {
    var name = req.body.name && req.body.name.trim();
    var region = req.body.region && req.body.region.trim();
    var country = req.body.country && req.body.country.trim();
	// console.log('hhh', req.session.passport.user);
    var user_id = req.session.passport.user;

		//Some very lightweight input checking
		if (name === '' ) {
			res.redirect('/canyons#BadInput');
			return;
		}

		var newCanyon = new Canyon({
			name: name, 
			user_id: user_id,
			region: region,
			country: country
		});

		newCanyon.save(function(err) {
			if(err) { console.log('save error', err); }
			res.redirect('/canyons');
		});
    
};

exports.show = function(req, res) {
	Canyon.findById(req.params.id, function(err, result){
    	if (err) { console.log('show error' + err); }
		res.render('canyon/canyon_show', {'canyon' : result});
  });
	
};

exports.edit = function(req, res) {
	Canyon.findById(req.params.id, function(err, result){
    	if (err) { console.log('edit error:' + err); }
		res.render('canyon/canyon_edit', {'canyon' : result});
  });
	
};


exports.update = function(req, res) {
	Canyon.update({_id: req.body.id}, 
		{ $set: { 
			name: req.body.name && req.body.name.trim(),
			// city: req.body.city && req.body.city.trim(),
			region: req.body.region && req.body.region.trim(),
   //     	description: req.body.description && req.body.description.trim(),
	     	country: req.body.country && req.body.country.trim()
   //     	latitude: req.body.latitude && req.body.latitude.trim(),
   //     	longitude: req.body.longitude && req.body.longitude.trim()

		}}, function (err) {
			if (err) {
				console.log('update error: ', err);
			}
			res.redirect('/canyons');
		});
};

exports.index = function(req, res) {
		
		Canyon.find(function (err, result) {
			if (err) { console.log(err); }
			res.render('canyon/canyons', {'canyons': result});
		});
};

exports.delete = function(req, res) {

	Canyon.remove({_id: req.params.id}, function (err) {
		if (err) { console.log('Remove error: ', err); 	}
			res.redirect('/canyons');
		});
};
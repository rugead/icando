'use strict';

var Region = require('../models/RegionModel');

exports.new = function(req, res) {
    res.render('region/region_new', {
    title: 'neue Schlucht'
    });
    
};

exports.create = function(req, res) {
    var name = req.body.name && req.body.name.trim();
	// console.log('hhh', req.session.passport.user);
    var user_id = req.session.passport.user;

		//Some very lightweight input checking
		if (name === '' ) {
			res.redirect('/regions#BadInput');
			return;
		}

		var newRegion = new Region({
			name: name,
			user_id: user_id
			
		});

		newRegion.save(function(err) {
			if(err) { console.log('save error', err); }
			res.redirect('/regions');
		});
    
};

exports.show = function(req, res) {
	Region.findById(req.params.id, function(err, result){
    	if (err) { console.log('show error' + err); }
		res.render('region/region_show', {'region' : result});
  });
	
};

exports.edit = function(req, res) {
	Region.findById(req.params.id, function(err, result){
    	if (err) { console.log('edit error:' + err); }
		res.render('region/region_edit', {'region' : result});
  });
	
};


exports.update = function(req, res) {
	Region.update({_id: req.body.id}, 
		{ $set: { 
			name: req.body.name && req.body.name.trim()
			// price: req.body.price && req.body.price.trim(),
			// dwd: req.body.dwd && req.body.dwd.trim(),
			// pax_max: req.body.pax_max && req.body.pax_max.trim(),
			// pax_booked: req.body.pax_booked && req.body.pax_booked.trim(),
			// city: req.body.city && req.body.city.trim(),
			// region: req.body.region && req.body.region.trim(),
   //     	description: req.body.description && req.body.description.trim(),
   //     	country: req.body.country && req.body.country.trim(),
   //     	latitude: req.body.latitude && req.body.latitude.trim(),
   //     	longitude: req.body.longitude && req.body.longitude.trim()

		}}, function (err) {
			if (err) {
				console.log('update error: ', err);
			}
			res.redirect('/regions');
		});
};

exports.index = function(req, res) {
		
		Region.find(function (err, result) {
			if (err) { console.log(err); }
			res.render('region/regions', {'regions': result});
		});
};

exports.delete = function(req, res) {

	Region.remove({_id: req.params.id}, function (err) {
		if (err) { console.log('Remove error: ', err); 	}
			res.redirect('/regions');
		});
};
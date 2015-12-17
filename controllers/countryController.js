'use strict';

var Country = require('../models/CountryModel');

exports.new = function(req, res) {
    res.render('country/country_new', {
    title: 'neues land'
    });
    
};

exports.create = function(req, res) {
    var name = req.body.name && req.body.name.trim();
    var user_id = req.session.passport.user;
    

		//Some very lightweight input checking
		if (name === '' ) {
			res.redirect('/countries#BadInput');
			return;
		}

		var newCountry = new Country({
			name: name,
			user_id: user_id
			
		});

		newCountry.save(function(err) {
			if(err) { console.log('save error', err); }
			res.redirect('/countries');
		});
    
};

exports.show = function(req, res) {
	Country.findById(req.params.id, function(err, result){
    	if (err) { console.log('show error' + err); }
		res.render('country/country_show', {'country' : result});
  });
	
};

exports.edit = function(req, res) {
	Country.findById(req.params.id, function(err, result){
    	if (err) { console.log('edit error:' + err); }
		res.render('country/country_edit', {'country' : result});
  });
	
};


exports.update = function(req, res) {
	Country.update({_id: req.body.id}, 
		{ $set: { 
			name: req.body.name && req.body.name.trim()
			
		}}, function (err) {
			if (err) {
				console.log('update error: ', err);
			}
			res.redirect('/countries');
		});
};

exports.index = function(req, res) {
		
		Country.find(function (err, result) {
			if (err) { console.log(err); }
			res.render('country/countries', {countries: result});
		});
};

exports.delete = function(req, res) {

	Country.remove({_id: req.params.id}, function (err) {
		if (err) { console.log('Remove error: ', err); 	}
			res.redirect('/countries');
		});
};


// 	router.get('/new', function (req, res ){
// 		// var countries = Country.find(function (err, cans) {
// 		// 		if (err) {console.log(err);}
// 		// 		//console.log(cans);			
// 		// 	});
// 		res.render('countries/country_new');
// 	});


// 	router.get('/', function (req, res) {

// 		Country.find(function (err, prods) {
// 			if (err) { console.log(err); }
// 			console.log(prods);
// 			res.render('countries/countries', {countries: prods});
// 		});

// 	});

//     router.post('/', function (req, res) {
// 		var name = req.body.name && req.body.name.trim();

// 		//Some very lightweight input checking
// 		if (name === '' ) {
// 			res.redirect('/countries#BadInput');
// 			return;
// 		}

// 		var newCountry = new Country({name: name});

// 		newCountry.save(function(err) {
// 			if(err) {
// 				console.log('save error', err);
// 			}
// 			res.redirect('/countries');
// 		});
// 	});

// 	router.delete('/', function (req, res) {
// 		Country.remove({_id: req.body.item_id}, function (err) {
// 			if (err) {
// 				console.log('Remove error: ', err);
// 			}
// 			res.redirect('/countries');
// 		});
// 	});

// 	router.get('/:id', function (req, res) {
// 		Country.findById({_id: req.params.id}, function (err, result) {
// 			if (err) {
// 				console.log('edit error: ', err);
// 			}
// 			console.log(result);
// 			res.render('countries/country_edit', {'country' : result});
// 		});
// 	});



// 	router.put('/', function (req, res) {
// 		Country.update({_id: req.body.item_id}, { $set: { name: req.body.name }}, function (err) {
// 			if (err) {
// 				console.log('update error: ', err);
// 			}
// 			res.redirect('/countries');
// 		});
// 	});
// };
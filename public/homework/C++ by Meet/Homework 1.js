// Shows counting
// 
// 
const DataStore = require('nedb');
const db = new DataStore({filename: __dirname + '/tassieDB', autoload: true});
// Count all
db.count({}, function(err, count) {
	if (err) {
		console.log("something is wrong");
	} else {
		console.log(`counted ${count} mamals`)
	}
});

// count Devil
db.count({"comName": /Devil/}, function(err, count) {
	if (err) {
		console.log("something is wrong");
	} else {
		console.log(`We have ${count} type(s) of Devils`);
	}
});





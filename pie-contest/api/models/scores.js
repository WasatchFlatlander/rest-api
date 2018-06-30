const mongoose = require('mongoose');
const scoreSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true},
	score: { 
		type: Number, 
		min: 0, 
		max:10,
		required: true,
	  	validate : {
	    	validator : Number.isInteger,
	    	message   : '{VALUE} is not an integer value'
	  	}
	}
});

module.exports = mongoose.model('Scores',scoreSchema);
# rest-api

This folder is an example of a REST API utilized for a pie eating contest. While the API required 3 functions Get , Record, Delete), I support those as well as other common REST requests. Here is a summary of the requests supported which can be found in pie-contest/api/routes/scores.js. More detailed commentary is in the scores route file.

(Get Scores) - GET request localhost:3000/scores/highscores (Top 25 DESC Scores Grouped By Contestant)
(Record Score) - POST localhost:3000/scores
(Delete Score) - DELETE localhost:3000/scores/5b37d36dd4859535b82ec492
Get Individual Score - GET localhost:3000/scores/5b37d36dd4859535b82ec492
Update Individual Score - PATCH localhost:3000/scores/5b37d36dd4859535b82ec492
Get All Scores - GET request localhost:3000/scores (All Scores DESC order)

The data is held in an Atlas Mongo DB. The App.js file has the user/pw to access the db. The Schema of the database can be found in pie-contest/api/models/scores.js:

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

Assuming you have node js installed on your machine and have downloaded the entire folder. All that is required to run
is 'npm start' command from your downloaded directory. For your convenience, I have added 25 contestants each with two scores to the DB. In developing this simple server, I utilized Postman to test out the API and would suggest you 
do the same.

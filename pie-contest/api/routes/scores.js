const  express = require('express');
const router = express.Router();
const Scores = require('../models/scores');
const mongoose = require('mongoose');

// Example GET localhost:3000/scores/highscores
// Returns JSON Object of NumScores With an array of top 25 (DESC)
// Scores grouped by name.
// {
//     "NumScores": 3,
//     "Results": [
//         {
//             "_id": "Josh",
//             "score": 10
//         },
//         {
//             "_id": "Josh",
//             "score": 9
//         },
//         {
//             "_id": "Josh",
//             "score": 8
//         }
//     ]
// }
router.get('/highscores', (req, res, next) => {

	Scores.aggregate([{
	   		$group:
	     	{
	       		_id: "$name",
	       		score: { $max: "$score" }
	     	}
	     }])
		.exec()
		.then( docs => {
			const response = {
				NumScores: Math.min(docs.length,25),
				Results: docs.sort(function(a, b){return b.score - a.score}).slice(0,25)
			}
			res.status(200).json(response)
		})
		.catch( err => {
			res.status(500).json({
				error: err
			})
		});
});


// Example GET localhost:3000/scores/
// Returns a JSON Object of all score records
// {
//     "NumScores": 3,
//     "Results": [
//         {
//             "_id": "5b37d36dd4859535b82ec492",
//             "name": "Josh",
//             "score": 10
//         },
//         {
//             "_id": "5b37d302d4859535b82ec48f",
//             "name": "Josh",
//             "score": 6
//         },
//         {
//             "_id": "5b37d2f7d4859535b82ec48e",
//             "name": "Josh",
//             "score": 6
//         }
//     ]
// }
router.get('/', (req, res, next) => {
	Scores.find()
		.select('name score _id')
		.exec()
		.then( docs => {
			const response = {
				NumScores: docs.length,
				Results: docs.sort(function(a, b){return b.score - a.score})
			}
			res.status(200).json(response)
		})
		.catch( err => {
			res.status(500).json({
				error: err
			})
		});
});

// Example - GET localhost:3000/scores/5b37ce2bdcac8e2f8c1203eb
// Returns JSON object of Invididual Score Details:
// {
//     "_id": "5b37d36dd4859535b82ec492",
//     "name": "Josh",
//     "score": 10
// }
router.get('/:entryId', (req, res, next) =>{
	const id = req.params.entryId;
	Scores.findById(id)
		.select('name score _id')
		.exec()
		.then( doc => {
			console.log('GET Score By Id',doc);
			if(doc){
				res.status(200).json(doc);	
			}else{
				res.status(404).json({message: 'Invalid Request ID'});
			}
		})
		.catch( err => {
			console.log(err);
			res.status(500).json({error:err});
		});
});

// Example POST localhost:3000/scores/
// BODY:
// {
// 	"name":"Josh",
// 	"score":"10"
// }	
// Returns JSON Object of new record:
// {
//     "message": "POST Request to /scores",
//     "postScore": {
//         "_id": "5b37d67eb4469a3ef83a02cd",
//         "name": "Josh",
//         "score": 10,
//         "__v": 0
//     }
// }
router.post('/', (req, res, next) => {
    const score = new Scores({
	    _id: new mongoose.Types.ObjectId(),
	    name: req.body.name,
	    score: req.body.score
    });
	score
		.save()
		.then( result => {
			console.log(result);
			res.status(200).json({
				message: 'POST Request to /scores',
				postScore: result
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error:err
			});
		});	
});



// Example - PATCH localhost:3000/scores/5b37ce2bdcac8e2f8c1203eb
// BODY:
// [
// 	{"propName":"name", "value":"Josh"},	
//  {"propName":"score", "value":"10"}
// ]
router.patch('/:entryId', (req, res, next) =>{
	const id = req.params.entryId;
	const updateOps = {};
	for(const ops of req.body){
		updateOps[ops.propName] = ops.value;
	}
	Scores.update({_id:id},{$set: updateOps})
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({message : id + ' successfully updated.'})
		})
		.catch( err => {
			console.log(err);
			res.status(500).json({error:err});
		});
});

// Example - DELETE localhost:3000/scores/5b37d380d4859535b82ec494
// Returns JSON Object of Deleted Score Record
router.delete('/:entryId', (req, res, next) =>{
	const id = req.params.entryId;
	Scores.findByIdAndRemove(id)
		.select('name score _id')		
		.exec()
		.then( result => {
			res.status(200).json(result)
		})
		.catch( error => {
			console.log(error);
			res.status(500).json({error:err});
		});
});

module.exports = router;
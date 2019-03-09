const express = require('express');
const router = express.Router();
const mongoose=require('mongoose');

const Director = require('../models/Director');

//Director Remove -->api/directors/id [DELETE]

router.delete('/:director_id',(req,res)=>{
		const promise=Director.findByIdAndDelete(req.params.director_id)

		promise.then((data)=>{
			if(!data)
				next({ message :'The director was not found.',code:99}); 
	
			res.json({status:'OK'});	
		}).catch((err)=>{
			res.json(err);
		})
});

//Director Update -->api/directors/id [PUT]

router.put('/:director_id',(req,res)=>{
	const promise=Director.findByIdAndUpdate(
		req.params.director_id,
		req.body,		
		{
			new:true 
		}
	);

	promise.then((data)=>{
		if(!data)
			next({ message :'The director was not found.',code:99}); 

		res.json(data);	
	}).catch((err)=>{
		res.json(err);
	})
});



//Director Detail -->api/directors/id 

router.get('/:director_id', (req, res) => {
	const promise = Director.aggregate([
		{
			$match:{
				'_id':mongoose.Types.ObjectId(req.params.director_id)
			}
		},
		{
			$lookup: {                      
				from: 'movies',              
				localField: '_id',          
				foreignField: 'director_id', 
				as: 'movies'                 
			}
        }
	]);

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	});
});

//api/directors -->directors with films


router.get('/', (req, res) => {
	const promise = Director.aggregate([
		{
			$lookup: {                      
				from: 'movies',             
				localField: '_id',          
				foreignField: 'director_id', 
				as: 'movies'                 
			}
        }
	]);

	promise.then((data) => {
		res.json(data);
	}).catch((err) => {
		res.json(err);
	});
});


router.post('/',(req,res,next)=>{

    const director= new Director(req.body);
    const promise=director.save();

    promise.then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    })

});

module.exports = router;
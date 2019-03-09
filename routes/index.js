const express = require('express');
const router = express.Router();

//Models
const User=require('../models/User');

const bcrypt = require('bcryptjs');

//Jwt -->

const jwt = require('jsonwebtoken');  //npm install jsonwebtoken --save


router.post('/authenticate',(req,res)=>{

	const {username,password}=req.body;

	User.findOne({
		username :username 			
	},(err,user)=>{
		if(err)
			throw err;

		if(!user){				
			res.json({
				status:false,
				message:'Authentication failed, user not found.'
			});
		}else{					

			bcrypt.compare(password,user.password).then((result)=>{	    
				if(!result){		
					res.json({
						status:false,
						message:'Authentication failed, password does not match.'
					});
				}else{				
					const payload = {	
						username:username
					};
					const token =jwt.sign(payload,req.app.get('api_secret_key'),{	
						expiresIn:720 //12 hour
					});

					res.json({		
						status:true,
						token:token	
					})
				}
			});
		}	
	});

});

// /register [POST]

router.post('/register', (req, res, next) => {
	const { username, password } = req.body;
	bcrypt.hash(password,10).then(function(hash){  
		const user = new User({
			username,         	//ES6  destructing 
			password:hash  		
		});

		const promise = user.save();		
		promise.then((data) => {
			res.json(data)
		}).catch((err) => {
			res.json(err);
		})
	});
});


/* GET home page. */
router.get('/', (req, res, next)=> {
	res.render('index', { title: 'Express' });
  });

module.exports = router;

const express = require('express');
const router = express.Router();

//models

const Movie = require('../models/Movie')

//Date-between Films List--> /api/movies/year1/year2

//gte-->higher or equal operator // gt -->higher operator
//lte-->lower or equal operator // lt -->lower operator

router.get('/between/:start_year/:end_year',(req,res)=>{    //http://localhost:3000/api/movies/between/1965/1972

  const{start_year,end_year}=req.params;

  const promise = Movie.find({
    year:{"$gte":parseInt(start_year),"$lte":parseInt(end_year)}
  });

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });

});

//TOP10

router.get('/top10',(req,res)=>{     

  const promise = Movie.find({}).limit(10).sort({imdb_score:-1});

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });

});



//Delete-->

router.delete('/:movie_id',(req,res,next)=>{  

  const promise = Movie.findByIdAndRemove(req.params.movie_id,req.body); 

  promise.then((movie)=>{ 
    if(!movie)            
      next({message:'The movie was not found',code: 99}); 
    
    res.json({status:"OK"}); 
  }).catch((err)=>{
    res.json(err);
  });

});



//Update ---> Postman --> body -->

router.put('/:movie_id',(req,res,next)=>{  

  const promise = Movie.findByIdAndUpdate(req.params.movie_id,req.body,{new:true}); 

  promise.then((movie)=>{ 
    if(!movie)            
      next({message:'The movie was not found',code: 99}); 
    
    res.json(movie);
  }).catch((err)=>{
    res.json(err);
  });

});


router.get('/:movie_id',(req,res,next)=>{  

  const promise = Movie.findById(req.params.movie_id); 

  promise.then((movie)=>{ 
    if(!movie)            
      next({message:'The movie was not found',code: 99}); 
    
    res.json(movie);
  }).catch((err)=>{
    res.json(err);
  });

});

//ALL FILMS with directors -->/api/movies

router.get('/',(req,res)=>{         

  const promise = Movie.aggregate([
    {
      $lookup: {
        from:'directors',
        localField:'director_id',
        foreignField:'_id',
        as:'director'
      }
    },
    {
      $unwind:'$director'
    }
  ]);

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });

});

//Post-Movie
router.post('/', (req, res, next)=> {     


  const movie=new Movie(req.body);

  const promise = movie.save();

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });

  

});

module.exports = router;

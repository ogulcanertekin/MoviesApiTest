
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();           

const server = require('../../app.js');

chai.use(chaiHttp);                     


let token,movieId;                  

describe('/api/movies TESTS',()=>{      
    before((done)=>{                   
        chai.request(server)
            .post('/authenticate')
            .send({username:'ogulcanertekin',password:'123456'})
            .end((err,res)=>{
                token=res.body.token;           
                //console.log(token);
                done();
            });
    });

    //---- api/movies [GET] için test

    describe('/api/movies [GET] TEST',()=>{             
        it('it should Get all the movies',(done)=>{
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token',token)            
                .end((err,res)=>{
                    res.should.have.status(200);    
                    res.body.should.be.a('array');  
                    done();
                });
        })
    });

    //---- api/movies [POST] için test

    describe('/POST movie', () => {
		it('it should POST a movie', (done) => {
			const movie = {
				title: 'The Lord of the Rings:The Two Towers',
				director_id: '5c7f3533f401a512dcea4022',
				category: 'Adventure',
				country: 'USA',
				year: 2002,
				imdb_score: 8.7
			};

			chai.request(server)
				.post('/api/movies')
				.send(movie)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.should.have.property('director_id');
					res.body.should.have.property('category');
					res.body.should.have.property('country');
					res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    movieId = res.body._id;
					done();
				});
		});
    });
    
    //--- api/movies/:movie_id [GET] için test

    describe('/GET/:movie_id movie', () => {
		it('it should GET a movie by the given id', (done) => {
			chai.request(server)
				.get('/api/movies/' + movieId)      
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title');
					res.body.should.have.property('director_id');
					res.body.should.have.property('category');
					res.body.should.have.property('country');
					res.body.should.have.property('year');
					res.body.should.have.property('imdb_score');
					res.body.should.have.property('_id').eql(movieId);
					done();
				});
		});
    });
    
    //--- api/movies/:movie_id [PUT] için test

    describe('/PUT/:movie_id movie', () => {
		it('it should UPDATE a movie given by id', (done) => {
			const movie = {
				title: 'Ogulcans update movie test',
				director_id: '5a34e1afb8523a78631f8541',
				category: 'Drama',
				country: 'France',
				year: 2019,
				imdb_score: 9.9
			};

			chai.request(server)
				.put('/api/movies/' + movieId)
				.send(movie)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title').eql(movie.title);
					res.body.should.have.property('director_id').eql(movie.director_id);
					res.body.should.have.property('category').eql(movie.category);
					res.body.should.have.property('country').eql(movie.country);
					res.body.should.have.property('year').eql(movie.year);
					res.body.should.have.property('imdb_score').eql(movie.imdb_score);

					done();
				});
		});
	});

    ////--- api/movies/:movie_id [DELETE] için test
    
    describe('/DELETE/:movie_id movie', () => {
		it('it should DELETE a movie given by id', (done) => {
			chai.request(server)
				.delete('/api/movies/' + movieId)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('status').eql("OK"); 
					done();
				});
		});
	});
});
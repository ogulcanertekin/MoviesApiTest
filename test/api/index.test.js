
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();          

const server = require('../../app.js');

chai.use(chaiHttp);  


describe('Index Tests',()=>{
    it('/ GET Index Page',(done)=>{
        chai.request(server)                    
            .get('/')
            .end((err,res)=>{
                res.should.have.status(200);  
                done();
            })
    });
});
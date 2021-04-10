import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Test get cache', () => {
    describe('GET /', () => {
      it('should get a single', (done) => {
        chai.request(app)
          .get('/api/v1/cache/randonchaekey')
          .end((err, res) => {
            if (err) console.log(err)
            res.should.have.status(200);
            res.body.should.be.an('object');
            done();
          });
      }).timeout(5000);
      it('should create a cache', (done) => {
        chai.request(app)
          .post('/api/v1/cache/create')
          .send({key: 'newnewnenwn'})
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.be.an('object');
            done();
          });
      }).timeout(10000);;
    });
});

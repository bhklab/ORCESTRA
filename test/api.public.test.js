const app = require('../app');
const public = require('../routes/api/public');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

/**
 * Test /api/psets/available and /api/psets/canonical API routes
 */
describe('API', () => {
    describe('public.js', () => {
        describe('#getDatasets()', async () => {
            it('Gets available PSets', (done) => {
                chai.request(app)
                    .get('/api/psets/available')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.not.be.eql(0);
                        return done();
                    });
            });
            it('Gets canonical PSets', (done) => {
                chai.request(app)
                    .get('/api/psets/canonical')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.not.be.eql(0);
                        let canonicals = res.body.map(item => item.canonical);
                        expect(canonicals.includes(false)).to.be.false;
                        return done();
                    });
            });
        });
    });
});
const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')
const should = chai.should() // eslint-disable-line no-unused-vars
const dotenv = require('dotenv')

dotenv.config()

chai.use(chaiHttp)

// Valid auth credentials
const VALID_AUTH_TYPE = process.env.AUTH_TYPE.toLocaleLowerCase()
const VALID_AUTH_TOKEN = process.env.AUTH_TOKEN

// Invalid auth credentials
const INVALID_AUTH_TYPE = 'Basic'.toLocaleLowerCase()
const INVALID_AUTH_TOKEN = 'invalid auth token'

const INVALID_AUTH_MESSAGE = 'Invalid or no credentials. Access Forbidden.'

describe('GET /time for valid response', () => {
  /*
   * Test the GET /time route with valid auth credentials
   */
  it('it should GET 200 OK and a valid response containing epoch time', (done) => {
    // Get the current epoch time
    const invokeEpochTime = Math.round(Date.now() / 1000)

    chai
      .request(app)
      .get('/time')
      .auth(VALID_AUTH_TOKEN, { type: VALID_AUTH_TYPE })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.have.property('epoch')
        res.body.epoch.should.be.a('number')

        // Checking if the epoch time is of the currect format
        const epochTime = res.body.epoch
        const epochTimeLength = epochTime.toString().length
        epochTimeLength.should.be.eql(10)

        // Checking if the epoch time is within 1 second of the current epoch time
        const difference = Math.abs(invokeEpochTime - epochTime)
        difference.should.be.below(1)

        done()
      })
  })
})

describe('GET /time for invalid response', () => {
  /*
   * Test the GET /time route without auth credentials
   */
  it('it should GET 403 Forbidden Error Message', (done) => {
    chai
      .request(app)
      .get('/time')
      .end((err, res) => {
        res.should.have.status(403)
        res.body.should.have.property('error')
        res.body.error.should.be.eql(INVALID_AUTH_MESSAGE)
        done()
      })
  })

  /*
   * Test the GET /time route with invalid auth key
   */
  it('it should GET 403 Forbidden Error Message', (done) => {
    chai
      .request(app)
      .get('/time')
      .auth(INVALID_AUTH_TOKEN, { type: VALID_AUTH_TYPE })
      .end((err, res) => {
        res.should.have.status(403)
        res.body.should.have.property('error')
        res.body.error.should.be.eql(INVALID_AUTH_MESSAGE)
        done()
      })
  })

  /*
   * Test the GET /time route with invalid auth type
   */
  it('it should GET 403 Forbidden Error Message', (done) => {
    chai
      .request(app)
      .get('/time')
      .auth(VALID_AUTH_TOKEN, { type: INVALID_AUTH_TYPE })
      .end((err, res) => {
        res.should.have.status(403)
        res.body.should.have.property('error')
        res.body.error.should.be.eql(INVALID_AUTH_MESSAGE)
        done()
      })
  })
})

describe('GET /metrics for valid response', () => {
  /*
   * Test the GET /metrics route with valid auth credentials
   */
  it('it should GET 200 OK and valid response containing prometheus metrics', (done) => {
    chai
      .request(app)
      .get('/metrics')
      .auth(VALID_AUTH_TOKEN, { type: VALID_AUTH_TYPE })
      .end((err, res) => {
        res.should.have.status(200)
        res.header['content-type'].should.contain('text/plain')
        res.text.should.be.a('string')
        done()
      })
  })
})

describe('GET /metrics for invalid response', () => {
  /*
   * Test the GET /metrics route without auth credentials
   */
  it('it should GET 403 Forbidden Error Message', (done) => {
    chai
      .request(app)
      .get('/metrics')
      .end((err, res) => {
        res.should.have.status(403)
        res.body.should.have.property('error')
        res.body.error.should.be.eql(INVALID_AUTH_MESSAGE)
        done()
      })
  })

  /*
   * Test the GET /metrics route with invalid auth key
   */
  it('it should GET 403 Forbidden Error Message', (done) => {
    chai
      .request(app)
      .get('/metrics')
      .auth(INVALID_AUTH_TOKEN, { type: VALID_AUTH_TYPE })
      .end((err, res) => {
        res.should.have.status(403)
        res.body.should.have.property('error')
        res.body.error.should.be.eql(INVALID_AUTH_MESSAGE)
        done()
      })
  })

  /*
   * Test the GET /metrics route with invalid auth type
   */
  it('it should GET 403 Forbidden Error Message', (done) => {
    chai
      .request(app)
      .get('/metrics')
      .auth(VALID_AUTH_TOKEN, { type: INVALID_AUTH_TYPE })
      .end((err, res) => {
        res.should.have.status(403)
        res.body.should.have.property('error')
        res.body.error.should.be.eql(INVALID_AUTH_MESSAGE)
        done()
      })
  })
})

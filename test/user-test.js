

//test suite for user controller


process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../server');
const should = chai.should();
const models = require('../models');
const bcrypt = require('bcryptjs');
const chaiDOM = require('chai-dom');
const Nightmare = require('nightmare');

chai.use(chaiHTTP);
chai.use(chaiDOM);

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

let currentDate = new Date();

describe('Users', function() {
  beforeEach('clear and add', function(done) {
    let newUser = {
      email: 'susan@example.com',
      password: 'spaz5713'
    }
		models.User.sync({ force: true })
		.then(function() {
			return models.User
			.create(newUser)
			.then(function(data) {
        console.log(data);
			});
		});

    let newSession = {
      sid: 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD',
      data: '{"cookie":{"originalMaxAge":259200000,"expires":"' + currentDate.addDays(3) + '","httpOnly":true,"path":"/"},"email":"susan@example.com","password":"' + bcrypt.hashSync("spaz5713", bcrypt.genSaltSync(10)) + '"}'
    }
    models.ConnectSession.sync({force: true})
    .then(function() {
      return models.ConnectSession
      .create(newSession)
      .then(function(data) {
        console.log(data);
        done();
      });
    });
  });

  it('should render the landing page', function(done) {
    chai.request(server)
    .get('/')
    .end(function(err, res) {
      console.log(res);
      res.should.have.status(200);
      res.should.be.html;
      Nightmare()
        .goto('localhost:5000')
        .evaluate(function() {
          document.querySelector('#intro').should.have.text('Welcome to the do-It task management application');
        });
      done();
    });
  });

  it('should get signup page /user/signup GET', function(done) {
    chai.request(server)
    .get('/user/signup')
    .end(function(err, res) {
      console.log(res);
      res.should.have.status(200);
      res.should.be.html;
      done();
    });
  });

	it('should create new user /user/signup POST', function(done) {
	    let newUser = {
	      'email': 'alice@example.com',
	      'password': 'spaz5713'
	    }
		  chai.request(server)
	    .post('/user/signup')
	    .send(newUser)
	    .end(function(err, res) {
				console.log(res);
	      res.should.have.status(200);
	      res.should.be.html;
				//res.text.should.be.a('string');
				//res.text.should.equal('Signup successful!  Start saving to-dos now.');
	      done();
	    });
	  });

  it('should get login page /user/login GET', function(done) {
    chai.request(server)
    .get('/user/login')
    .end(function(err, res) {
      console.log(res);
      res.should.have.status(200);
      res.should.be.html;
      done();
    });
  });

	it('should login users /user/login POST', function(done) {
		let userLoggingIn = {
			'email': 'susan@example.com',
			'password': 'spaz5713'
		}
		chai.request(server)
		.post('/user/login')
		.send(userLoggingIn)
		.end(function(err, res) {
			console.log(res.body);
			res.should.have.status(200);
			res.should.be.html;
      // res.body.should.be.a('object');
      // res.body.should.have.property('email');
      // res.body.should.have.property('password');
      // res.body.should.have.property('id');
      // res.body.email.should.equal('susan@example.com');
      // res.body.password.should.equal('spaz5713');
			// res.body.id.should.equal(1);
      done();
		});
	});

  it('should get settings page /user/:cookie GET', function(done) {
    chai.request(server)
    .get('/user/WDfAv8WICmE_gyrEjckhG_a9ijWNekZD')
    .end(function(err, res) {
      console.log(res);
      res.should.have.status(200);
      res.should.be.html;
      done();
    });
  });

  it('should logout users /user/logout DELETE', function(done) {
    chai.request(server)
    .delete('/user/logout')
    .end(function(err, res) {
      console.log(res);
      res.should.have.status(200);
      res.should.be.html;
      done();
    })
  });

	it('should delete users /user/delete PUT', function(done) {
		let userDeletingSelf = {
			'email': 'susan@example.com',
			'password': 'spaz5713'
		}
		chai.request(server)
		.put('/user/delete')
		.send(userDeletingSelf)
		.end(function(err, res) {
			console.log(res.text);
			res.should.have.status(200);
			res.should.be.html;
			//res.text.should.be.a('string');
			//res.text.should.equal(`Your account and all your to-dos were successfully deleted.`);
			done();
		});
	});
  it(`should update users' email /user PUT`, function(done) {
    let userUpdatingEmail = {
      'email': 'susan@example.com',
      'password': 'spaz5713',
      'newEmail': 'stephen@example.com'
    }
    chai.request(server)
    .put('/user')
    .send(userUpdatingEmail)
    .end(function(err, res) {
      console.log(res.text);
      res.should.have.status(200);
      res.should.be.html;
      //res.text.should.be.a('string');
      //res.text.should.equal(`You're golden!  Please use your new credentials to log in in the future.`);
      done();
    });
  });

  it(`should update users' password /user PUT`, function(done) {
    let userUpdatingPassword = {
      'email': 'susan@example.com',
      'password': 'spaz5713',
      'newPassword': 'donkeykong'
    }
    chai.request(server)
    .put('/user')
    .send(userUpdatingPassword)
    .end(function(err, res) {
      console.log(res.text);
      res.should.have.status(200);
      res.should.be.html;
      //res.text.should.be.a('string');
      //res.text.should.equal(`You're golden!  Please use your new credentials to log in in the future.`);
      done();
    });
  });
});

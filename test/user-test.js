

//test suite for user controller


process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const models = require('../models');

chai.use(chaiHttp);

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
				done()
			});
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
				res.text.should.be.a('string');
				res.text.should.equal('Signup successful!  Start saving to-dos now.');
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
				res.should.be.json;
	      res.body.should.be.a('object');
	      res.body.should.have.property('email');
	      res.body.should.have.property('password');
	      res.body.should.have.property('id');
	      res.body.email.should.equal('susan@example.com');
	      res.body.password.should.equal('spaz5713');
				res.body.id.should.equal(1);
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
				res.text.should.be.a('string');
				res.text.should.equal(`You're golden!  Please use your new credentials to log in in the future.`);
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
				res.text.should.be.a('string');
				res.text.should.equal(`You're golden!  Please use your new credentials to log in in the future.`);
				done();
			});
		});

		it('should delete users /user DELETE', function(done) {
			let userDeletingSelf = {
				'email': 'susan@example.com',
				'password': 'spaz5713'
			}
			chai.request(server)
			.delete('/user')
			.send(userDeletingSelf)
			.end(function(err, res) {
				console.log(res.text);
				res.should.have.status(200);
				res.should.be.html;
				res.text.should.be.a('string');
				res.text.should.equal(`Your account and all your to-dos were successfully deleted.`);
				done();
			});
		});

	});



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

require('mocha-generators').install();

chai.use(chaiHTTP);
chai.use(chaiDOM);

//++++++ functions for use in tests ++++++

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

let currentDate = new Date();

//++++++ tests ++++++

describe('UserFrontEndTests', function() {
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

  it('should render signup on signup click', function(done) {
    Nightmare()
    .goto('localhost:5000')
    .click('#sign-up')
    .wait('#signup-form', 500)
    .type('[name=email]', 'elsa@example.com')
    .type('[name=emailConf]', 'elsa@example.com')
    .type('[name=password]', 'spaz5713')
    .type('[name=passwordConf]', 'spaz5713')
    .click('button[type=submit]')
    .wait(500)
    .evaluate(function() {
      return document.querySelector('.data').text;
    })
    .end()
    .then(function(content) {
      content.should.equal('Signup successful!  Start saving to-dos now.');
      done();
    })
    .catch(function(error) {
      console.log(error);
      done();
    })
  });

  it('should signup on form submit', function(done) {
    done();
  });

  it('should render login on login click', function(done) {
    done();
  });

  it('should login on form submit', function(done) {
    done();
  });

  it('should render settings on settings click', function(done) {
    done();
  });

  it('should submit settings on form submit', function(done) {
    done();
  });

  it('should logout on logout click', function(done) {
    done();
  });

});

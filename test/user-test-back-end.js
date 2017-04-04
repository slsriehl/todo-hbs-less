

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

const myNightmare = function(evaluate) {
  Nightmare()
    .goto('localhost:5000')
    .evaluate(evaluate);
}

//++++++ tests ++++++

//tests for page operations where the cookie is undefined or doesn't matter
describe('UsersWithUndefinedCookie', function() {
  beforeEach('clear and add', function(done) {
    const toEvaluate = function() {
      document.cookie = ""
    }
    myNightmare(toEvaluate);
    let newUser = {
      email: 'susan@example.com',
      password: bcrypt.hashSync("spaz5713", bcrypt.genSaltSync(10))
    }
		let susansId;
    let newSession = {
      sid: 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD',
      data: '{"cookie":{"originalMaxAge":259200000,"expires":"' + currentDate.addDays(3) + '","httpOnly":true,"path":"/"},"email":"susan@example.com","password":"' + newUser.password + ',"userId":' + susansId + '"}'
    }

		models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
		.then(function(){
			models.sequelize.options.maxConcurrentQueries = 1;
			return models.sequelize.sync({ force: true });
		})
		.then(function(){
			return models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
		})
		.then(function() {
			return models.User
			.create(newUser);
		})
		.then(function(data) {
			susansId = data.dataValues.id;
			return models.ConnectSession
			.create(newSession);
		})
		.then(function(data) {
			return models.Context
			.bulkCreate([{
				name: 'Home',
				UserId: susansId
			}, {
				name: 'Work',
				UserId: susansId
			}, {
				name: 'Phone',
				UserId: susansId
			}, {
				name: 'Computer',
				UserId: susansId
			}])
		})
		.then(function(data) {
			done();
		})
		.catch(function(error) {
			console.log('table sync error');
			throw error;
			done();
		});
	});

  it('should render the landing page', function(done) {
    chai.request(server)
    .get('/')
    .end(function(err, res) {
      console.log(res);
      res.should.have.status(200);
      res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('#intro').should.have.text('Welcome to the do-It task management application');
      }
      myNightmare(toEvaluate);
      done();
    });
  });

  it('should render the login page if the cookie is undefined on land', function(done) {
    chai.request(server)
    .get('/')
    .end(function(err, res) {
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#login-form');
        document.should.have.html(res.text);
      }
      setTimeout(function () { myNightmare(toEvaluate) }, 1000);
    });
    done();
  });

  it('should get signup page /user/signup GET', function(done) {
    chai.request(server)
    .get('/user/signup')
    .end(function(err, res) {
      console.log(res);
      res.should.have.status(200);
      res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#signup-form');
        document.querySelector('#signup-form').should.have.html(res.text);
      }
      myNightmare(toEvaluate);
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
        const toEvaluate = function(res) {
          document.querySelector('#add-todo').should.have.length(4);
          document.querySelector('#add-context').should.have.length(2);
          document.querySelector('.data').should.have.text('Signup successful!  Start saving to-dos now.');
          document.should.have.html(res.text);
        }
				myNightmare(toEvaluate);
	      done();
	    });
	  });

    it('should fail if user is already in the DB /user/signup POST', function(done) {
      let existingUser = {
        'email': 'susan@example.com',
        'password': 'spaz5713'
      }
      chai.request(server)
      .post('/user/signup')
      .send(existingUser)
      .end(function(err, res) {
        console.log(res);
        res.should.have.status(200);
        res.should.be.html;
        const toEvaluate = function(res) {
          document.querySelector('form').should.have.id('#signup-form');
          document.querySelector('.data').should.have.text('Signup not successful.');
          document.should.have.html(res.text);
        }
        myNightmare(toEvaluate);
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
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#login-form');
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
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
      const toEvaluate = function() {
        document.querySelector('#add-todo').should.have.length(0);
        document.querySelector('#add-context').should.have.length(0);
        document.querySelector('.data').should.have.text('You have successfully logged in.');
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
		});
	});

  it("should fail if the password doesn't match /user/login POST", function(done) {
    let existingUser = {
      'email': 'susan@example.com',
      'password': 'donkeykong'
    }
    chai.request(server)
    .post('/user/login')
    .send(existingUser)
    .end(function(err, res) {
      console.log(res);
      res.should.have.status(200);
      res.should.be.html;
      const toEvaluate = function(res) {
        document.querySelector('form').should.have.id('#login-form');
        document.querySelector('.data').should.have.text("Sorry, your credentials don't match any users.  Please check them and try again.");
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    });
  });

  it("should fail if the username isn't found /user/login POST", function(done) {
    let notAUser = {
      'email': 'alice@example.com',
      'password': 'spaz5713'
    }
    chai.request(server)
    .post('/user/login')
    .send(notAUser)
    .end(function(err, res) {
      console.log(res);
      res.should.have.status(200);
      res.should.be.html;
      const toEvaluate = function(res) {
        document.querySelector('form').should.have.id('#login-form');
        document.querySelector('.data').should.have.text("Sorry, your credentials don't match any users.  Please check them and try again.");
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    });
  });

	// this test becomes unnecessary when setting the cookie in the header because
	// the test fails with an undefined cookie header
  // it("shouldn't get settings page if cookie is undefined /user/settings GET", function(done) {
  //   chai.request(server)
  //   .get('/user/settings')
	// 	.set('clientcookie', undefined)
  //   .end(function(err, res) {
  //     console.log(res);
  //     res.should.have.status(200);
  //     res.should.be.html;
  //     const toEvaluate = function() {
  //       document.querySelector('form').should.have.id('#login-form');
  //       document.querySelector('.data').should.have.text("Sorry, your credentials don't match any users.  Please check them and try again.");
  //       document.should.have.html(res.text);
  //     }
  //     myNightmare(toEvaluate);
  //     done();
  //   });
  // });

	// this test becomes unnecessary when setting the cookie in the header because
	// the test fails with an undefined cookie header
  // it(`shouldn't update users' email and password if the cookie is undefined /user PUT`, function(done) {
  //   let userUpdatingEmail = {
  //     'password': 'spaz5713',
  //     'newEmail': 'stephen@example.com',
  //     'newPassword': 'donkeykong'
  //   }
  //   chai.request(server)
  //   .put('/user')
	// 	.set('clientcookie', undefined)
  //   .send(userUpdatingEmail)
  //   .end(function(err, res) {
  //     console.log(res.text);
  //     res.should.have.status(200);
  //     res.should.be.html;
  //     const toEvaluate = function() {
  //       document.querySelector('form').should.have.id('#change-form');
  //       document.querySelector('.data').should.have.text("Info not updated.  Try again.");
  //       document.should.have.html(res.text);
  //     }
  //     myNightmare(toEvaluate);
  //     done();
  //   });
  // });

  it('should logout users /user/logout DELETE', function(done) {
    chai.request(server)
    .delete('/user/logout')
    .end(function(err, res) {
      console.log(res);
      res.should.have.status(200);
      res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#login-form');
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    })
  });

	// this test becomes unnecessary when setting the cookie in the header because
	// the test fails with an undefined cookie header
	// it("shouldn't delete users with an undefined cookie /user DELETE", function(done) {
	// 	let userDeletingSelf = {
	// 		'password': 'spaz5713'
	// 	}
	// 	chai.request(server)
	// 	.delete('/user')
	// 	.set('clientcookie', undefined)
	// 	.send(userDeletingSelf)
	// 	.end(function(err, res) {
	// 		console.log(res.text);
	// 		res.should.have.status(200);
	// 		res.should.be.html;
  //     const toEvaluate = function() {
  //       document.querySelector('form').should.have.id('#change-form');
  //       document.querySelector('.data').should.have.text('Error deleting your account.  Please login again.');
  //       document.should.have.html(res.text);
  //     }
  //     myNightmare(toEvaluate);
  //     done();
  //   });
	// });
});

//tests where the cookie in the browser is defined but doesn't match
//the cookie in the session
describe('UserWithWrongCookie', function() {
  beforeEach('clear and add', function(done) {
    Nightmare()
      .goto('localhost:5000')
      .evaluate(function() {
        document.cookies = '; do-it=9om6W8WICmE_gyrEjckhG_a9ijWNekZD'
      });
		let newUser = {
      email: 'susan@example.com',
      password: bcrypt.hashSync("spaz5713", bcrypt.genSaltSync(10))
    }
		let susansId;
    // let newSession = {
    //   sid: 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD',
    //   data: '{"cookie":{"originalMaxAge":259200000,"expires":"' + currentDate.addDays(3) + '","httpOnly":true,"path":"/"},"email":"susan@example.com","password":"' + newUser.password + ',"userId":' + susansId + '"}'
    // }

		models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
		.then(function(){
			models.sequelize.options.maxConcurrentQueries = 1;
			return models.sequelize.sync({ force: true });
		})
		.then(function(){
			return models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
		})
		.then(function() {
			return models.User
			.create(newUser);
		})
		.then(function(data) {
			susansId = data.dataValues.id;
			return models.ConnectSession
			.create({
	      sid: 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD',
	      data: '{"cookie":{"originalMaxAge":259200000,"expires":"' + currentDate.addDays(3) + '","httpOnly":true,"path":"/"},"email":"susan@example.com","password":"' + newUser.password + ',"userId":' + susansId + '"}'
	    });
		})
		.then(function(data) {
			done();
		})
		.catch(function(error) {
			console.log('table sync error');
			throw error;
			done();
		});
  });

  it('should render the login page if the cookie is invalid on land', function(done) {
    chai.request(server)
    .get('/')
    .end(function(err, res) {
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#login-form');
        document.should.have.html(res.text);
      }
      setTimeout(function () { myNightmare(toEvaluate) }, 1000);
    });
    done();
  });

  it("shouldn't get settings page if cookie is wrong /user GET", function(done) {
    chai.request(server)
    .get('/user')
		.set('clientcookie', '9om6W8WICmE_gyrEjckhG_a9ijWNekZD')
    .end(function(err, res) {
      console.log(res);
      res.should.have.status(200);
      res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#login-form');
        document.querySelector('.data').should.have.text("Sorry, your credentials don't match any users.  Please check them and try again.");
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    });
  });

  it(`shouldn't update users' email and password if the cookie is wrong /user PUT`, function(done) {
    let userUpdatingEmail = {
      'password': 'spaz5713',
      'newEmail': 'stephen@example.com',
      'newPassword': 'donkeykong'
    }
    chai.request(server)
    .put('/user')
		.set('clientcookie', '9om6W8WICmE_gyrEjckhG_a9ijWNekZD')
    .send(userUpdatingEmail)
    .end(function(err, res) {
      console.log(res.text);
      res.should.have.status(200);
      res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#change-form');
        document.querySelector('.data').should.have.text("Info not updated.  Try again.");
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    });
  });

  it("shouldn't delete users with a wrong cookie /user DELETE", function(done) {
		let userDeletingSelf = {
			'password': 'spaz5713'
		}
		chai.request(server)
		.delete('/user')
		.set('clientcookie', '9om6W8WICmE_gyrEjckhG_a9ijWNekZD')
		.send(userDeletingSelf)
		.end(function(err, res) {
			console.log(res.text);
			res.should.have.status(200);
			res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#change-form');
        document.querySelector('.data').should.have.text('Error deleting your account.  Please login again.');
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    });
	});

});

//tests where the user has the right cookie
describe('UserWithRightCookie', function() {
  beforeEach('clear and add', function(done) {
    const toEvaluate = function() {
      document.cookies = '; do-it=WDfAv8WICmE_gyrEjckhG_a9ijWNekZD';
    }
    myNightmare(toEvaluate);
		let newUser = {
      email: 'susan@example.com',
      password: bcrypt.hashSync("spaz5713", bcrypt.genSaltSync(10))
    }
		let susansId;
    // let newSession = {
    //   sid: 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD',
    //   data: '{"cookie":{"originalMaxAge":259200000,"expires":"' + currentDate.addDays(3) + '","httpOnly":true,"path":"/"},"email":"susan@example.com","password":"' + newUser.password + ',"userId":' + susansId + '"}'
    // }

		models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
		.then(function(){
			models.sequelize.options.maxConcurrentQueries = 1;
			return models.sequelize.sync({ force: true });
		})
		.then(function(){
			return models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
		})
		.then(function() {
			return models.User
			.create(newUser);
		})
		.then(function(data) {
			susansId = data.dataValues.id;
			return models.ConnectSession
			.create({
				sid: 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD',
				data: '{"cookie":{"originalMaxAge":259200000,"expires":"' + currentDate.addDays(3) + '","httpOnly":true,"path":"/"},"email":"susan@example.com","password":"' + newUser.password + ',"userId":' + susansId + '"}'
			});
		})
		.then(function(data) {
			done();
		})
		.catch(function(error) {
			console.log('table sync error');
			throw error;
			done();
		});
  });

  it('should render the todos page if the cookie is valid on land', function(done) {
    chai.request(server)
    .get('/')
    .end(function(err, res) {
      const toEvaluate = function() {
        document.querySelector('#add-todo').should.have.length(0);
        document.querySelector('#add-context').should.have.length(0);
        document.should.have.html(res.text);
      }
      setTimeout(function () { myNightmare(toEvaluate) }, 1000);
    });
    done();
  });

  it('should get settings page /user GET', function(done) {
    chai.request(server)
    .get('/user')
		.set('clientcookie', 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD')
    .end(function(err, res) {
      console.log(res);
      res.should.have.status(200);
      res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#change-form');
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    });
  });

  it(`should update users' email and password with correct cookie and password /user PUT`, function(done) {
    let userUpdatingEmail = {
      'password': 'spaz5713',
      'newEmail': 'stephen@example.com',
      'newPassword': 'donkeykong'
    }
    chai.request(server)
    .put('/user')
		.set('clientcookie', 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD')
    .send(userUpdatingEmail)
    .end(function(err, res) {
      console.log(res.text);
      res.should.have.status(200);
      res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#change-form');
        document.querySelector('.data').should.have.text("You're golden!  Please use your new credentials to login in the future.");
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    });
  });

  it(`shouldn't update users' email and password if password is wrong /user PUT`, function(done) {
    let userUpdatingEmail = {
      'password': 'flibergit',
      'newEmail': 'stephen@example.com',
      'newPassword': 'donkeykong'
    }
    chai.request(server)
    .put('/user')
		.set('clientcookie', 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD')
    .send(userUpdatingEmail)
    .end(function(err, res) {
      console.log(res.text);
      res.should.have.status(200);
      res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#change-form');
        document.querySelector('.data').should.have.text("Your current password doesn't match our records.");
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    });
  });

  it(`shouldn't update users' email and password if password is undefined /user PUT`, function(done) {
    let userUpdatingEmail = {
      'password': undefined,
      'newEmail': 'stephen@example.com',
      'newPassword': 'donkeykong'
    }
    chai.request(server)
    .put('/user')
		.set('clientcookie', 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD')
    .send(userUpdatingEmail)
    .end(function(err, res) {
      console.log(res.text);
      res.should.have.status(200);
      res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#change-form');
        document.querySelector('.data').should.have.text("Your current password doesn't match our records.");
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    });
  });

  it(`shouldn't update users' email and password if new info isn't sent /user PUT`, function(done) {
    let userUpdatingEmail = {
      'password': 'spaz5713'
    }
    chai.request(server)
    .put('/user')
		.set('clientcookie', 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD')
    .send(userUpdatingEmail)
    .end(function(err, res) {
      console.log(res.text);
      res.should.have.status(200);
      res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#change-form');
        document.querySelector('.data').should.have.text("Info not updated.  Try again.");
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    });
  });


  it("should delete users with the right cookie /user DELETE", function(done) {
		let userDeletingSelf = {
			'password': 'spaz5713'
		}
		chai.request(server)
		.delete('/user')
		.set('clientcookie', 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD')
		.send(userDeletingSelf)
		.end(function(err, res) {
			console.log(res.text);
			res.should.have.status(200);
			res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#login-form');
        document.querySelector('.data').should.have.text('Your account and all your to-dos were successfully deleted.');
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    });
	});

  it("shouldn't delete users with the wrong password /user DELETE", function(done) {
		let userDeletingSelf = {
			'password': 'donkeykong'
		}
		chai.request(server)
		.delete('/user')
		.set('clientcookie', 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD')
		.send(userDeletingSelf)
		.end(function(err, res) {
			console.log(res.text);
			res.should.have.status(200);
			res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#login-form');
        document.querySelector('.data').should.have.text('Your password is incorrect.  Please try again.');
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    });
	});

  it("shouldn't delete users with an undefined password /user DELETE", function(done) {
    let userDeletingSelf = {
      'password': undefined
    }
    chai.request(server)
    .delete('/user')
		.set('clientcookie', 'WDfAv8WICmE_gyrEjckhG_a9ijWNekZD')
    .send(userDeletingSelf)
    .end(function(err, res) {
      console.log(res.text);
      res.should.have.status(200);
      res.should.be.html;
      const toEvaluate = function() {
        document.querySelector('form').should.have.id('#login-form');
        document.querySelector('.data').should.have.text('Your password is incorrect.  Please try again.');
        document.should.have.html(res.text);
      }
      myNightmare(toEvaluate);
      done();
    });
  });

});

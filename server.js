// ++++++ dev tools ++++++
const util = require('util');


// ++++++ General Express config ++++++
const express         = require('express'),
      bodyParser      = require('body-parser'),
      logger          = require('morgan'),
			hbs							= require('express-handlebars'),
      cookieParser    = require('cookie-parser'),
      app             = express(),
			routes 					= require('./routes/index');

app.use(logger("combined"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("./public"));

//++++++ Handlebars config ++++++
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'handlebars');

//++++++ express sessions ++++++
const session 		= require('express-session'),
			database 		= require('./models').sequelize,
 			SequelStore	= require('connect-sequelize')(session),
			secret 			= require('./config/secret'),
			modelName		= 'ConnectSession';

app.use(session({
  secret: secret,
  store: new SequelStore(database, {}, modelName),
  resave: true,
  saveUninitialized: true
}));

//++++++ API Routes ++++++
app.use(routes);

// ++++++ SERVER LISTEN ++++++
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, function () {
	console.log(`express server listening to your mom on port ${PORT}`);
});

module.exports = server;

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

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("./src"));

//++++++ Handlebars config ++++++
app.engine('hbs', hbs({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

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

//++++++ Routes ++++++
app.use(routes);

// ++++++ SERVER LISTEN ++++++
const PORT = process.env.PORT || 6321;

const server = app.listen(PORT, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log('express server listening to your mom at http://' + host + ':' + port);
});

module.exports = server;

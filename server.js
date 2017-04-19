// ++++++ dev tools ++++++
const util = require('util');


// ++++++ General Express config ++++++
const express         = require('express'),
      bodyParser      = require('body-parser'),
      logger          = require('morgan'),
			hbs							= require('express-handlebars'),
      cookieParser    = require('cookie-parser'),
      app             = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static("./public"));

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

// ++++++ Express routes ++++++
const userRoutes		= require('./routes/user'),
			contextRoutes = require('./routes/context'),
			itemRoutes		= require('./routes/item');

app.use(userRoutes);
app.use(contextRoutes);
app.use(itemRoutes);

// ++++++ SERVER LISTEN ++++++
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, function () {
  console.log('express server listening to your mom at port' + PORT);
});

module.exports = server;

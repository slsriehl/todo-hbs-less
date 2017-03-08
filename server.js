// ++++++ dev tools ++++++
const util = require('util');


// ++++++ General Express config ++++++
const express         = require('express'),
      bodyParser      = require('body-parser'),
      logger          = require('morgan'),
      //cookieParser    = require('cookie-parser'),
      app             = express(),
			routes 					= require('./routes/index');

app.use(logger("combined"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static("./public"));

app.set('view engine', 'html');

//++++++ HTML Routes +++++
app.get('/', (req, res) => {
	res.render('index.html');
});

//++++++ API Routes ++++++
app.use(routes);

// ++++++ SERVER LISTEN ++++++
const PORT = process.env.PORT || 5000;

app.listen(PORT, function() {
  console.log("server.js listening to your mom on PORT: " + PORT);
});

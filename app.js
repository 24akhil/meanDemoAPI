const express = require("express");
const app = express();
const morgan = require("morgan"); //Logging package in nodejs.
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const swaggerOptions = require("./api/middleware/swagger");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./api/middleware/swagger');
// const productRoutes = require("./api/routes/products");
// const orderRoutes = require("./api/routes/orders");
// const userRoutes = require('./api/routes/user');
const routes = require('./routes');

// mongoose.connect(
//   "mongodb://node-shop:" +
//     process.env.MONGO_ATLAS_PW +
//     "@node-rest-shop-shard-00-00-wovcj.mongodb.net:27017,node-rest-shop-shard-00-01-wovcj.mongodb.net:27017,node-rest-shop-shard-00-02-wovcj.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin",
//   {
//     useMongoClient: true
//   }
// );

//#region connect to mongo db using mongoose ORM/driver.
mongoose.connection.on('connected', function () {
  console.log('DB Connected.')
});
mongoose.connect(process.env.DB_CONNECTION_STRING,
  { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {

    if (err)
      console.log('DB Connection Error: ', err);
  });
//#endregion

mongoose.Promise = global.Promise;

app.use(morgan("dev")); //logger moddleware...logs on console when an route is hit.

app.use('/uploads', express.static('uploads'));//To show images from upload folder at GET request.

app.use(bodyParser.urlencoded({ extended: false })); //request body parser but not request files
app.use(bodyParser.json());

//CORS handling.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //'*'->https://www.example.com specific address.
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") { //Allowing specific methods.
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use('/', routes);
// app.use("/products", productRoutes);
// app.use("/orders", orderRoutes);
// app.use("/user", userRoutes);



//Error handling setup.
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  // console.log(req.body,req.headers);
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;

const express = require('express');
const morgan = require('morgan');
const path = require('path')
const fs = require('fs');
const { some_important_function } = require('package-private-1')

// front end library
const hbs = require('hbs')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// JWT token validation (vulnerable version)
const jwt = require('jsonwebtoken');
require('dotenv').config();

// preventing CSRF
// const helmet = require("helmet");

// CSRF warning mitigated
const app = express();
// place morgan here to enable console.log (logging)
app.use(morgan('dev'));
// app.use(helmet());

// importing front end stuff
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');
const databasePath = path.join(__dirname, '../database/users.json');

// Read the JSON file
let data = fs.readFileSync(databasePath, "utf8");
data = JSON.parse(data);

// helper script for JWT
const authentication = require('./helpers/authentication');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CALL TO vulnerable package.
const sum = some_important_function()
console.log("Usage of the imporant function: " + sum)

app.get('/health', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

// Where FLAG will be displayed
app.get('/', authentication, async (req, res, next) => {
  // authentication
  try {
    const username = req.user.name
    const user = data.users.find(u => u.username === username);

    if (user) {
      res.render('message', {
        username: username,
        message: user.message
      })
    } else {
      res.send("Handel-bars rendering failed failed!")
    }
  } catch (error) {
    next(error)
  }
});

// login page for the application
app.post('/login', async (req, res, next) => {
  try {
    // DB is static, ignore check for only alphanumeric
    const username = req.body.username.toLowerCase();
    const user = data.users.find(u => u.username === username);
    const user_jwt_payload = { name: username };

    if (user && req.body.password === user.password) {

      // generating a JWT token
      const accessToken = jwt.sign(user_jwt_payload, process.env.JWT_SECRET_KEY, { expiresIn: "10m" })
      res.cookie('Authorization', accessToken)
      res.redirect('/');

      console.log("credentials used (token generated): " + req.body.username + ":" + req.body.password);
      console.log(accessToken)
    } else {
      res.status(401).render('index', {
        indexMessageError: "Invalid credentials!"
      })
      console.log("credentials used: " + req.body.username + ":" + req.body.password)
    }
  } catch (error) {
    next(error)
  }
})

// logout from the application
app.get('/logout', async (_, res, next) => {
  try {
    res.clearCookie('Authorization');
    res.redirect('/')
  } catch (error) {
    next(error)
  }
})


app.use((req, res, next) => {
  res.status(404).redirect('/');
});

app.use((err, req, res, next) => {
  res.status(500).json(err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));

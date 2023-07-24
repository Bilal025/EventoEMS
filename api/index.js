const express = require ('express');
var cors = require('cors');
require('dotenv').config();
const { default: mongoose } = require('mongoose');
const UserModel = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'bsbsfbrnsftentwnnwnwn';


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}));

mongoose.connect(process.env.MONGO_URL);


app.get('/test', (req, res) =>{
  res.json('test ok'); 
});

app.post('/register', async (req, res) =>{
  const {name, email, password} = req.body;
  

  try{
    const userDoc = await UserModel.create({
      name,
      email, 
      password:bcrypt.hashSync(password, bcryptSalt)
    });
    res.json(userDoc);
  }catch(e){
    res.status(422).json(e);
  }
  
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const userDoc = await UserModel.findOne({email});

  if (!userDoc) {
    return res.status(404).json({ error: 'User not found' });
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // User verified, create and send JWT token
  jwt.sign({
      email: userDoc.email,
      id: userDoc._id,
      
    },jwtSecret,{},(err, token) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to generate token' });
      }
      res.cookie('token', token).json(userDoc);
    }
  );
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await UserModel.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});














app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true)
})


app.listen(4000);

//45ymnGKgjxOwO9EJ
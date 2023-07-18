const express = require ('express');
var cors = require('cors');
require('dotenv').config();
const { default: mongoose } = require('mongoose');
const UserModel = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'bsbsfbrnsftentwnnwnwn';


app.use(express.json());
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
  const {email, password} = req.body;

  const userDoc = await UserModel.findOne({email})

  if (userDoc){
    const passOk = bcrypt.compareSync(password,userDoc.password);
    if(passOk){

      jwt.sign({email:userDoc.email, id:userDoc._id}, jwtSecret, {}, (err,token)=>{

        if(err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    }else{
      res.status(422).json('pass not ok');
    }
  }else{  
    res.json('not found');
  }
})

app.listen(4000);

//45ymnGKgjxOwO9EJ
import ConnectDB from './config/index.js';
import express, { response }  from 'express';
import cors from 'cors'
import admin from './routes/admin.js'
import auth from './routes/auth.js'
import user from './routes/user.js'
import ErrorMiddleware from './middleware/error.js'

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
// Connect Db
ConnectDB();

app.use('/images', express.static('images'));


app.get("/", (req, res) => {
    res.send("<h1>Hello to Gocality App API</h1>");
  });

// Auth Routes 
app.use('/auth', auth);

app.use('/admin', admin);

app.use('/user', user);




app.use(ErrorMiddleware);

app.listen(PORT)
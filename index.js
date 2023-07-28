import ConnectDB from './config/index.js';
import express, { response }  from 'express';
import cors from 'cors'
import admin from './routes/admin.js'
import auth from './routes/auth.js'
import user from './routes/user.js'
import ErrorMiddleware from './middleware/error.js'
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url'; 

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;
// Connect Db
ConnectDB();



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname,'utills')))
app.use('/static',express.static('utilss'))




app.get("/", (req, res) => {
    res.send("<h1>Hello to Gocality App API</h1>");
  });

// Auth Routes 
app.use('/auth', auth);

app.use('/admin', admin);

app.use('/user', user);




app.use(ErrorMiddleware);

app.listen(PORT)
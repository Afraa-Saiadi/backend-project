const express = require('express')
const app = express()
const router = require('./config/router');
const cookieParser = require('cookie-parser');
const { requireAuth} = require('./authMiddleware/authMiddleware');


// app.get('*', checkUser);
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({extended:true}))

require('./config/mongoose')




app.use(router)
app.listen(3000)
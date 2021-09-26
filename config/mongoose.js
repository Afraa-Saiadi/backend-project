const mongoose = require('mongoose');
const db ='mongodb+srv://Ahmad:adam152020@cluster0.yexv7.mongodb.net/nodejsdatabase?retryWrites=true&w=majority'
mongoose.set('useFindAndModify', false);
mongoose.connect(db, {userNewUrlParser : true, useUnifiedTopology:true})
   .then (res=>console.log('connected with db'))
   .catch(err=>console.log('err with db'))
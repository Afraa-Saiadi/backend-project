const { Question } = require('../models/Question');
const { Comment } = require('../models/Comment');
// const { User } = require('../models/User')


const User = require("../models/User");
const jwt = require('jsonwebtoken');

 
const getHomepage = async (req,res)=>{
    var resultArr = [];
    Question.find()
    .then(result =>{
      res.render('homepage',{result})
    })
    .catch(err=>console.log(err))
    
}

const postNewQuestion=(req,res)=>{
    if (req.method==='GET'){
        res.render('addQuestion',{ err:false})
    }
    if (req.method==='POST'){

        console.log(req.body)
        const question = new Question(req.body)
        question.userId = req.body.user_id;
        question.save()
         .then(result=>res.redirect('/'))
         .catch(err=>res.render('addQuestion', {err:err.errors}))
    
        
    }
    
}

const showOneQuestion=(req,res)=>{
    // Question.findById({_id:req.params.id})
    // .then(result=>{
       
    //     res.render('showOne',{result})})
    // .catch(err=>console.log(err))
    if (req.method === 'GET') {
      Question.findById({_id: req.params.id }).populate('user_id',['email'])
          .then(result => {
              console.log(result)
              Comment.find({question_id: {$in : [result._id]}}).populate('user_id',['_id','email'])
                  .then( comments =>{
                      const auth_id = res.locals.user
                      console.log(comments)
                      res.render('showOne', { result, comments, auth_id })
                      })
                  .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
      }
  if(req.method === "POST"){
      const comment = new Comment(req.body);
      console.log(req.body)
      comment.save()
      .then(results=>res.redirect(`/question/${req.params.id}`))
      .catch(err => res.render('showOne', { error: err.errors }))
  }
}

 

 const updateOneQuestion=(req,res)=>{
    if (req.method==='GET'){
        Question.findById({_id:req.params.id})
    .then(result=>{
        console.log(result)
       
        res.render('editQuestion',{result})})
    .catch(err=>console.log(err))
 }

 if (req.method==='POST'){
    Question.findByIdAndUpdate({_id:req.params.id})
    .then(result=>{
        console.log(result)
       
        result.question = req.body.question
        result.description = req.body.description
        result.save()
        .then(()=>
        res.redirect('/'))
           
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))

   
    
 }
        
} 

const deleteOneQuestion=(req,res)=>{
    Question.findByIdAndDelete({_id:req.params.id})
    .then(result=>{
        res.redirect('/')
    })
    .catch(err=>console.log(err))
}

const updateOneComment=(req,res)=>{
  if (req.method==='GET'){
    Comment.findById({_id:req.params.id})
.then(result=>{
    console.log(result)
   
    res.render('showOne',{result})})
.catch(err=>console.log(err))
}

if (req.method==='POST'){
Comment.findByIdAndUpdate({_id:req.params.id})
.then(result=>{
    console.log(result)
   
    result.comment = req.body.comment
    
    result.save()
    .then(()=>
    res.redirect('/'))
       
    .catch(err=>console.log(err))
})
.catch(err=>console.log(err))
}

}

const deleteOneComment =(req,res)=>{
  Comment.findByIdAndDelete({_id:req.params.id})
  .then(result=>{
      res.redirect('/')
  })
  .catch(err=>console.log(err))

}

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

 // incorrect email
 if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  
     // duplicate email error
     if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
   // validation errors
   if (err.message.includes('user validation failed')) {
    console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      console.log(properties);
      errors[properties.path] = properties.message;
      // console.log(properties)
    });
  }
  return errors;
  }
  
  // create json web token
  const maxAge = 3 * 24 * 60 * 60;
  const createToken = (id) => {
    return jwt.sign({ id }, 'afraa adam sham ahmad secret', {
      expiresIn: maxAge
    });
  };
  
  // controller actions
  const signup_get = (req, res) => {
      res.render('signup');
    }
    
    const login_get = (req, res) => {
      res.render('login');
    }
    
    const signup_post = async (req, res) => {
      // res.send('new signup');
      const { email, password } = req.body;
    //   console.log(email, password);
    // res.send('new signup');
    try {
      const user = await User.create({ email, password });
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({user : user._id});
    }
    catch(err) {
      // console.log(err);
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
    }
    
    const login_post = async (req, res) => {
      // res.send('user login');
      const { email, password } = req.body;
      // console.log(req.body);
  
    //   console.log(email, password);
    //   res.send('user login');
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user, token });
      } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
      }

    }

const logout_get=(req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}




module.exports={
    getHomepage,
    postNewQuestion,
    showOneQuestion,
    updateOneQuestion,
    deleteOneQuestion,
    updateOneComment,
    deleteOneComment,
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get

}
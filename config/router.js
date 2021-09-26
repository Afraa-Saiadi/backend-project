const express = require('express')
const router = express.Router()
const controller =require('../controllers/controller')
const { requireAuth ,checkUser } = require('../authMiddleware/authMiddleware');


router.get('*', checkUser);

router.get('/', controller.getHomepage)

router.all('/add-question', requireAuth ,controller.postNewQuestion)

router.all('/question/:id',requireAuth,controller.showOneQuestion)

router.all('/question/edit/:id', requireAuth ,controller.updateOneQuestion)

router.get('/delete-question/:id', requireAuth ,controller.deleteOneQuestion)

router.all('/comment/edit/:id', requireAuth ,controller.updateOneComment)
router.get('/delete-comment/:id', requireAuth ,controller.deleteOneComment)

router.get('/signup', controller.signup_get);

router.post('/signup', controller.signup_post);

router.get('/login', controller.login_get);

router.post('/login', controller.login_post);

router.get('/logout', controller.logout_get);





module.exports= router
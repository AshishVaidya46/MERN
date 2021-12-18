const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/register',userCtrl.register)

router.post('/login',userCtrl.login)

router.get('/logout',userCtrl.logout)

router.get('/refresh_token',userCtrl.refreshToken)

router.get('/infor', auth, userCtrl.getUser)

router.get('/users_info', auth,authAdmin, userCtrl.getUsers)

router.patch('/addcart', auth, userCtrl.addCart)

router.get('/history' , auth, userCtrl.history)

router.put('/edit_user/:id',auth,userCtrl.updateUser)

router.post('/address/:id', userCtrl.address)

router.delete('/history/:id', userCtrl.deleteHistory)

router.post('/activation', userCtrl.activateEmail)


// Social Login
router.post('/google_login', userCtrl.googleLogin)

module.exports = router
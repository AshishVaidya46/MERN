const Users = require('../models/userModel')
const PaymentModel = require('../models/paymentModel')
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')
const sendMail = require('./sendMail')
const {google} = require('googleapis')
const {OAuth2} = google.auth
const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    sorting(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort('-createdAt')
        }

        return this;
    }
}

const userCtrl = {
    register: async (req, res) =>{
        try {
            const {name, email, password,address} = req.body;

            if(!name || !email || !password)
                return res.status(400).json({msg: "Please fill in all fields."})

            if(!validateEmail(email)){
                return res.status(400).json({msg: "Invalid Email"})
            }

            if(password.length < 6) 
                return res.status(400).json({msg: "Password is at least 6 characters long."})

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = {
                name, email, password: passwordHash, address
            }


            const activation_token = createActivationToken(newUser)
            const url = ` http://localhost:3000/user/activate/${activation_token}`
            sendMail(email,url)

            res.json({msg: "Register Success! Please activate your email to start."})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    activateEmail: async (req, res) => {
        try {
            const {activation_token} = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const {name, email, password, address} = user

            const check = await Users.findOne({email})
            if(check) return res.status(400).json({msg:"This email already exists."})

            const newUser = new Users({
                name, email, password, address
            })

           // await newUser.save()
            const accesstoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7d
            })

            res.json({accesstoken})


        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) =>{
        try {
            const {email, password} = req.body;

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg:"User does not exits."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg:"Incorrect Password."})

            //if login success, create access token and refresh token
            const accestoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 //7d
            })

            res.json({accestoken })   
                } catch (err) {        
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken',{path: '/user/refresh_token'})
            return res.json({msg:"Logged Out"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    refreshToken: (req, res) =>{
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: "please Login or Register"})
              
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
                if(err) return res.status(400).json({msg: "please Login or Register"})

                const accesstoken = createAccessToken({id: user.id})
                res.json({accesstoken})
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }

    },
    getUser: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg: "User does not exits."})

            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})

        }
    },
    addCart: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg: "User does not esit"})

            await Users.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            })

            return res.json({msg: "Added to cart"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    history: async (req, res) => {
        try {
            const features = new APIfeatures(PaymentModel.find({user_id: req.user.id}), req.query).sorting()
            const history = await features.query
            //console.log(history)
            res.json(history)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteHistory: async (req, res) => {
        try {
            await PaymentModel.findByIdAndDelete(req.params.id)
            res.json({msg: "Order Deleted"})
        } catch (err) {
            return res.status(500).json({msg: err.message}) 
        }
    },
    getUsers: async (req, res) => {
        try {
            const user = await Users.find().select('-password')
            if(!user) return res.status(400).json({msg: "User does not exits."})

            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})

        }
    },
    updateUser: async(req, res) => {
        try {
            const {name,password} = req.body;
            const userName = await Users.findOne({name})
            if(userName) return res.status(400).json({msg: "The UserName already exists."})
            
            if(name && password){
                if(password.length < 6) 
                return res.status(400).json({msg: "Password is at least 6 characters long."})

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)

            await Users.findOneAndUpdate({_id: req.params.id},{name,password: passwordHash})

            res.json({msg: "Successfully User Name changed."})
            }else if(password){
                if(password.length < 6) 
                return res.status(400).json({msg: "Password is at least 6 characters long."})

            // Password Encryption
            const passwordHash = await bcrypt.hash(password, 10)

            await Users.findOneAndUpdate({_id: req.params.id},{password: passwordHash})

            res.json({msg: "Successfully password changed."})
            }else if(name){
                await Users.findOneAndUpdate({_id: req.params.id},{name})
                res.json({msg: "Successfully User Name changed."})
            }
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    address: async(req, res) => {
        try {
            const {address, postalCode, mobile} = req.body
            await Users.findOneAndUpdate({_id: req.params.id},{
                address, postalCode, mobile
            })
            res.json({msg: "done"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    googleLogin: async (req, res) => {
        try {
            const {tokenId} = req.body

            const verify = await client.verifyIdToken({idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID})

            const {email_verified, email, name} = verify.payload

            const password = email + process.env.GOOGLE_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            if(!email_verified) return res.status(400).json({msg: "Email verification failed."})

            const user = await Users.findOne({email})

            if(user){
                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            const refreshtoken = createRefreshToken({id: user._id})
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 //7d
            })

                res.json({msg: "Login success!"})
            }else{
                const newUser = new Users({
                    name, email, password: passwordHash
                })

                await newUser.save()
                
            const refreshtoken = createRefreshToken({id: user._id})
            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 //7d
            })

                res.json({msg: "Login success!"})
            }

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , {expiresIn: '11m'})
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = userCtrl
const express = require("express");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const router = express.Router();
const PaymentModel = require('../models/paymentModel')
const Users = require('../models/userModel')
const nodemailer = require("nodemailer");
const Products = require('../models/productModel')

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
            this.query = this.query.sort('-updatedAt')
        }

        return this;
    }
}

router.get("/checkout", async(req, res) => {
    try {
        const features = new APIfeatures(PaymentModel.find(), req.query).sorting()
        const  paymentModel = await features.query
        res.json(paymentModel)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})


router.post("/checkout_success", async (req, res) => {
    let order;
    let status;
    let OrderId ;
    const {id, cart, user, total, method} =req.body

   // console.log(req.body)
    const users = await Users.findById(user._id).select('name email')
    if(!users) return res.status(400).json({msg: "User does not exist."})

    try {
        if(method === 'card'){
         for(let i=0; i<cart.length; i++){
             order = new PaymentModel({
                user_id:user._id,
                name: user.name,
                email: user.email,
                paymentID:id,
                address: user.address,
                zipCode:user.postalCode,
                contact:user.mobile,
                cart: cart[i],
                amount: total,
                paid: true,
                method: 'card'     
            })
            await order.save()
        }
        for(let i=0; i<cart.length; i++) {
            await Products.findOneAndUpdate({_id: cart[i]._id}, {
               sold: cart[i].quantity + cart[i].sold
           })
        }
        status ="success"
        OrderId = order._id
        res.json({status,OrderId});
        }else if(method === 'cash'){
            for(let i=0; i<cart.length; i++){
                order = new PaymentModel({
                    user_id:user._id,
                    name: user.name,
                    email: user.email,
                    paymentID:id,
                    address: user.address,
                    zipCode:user.postalCode,
                    contact:user.mobile,
                    cart: cart[i],
                    amount: total, 
                    paid: false, 
                    method: 'cash'
               })
              await order.save();
           }
           for(let i=0; i<cart.length; i++) {
            await Products.findOneAndUpdate({_id: cart[i]._id}, {
               sold: cart[i].quantity + cart[i].sold
           })
        }
        console.log(order.createdAt)
            status = "success";
            OrderId = order._id;
            res.json({status,OrderId});
        }

        //const testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
              user: 'Elegnate@outlook.com', // genthereal.emaierated ethereal user
              pass: 'Ash16arysu&sa', // generated ethereal password
            },
          });

          const message = {
            from: 'Elegnate@outlook.com', // sender address
            to:`${user.email},Elegnate@outlook.com`, // list of receivers
            subject: "Your Order is Confirmed!", // Subject line
            html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Thank you for your order</h2>
                   <p >Thank you for shopping with Elegnate! We've recived your order and will get started on it right away
                        Once Your order ready for delivery, we'll send you a mail.</p>
                <p>Order No: ${OrderId};</p>
                <p>purchase Date: ${new Date(order.createdAt).toDateString()}</p>
                <p>purchase method: ${method};</p>
                <p>purchase total: ${total}</p>
                <hr />
                   
                           
            </div>`, // plain text body
            };

          transporter.sendMail(message, (err, info) => {
              if(err){
                  console.log("error in sending mail",err)
                  return res.status(400).json({
                      message: `error in sending mail ${err}`
                  })
              }else{
                 // console.log("successfully send the mail", info)
                 return info;
              }
          })
    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: err.message})
    }
})

router.post("/payment_card", async (req, res) => {
    let {amount, id} = req.body
    try {
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "INR",
            payment_method: id,
            confirm: true
        })
        //console.log("Payment", payment)
        res.json({
            message: "Payment Successful",
            success: true
        })
    } catch (error) {
        console.log("Error", error)
        res.json({
            message: "Payment failed",
            success: false
        })
    }
})


router.put("/deliverycheckout", async (req, res) => {
    try {
       const response = await PaymentModel.findOneAndUpdate({_id: req.body.id}, {delivered: true})
       const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
          user: 'Elegnate@outlook.com', // genthereal.emaierated ethereal user
          pass: 'Ash16arysu&sa', // generated ethereal password
        },
      });

      const message = {
        from: 'Elegnate@outlook.com', // sender address
        to: "ashishvaidya683@gmail.com", // list of receivers
        subject: "Order successfully delivered", // Subject line
        html: `<div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: teal;">Your order has been delivered</h2>
            <hr />
                       
        </div>`, // plain text body
      };

      transporter.sendMail(message, (err, info) => {
          if(err){
              console.log("error in sending mail",err)
              return res.status(400).json({
                  message: `error in sending mail ${err}`
              })
          }else{
             // console.log("successfully send the mail", info)
          }
      })
        res.json(response)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

router.put("/paidcheckout", async (req, res) => {
    try {
        const response = await PaymentModel.findOneAndUpdate({_id: req.body.id}, {paid: true})
        res.json(response)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

router.put("/dispatch", async (req, res) => {
    try {
        const response = await PaymentModel.findOneAndUpdate({_id: req.body.id}, {dispatch: true})
        res.json(response)
        } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})
router.put("/cancel", async (req, res) => {
    try {
        const response = await PaymentModel.findOneAndUpdate({_id: req.body.id}, {cancel: true})
        res.json(response)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})
router.put("/return", async (req, res) => {
    try {
        const response = await PaymentModel.findOneAndUpdate({_id: req.body.id}, {return: true})
        res.json(response)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

router.put("/returndisable", async (req, res) => {
    try {
        const response = await PaymentModel.findOneAndUpdate({_id: req.body.id}, {returnButton: false})
        res.json(response)
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})

module.exports = router

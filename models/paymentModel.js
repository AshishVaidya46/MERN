const mongoose = require('mongoose')


const paymentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    paymentID:{
        type: String,
    },
    address:{
        type: Array,
        required: true
    },
    contact:{
        type: Array,
        
    },
    cart:{
        type: Array,
        default: []
    },
    amount:{
        type:String,
        required: true
    },
    zipCode: {
        type: Array
    },
    delivered: {
        type: Boolean,
        default: false
    },
    paid: {
        type: Boolean,
        require:true 
    },
    dispatch: {
        type: Boolean,
        default:false
    },
    cancel: {
        type: Boolean,
        default:false
    },
    return: {
        type: Boolean,
        default:false
    },
    returnButton: {
        type:Boolean,
        default: true
    },
    method:{
        type: String,
        required: true
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Payments", paymentSchema)
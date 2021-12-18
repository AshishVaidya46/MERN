import React, {useContext,useState} from 'react';
import { CardNumberElement,CardExpiryElement,CardCvcElement, useElements, useStripe } from '@stripe/react-stripe-js'
import axios from 'axios'
import {useHistory} from 'react-router-dom'
import { GlobalState } from '../../../GlobalState';
import Loading from '../utils/loading/Loading';


 function PaymentForm({user, cart, card, props}) {
    const state = useContext(GlobalState)
    const stripe = useStripe()
    const elements = useElements()
    const [total] = state.userAPI.total
    const [token] = state.token 
    const [loading, setLoading] = useState(false)
    const history = useHistory()


    const handleSubmit = async(e) => {
        e.preventDefault()
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: elements.getElement(CardNumberElement,CardExpiryElement,CardCvcElement)
        })
    
    if(!error) {
        try{
            const {id} = paymentMethod
            const response = await axios.post("/api/payment_card",{
                amount: total *100,
                id
            })

            if(response.data.success){
                //console.log("Successful Payment")
                setLoading(true)
                const res = await axios.post("/api/checkout_success",{
                    id, cart, user, total, method :'card'
                }, {
                    headers: {Authorization: token}
                })
                setLoading(false)
                if(res.data.status === "success"){history.push(`/success/${id}`)}
                
            }else{
                history.push(`/canceled/${id}`)
            }
        }catch(error){
            console.log('Error',error)
        }       
    }else{
        console.log(error.message)
    }
}
if(loading) return <div className="products"><Loading /></div>

    return (
        <div className='payment_container'>
        <b >Debit/Credit/ATM Card</b>
                <hr/>
                <form onSubmit={handleSubmit}>
                    <fieldset className="FormGroup">
                        <div className="first-row">
                        <CardNumberElement
                            options={{
                                placeholder:'Card Number',
                                showIcon: true,
                            
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#000',
                                        '::placeholder': {
                                        color: '#000',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                             }}
                        />
                        </div>
                        <div className="second-row row">
                            <div className="expiry">
                           <div style={{width:'17%',float:'left'}}> Expiry Date:</div>
                           <div style={{width:'83%', float:'right',borderBottom: '1px solid rgb(168, 161, 161)'}}>
                           <CardExpiryElement
                                options={{
                                placeholder:'mm/yy',                            
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#000',
                                        '::placeholder': {
                                        color: '#000',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                             }}
                            />
                            </div>
                            </div>
                            <div className="cvv row">
                            <div style={{width:'8%',float:'right'}}>cvv:</div>
                            <div style={{width:'92%', float:'left',borderBottom: '1px solid rgb(168, 161, 161)'}}> <CardCvcElement
                                options={{
                                placeholder:'***',                            
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#000',                                    
                                        '::placeholder': {
                                        color: '#000',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                             }}
                            /></div>
                            </div>
                           
                        </div>
                    </fieldset>
                    <p className="row">
                    <button type='submit' disabled={!card || !props} className=" btn btn-danger mt-1">Place your Order</button>
                    </p>
                </form>
                
        </div>
    );
}

export default PaymentForm;

/*<CardElement
options={{
    hidePostalCode: true,
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
            color: '#aab7c4',
                },
            },
        invalid: {
            color: '#9e2146',
                },
            },
        }}
/>*/
import axios from 'axios';
import React, {useContext, useState} from 'react';
import {GlobalState} from '../../../GlobalState'; 
import { useParams, useHistory } from 'react-router-dom'
import {Card} from 'react-bootstrap'
import { toast } from 'react-toastify'
import Loading from '../utils/loading/Loading';
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe('pk_test_51ImeGQSJnujPryRaKxxMSM5GK4OQMGf3vVFrWAXm7nItnhK2skjB07EzfAt6YGMP6asIvRRGOiHHjO1EhOyxIGpS00oScOTt7w');
toast.configure();


function Checkout() {
    const state = useContext(GlobalState)
    const [cart, setCart] = state.userAPI.cart
    const [total] =state.userAPI.total
    const [user] = state.userAPI.user
    const params = useParams()
    const history = useHistory()
    const [token] = state.token
    const [loading, setLoading] = useState(false)
    const [callback, setCallback] = useState(false)
    const [delivery, setDelivery] = useState(true)
    const [payment, setPayment] = useState(false)
    const [card, setCard] = useState(false)
    const [addresss, setAddress] = useState({
        address: '', postalCode: '', mobile:''
    })

    const onChangeInput = e => {
        const {name, value} = e.target;
        setAddress({...addresss, [name]: value})
    }
    const handleCallback = () => {
        setCallback(true)
    }
    const handlePayment= () => {
        setDelivery(false)
    }
    const handleSave = async e => {
        e.preventDefault()
        try {
            setLoading(true)
            await axios.post(`/user/address/${params.id}`,{...addresss, },{
                headers:{Authorization:token}
            })
            window.location.reload();
            setCallback(false)
            setAddress({ address:'', postalCode:'', mobile:''})
            setLoading(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }
    const cashondelivery = () => {
        setPayment(true)
        setCard(false)
    }
    const carddelivery = () => {
        setCard(true)
        setPayment(false)

    }
    const handleCashOnDelivery = async() => {
    setLoading(true)
        const response = await axios.post("/api/checkout_success",{
            total,
            cart,
            user,
            method:'cash'
        }, {
            headers: {Authorization: token}
            })
        setLoading(false)
       const {status,OrderId} =response.data
        if (status === 'success') {
            setCart([])
            history.push(`/success/${OrderId}`)
        }else{
            toast('somthing went wrong')
        }
        
    }

    if(loading) return <div className="products"><Loading /></div>
    return (
        <>
                <div className="container">
                        {user.address !== '' ?<Card style={{marginTop:15,backgroundColor:'pink', width: '18rem' }}>
                            <Card.Body>
                            <Card.Title>Shipping Address</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{user.address}</Card.Subtitle>
                            <Card.Text>{user.postalCode}</Card.Text>
                            <Card.Text>Contact:{user.mobile}</Card.Text>
                            </Card.Body>
                        </Card> : ''}
                    
        <div className="address">
        {
            callback ? 
            <form onSubmit={handleSave}>
              <h2>Shipping</h2>

              <label htmlFor="address">Address</label>
              <input type="text" name="address" id="address" required
              className="form-control mb-2" value={addresss.address}
              onChange={onChangeInput} />

              <label htmlFor="zipCode">Postal Code</label>
              <input type="text" name="postalCode" id="postalCode" required
              className="form-control mb-2" value={addresss.postalCode}
              onChange={onChangeInput} /> 

              <label htmlFor="mobile">Mobile</label>
              <input type="text" name="mobile" id="mobile" required
              className="form-control mb-2" value={addresss.mobile}
              onChange={onChangeInput} />
              <button className="btn btn-danger" type="submit">Save</button>
            </form>

            :
            <div onClick={handleCallback}>{user.address !== '' ?'+Edit Addres' : '+Add your Addres'}</div>
        }
        </div>
        <div className="row card_box">
        {
            cart.map( product => (
                <div key={product._id} className="products_card col-lg-3 col-md-4 col-sm-6 col-6">
                <div className="product_box">
                <b title={product.title}>{product.title}</b>
                <br/>
                <span>₹{product.price}</span>
                <p>{product.description}</p>
                <p>@{product.content}</p>
            </div>
            <div className="product_img">
                <img src={product.images[0].url} alt={product.images[0].url}/>
            </div>   
                </div>
           
            ))
        }
        </div>

        <div className="total">
                <p>       Sub Total: ₹{total}</p>
                <p>Delivery Charges: ₹ 0.00</p>
                <h5>       Total: ₹{total}</h5>
        </div>

        <div className="row card_container">
        {delivery ? <button className="btn btn-danger" disabled={user.address === ''} onClick={handlePayment} style={{textDecoration: 'none', marginBottom:10}}>Proceed to payment</button>
        :  <div>
            <div  className="payment_card "  onClick={cashondelivery}>
            <div className="product_box">
            <b>Cash On Delivery</b>
            <hr/>
            <p className="row">
                <button className="btn btn-danger" disabled={!payment || user.address === ''} onClick={handleCashOnDelivery} >Place Your Order</button>
            </p>
            </div>
        </div>

        <div onClick={carddelivery}>
                <Elements stripe={stripePromise}>
                        <PaymentForm user={user} cart={cart} props={user.address !== ''} card= {card}/>
                         </Elements>
                </div>
        </div>
}        </div>

        </div>
        </>
    );
}

export default Checkout;

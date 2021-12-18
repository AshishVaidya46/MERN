import axios from 'axios';
import React, {useState, useEffect, useContext} from 'react';
import {useParams, Link} from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import Back from '../../headers/icon/back.svg'
import Loading from '../utils/loading/Loading';


function OrderDetails() {
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history
    const [isAdmin] = state.userAPI.isAdmin
    const [orderDetails, setOrderDetails] = useState([])
    const [loading, setLoading] = useState(false)
    const params = useParams()


    useEffect(() => {
        if(params.id){
            history.forEach(item => {
                if(item._id === params.id) setOrderDetails(item)
            })
        }
    }, [params.id,history])

    useEffect(() => {
        history.forEach( item => {
            if(item.delivered){
                if( Math.round((new Date().getTime() - new Date(item.updatedAt).getTime()) / (1000 * 3600 * 24)) >= 6){
                   return handelReturnButton(item._id);
                }
            }
        })

})

const handelReturnButton = async(id) => {
    await axios.put('/api/returndisable',{id})
}

    const handleDelivered = async (id) => {
        await axios.put('/api/deliverycheckout',{id})
        setLoading(true)
        window.location.reload();
        setLoading(false)
    }

    const handlePaid = async (id) => {
        await axios.put('/api/paidcheckout', {id})
        setLoading(true)
        window.location.reload();
        setLoading(false)
    }

    const handleDispatch = async (id) => {
        await axios.put('/api/dispatch', {id})
        setLoading(true)
        window.location.reload();
        setLoading(false)
    }
    const handleCancle = async (id) => {
        await axios.put('/api/cancel', {id})
        setLoading(true)
        window.location.reload();
        setLoading(false)
    }

    const handelReturn = async (id) => {
        await axios.put('/api/return', {id})
        setLoading(true)
        window.location.reload();
        setLoading(false)
    }

    if(orderDetails.length === 0) return null
    if(loading) return <div className="products"><Loading /></div>

    return (
        <div className="container">
                <img style={{position: 'relative', width:'28px', marginTop:'5px'}} onClick={() => {window.history.back()}} src={Back} alt={Back} />
        <div className="container history-page">
            <table>
                <thead>
                    <tr style={{textAlign:'center'}}>
                        <th>Name</th>
                        <th>Order no#</th>
                        <th>Address</th>
                        <th>Postal Code</th>
                        <th>Contact</th>
                    </tr>
                </thead>
                <tbody>
                 <tr>
                        <td>{orderDetails.name}</td>
                        <td>{orderDetails._id}</td>
                        <td>{orderDetails.address}</td>
                        <td>{orderDetails.zipCode} </td>
                        <td>{orderDetails.contact} </td>
                    </tr>
                    
                </tbody>
            </table>

            <br/>
            
            <div className={`alert ${orderDetails.delivered && orderDetails.dispatch && 'alert-success'}
                         & alert ${!orderDetails.dispatch && !orderDetails.delivered && 'alert-danger'}
                         & alert ${orderDetails.cancel && 'alert-danger'}
                         & alert ${orderDetails.dispatch && !orderDetails.delivered && 'alert-warning'}
                        d-flex justify-content-between align-item-center` } role="alert">
                            {
                                !orderDetails.return && !orderDetails.cancel && !orderDetails.dispatch && !orderDetails.delivered && 'Packge Will be Delivered within 4 Days!!'
                            }
                            {
                                !orderDetails.return &&orderDetails.dispatch && orderDetails.delivered && `Delivered on ${new Date(orderDetails.updatedAt).toDateString()}`
                            }
                            {
                                !orderDetails.return && orderDetails.dispatch && !orderDetails.delivered && <p>Your package is out for delivery on:{new Date(orderDetails.updatedAt).toDateString()}</p>
                            }
                            {
                                orderDetails.return && <p> Return received. Processing your refund.
                                                        <br/>₹{orderDetails.cart[0].price} will refunded to your original payment
                                                           <br/>You will get refund within 6 working Days</p>
                            }
                            {
                                orderDetails.cancel && <p> This Package cannot delivered to your address.
                                                           <br /> Processing your refund
                                                           <br/>You will get refund within 6 working Days</p>
                            }
                            { 
                                !isAdmin && !orderDetails.cancel && !orderDetails.return && orderDetails.returnButton && <button className="btn btn-dark text-upercase" onClick={() => handelReturn(orderDetails._id)}>Return</button> 
                            }
                            {
                                isAdmin && !orderDetails.dispatch && !orderDetails.delivered && !orderDetails.cancel && <button onClick={() => handleCancle(orderDetails._id)} className="btn btn-dark text-upercase">cancel order</button>
                            }
                            {
                                isAdmin && orderDetails.dispatch && ! orderDetails.delivered &&
                                <button className="btn btn-dark text-upercase"
                                onClick={() => handleDelivered(orderDetails._id)}>
                                    Mark as delivered
                                </button>
                            }
                            {
                                isAdmin && !orderDetails.dispatch && !orderDetails.cancel && !orderDetails.return &&
                                <button className="btn btn-dark text-upercase"
                                onClick={() => handleDispatch(orderDetails._id)}>
                                    dispatch
                                </button>
                            }
            </div>

            <h3>Payment</h3>
            <div className={`alert ${orderDetails.paid  ? 'alert-success' : 'alert-danger'}
                        d-flex justify-content-between align-item-center`} role="alert">
                            {
                                orderDetails.paid  ? `Paid on ${new Date(orderDetails.createdAt).toDateString()}`  : 'Not Paid'
                            }
                            
                            {
                                isAdmin && !orderDetails.paid && 
                                <button className="btn btn-dark text-upercase"
                                onClick={() => handlePaid(orderDetails._id)}>
                                    Mark as Paid
                                </button>
                            }
            </div>
            
            <table style={{margin: "30px 0px"}}>
                <thead>
                    <tr>
                        <th></th>
                        <th >Products</th>
                        <th>product_id</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                
                <tbody>
                    {
                        orderDetails.cart.map(item =>(
                        <tr key={item._id}>
                            <td><Link  to={`/detail/${item._id}`}><img src={item.images[0].url} alt={item.images[0].url} /></Link></td>
                            <td>{item.title}</td>
                            <td>{item.product_id}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price * item.quantity}</td>
                        </tr>
                        ))
                    }
                    
                </tbody>
            </table>
        </div>
        {!isAdmin && orderDetails.return && <div className="row">
            <Link className="btn btn-danger" to={'/'}>
                continue shopping
            </Link>
        </div>}
        </div>
    )
}

export default OrderDetails;
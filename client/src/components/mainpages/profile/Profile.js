import React,{ useEffect, useContext, useState } from 'react'
import { GlobalState } from '../../../GlobalState'
import {Link}  from 'react-router-dom'
import UserImg from '../../headers/icon/user.svg'
import Success from '../../headers/icon/success.svg'
import Close from '../../headers/icon/close.svg'
import axios from 'axios'
import Loading from '../utils/loading/Loading';
import { toast } from 'react-toastify'

toast.configure();


function Profile() {
    const state = useContext(GlobalState)
    const [user] = state.userAPI.user
    const [udUser, setudUser] = useState({
        name: user.name, password:user.password
    })
    const [history] = state.userAPI.history
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [pending] = useState([])
    const [succesful] = useState([])
    const [callback] = state.userAPI.callback

    useEffect(() => {
        history.forEach(val => {
            if(!val.delivered && !val.dispatch && !val.cancel && !val.return){
                 pending.push(val) 
                } else if(val.delivered && !val.return){
                    succesful.push(val)
                }          
        })
    },[history, pending,succesful, callback])


    const onChangeInput = e => {
        const {name, value} = e.target;
        setudUser({...udUser, [name]:value})
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            setLoading(true)
            await axios.put(`/user/edit_user/${user._id}`, {...udUser}, {
                headers:{Authorization:token}
            });
            window.location.reload();
            toast('You have successfully placed an order.')
            setLoading(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }
    
    const handleDelete = async (id) => {
        try{
            if(window.confirm("Do you want to delete this order?")){
                setLoading(true)
        await axios.delete(`/user/history/${id}`, {
            headers:{Authorization:token}
        })
        setLoading(false)
        window.location.reload();
    }
    }catch (err){
        alert(err.response.data.msg)
    }
    }

    if(loading) return <div className="products"><Loading /></div>

    return (
        <div className="container profile_page">
            <title>Profile</title>
            <section className="row text-secondary my-3">
            <div className="container">
            
                <div className="col-md-4">
                <h3 className="text-center text-uppercase">
                        {isAdmin ? 'Admin Profile' : 'User Profile'}
                    </h3>
                <div className="avatar">
                        <img src={UserImg} 
                        alt="avatar" />
                        <span>
                            <p>Change</p>
                            <input type="file" name="file" id="file_up"
                            accept="image/*" />
                        </span>
                    </div>


                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name"  className="form-control"
                        placeholder={user.name} value={udUser.name} onChange={onChangeInput}/>

                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" defaultValue={user.email} 
                        className="form-control" disabled={true} />

                        <label htmlFor="password">New Password</label>
                        <input type="password" name="password"  className="form-control"
                        placeholder="Your new password" value={udUser.password} onChange={onChangeInput} />

                        <button type="submit" className="btn btn-danger" >
                            Update
                        </button>
                    </form>
                </div>


  <div className="history-page">
    <h5>Order History {history.length} </h5>

   {isAdmin && <div className=" container" style={{
            borderBottom: '1px solid crimson',
            paddingBottom: '6px'
            }}>
                <input type="text" value={search} placeholder="Order no" onChange={event => {setSearch(event.target.value)}} /> 
                <div className="row_category" >
                <button className="activate" style={{color: 'crimson'}} value='all' onClick={e => {setSearch(e.target.value)}}>All</button>
                <button style={{color: 'crimson'}} value='pending' onClick={e => {setSearch(e.target.value)}}>                          
                            <i className=" position-relative" aria-hidden="true">
                                    <span className="position-absolute"
                                    style={{
                                        padding: '3px 6px',
                                        background: '#ed143dc2',
                                        borderRadius: '50%',
                                        top: '-10px',
                                        left: '68px',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}>
                                        {pending.length}
                                    </span>
                        </i>
                    Pending
                </button>
                <button style={{color: 'crimson'}} value='dispatch' onClick={e => {setSearch(e.target.value)}} >
                    Dispatch
                </button>
                <button style={{color: 'crimson'}} value='cancel' onClick={e => {setSearch(e.target.value)}} >
                    Cancel
                </button>
                <button style={{color: 'crimson'}} value='return' onClick={e => {setSearch(e.target.value)}} >
                    Return
                </button>
                <button style={{color: 'crimson'}} value='successfull' onClick={e => {setSearch(e.target.value)}}>
                <i className=" position-relative" aria-hidden="true">
                                    <span className="position-absolute"
                                    style={{
                                        padding: '3px 6px',
                                        background: '#ed143dc2',
                                        borderRadius: '50%',
                                        top: '-10px',
                                        left: '100px',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}>
                                        {succesful.length}
                                    </span>
                        </i>
                    SuccessFull
                </button>   

            </div>
        </div>}
 
<div className="col-lg-12 col-md-12 col-sm-12 col-12 text-secondary table-responsive my-3">
  <table className="table my-3">
  <thead className="bg-light font-weight-bold">
                <tr style={{textAlign: 'center'}}>
                    <th className="p-2"></th>
                    <th className="p-2">Product</th>
                    <th className="p-2">Order no#</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Method</th>
                    <th className="p-2">Order Date</th>
                    <th className="p-2">Delivered</th>
                    <th className="p-2">Paid</th>
                    <th></th>
                </tr>
            </thead>
    <tbody >
      {
        // eslint-disable-next-line array-callback-return
        history.filter((val) => {
            if(search === "" || search === 'all'){
                return val
            }else if(val._id.includes(search)){
                return val
            }else if(!val.delivered && !val.dispatch && !val.cancel && !val.return && search === 'pending'){
                return val
            }else if( val.dispatch && !val.return && !val.delivered && search === 'dispatch'){
                return val
            }else if( val.cancel && search === 'cancel'){
                return val
            }else if(val.return && search === 'return'){
                return val
            }else if(val.delivered && !val.return && search === 'successfull'){
                return val
            }
        })
        .map( item => {
            return(
        item.cart.map( product => (
            
            <tr className={`alert ${item.cancel && 'alert-danger'}
             & alert ${ item.delivered && item.dispatch && 'alert-success'}
             & alert ${ item.dispatch && !item.delivered && 'alert-warning'}`} role="alert" key={product._id}>
        <td style={{width: '100px', overflow: 'hidden'}}>
        <Link style={{textDecoration: 'none', color:'black'}} to={`/history/${item._id}`}>
        <img src={product.images[0].url} alt={product.images[0].url}
        className="img-thumbnail w-100"
        style={{minWidth: '80px', height: '80px'}} />
        </Link>
    </td>

    <td style={{minWidth: '200px'}} className="align-middle" >
    {item.cancel ? '' :<Link style={{textDecoration: 'none', color:'black'}} to={`/history/${item._id}`}>
        <h5 className="text-capitalize text-secondary">
                {product.title}
        </h5>
        <p>{product.description}</p>
        <p>@{product.brand}</p>
        </Link>}
    </td>

    <td>
    <Link style={{textDecoration: 'none', color:'black'}} to={`/history/${item._id}`}>
        {item._id}
        <hr/>
        {isAdmin && <p>{item.paymentID}</p>}
        <p className='text-success'>
        {!item.return && item.dispatch && item.delivered && `Delivered on ${new Date(item.updatedAt).toDateString()}`}
        </p>
        <p className='text-dark'>
            {item.return && `Return requested on :${new Date(item.updatedAt).toDateString()}`}
        </p>
        <p className='text-danger'>
        { !item.return && !item.cancel && !item.dispatch && !item.delivered && 'Packge Will be Delivered within 4 Days!!'}
        </p>
        <p className='text-warning'>
        {!item.return && item.dispatch && !item.delivered && 'Your package is out for delivery'}
        </p>
        <br />

    </Link>
    </td>

    <td className="align-middle" style={{maxWidth: '80px'}}>
    <Link style={{textDecoration: 'none', color:'black'}} to={`/history/${item._id}`}>
    {item.cancel ? 'Your Order has been canceld '
    :    <h6 className="text-danger">₹{product.price * product.quantity}</h6>    
    }
    </Link>
    </td>
    
    <td>{item.method}</td>

    <td className="p-2">
        <Link  style={{textDecoration: 'none', color:'black'}} to={`/history/${item._id}`}>
            {new Date(item.createdAt).toDateString()}
        </Link>
     </td>
     <td className="p-2">
                        {
                            item.delivered
                                ? <img src={Success} alt={Success}  
                                style={{borderRadius: '50%', width: '20px', height: '20px',
                                       transform: 'translateY(-3px)', marginRight: '3px' }} />
                                : <img src={Close} alt={Close} 
                                style={{borderRadius: '50%', width: '20px', height: '20px',
                                       transform: 'translateY(-3px)', marginRight: '3px' }} />
                        }
    </td>
    <td className="p-2">
                        {
                            item.paid
                                ? <img src={Success} alt={Success}  
                                style={{borderRadius: '50%', width: '20px', height: '20px',
                                       transform: 'translateY(-3px)', marginRight: '3px' }} />
                                : <img src={Close} alt={Close} 
                                style={{borderRadius: '50%', width: '20px', height: '20px',
                                       transform: 'translateY(-3px)', marginRight: '3px' }} />
                        }
    </td>
    {isAdmin && <td className="p-2" >
        <button onClick={() => handleDelete(item._id)}>delete</button>
    </td>}   
    <hr />          
     </tr>
))
) })
      }
    </tbody>
  </table>
</div>
            
        </div>

        </div>
        </section>
        </div>
        
    );
}

export default Profile;

import React, {useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import {GlobalState} from '../../../GlobalState';
import ProductItem from '../utils/productItem/ProductItem';
import axios from 'axios';
import Loading from '../utils/loading/Loading';
import Back from '../../headers/icon/back.svg'
//import LoadMore from '../product/LoadMore';


function SearchProducts() {
    const state = useContext(GlobalState)
    const [products, setProducts] = useState([])
    const params = useParams();
    const [isAdmin] = state.userAPI.isAdmin
    const [token] =state.token
    const [callback, setCallback] = state.productAPI.callback
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState('')
    //const [page, setPage] = useState(1)
    const [search , setSearch] = useState('')
    const [isCheck, setIsCheck] = useState(false)
    const [calllback] = state.productAPI.callback
    
    useEffect(() => {
        const getProduct = async() => {
            setLoading(true)
            const res = await axios.get(`/api/products?${sort}`)
            if(params.name === 'All_Products'){
                setProducts(res.data.products)
              //  setResult(res.data.result)

            }else{
            setProducts ( res.data.products.filter(product => {
                return product.category === params.name.toUpperCase()
            })
            )  
           // setResult(res.data.result)

        }  
            setLoading(false)   
         }
    getProduct();

    },[calllback, params.name, sort])

    const handleCheck = (id) =>{
        products.forEach(product => {
            if(product._id === id) product.checked = !product.checked
        })
        setProducts([...products])
    }

    const deleteProduct = async(id, [images]) => {
       // console.log({id})
        try {
            setLoading(true)
            for(let i=0; i< images.length ; i++){
            const destroyImg = axios.post('/api/destroy', (images[i].public_id), {
                headers: {Authorization: token}
            })
            await destroyImg
        }
            const deleteProduct = axios.delete(`/api/products/${id}`, {
                headers: {Authorization: token}
            })

            await deleteProduct
            setCallback(!callback)
            setLoading(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }
    
    const checkAll = () =>{
        products.forEach(product => {
            product.checked = !isCheck
        })
        setProducts([...products])
        setIsCheck(!isCheck)
    }

    const deleteAll = () => {
        products.forEach(product => {
            if(product.checked) deleteProduct(product._id, product.images)

        })
    }
   
    if(loading) return <div className="products"><Loading /></div>

    return (
        <div className="container">
        <img style={{position: 'relative', width:'28px', marginTop:'5px'}} onClick={() => {window.history.back()}} src={Back} alt={Back} />
        <h2 style={{ textTransform: 'capitalize'}}> {products.length === 0 ? <p>No search found!!</p>
            :params.name}</h2><p>Total Items:{products.length}</p>
            <div style={{
            borderBottom: '1px solid crimson',
            paddingBottom: '6px'
            }}>
            {
                products.length === 0 ?''
            :<div className="filter_menu">
        <div className="row category">    
        <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value= ''>Newest</option>
                <option value= 'sort=oldest'>Oldest</option>
                <option value= 'sort=-sold'>Best Sales</option>
                <option value= 'sort=-price'>Price: High-Low</option>
                <option value= 'sort=price'>Price: Low-High</option>
            </select>
        </div>
        <div>
           {isAdmin && <input type="text" value={search} placeholder="Product Id" onChange={event => {setSearch(event.target.value)}} />} 
        </div>
    </div>
            }

            </div>

            {
            isAdmin && 
            <div className="delete-all">
                <span>Select all</span>
                <input type="checkbox" checked={isCheck} onChange={checkAll} />
                <button onClick={deleteAll}>{isCheck ? 'Delete All' : 'Delete'}</button>
            </div>
        }
        <div className="products ml-1  row">
        {
            // eslint-disable-next-line array-callback-return
            products.filter((val) => {
                if(search === ""){
                   return val
                }else if(val.product_id.includes(search)){
                    return val
                }
            }).map(product => {
                return <ProductItem key={product._id} product={product} 
                isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck}/>
            })
        }
        </div>
        </div>

    );
}

export default SearchProducts;

/*<div className="load_more">
            {
                result <= page * 7 ? "" : <button onClick={() => setPage(page+1)}>Load more</button>
            }
        </div> */
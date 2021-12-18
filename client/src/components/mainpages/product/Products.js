import React, {useContext, useEffect, useState} from 'react';
import {GlobalState} from '../../../GlobalState';
import ProductItem from '../utils/productItem/ProductItem';
import Loading from '../utils/loading/Loading';
import axios from 'axios';


function Product() {
    const state = useContext(GlobalState)
    const [products, setProducts] = useState([])
    const [isAdmin] = state.userAPI.isAdmin
    const [token] =state.token
    const [callback, setCallback] = state.productAPI.callback
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)
    const [page] = useState(1)

    useEffect(() => {

        const getproduct = async() => {
        const res = await axios.get(`/api/products?limit=${page*6}`)
        setProducts(res.data.products)
    }
    getproduct();
    }, [page])

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

    /*const filterItem = async(categItem) => {
        const items = await axios.get('/api/products')
        setLoading(true)

        if(categItem === 'All'){
            setProducts(items.data.products)
        }else{
        const updateItem = items.data.products.filter(curItem => {
            //console.log(curItem)
            return curItem.category === categItem;
        });
        setProducts(updateItem)
       }
       setLoading(false)
    }*/
    
    if(loading) return <div className="products"><Loading /></div>
    return (
        <>
        {
            isAdmin && 
            <div className="delete-all">
                <span>Select all</span>
                <input type="checkbox" checked={isCheck} onChange={checkAll} />
                <button onClick={deleteAll}>{isCheck ? 'Delete All' : 'Delete'}</button>
            </div>
        }

        <div className="container">
        <div className="products row">
        {
            products.map(product => {
                return <ProductItem key={product._id} product={product} 
                isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck}/>
            })
        }
        </div>
</div>
        </>
    );
}

export default Product;



/*<div className=" container" style={{
            borderBottom: '1px solid crimson',
            paddingBottom: '6px'
            }}>
            <div className="row_category" >
                <button style={{color: 'crimson'}} onClick={() => filterItem('All')}>All</button>
                <button style={{color: 'crimson'}} onClick={() => filterItem('laptop')}>laptop</button>
                <button style={{color: 'crimson'}} onClick={() => filterItem('apple')}>apple</button>
                <button style={{color: 'crimson'}} onClick={() => filterItem('Women')}>Women</button>
            </div>
        </div>*/
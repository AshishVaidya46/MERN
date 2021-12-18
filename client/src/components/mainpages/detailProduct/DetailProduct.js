import React, { useState,useContext, useEffect} from 'react';
import { useParams} from 'react-router-dom';
import {GlobalState} from '../../../GlobalState';
import ProductItem from '../utils/productItem/ProductItem';
import BtnRender from '../utils/productItem/BtnRender';
import Back from '../../headers/icon/back.svg'
import axios from 'axios';

//import LoadMore from '../product/LoadMore'

function DetailProduct() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [products,setProducts] = useState([])
    const [product] = state.productAPI.products
    const [tab, setTab] = useState(0)
    //const addCart = state.userAPI.addCart
    const [detailProduct, setDetailProduct] =useState([])
    const [page, setPage] = useState(1)
    const [isAdmin] = state.userAPI.isAdmin
    const [result] = state.productAPI.result

    useEffect(() => {
        
        const getProduct = async() => {
        const res = await axios.get(`/api/products?limit=${page*4}`)
        setProducts(res.data.products)
    }
    getProduct();
    }, [page, params.id])

    useEffect(() => {
        if(params.id){
            product.forEach(item => {
                if(item._id === params.id) setDetailProduct(item)
            })
        }
    }, [params.id, product])

    const reloadPage =() => {
        window.location.reload();
    }

    if(detailProduct.length === 0) return null;

    return (
        <div className="container box">
                <img style={{position: 'relative', width:'28px', marginTop:'5px'}} onClick={() => {window.history.back()}} src={Back} alt={Back} />

            <div className="title">
                <h5>{detailProduct.title}</h5>
                <h6>{detailProduct.description}</h6>
            </div>
            <div className="detail-img">
            <a href={detailProduct.images[tab].url} >
                <img src={detailProduct.images[tab].url} alt={detailProduct.images[tab].url}
                    className="d-block img-thumbnil rounded mt-4 w-100%"
                    style={{height: '350px'}} /> 
            </a>

            </div>
            <div className=" row d-flex justify-content-around mx-0 col-md-3 col-lg-4 ">
                {
                detailProduct.images.map((img, index) => (
                    <img key={index} src={img.url} alt={img.url}
                        className="img-thumbnail rounded"
                        style={{height: '80px', width: '20%'}}
                        onClick={() => setTab(index)}
                    />
                ))
                }
            </div> 

            <div className=" box-detail">
                {detailProduct.newPrice === 0 ? <p>Price: ₹ {detailProduct.price}</p> : <p><span> Price: ₹ {detailProduct.newPrice}</span> <span className="cancel_amount"> ₹ {detailProduct.price}</span></p> }
                <p>@{detailProduct.brand}</p>
                {isAdmin && <p>Sold: {detailProduct.sold}</p>}
                <hr />
                <p className="text-warning">In Stock </p>
                <hr />
                <p> Product Details:  {detailProduct.description}</p>
                <p>Size : -</p>
                <hr />
                <p>Product Material : {detailProduct.material} </p>
                <hr />
                <hr />
                <p>Return Policy : Easy return within 5 days of delivery.
                                  You wil get your refund within 6 working days.</p>

                <BtnRender product={detailProduct}/>
            </div>

            <div>
                <h2>Related products</h2>
                 <div onClick={() => reloadPage()} className="products row ml-1">
                    {
                        products.map(product => {
                        return product.category === detailProduct.category && product._id !== detailProduct._id
                        ? <ProductItem key={product._id} product={product} /> : null
                        })
                    }
                </div>
                <div className="load_more">
            {
                result <page * 5 ? ""
                :<button onClick={() => setPage(page+1)}>Load more</button>
            }
        </div>

            </div>
        </div>
    );
}

export default DetailProduct;
import React from 'react';
import BtnRender from './BtnRender';
import {Link} from 'react-router-dom';
import heart from '../../../headers/icon/heart.svg'

//import {Card} from 'react-bootstrap'


function ProductItem({product, isAdmin, deleteProduct, handleCheck}) {
   // console.log(product.images.length)

        return (
            <div className="product_card  col-lg-3 col-md-4 col-sm-6 col-6" >

            {
                isAdmin && <input type="checkbox" checked={product.checked}
                onChange={() => handleCheck(product._id)} />
            }
            <Link style={{textDecoration: 'none', color:'black'}} to={`/detail/${product._id}`}>

            <div className="product_box ">
            <Link style={{float:'right'}}><img src={heart} alt={heart} width='25'/></Link>

                <b title={product.title}>{product.title}</b>
                <br/>
                {product.newPrice === 0 ? <p>Price: ₹ {product.price}</p> : <p><span> Price: ₹ {product.newPrice}</span> <span className="cancel_amount"> ₹{product.price}</span></p> }
                <p>{product.description}</p>
                <p>@{product.brand}</p>
            </div>
            <div className="product_img">
                <img src={product.images[0].url} alt="" />
            </div>
            </Link>

            <BtnRender product={product} deleteProduct={deleteProduct} />
        </div>

    );
}

export default ProductItem;
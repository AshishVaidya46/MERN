import React from 'react';
import BtnRender from '../productItem/BtnRender';
import {Link} from 'react-router-dom';
import heart from '../../../headers/icon/heart.svg'

//import {Card} from 'react-bootstrap'


function SliderItems({product}) {
   // console.log(product.images.length)

        return (
            <div className="product_card " >
            <Link style={{textDecoration: 'none', color:'black'}} to={`/detail/${product._id}`}>

            <div className="product_box">
                <b title={product.title}>{product.title}</b>
                <Link style={{float:'right'}}><img src={heart} alt={heart} width='25'/></Link>
                <br/>
                <span>₹{product.price}</span>
                <p>{product.description}</p>
                <p>@{product.brand}</p>
            </div>
            <div className="product_img">
                <img src={product.images[0].url} alt={product.images[0].url}/>
            </div>
            </Link>

            <BtnRender product={product} />
        </div>

    );
}

export default SliderItems;
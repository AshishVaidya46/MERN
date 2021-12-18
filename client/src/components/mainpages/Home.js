import React, { useEffect,useContext, useState } from 'react';
import Filters from './product/Filters';
import {Card} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {GlobalState} from '../../GlobalState'
import SliderItems from '../mainpages/utils/sliderItems/SliderItems';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import Products from '../mainpages/product/Products'
import HomeImg from '../headers/icon/homeImg.jpg'
//import Loading from '../mainpages/utils/loading/Loading';


function Home() {

  const state = useContext(GlobalState)
  const [products, setProducts] = useState([])
  const [callback] = state.productAPI.callback
  const [categories] = state.categoriesAPI.categories
  const [page] = useState(1)


  useEffect(() => {
    const getProduct = async() => {
      const res = await axios.get(`/api/products?limit=${page*10}`)      
      setProducts ( res.data.products.filter(product => {
        return product.category === 'NECKLACE'
    })
      )
    }
    getProduct()
  },[callback, page])

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1300,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        }
      ],
  };
  //if(loading) return <div className="products"><Loading /></div>

    return (
        <div >
            <Filters /> 
            <img className="home_imge" 
                src= {HomeImg}
                alt={HomeImg}
            />
            <div className="container">

            <Link className="btn btn-light" style={{textDecoration:'none',
                    color: 'black',
                    fontSize: 'medium', 
                    float: 'right',
                    marginBottom:'10px'
                    }} to={`/products/${'All_Products'}`}>VIEW ALL</Link>
            <h2 style={{color: 'black',fontSize:'x-large',fontFamily:'sans-serif'}}> Newest Arrival </h2>
       <div>
         <Products />
       </div>
       <h2 style={{color: 'black', fontSize:'x-large',fontFamily:'sans-serif', textDecoration: 'none'}}>Search by Category </h2>

                <div className="row">
                { categories.map(category => (
                  <div key={category._id} className="card-container col-lg-4 col-md-4 col-6">
                <Link to={`/products/${category.name}`}>
                    <Card style={{width: '100%'}} className="bg-dark card text-white">
                    <Card.Img className="img" src={category.images.url} alt={category.images.url}/>
                    <Card.ImgOverlay>
                        <Card.Title className="row title">{category.name}</Card.Title>
                    </Card.ImgOverlay>
                    </Card>
                </Link>
                </div>
                ))
                  }
                </div>

                <h2><Link style={{color: 'rgba(37,36,36)',fontFamily:'sans-serif' , textDecoration: 'none'}} to={`/products/${'necklace'}`}>NeckLace</Link></h2>
        <div className="container" style={{marginBottom:'25px', background:'rgb(245, 241, 241)'}}>
        <Slider {...settings}>
        {
            products.map(product => {
            return <SliderItems key={product._id} product={product} />
            })
        }
        </Slider>
      </div>
        </div>
            </div>
           
    );
}

export default Home;
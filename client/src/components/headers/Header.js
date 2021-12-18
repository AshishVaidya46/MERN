import React, { useContext } from 'react';
import {GlobalState} from '../../GlobalState';
import Bag from './icon/bag.svg';
import Logo from './icon/logo.jpg'
import axios from 'axios';
import { Navbar, Nav, NavDropdown} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import heart from './icon/heart.svg'

function Header() {
   const state = useContext(GlobalState)
   const [isLogged] = state.userAPI.isLogged
   const [isAdmin] = state.userAPI.isAdmin
   const [cart] = state.userAPI.cart
   const [user] =state.userAPI.user
   const [categories] =state.categoriesAPI.categories
   //const [category, setCategory] = state.productAPI.category
   //const [search, setSearch] =state.productAPI.search



   const logoutUser = async () =>{
       await axios.get('/user/logout')
       localStorage.getItem('firstLogin')
       window.location.href = "/"
   }

   const adminRouter = () =>{
       return( 
           <>
               <Nav.Link style={{marginLeft:'15px'}}  href="/create_product">Create Product</Nav.Link>
               <Nav.Link style={{marginLeft:'15px'}}  href="/category" >Catogories</Nav.Link>
           </>
       )
   }
/*   const handleCategory = e => {
       //console.log(e.target.value)
       setCategory(e.target.value)
       setSearch('')
}*/
   const loggedRouter = () =>{
    return(
      <>
        <NavDropdown style={{marginLeft:'15px'}}  title={isAdmin ? 'Admin' : user.name} id="basic-nav-dropdown" >
         <NavDropdown.Item href="/profile">{isAdmin ? 'Orders' : 'Profile'}</NavDropdown.Item>
                    {
                        isAdmin &&  <NavDropdown.Item  href="/user_info">Users</NavDropdown.Item>
                    }
            <NavDropdown.Divider />
             <NavDropdown.Item  href="/" onClick={logoutUser}>Logout</NavDropdown.Item>
        </NavDropdown>

      </>
    )
  }


    return (
        <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/"><div style={{fontFamily:"cursive"}}><img src={Logo} alt={Logo} width="80"/>Elegnate</div></Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end" >
    <Nav className="mr-auto">      

      <Nav.Link active='true' style={{marginLeft:'15px'}} href="/">Home</Nav.Link>
                {
                    isLogged ? loggedRouter() : <Nav.Link style={{marginLeft:'15px'}}  href="/login">Login OR Register</Nav.Link>
                }
                <NavDropdown style={{marginLeft:'15px'}} title='categories' id="basic-nav-dropdown" >
        {categories.map(category =>(
            <div key={category._id}>
            <NavDropdown.Item href={`/products/${category.name}`}>{category.name}</NavDropdown.Item>
            </div>
        ))}
        </NavDropdown>
                <Nav.Link style={{marginLeft:'15px'}} href={`/products/${'All_Products'}`}>Products</Nav.Link>

                {isAdmin && adminRouter()}

            </Nav>
  </Navbar.Collapse>
  {
      isAdmin ? '' 
        :    <Nav.Link href="/wishlist">
                   <img src={heart} alt={heart} width='25'/>
               </Nav.Link>
  }
  {
                isAdmin ? ''
                :        <Nav.Link style={{marginLeft:'15px'}}  href="/cart">
                                <i className="fas fa-shopping-cart position-relative" aria-hidden="true">
                                    <span className="position-absolute"
                                    style={{
                                        padding: '3px 6px',
                                        background: '#ed143dc2',
                                        borderRadius: '50%',
                                        top: '-10px',
                                        right: '-10px',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}>
                                        {cart.length}
                                    </span>
                                </i> <img src={Bag} alt={Bag} width='25'/>
                        </Nav.Link>
            }
</Navbar>


    );
}

export default Header;

/*<NavDropdown style={{marginLeft:'15px'}}  defaultValue={category} title="Categories" id="basic-nav-dropdown">
            {
                categories.map(category => (
                    <NavDropdown.Item onClick={handleCategory} key={category._id}>
                    <option value={"category=" + category._id} key={category._id} >
                            {category.name}
                        </option>
                    </NavDropdown.Item>
                ))
            }
        </NavDropdown>*/
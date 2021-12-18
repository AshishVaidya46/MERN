import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from 'react-google-login'

function Login() {
    const [user, setUser] = useState({
        email:'', password:''
    })

    const onChangeInput = e => {
        const {name, value} = e.target;
        setUser({...user, [name]:value})
    }
    const loginSubmit = async e =>{
        e.preventDefault()
        try {
            await axios.post('./user/login', {...user})
            localStorage.setItem('firstLogin', true)
            window.location.href = "/";
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const responseGoogle = async(response) => {
        console.log(response)
        try {
            await axios.post('/user/google_login', {tokenId: response.tokenId})
            localStorage.setItem('firstLogin', true)
            window.location.href = "/";
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={loginSubmit}>
            <h2>Login</h2>
                <input type="email" name="email" required
                placeholder="Email" value={user.email} onChange={onChangeInput} />

                <input type="password" name="password" required autoComplete="on"
                placeholder="Password" value={user.password} onChange={onChangeInput}/>

                <div className="row">
                    <button type="submit">Login</button>
                </div>
            </form>
             <hr />
            <div className="social">
            <GoogleLogin
                clientId="37900642096-rfkt2c1lo568g3v1c4isdfch0jc75ks7.apps.googleusercontent.com"
                buttonText="Login With google"
                onSuccess={responseGoogle}
                cookiePolicy={'single_host_origin'}
            />
            </div>
            <hr />
            <p>New Customer ? <Link style={{ color:'black'}} to="/register" >Register Now</Link></p> 
        </div>
    );
}

export default Login;

/*user06 pass 9004274008 */
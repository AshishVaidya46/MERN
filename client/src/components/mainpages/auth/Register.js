import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'
import Valid from './valid'


function Register() {

    const [user, setUser] = useState({
        name:'', email:'', password: '',cf_password: '',address: '',
    })

    const onChangeInput = e =>{
        const {name, value} = e.target;
        setUser({...user, [name]:value})
    }

    const registerSubmit = async e =>{
        e.preventDefault()
        try {
            const errMsg = Valid(user)
            console.log(errMsg)
            if(errMsg){
                return alert(errMsg)
            }
            const res = await axios.post('/user/register', {...user})

            localStorage.setItem('firstLogin', true)
            window.location.reload();
            window.location.href = "/";
            alert(res.data.msg)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={registerSubmit}>
                <h2>Register</h2>
                <input type="text" name="name" required
                placeholder="Name" value={user.name} onChange={onChangeInput} />

                <input type="email" name="email" required
                placeholder="Email" value={user.email} onChange={onChangeInput} />

                <input type="password" name="password" required autoComplete="on"
                placeholder="Password" value={user.password} onChange={onChangeInput} />

                <input type="password" name="cf_password" required autoComplete="on"
                placeholder="Confirm Password" value={user.cf_password} onChange={onChangeInput} />

                <div className="row">
                    <button type="submit">Register</button>
                    <p>Already have an account? <Link style={{color:'black'}} to="/login">Login</Link></p>
                </div>
            </form>
        </div>
    )
}

export default Register
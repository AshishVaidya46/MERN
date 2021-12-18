import React, {useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'

function ActivationLink() {
    const {activation_token} = useParams()

    useEffect(() => {
        if(activation_token){
            const activationEmail = async () => {
                try {
                   await axios.post('/user/activation', {activation_token})
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
            activationEmail()
        }
    },[activation_token])

    return (
        <div className="active_page">
             <h2>Verification successful!!</h2>
             <p> Your Account is now activated.</p>
             <b>Go to Home and shop now</b>
        </div>
    )
}

export default ActivationLink

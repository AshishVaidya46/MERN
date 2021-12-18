import React from 'react'
import Facebook from '../headers/icon/facebook.svg'
import Instagram from '../headers/icon/instagram.svg'
import WhatsApp from '../headers/icon/whatsapp.svg'
import Address from '../headers/icon/address.svg'
import Contact from '../headers/icon/phone.svg'
import Mail from '../headers/icon/mail.svg'


function Footer() {
    return (
        <>
            <div className="footer">
            <div className="container row">
                <div className="aboutus col-lg-4 col-md-5 col-sm-12 col-12">
                    <h2>About Us</h2>
                    <p>Elegnate is an e-commerce website which sell only Imitation Jewellery,
                        We sell different brands of jewellery on our website.
                        <br/>
                        For Vendors: Sell your jewellery in all over india with Elegnate.
                        Send Mail for collaboration.
                        <br />
                        <b style={{textDecoration: 'underline'}}>Easy return / Fastest delivery / Secured</b></p>
                        <ul className="sci">
                            <li><img style={{width: '25px'}} src={Facebook} alt={Facebook}/></li>
                            <li><a href="https://www.instagram.com/elegnate/?utm_medium=copy_link"><img style={{width: '23px'}} src={Instagram} alt={Instagram}/></a></li>
                            <li><img style={{width: '23px'}} src={WhatsApp} alt={WhatsApp}/></li>
                        </ul>
                </div>
                <div className="quickLinks col-lg-4 col-md-6 col-sm-12 col-12 ">
                    <h2>Quick Link</h2>
                    <ul>
                        <li><a href="#!">Privacy Policy</a></li>
                        <li><a href="#!">Help</a></li>
                        <li><a href="#!">Terms & Conditions</a></li>
                    </ul>
                </div>
                <div className="info col-lg-3 col-md-6 col-sm-12 col-12">
                    <h2>Contact Info</h2>
                    <ul>
                        <li>
                            <span><img style={{width: '28px', marginRight:'3px'}} src={Address} alt={Address}/></span>
                            <span>35I/J Mugbhat Cross Lane,<br/></span>
                             <span style={{marginLeft:'35px'}}> Girgaon, Charni Road,<br/></span>
                             <span style={{marginLeft:'35px'}}> Mumbai:400004.</span>
                        </li>
                        <li>
                                <p><a href="tel:8369313194"><img style={{width: '15px'}}  src={Contact} alt={Contact}/>+91 8369313194</a><br/>
                                <a href="tel:8369313194"><img style={{width: '15px'}}  src={Contact} alt={Contact}/>+91 8369313194</a></p>
                        </li>
                        <li>
                            <p><a href="mailto:Elegnate@outlook.com"><img style={{width: '18px', marginRight:'8px'}}  src={Mail} alt={Mail}/>Elegnate@outlook.com</a></p>
                        </li>
                    </ul>
                </div>
                </div>
            </div>
            <div className=" copyright">
                    <p>Copyright © 2021 Elegnate. All Rights Reserved.</p>
                </div>
            </>
    );
}

export default Footer;
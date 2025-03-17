import { useState } from 'react'
import '../Styles/FrontPage.css'
import welcomeImage from '../gallery/glavna.jpg'
import firstImage from '../gallery/slika1.jpg'
import secondImage from '../gallery/slika2.jpg'
import thirdImage from '../gallery/slika3.jpg'
import instgram from '../gallery/instagram.png'
import tiktok from '../gallery/tiktok.png'
import { Link } from 'react-router-dom'
export const FrontPage = () => {

return(
        <div className='main'>
            <div className='welcome-container'>
                <img className='welcome-image' src={welcomeImage} alt="welcomeImage" />
            </div>
         <div className='sales'>
                <p className='title'>Items on sale!</p>
            <div className='items-on-sale'>
                <div className='item-one'>
                    <img src={secondImage} alt="firstImage" />
                    <Link className='nav-to-product'to={'/products'}>New collection</Link>
                </div>
                
                <div className='item-three'>
                    <img src={thirdImage} alt="thirdImage" />
                    <Link className='nav-to-product'to={'/products'}>Sale</Link>
                </div>
            </div>
        </div>   
      <footer>
        <div className='footer-options'>
            <p>Contact</p>
            <p>Store Policy</p>
            <p>Shipping & Returns</p>
            <p>How to order?</p>
        </div>
        <div className='subscribe-for-promotions'>
            <p>Enter your email here</p>
        <div className="subscribe-container">
            <input
            className='input-email'
            type="text"
            placeholder='example@monamour.com'
            />
            <button className='subscribe-button'>Subscribe</button>
    </div>
        </div>
      </footer>
    </div>
    )
}
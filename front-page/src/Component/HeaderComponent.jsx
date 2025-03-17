 import { useState } from 'react';
import '../Styles/Header.css'
import { Link } from 'react-router-dom';
export const HeaderComponent = () => {
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <header className='header'>
            <div className='logo-place'>
                <span className="material-symbols-outlined"
                onClick={() => setMenuVisible(true)}
                >menu</span>
                <div className={`dropdown-menu ${menuVisible ? 'visible': ''}`}>
                        <span 
                        className="material-symbols-outlined"
                        onClick={() => (setMenuVisible(false))}
                        >close
                        </span> 
                        <div className='options'>
                            <p>Home</p>
                            <p>New Collection</p>
                            <p>Sale</p>
                            <p>About</p>
                            <p>Contact</p>
                        </div>         
                </div>
            </div>
            <div className='title'>
                <Link to={'/'}>Monamour</Link>
            </div>
                <div className='header-navigation'>
                    <div className='cart-option'>
                    <Link className='login-nav' to={'/cart'}>Cart</Link>

                    <span className="material-symbols-outlined">shopping_cart</span>
                    </div>
                    <div className='login-option'>
                    <Link className='login-nav' to={'/login'}>Login</Link>
                    <span className="material-symbols-outlined">person</span>
                    </div>
                    
                </div>
            </header>
    )
}
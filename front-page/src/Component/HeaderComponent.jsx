 import { useEffect, useState } from 'react';
import '../Styles/Header.css'
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartProvider';
import { da, se, tr } from 'date-fns/locale';
import { useUser } from './UserProvider';
import MasterCard from '../gallery/masterCard.png'
import Visa from '../gallery/visa.png'
export const HeaderComponent = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [cartVisible, setCartVisible] = useState(false);
    const [mainProductPhoto,setMainProductPhoto] = useState([]);
    const [mainImage ,setMainImage] = useState(null);
    const [size ,setSize] = useState("L");
    const [userMenu, setUserMenu] = useState(false);
    const {cart,quantity, price, deleteFromCart} = useCart();
    const {user, userLogin,getUserFromCookie} = useUser();
    const [userImage, setUserImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(false);
    const [authErrorMessage, setAuthErrorMessage] = useState(false);
    const [succesMessage, setSuccesMessage] = useState(false);
    const [checkoutForm, setCheckoutForm] = useState(false);
    const [shippingAdress, setShippingAdress] = useState('');
    const [phoneNumber ,setPhoneNumber] = useState('');
    const [userCards, setUserCards] = useState([]);
    const [cardId,setCardId] = useState(0);
    const [selectedCard, setSelectedCard] = useState(0);
    const navigate = useNavigate();
    const getProductImage = (productId) => {
        const image = mainProductPhoto.find(image => image.productId === productId);
        return image ? image.base64Image : null;
    }; 
    async function getProfileImage() {
        try {
            const response = await fetch(`http://localhost:8080/api/user/profile-image/${user.id}`, {
                method: 'GET',
                credentials: 'include',
            })
            if (response.ok){
                const data = await response.text();  // Koristi response.text() umesto response.json()
                setUserImage(data)
                console.log(data)
            } else {
                console.log('Error happen!')
            }
        } catch (error) {
            console.log('Error happen while fetching user img!', error);
        }
    }
    async function getProductImages() {
        try {
            const response = await fetch('http://localhost:8080/api/products/productMainImage', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Received data: ', data);
                setMainProductPhoto(data);
            } else {
                console.log('Error occurred while trying to get product images');
            }
        } catch (error) {
            console.log('Error happened: ', error);
        }
    }
    async function createOrder() {
        const cartProducts = JSON.parse(localStorage.getItem('cart'))
        if (user === null){
            setAuthErrorMessage(true);
            return;
        } else if (cartProducts.length === 0){
            setErrorMessage(true);
            return;
        } else if (selectedCard === null || selectedCard === 0){
            console.log('You need to chose card before payment.')
            return;
        }
        const formattedProducts = cartProducts.map(product => ({
            productId: product.id,
            quantity: product.quantity
        }))
        const orderData = {
            userId: user?.id || 0,
            products: formattedProducts,
            createdAt: new Date().toISOString(),
            shippingAddress: shippingAdress,
            phoneNumber: phoneNumber,
            totalPrice: price,
            cardId: cardId
        }
        
        
        try {
            const response = await fetch('http://localhost:8080/api/confirmCheckout',{
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(orderData)
            })

            if (response.ok){
                const data = await response.text();
                console.log(JSON.stringify(data));
                setSuccesMessage(`Your order is created!`)
                setAuthErrorMessage(false);
                setErrorMessage(false)
            }
        } catch (error) {
            console.log("Error happen while creating checkout!:" , error);
        }
    }
    const handleDeleteFromCart  = (product) => {
        deleteFromCart(product);
    }
    async function logout() {
        try {
            const response = await fetch('http://localhost:8080/auth/logout', {
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok){
                const data = await response.text();
                userLogin(null);
                console.log(data);
                navigate('/');
            } else {
                console.log('Error happen while trying to logout user!')
            }
        } catch (error) {
            console.log('Error happen ', error);
        }
    }
    async function getUserPayments() {
        try {
            const response = await fetch(`http://localhost:8080/api/getYourPayments/${user.id}`,{
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok){
                const data = await response.json();
                console.log('Users cards: ', data)
                setUserCards(data);
            } else {
                console.log('Error happen while fetching cards!');
            }
        } catch (error) {
            console.log('Error happen ', error)
        }
    }
    
    useEffect(() => {
        getUserPayments();
    }, [checkoutForm])
    useEffect(() => {
            getUserFromCookie();
            getProductImages();
            getProfileImage();
        }, []);
useEffect(() => {
    getProfileImage();
}, [user])
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
                            <Link to={'/'}>
                            <p>Home</p>
                            </Link>
                            <Link to={'/products'}>
                            <p>New Collection</p>
                            </Link>
                            <Link to={'/products'}>
                            <p>Sale</p>
                            </Link>
                            <Link to={'/'}>
                            <p>About</p>
                            </Link>
                            <Link to={'/'}>
                            <p>Contact</p>
                            </Link>
                        </div>         
                </div>
            </div>
            <div className='title'>
                <Link to={'/'}>Monamour</Link>
            </div>
                <div className='header-navigation'>
                    <div className='cart-option'>
                    <span 
                    onClick={() => setCartVisible(!cartVisible)}
                    className="material-symbols-outlined">shopping_cart</span>

                    <div className={`cart ${cartVisible ? 'visible' : ''}`}>
                        <div  className='cart-header'>
                        <h2>Cart</h2>
                        <span
                        onClick={() => setCartVisible(false)}
                            className="material-symbols-outlined 
                            toggle-close-button"
                            >close
                        </span>
                        </div>

                        <div className='products'>
                            <ul>
                                {cart.map((product,index) => (
                                    <li
                                     className='show-product'
                                    key={index}>
                                        <div className='img-container'>
                                        <img src={getProductImage(product.id)} alt="" />
                                        </div>
                                        <div className='about-product'>
                                        <p>Name:{product.name}</p>
                                        <p>Price: {product.price}</p>
                                        <p>Size: {size}</p>
                                        <p>Quantity: {product.quantity}</p>
                                        <button
                                        onClick={() => handleDeleteFromCart(product)}
                                        >Delete from cart</button>
                                        {/* <input 
                                        className='input-quantity'
                                        type="number"
                                        value={product.quantity}
                                        min={1}
                                        /> */}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {checkoutForm && (
                            <div className='checkout-form'>
                                <div className='checkout-header'>
                                    <h1 className='checkout-title'>Confirm checkout</h1>
                                </div>
                                <div className='contact-information'>
                                    <div className='contact-input'>
                                    <h1>Phone number</h1>
                                    <input
                                    type='text'
                                    value={phoneNumber || ''}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder={user.phoneNumber}
                                    />
                                    </div>
                                    <div className='contact-input'>
                                        <h1>Adress *</h1>       
                                        <input
                                        type='text'
                                        value={shippingAdress || ''}
                                        onChange={(e) => setShippingAdress(e.target.value)}
                                        placeholder='Confirm shipping adress'
                                        />
                                    </div>

                                    {userCards.length > 0 ? (
                                        userCards.map((card) => {
                                                const isCardChosen = Number(card.id) === Number(selectedCard);
                                                return (
                                                    <div
                                                    onClick={() => {
                                                        setCardId(card.id)
                                                        setSelectedCard(card.id)}} 
                                                    key={card.id}
                                                    className={`user-card-information ${isCardChosen ? 'chosen': ''}`}>
                                                        <div className={`card-details`}>
                                                            <p>Card holder name</p>
                                                            <p>{card.cardHolderName}</p>
                                                        </div>
                                                        <div className='card-details'>
                                                            <p>Last four digits</p>
                                                            <p>{card.cardNumber.slice(-4)}</p>
                                                        </div>
                                                        <div className='card-details'>
                                                            <p>Type of card</p>
                                                        {card.typeOfCard === 'MasterCard' ? (
                                                            <img src={MasterCard} alt="" />
                                                        ): (
                                                            <img src={Visa} alt="" />
                                                        )}
                                                        </div>
                                                        
                                                    </div>
                                                )
                                        })
                                    ): (
                                        <div className='no-card-exception'>
                                        <p>You need to add a card to procide through payment!</p>
                                        <button
                                        onClick={() => navigate('/payment')}
                                        >Add card</button>
                                        </div>
                                    )}
                                </div>

                                
                                <div className='pay-button'>
                                        <button
                                        onClick={() => setCheckoutForm(false)}
                                        >Close</button>
                                        <button
                                        onClick={createOrder}
                                        >Pay</button>
                                </div>
                            </div>
                            )}
                        </div>
                        <div className='cart-info'>
                        <p>Total price: {price} </p>
                        <button 
                        // onClick={() => createOrder()}
                        onClick={() => setCheckoutForm(true)}
                        className='checkout-button'>Checkout</button>
                        {authErrorMessage || errorMessage ? (
                            <p>{authErrorMessage ? 'You need to be logged in!': "There are no products in your basket!"}</p>
                        ): (
                            <p>{succesMessage}</p>
                        )}
                        </div>
                        
                    </div>
                    </div>
                    {user === null ? (
                    <div className='login-option'>
                    <span 
                    onClick={() => navigate('/login')}
                    className="material-symbols-outlined">person
                    </span>
                    </div>
                    ): (
                        <div className='login-option'>
                            <img
                            onClick={() => setUserMenu(!userMenu)}
                            src={userImage} alt="img" />
                            <div className={`user-option ${userMenu ? 'visible' : ''}`}>
                                <ul className='list-of-options'>
                                    <li className='option'>
                                        <Link to={'/profileSettings'}>
                                        <p>Profile</p>
                                        </Link>

                                        <Link to={'/notifications'}>
                                        <p>Notification</p>
                                        </Link>
                                        <p
                                        onClick={() => logout()}
                                        >Logout</p>
                                    </li>
                                </ul>
                            </div>
                    </div>
                    )}
                    
                    
                </div>
            </header>
    )
}
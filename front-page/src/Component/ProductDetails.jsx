import '../Styles/ProductDetails.css'
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import image from '../gallery/slika1.jpg'
import { ca, da } from 'date-fns/locale';
import { useCart } from './CartProvider';
export const ProductDetails = () => {
    const {id} = useParams();
    const [product,setProduct] = useState(null);
    const [name, setName] = useState(null);
    const [colors,setColors] = useState([]);
    const [size, setSize] = useState([]);
    const [priceOfProduct, setpriceOfProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0)
    const [quantity, setQuantity] = useState(0);
    const {cart,addToCart,price} = useCart();
    const navigate = useNavigate();

    async function fetchProductDetails() {
        try {
            const response = await fetch(`http://localhost:8080/api/findProduct/${id}`,{
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok){
                const data = await response.json();
                setProduct(data);
                setName(data.name);
                let arrayOfSizeString = data.size.split(',');
                setSize(arrayOfSizeString);
                let collorsOfProduct = data.color.split(',');
                setColors(collorsOfProduct);
                setpriceOfProduct(data.price);
                console.log(data)
            } else {
                console.log('Error happen while fetching product!')
            }
        } catch (error) {
            console.log('Error happen:', error);
        }
    }

    async function fetchProductImages() {
        try {
            const response = await fetch(`http://localhost:8080/api/productsImage/${id}`, {
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok){
                const data = await response.json();
                setImages(data);
                console.log('Images: ', data);
            } else {
                console.log('Error happen while fetching images!')
            }
        } catch (error) {
            console.log('Error: ', error)
        }
    }

    const handleAddToCart = (quantity) => {
        if (product) {
            addToCart(product,quantity);
            console.log("Added to cart:", product);
        } else {
            console.log("Product is null, can't add to cart");
        }
    }
    

    const nextImage = () => {
        setCurrentIndex((currentIndex) => 
            currentIndex === images.length - 1 ? 0: currentIndex + 1
        );
    }
    const previousImage = () => {
        setCurrentIndex((currentIndex) => 
        currentIndex === 0 ? images.length - 1: currentIndex - 1
        );
    }

    useEffect(() => {
        fetchProductDetails();
        fetchProductImages();
    },[id])
    return (
        <div className='product-page'>
            <div className="product-details">
                <div className='image-container'>
                {images.length > 0 ? (
                    <img src={images[currentIndex].base64Image} alt="photo" />
                    ):(
                        <p>Loading image...</p>
                    )}
                    <div className='more-photos'>
                    <span
                    onClick={previousImage}
                    className="material-symbols-outlined">
                    keyboard_arrow_left
                    </span>
                    <span 
                    onClick={nextImage}
                    className="material-symbols-outlined">
                    keyboard_arrow_right
                    </span>
                    </div>
                </div>

                    <div className='product-info'>
                                <h1>{name}</h1>
                                <p>{priceOfProduct}EUR</p>  
                                <p>Size:</p>
                            <div 
                            className='size-container'
                            >
                        {size.map((size, index) => (
                            <button key={index}>{size}</button>
                        ))}
                        </div>

                        <div className='colors'>
                        {colors.map((color,index) => (
                            <div 
                            className='circle'
                            key={index}
                            style={{backgroundColor: color}}
                            ></div>
                        ))}
                        </div>
                        <div className='quantity-input'>
                            <p>Quantity</p>
                            <input 
                            className='quantity'
                            type="number"
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            min={1}
                             />
                        </div>

                        <button 
                         onClick={() => handleAddToCart(quantity)}
                        className='add-to-cart'>Add to Cart
                        </button>

                </div>
            </div>
        </div>
    )
}
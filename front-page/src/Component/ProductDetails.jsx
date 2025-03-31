import '../Styles/ProductDetails.css'
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import image from '../gallery/slika1.jpg'
import { da } from 'date-fns/locale';
export const ProductDetails = () => {
    const {id} = useParams();
    const [name, setName] = useState(null);
    const [colors,setColors] = useState([]);
    const [size, setSize] = useState([]);
    const [price, setprice] = useState(null);
    const [images, setImages] = useState([]);
    
    async function fetchProductDetails() {
        try {
            const response = await fetch(`http://localhost:8080/api/findProduct/${id}`,{
                method: 'GET'
            })
            if (response.ok){
                const data = await response.json();
                setName(data.name);
                let arrayOfSizeString = data.size.split(',');
                setSize(arrayOfSizeString);
                let collorsOfProduct = data.color.split(',');
                setColors(collorsOfProduct);
                setprice(data.price);
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
                method: 'GET'
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
    const readCollor = (color) =>{
        console.log(color)
    }
    useEffect(() => {
        fetchProductDetails();
        fetchProductImages();
    },[id])
    return (
        <div className='product-page'>
            <div className="product-details">
                    {images.length > 0 ? (
                    <img src={images[0].base64Image} alt="photo" />
                    ):(
                        <p>Loading image...</p>
                    )}

                    <div className='product-info'>
                                <h1>{name}</h1>
                                <p>{price}EUR</p>  
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
                            onClick={() => readCollor(color)}
                            style={{backgroundColor: color}}
                            ></div>
                        ))}
                        </div>
                        <div className='quantity-input'>
                            <p>Quantity</p>
                            <input 
                            className='quantity'
                            type="number"
                            min={1}
                             />
                        </div>

                        <button className='add-to-cart'>Add to Cart</button>
                    </div>
            </div>
        </div>
    )
}
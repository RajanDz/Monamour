import '../CSS/ProductDetails.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { da } from 'date-fns/locale';

export const ProductDetails = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [images, setImages] = useState([]);
    const [price, setPrice] = useState("");
    const [message, setMessage] = useState(""); // Poruka za korisnika
    const [replaceImage, setReplaceImage] = useState([]);
    const [replacedImageId, setReplacedImageId] = useState(null);
    const handleFileChange = (event) => {
        setReplaceImage((prevImages) => [...prevImages, ...Array.from(event.target.files)])
    }
    async function fetchProductDetails() {
        try {
            const response = await fetch(`http://localhost:8080/api/findProduct/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setProduct(data);
                setName(data.name);
                setColor(data.color);
                setSize(data.size);
                setPrice(data.price);
            } else {
                setMessage("Failed to load product details.");
            }
        } catch (error) {
            setMessage("There was an error loading the product.");
        }
    }

    async function getProductImages() {
        try {
            const response = await fetch(`http://localhost:8080/api/productsImage/${id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json(); // Receiving data as an array of objects
                console.log('Received data: ', data);
                // Store base64Image and productId together in the images array
                const imageList = data.map((item) => ({
                    imageId: item.imageId,
                    base64Image: item.base64Image
                     // Ensure productId is included
                }));
                setImages(imageList);
            } else {
                console.log("Error happened while trying to get product images");
            }
        } catch (error) {
            console.log("Error happened: ", error);
        }
    }
    
    async function editProductDetails() {
        const formData = new FormData();
            formData.append("id", id);
            formData.append("name", name);
            formData.append("color", color);
            formData.append("size", size);
            formData.append("price", price);
            if (replaceImage.length > 0){
                formData.append("replacedImage", replacedImageId )
                replaceImage.forEach((image) => {
                    formData.append("images", image);
                })
            }
            
        try {
            const response = await fetch('http://localhost:8080/api/editProductDetails', {
                method: 'POST',
                body: formData,
            })
            if (response.ok){
                const data = await response.json();
                fetchProductDetails();
                console.log(data);
            }else {
                console.log("Failed to edit details of product");
            }
        } catch (error) {
            console.error('There was an error!', error);
        }
    }
    async function deleteImageOfProduct(imageId) {
        try {
            const response = await fetch(`http://localhost:8080/api/deleteImageofProduct/${imageId}`,{
                method: 'DELETE'
            });
            if (response.ok){
                const data = await response.json();
                console.log('Successfully deleted: ', data);
            } else {
                console.log('Error happen');
            }
        } catch (error) {
            console.log('Error happen: ', error);
        }
        
    }
    const saveImageId = (imageId) => {
        setReplacedImageId(imageId);
        console.log("Test id-a: ",imageId);
    }

    useEffect(() => {
        if (!user) {
            console.log("You need to be logged in to access this page");
            navigate('/login');
        } else {
            fetchProductDetails();
            getProductImages();
        }
    }, [user, navigate]);

    return (
        <div className="product-details-container">
            <div className="product-info">
                    {product ? (
                    <>
                        <h2>{product.name}</h2>
                        <p><strong>Color:</strong> {product.color}</p>
                        <p><strong>Size:</strong> {product.size}</p>
                        <p><strong>Price:</strong> ${product.price}</p>
                    <div className="product-images">
                         <ul className="images">
                            {images.map((image, index) => (
                                <li 
                                className='image'
                                key={index}>
                                    <img src={image.base64Image} alt={`Product Image ${index + 1}`} />
                                    <div className='edit-photo-button'>
                                        <input 
                                        type="file" 
                                        multiple
                                        hidden
                                        id='fileInput'
                                        onChange={handleFileChange}
                                        />
                                        <button
                                        className='replace-button'
                                         onClick={() => {
                                            saveImageId(image.imageId);
                                            document.getElementById('fileInput').click()}}>Replace photo</button>
                                            <button onClick={() => deleteImageOfProduct(image.imageId)}>Delete photo</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    </>
                ) : (
                    <p>{message}</p>
                )}
            </div>

            <div className="details">
                {product && (
                    <>
                        <h3>Edit Product Details</h3>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Product Name"
                        />
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="Product Color"
                        />
                        <input
                            type="text"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            placeholder="Product Size"
                        />
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Product Price"
                        />
                        <button onClick={editProductDetails}>Save Changes</button>

                        {message && <p className="message">{message}</p>}
                    </>
                )}
            </div>
        </div>
    );
};

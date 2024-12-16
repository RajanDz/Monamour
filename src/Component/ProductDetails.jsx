import '../CSS/ProductDetails.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

export const ProductDetails = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState("");
    const [message, setMessage] = useState(""); // Poruka za korisnika

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
                setProduct(data);
                setName(data.name);
                setColor(data.color);
                setSize(data.size);
                setImage(data.image);
                setPrice(data.price);
            } else {
                setMessage("Failed to load product details.");
            }
        } catch (error) {
            setMessage("There was an error loading the product.");
        }
    }
    async function editProductDetails() {
        try {
            const response = await fetch('http://localhost:8080/api/editProductDetaoils', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    name: name,
                    color: color,
                    size: size,
                    price: price,
                    image: image
                })
            })
            if (response.ok){
                const data = await response.json();
                console.log(data);
            }else {
                console.log("Failed to edit details of product");
            }
        } catch (error) {
            console.error('There was an error!', error);
        }
    }
    useEffect(() => {
        if (!user) {
            console.log("You need to be logged in to access this page");
            navigate('/login');
        } else {
            fetchProductDetails();
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
                        <img src={product.image} alt={product.name} />
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
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Product Price"
                        />
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="Product Image URL"
                        />

                        <button onClick={editProductDetails}>Save Changes</button>

                        {message && <p className="message">{message}</p>}
                    </>
                )}
            </div>
        </div>
    );
};

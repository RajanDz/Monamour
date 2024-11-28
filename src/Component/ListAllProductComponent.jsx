import { useState } from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';  // Za navigaciju
import { useEffect } from 'react';
import { CreateProduct } from './CreateProductComponent';
import { Link } from 'react-router-dom';
import '../CSS/ListAllProducts.css'
export const ListAllProduct = () => {
    const {user} = useUser();
    const navigate = useNavigate();  // Za navigaciju na login ako je korisnik null
    const [products, setProducts] = useState([]);  // Držimo listu proizvoda u stanju
    const [productName,setProductName] = useState("");
    const [deleteButton, setDeleteButton] = useState(false);
    const [message,setMessage] = useState("");
    const [reason, setReason] = useState("");


    const toggleDeleteButton = () => {
        setDeleteButton(!deleteButton)
    }
    async function deleteProducts() {
        console.log(user.user.id)
    
        try {
            const response = await fetch('http://localhost:8080/api/deleteAllProducts', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.user.id,  // Koristite user.id direktno
                    reason: reason      // Prolazimo razlog za brisanje
                })
            });
    
            if (response.ok) {
                const data = await response.json();
                setMessage("Products are deleted.");
                console.log(data);  // Logujte podatke koji su vraćeni sa servera
            } else {
                setMessage("Failed to delete products.");
            }
        } catch (error) {
            setMessage('There was an error!');
            console.error('There was an error!', error);
        }
    }
    
    
    async function getAllProducts() {
        try {
            const response = await fetch('http://localhost:8080/api/products',{
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok){
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            setProducts(data);
        } catch (error) {
            console.error('There was an error!', error);
        }
}

const searchProduct = () => {
const filteredProducts = products.filter(product  => product.name.toLowerCase().includes(productName.toLowerCase()));
setProducts(filteredProducts);
}
useEffect(() => {
    if (!user){
        console.log("You need to be logged in to acces this page");
        navigate('/login');
    } else {
        console.log("User details:", user); // Ispisivanje user objekta
        getAllProducts();
    }
}, [user, navigate]);  

return (
    <div>
      <div className='search-buttons'>
    <div className='search-container'>
        <input
            type="text"
            placeholder='name'
            onChange={(e) => setProductName(e.target.value)}
        />
        <button className='submit-product' onClick={searchProduct}>Submit</button>
    </div>

        <div className='products-buttons'>
    <Link to={'/createProduct'}>
    <button>Create products</button>
    </Link>
    <button onClick={toggleDeleteButton}>Delete products</button>
    <button className='refresh-button' onClick={getAllProducts}>Refresh Products</button>
        </div>

    {deleteButton && (
    <div className='deleteProducts'>
        <div>
            <input 
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="reason"
            />
        </div>
        <button className='delete-button' onClick={deleteProducts}>Submit</button>
        {message && <p>{message}</p>}
    </div>
    )}
</div>


        <ul className='products'>
            {products.map((product, index) => (
                <li key={index}>
                    <p>{product.name}</p>
                    <p>{product.price}</p>
                    <img className='img' src={product.image} alt="error" />
                </li>
            ))}
        </ul>
    </div>
);
};

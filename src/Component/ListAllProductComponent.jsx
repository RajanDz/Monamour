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
    const [mainProductsPhoto, setMainProductsPhoto] = useState([]);

    const toggleDeleteButton = () => {
        setDeleteButton(!deleteButton)
    }
    const getProductImageById = (productId) => {
        const image = mainProductsPhoto.find(image => image.productId === productId);
        return image ? image.base64Image : ''; // Ako ne postoji slika, vraćamo praznu string
    };
    async function deleteProduct(product_id) {
        try {
            const response = await fetch("http://localhost:8080/api/deleteOneProduct",{
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.user.id,
                    product_id: product_id
                })
            })
            if (response.status === 200){
                const data = await response.json();
                console.log('Product is deleted!')

             } else if (response.status === 500) {
                console.log('Failed to delete product!')
            }
        } catch (error) {
            console.error('There was an error!', error);
        }
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
    async function getProductImages() {
        try {
            const response = await fetch(`http://localhost:8080/api/productMainImage`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });
    
            if (response.ok) {
                const data = await response.json(); 
                console.log('Recived data: ',data);
                setMainProductsPhoto(data);
            } else {
                console.log("Error happened while trying to get product images");
            }
        } catch (error) {
            console.log("Error happened: ", error);
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
        getProductImages();
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
                <button className='create-button'>Create products</button>
            </Link>
             <button onClick={toggleDeleteButton}>Delete products</button>
             <Link to={'/auditLogs'}>
             <button>Audit Logs</button>
             </Link>
            <button className='refresh-button' onClick={getAllProducts}>Refresh Products</button>
    </div>

    {deleteButton && (
    <div className='delete-products'>
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
                    <p>Name: {product.name}</p>
                    <p>Cijena: {product.price}e</p>
                    <img className='img' src={getProductImageById(product.id)} alt="error" />
                    <Link to={`/productDetails/${product.id}`}>
                    <button className='edit-button'>Edit</button>
                    </Link>
                    <button className='delete-button' onClick={() => deleteProduct(product.id)}>Delete</button>
                </li>
            ))}
        </ul>
    </div>
);
};

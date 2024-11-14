import { useState } from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';  // Za navigaciju
import { useEffect } from 'react';
import '../CSS/ListAllProducts.css'
export const ListAllProduct = () => {
    const {user} = useUser();
    const navigate = useNavigate();  // Za navigaciju na login ako je korisnik null
    const [products, setProducts] = useState([]);  // Držimo listu proizvoda u stanju
    const [productName,setProductName] = useState("");

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
    <button className='refresh-button' onClick={getAllProducts}>Refresh Products</button>
</div>


        <ul className='products'>
            {products.map((product, index) => (
                <li key={index}>
                    <p>{product.name}</p>
                    <p>{product.price}</p>
                    <img className='img' src={product.image} alt="error" />
                    {console.log(product.im)}
                </li>
            ))}
        </ul>
    </div>
);
};

import { useState } from 'react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';  // Za navigaciju
import { useEffect } from 'react';
export const ListAllProduct = () => {
    const {user} = useUser();
    const navigate = useNavigate();  // Za navigaciju na login ako je korisnik null
    const [products, setProducts] = useState([]);  // Držimo listu proizvoda u stanju


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
        <h1>Product List</h1>
        <ul>
            {products.map((product, index) => (
                <li key={index}>
                    {product.name} - ${product.price}
                </li>
            ))}
        </ul>
    </div>
);
};

import '../CSS/CreateProduct.css';
import { useState } from "react";

export const CreateProduct = () => {
    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState("");
    const [message,setMessage] = useState("");

    async function createProduct() {
        try {
            const response = await fetch('http://localhost:8080/api/createProduct',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name,color,size,image,price}),
            });
            const data = await response.json();
            if (response.ok){
                console.log(`Product with name ${name} is created`)
                setMessage(`You have successfully added a product.  ${name}`);
                return data;
            } else {
                console.log(`Product with name ${name} is  failed to created`);
                setMessage(`Product with name ${name} is  failed to created`);

            }
        } catch (error) {
            console.error("Login failed:");
        }
    }

    return (
        <div className='createProduct'>
            <div>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // Ažurira stanje za name
                    placeholder="Name"
                />
            </div>

            <div>
                <input 
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)} // Ažurira stanje za color
                    placeholder="Color"
                />
            </div>

            <div>
                <input 
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)} // Ažurira stanje za size
                    placeholder="Size"
                />
            </div>

            <div>
                <input 
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)} // Ažurira stanje za image URL
                    placeholder="Image URL"
                />
            </div>

            <div>
                <input 
                    type="number" // Koristimo type="number" za unos cene
                    value={price}
                    onChange={(e) => setPrice(e.target.value)} // Ažurira stanje za price
                    placeholder="Price"
                />
            </div>

            <button onClick={createProduct}>Submit</button>

            {message && <p className='message'>{message}</p>}
        </div>
    );
};

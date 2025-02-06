import '../CSS/CreateProduct.css';
import { useState } from "react";

export const CreateProduct = () => {
    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [images, setImages] = useState([]);
    const [price, setPrice] = useState(0);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setImages((prevImages) => [...prevImages,...Array.from(e.target.files)]);
        console.log("Files: ", e.target.files);
        console.log("Files array: ", Array.from(e.target.files));
    };

    async function createProduct() {
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("color", color);
            formData.append("size", size);
            formData.append("price", price);

            images.forEach((image) => {
                formData.append("images", image); 
            });

            const response = await fetch('http://localhost:8080/api/createProduct', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`Product created successfully:`, data);
                setMessage(`Product "${name}" successfully created.`);
                return data;
            } else {
                console.error("Failed to create product.");
                setMessage(`Failed to create product "${name}".`);
            }
        } catch (error) {
            console.error("Error while creating product:", error);
            setMessage("An error occurred while creating the product.");
        }
    }

    return (
        <div className='createProduct'>
            <div>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
            </div>

            <div>
                <input 
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Color"
                />
            </div>

            <div>
                <input 
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="Size"
                />
            </div>
            
            <div>
                <input 
                    type="file"
                    multiple
                    hidden
                    id='fileInput'
                    onChange={handleFileChange}
                />
                <button 
                    className='add-image' 
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    +
                </button>
            </div>
            {images.length > 0 && (
    <div className='img-container'>
        {images.map((image, index) => {
            return (
                <img 
                    className='product-image'
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Image ${index}`}
                />
            );
        })}
    </div>
)}
            <div>
                <input 
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price"
                />
            </div>
            
            <button onClick={createProduct} className='submit-button'>Submit</button>

            {message && <p className='response-message'>{message}</p>}

            {/* Dodatni pregled fajlova */}
            {images.length > 0 && (
                <div className='file-preview'>
                    <h4>Selected Files:</h4>
                    <ul>
                        {images.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

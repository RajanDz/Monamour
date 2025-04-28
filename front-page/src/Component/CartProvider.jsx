// src/components/CartProvider.js
import { ca } from "date-fns/locale";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = JSON.parse(localStorage.getItem('cart'));
            return savedCart ? savedCart : [];
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
        return [];
        }
        
    });
    const [price, setPrice] = useState(0);
    const [quantity,setQuantity] = useState(0);



    const addToCart = (product,quantity) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(p => p.id === product.id);
            let updatedCart;
            if (existingProduct){
                updatedCart = prevCart.map(p => 
                    p.id === product.id ? {...p, quantity: (p.quantity || 0) + Number(quantity)}: p)
            } else {
                updatedCart = [...prevCart, {...product,quantity}];
            }
            return updatedCart
        })
    };
    const deleteFromCart = (product) => {
        setCart((prevCart) => {
            const findProduct = prevCart.findIndex(p => p.id === product.id);
            const updatedCart = [...prevCart];
            updatedCart.splice(findProduct,1);
            return updatedCart
        })
    }
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setPrice(total);
        console.log("Cart:", cart)
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, price,quantity,setQuantity, addToCart,deleteFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

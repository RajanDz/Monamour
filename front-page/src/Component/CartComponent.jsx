import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";


export const CartComponent = () => {
    const {cart} = useCart();


    return (
        <div>
            {cart.map((product, index) => (
                <li key={index}>
                    <p>{product.name}</p>
                </li>
            ))}
        </div>
    );
};

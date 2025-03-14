import '../CSS/NavigationBar.css'
import { useState } from 'react';
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';
import { ListAllProduct } from './ListAllProductComponent';
export const NavigationBar = () => {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [isSectionOpen, setisSectionOpen] = useState(false);

    const toggleDropdown  = () => {
        setIsOpen(!isOpen);
    }; // Koristi useUser hook
    const toggleNavBar  = () => {
        setisSectionOpen(!isSectionOpen);
    }; // Koristi useUser hook

    return (
        <div>
             <div className="nav-bar">
                <ul>
                    <li>
                        <Link to="/products">Products</Link>
                        <Link to="/users">Users</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

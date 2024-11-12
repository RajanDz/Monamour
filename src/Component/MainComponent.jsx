import '../CSS/Main.css'
import { useState } from 'react';
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';
export const MainComponent = () => {
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
            {user ? (
                <div className='user-details'>
                    <h1 className='menu' onClick={toggleNavBar}>Menu</h1>
                    <h1 onClick={toggleDropdown}>{user.user.name}</h1> 
                    {isOpen && (
                        <div className='dropdown-menu'>
                    <ul>
                    <li>
                        <Link to={'/profile'}>Profile</Link>
                    </li>

                    <li>
                    <Link to={'/settings'}>Settings</Link>
                    </li>

                    <li>
                    <Link to={'/logout'}>Logout</Link>
                    </li>
                    </ul>
                        </div>
                    )}
                </div>
                
            ) : (
                <h1>Please login</h1>
            )}
            {isSectionOpen && (
                <div className='section'>
                <ul>
                    <li>
                        <Link to={'/products'}>Products</Link>
                    </li>

                    <li>
                    <Link to={'/users'}>Users</Link>
                    </li>

                    <li>
                    <Link to={'/transaction'}>Transaction</Link>
                    </li>

                </ul>
            </div>
            )}
              

        </div>
    );
};

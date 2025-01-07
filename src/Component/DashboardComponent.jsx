import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Dashboard.css';

export const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [lastUser, setLastUser] = useState(null);
    const [totalProducts, setTotalProducts] = useState(0);

    async function fetchAllProducts() {
        try {
            const response = await fetch('http://localhost:8080/api/products', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const data = await response.json();
            setTotalProducts(data.length);
        } catch (error) {
            console.error('There was an error fetching products!', error);
        }
    }

    async function fetchAllUsers() {
        try {
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const data = await response.json();
            setTotalUsers(data.length);
            setLastUser(data[data.length - 1]);
        } catch (error) {
            console.error('There was an error fetching users!', error);
        }
    }

    useEffect(() => {
        fetchAllUsers();
        fetchAllProducts();
        console.log(totalUsers)
    }, []);

    return (
        <div className="dashboard">
            <div className="details-about-users">
                <div className="user-detail">
                    <p>Total users: {totalUsers}</p>
                    <p>Last registered user: {lastUser ? lastUser.name : 'No users yet'}</p>
                    <p>Sum of new users: 0</p>
                </div>
                <div className="product-detail">
                    <p>Total products: {totalProducts}</p>
                    <p>Active orders: 0</p>
                    <p>Last order: none</p>
                </div>
            </div>
        </div>
    );
};

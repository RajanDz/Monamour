import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Dashboard.css';
import { da } from 'date-fns/locale';

export const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [lastUser, setLastUser] = useState(null);
    const [totalProducts, setTotalProducts] = useState(0);
    const [sumOfNewUsers, setSumOfNewUsers] = useState(0);


    async function getSumOfNewUsers() {
        try {
            const response = await fetch(`http://localhost:8080/api/sumOfNewUsers`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include', // Omogućava slanje cookies sa zahtevima

            });
            if (response.ok){
                const data = await response.json();
                setSumOfNewUsers(data);
                console.log(data);
            } else {
                console.log('Error happen while trying to fetch sum!')
            }
        } catch (error) {
            console.log('Error happen: ', error)
        }
    };


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
    };

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
        getSumOfNewUsers();
        console.log(totalUsers)
    }, []);

    return (
        <div className="dashboard">
            <div className="details-about-users">
                <div className="user-detail">
                    <p>Total users: {totalUsers}</p>
                    <p>Last registered user: {lastUser ? lastUser.name : 'No users yet'}</p>
                    <p>Sum of new users:{sumOfNewUsers}</p>
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

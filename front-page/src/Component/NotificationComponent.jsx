import '../Styles/Notification.css'
import { useEffect, useState } from "react";
import { useUser } from "./UserProvider"
import { Link, useNavigate, useParams } from "react-router-dom"
import { not } from "ajv/dist/compile/codegen";
import { da, tr } from "date-fns/locale";
import { use } from 'react';

export const NotificationComponent = () => {
    const {user} = useUser();
    const [notifications, setNotifications] = useState([]);
    const [page, setPage]  = useState(0);
    const [pageResponse, setPageResponse] = useState({pageNo: 0, totalPages: 0, isLast:false})
    const navigate = useNavigate();
    async function fetchUserNotification(page = 0) {
        try {
            const response = await fetch(`http://localhost:8080/api/getUserNotifications/${user.id}?pageNo=${page}`, {
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok){
                const data = await response.json();
                setNotifications(data.content);
                setPageResponse({
                    pageNo: data.pageNo,
                    totalPages: data.totalPages,
                    isLast: data.last
                })
            } else {
                console.log('Error happen while fetching notification!')
            }
        } catch (error) {
            console.log('Error happen: ', error)
        }
    }
    const nextPage = () => {
        if (!pageResponse.isLast){
            setPage(prevPage => prevPage + 1);
        } else {
            setPage(0);
        }
    }
    const prevPage = () => {
        if (page === 0){
            setPage(pageResponse.totalPages - 1);
        } else {
            setPage(prevPage => prevPage - 1);
        }
    }
    
    useEffect(() => {
        if (user){
            fetchUserNotification(page);
        }
    }, [page, user])
    return (
        <div >
            {user !== null ? (
            <div className="notification-page">
                    <div className='topbar-menu'>
                <Link to={'/profileSettings'}>
                <p>Profile</p>
                </Link>
                <Link to={'/orders'}>
                <p>Order</p>
                </Link>
                <Link to={'/payment'}>
                <p>Payment</p>
                </Link>

            </div>
            <div className='table-container'>
            <table className="notifications-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Message</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {notifications.length > 0 ? (
                            notifications.map((notification,index) => (
                                <tr key={index}>
                                    <td>{notification.id}</td>
                                    <td>{notification.message}</td>
                                    <td>{new Date(notification.dateOfNotication).toLocaleString()}</td>
                                </tr>
                            ))
                    ):(
                        <tr>
                            <td colSpan="3">No notifications found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
                
            
            <div className='pages'>
                <span 
                    onClick={prevPage}
                    className="material-symbols-outlined">
                    arrow_back_ios
                    </span>
                    <p>{page}</p>
                    <span
                onClick={nextPage}
                className="material-symbols-outlined">
                arrow_forward_ios
                </span>
            </div>
            </div>
        </div>
            ): (
                navigate('/login')
            )}
            
        </div>
    )
}
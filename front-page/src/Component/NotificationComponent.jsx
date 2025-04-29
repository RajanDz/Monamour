import '../Styles/Notification.css'
import { useEffect, useState } from "react";
import { useUser } from "./UserProvider"
import { not } from "ajv/dist/compile/codegen";
import { tr } from "date-fns/locale";

export const NotificationComponent = () => {
    const {user} = useUser();
    const [notifications, setNotifications] = useState([]);
    async function fetchUserNotification() {
        try {
            const response = await fetch(`http://localhost:8080/api/getUserNotifications/${user.id}`, {
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok){
                setNotifications(await response.json());
            } else {
                console.log('Error happen while fetching notification!')
            }
        } catch (error) {
            console.log('Error happen: ', error)
        }
    }
    useEffect(() => {
        fetchUserNotification();
        console.log()
    }, [user])
    return (
        <div className="notification-page">
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
        </div>
    )
}
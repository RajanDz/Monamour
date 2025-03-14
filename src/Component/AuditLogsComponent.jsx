import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/AuditLogs.css';

export const AuditLogsComponent = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function fetchAuditLogs() {
        try {
            const response = await fetch('http://localhost:8080/api/productLogs', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setLogs(data);
                console.log(data);
            } else {
                throw new Error('Failed to fetch logs');
            }
        } catch (error) {
            setError(error.message);
            console.error('There was an error!', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAuditLogs();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Product</th>
                        <th>Action</th>
                        <th>Reason</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.length > 0 ? (
                        logs.map((log, index) => (
                            <tr key={index}>
                                <td>
                                    <Link to={`/user/${log.user.id}`} className="link-in-table">
                                        {log.user.name} {log.user.lastname}
                                    </Link>
                                </td>
                                <td>{log.product ? log.product.name : "All"}</td>
                                <td>{log.action}</td>
                                <td>{log.reason}</td>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No logs available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

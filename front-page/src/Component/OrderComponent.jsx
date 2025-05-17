import { useEffect, useState } from 'react'
import '../Styles/Order.css'
import { useUser } from './UserProvider'
import { tr } from 'date-fns/locale';
import { or } from 'ajv/dist/compile/codegen';
import { useNavigate } from 'react-router-dom';
import { Link} from "react-router-dom"
export const OrderComponent = () => {
    const {user} = useUser();
    const [orders, setOrders] = useState([]);
    const [showProducts, setShowProducts] = useState(false);
    const [products, setProducts] = useState([]);
    const [mainProductImage, setMainProductPhoto] = useState([]);
    const [page,setPage] = useState(0);
    const [orderResponse, setOrderResponse] = useState({pageNo: 0, totalPages: 0, isLast: false});
    const navigate = useNavigate();
    async function  fetchOrders(page = 0) {
        try {
            const response = await fetch(`http://localhost:8080/api/getOrders/${user.id}?page=${page}`,{
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok){
                const data = await response.json();
                setOrders(data.content);
                setOrderResponse({
                    pageNo: data.pageNo,
                    totalPages: data.totalPages,
                    isLast: data.last
                })
            } else {
                console.log('Error happen while fetchin orders!')
            }
        } catch (error) {
            console.log('Error happen', error)
        }
    }
    const nextPage = () => {
        if (!orderResponse.isLast){
            setPage(prevPage => prevPage + 1);
        } else {
            setPage(0)
        }
    }
    const prevPage = () => {
        if (page === 0){
            setPage(orderResponse.totalPages - 1)
        } else {
            setPage(prevPage => prevPage - 1);
        }
    }
    async function fetchProducts(orderId) {
        try {
            const response = await fetch(`http://localhost:8080/api/getProductsOfOrder/${orderId}`,{
                method: 'GET',
                credentials: 'include'
            })
            if (response.ok){
                setProducts(await response.json())
                setShowProducts(true)
            } else {
                console.log('Error happen while fetchin products!')
            }
        } catch (error) {
            console.log('Error happen', error)
        }
    }
    const getProductImage = (productId) => {
        const image = mainProductImage.find(image => image.productId === productId);
        return image ? image.base64Image : null;
    };
    async function getProductImages() {
        try {
            const response = await fetch('http://localhost:8080/api/products/productMainImage', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Received data: ', data);
                setMainProductPhoto(data);
            } else {
                console.log('Error occurred while trying to get product images');
            }
        } catch (error) {
            console.log('Error happened: ', error);
        }
    }
    useEffect(() => {
        if (user){
        fetchOrders(page);
        getProductImages();
    }
    }, [page,user])

    return (
        <div className='order-page'>
            
            <div className='orders'>
                <table className='orders-table'>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>TOTAL PRICE</th>
                        <th>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order,index) => (
                            <tr key={index}>
                                    <td onClick={() => fetchProducts(order.id)}>{order.id}</td>
                                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                                    <td>{order.shippingAddress}</td>
                                    <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showProducts && (
                    <div className='ordered_products'>
                        <span
                            onClick={() => setShowProducts(false)}
                            className="material-symbols-outlined 
                            toggle-close-button"
                            >close
                        </span>
                        {products.map((product,index) => (
                            <div
                            className='item'
                            key={index}>
                                <img src={getProductImage(product.id)} alt="photo" />
                                <p>Name: {product.name}</p>
                                <p>Size: {product.size}</p>
                                <p>Color: {product.color}</p>
                                <p>Price: {product.price}</p>
                                <button onClick={() => navigate(`/product/${product.id}`)}>Find product</button>
                            </div>
                        ))}
                    </div>
                )}
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
                <p className='about-table'>Klikom na id porudzbine mozete pronaci detalje o istoj.</p>
            </div>
            <div className='topbar-menu'>
                <Link to={'/profileSettings'}>
                <p>Profile</p>
                </Link>
                <Link to={'/notifications'}>
                <p>Notification</p>
                </Link>
                <Link to={'/payment'}>
                <p>Payment</p>
                </Link>

            </div>
        </div>
    )
}
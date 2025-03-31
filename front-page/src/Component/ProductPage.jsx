import { useEffect, useState } from 'react';
import '../Styles/ProductsPage.css';
import welcomeImage from '../gallery/glavna.jpg';
import image from '../gallery/sales.jpg';
import { Link } from 'react-router-dom';

export const ProductPage = () => {
    const [showFilters, setShowFilter] = useState(null);
    const [products, setProducts] = useState([]);
    const [mainProductImage, setMainProductPhoto] = useState([]);
    const vissibilityButton = (element) => {
        if (showFilters === element) {
            setShowFilter(null);
        } else {
            setShowFilter(element);
            console.log(element);
        }
    };

    const getProductImage = (productId) => {
        const image = mainProductImage.find(image => image.productId === productId);
        return image ? image.base64Image : null;
    };

    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:8080/api/products', {
                method: 'GET',
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.log('Error while fetching products');
            }
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    async function getProductImages() {
        try {
            const response = await fetch('http://localhost:8080/api/productMainImage', {
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
        fetchProducts();
        getProductImages();
    }, []);

    return (
        <div className='products-page'>
            {/* <div className="represent-image">
                <img src={image} alt="photo" />
            </div> */}
            <div className='filters-and-sort-container'>
                <div className='sort-by'>
                <p onClick={() => vissibilityButton('sort-by')}>SORT BY</p>
                {showFilters === 'sort-by' && (
                    <div className='sort-filters'>
                        <p>Low to high price</p>
                    </div>
                )}
                </div>

                <div className='sort-by'>
                <p onClick={() => vissibilityButton('filters')}>FILTERS</p>
                {showFilters === 'filters' && (
                    <div className='sort-filters'>
                        <p>Low to high price</p>
                    </div>
                )}
                </div>
            </div>



            <div className='product-and-filter-container'>
                    {products.map((product) => (
                        <div className='product' key={product.id}>
                            <Link to={`/product/${product.id}`}>
                            <div className='image-box'>
                            <img src={getProductImage(product.id)} alt="product" />
                            <span className="material-symbols-outlined">
                            add
                            </span>
                            </div>
                                <p className='product-name'>{product.name}</p>
                                <p>{product.price}€</p>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
};

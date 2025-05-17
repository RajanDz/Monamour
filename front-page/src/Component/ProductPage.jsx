import { useEffect, useState } from 'react';
import '../Styles/ProductsPage.css';
import welcomeImage from '../gallery/glavna.jpg';
import image from '../gallery/sales.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserProvider';
import { useCart } from './CartProvider';

export const ProductPage = () => {
    const [showFilters, setShowFilter] = useState(null);
    const [showMenu, setShowMenu] = useState(null);
    const [products, setProducts] = useState([]);
    const [mainProductImage, setMainProductPhoto] = useState([]);
    const {userLogin} = useUser();
    const {addToCart} = useCart();
    const navigate = useNavigate();
    const avaibilitySizes = (element) => {
        if (showMenu === element){
            setShowMenu(null);
        } else {
            setShowMenu(element)
        }
    }
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
            const response = await fetch('http://localhost:8080/api/products/products', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } 
            else {
                console.log('Error while fetching products');
            }
        } catch (error) {
            console.log('Error: ', error);
        }
    }

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
        fetchProducts();
        getProductImages();
    }, []);

    return (
        <div  className={`products-page ${showFilters ? 'dim-background' : ''}`}>
            {/* <div className='filters-and-sort-container'>
                <div className='sort-by'>
                    <div className='product-navigation'>
                    <p onClick={() => vissibilityButton('sort-by')}>SORT BY</p>
                    <p onClick={() => vissibilityButton('filters')}>FILTERS</p>
                    </div>
                {showFilters === 'sort-by' && (
                    <div className='sort-filters'>
                        <p>Newest</p>
                        <p>Low to high price</p>
                        <p>High to low price</p>
                        <p>Name A-Z</p>
                        <p>Name Z-A</p>
                    </div>
                )}
                </div>
                
                <div className='show-filters'>
                {showFilters === 'filters' && (
                    <div className='filters-element'>
                        <div className='header-filters'>
                            <p className='title-filters'>FILTERS</p>
                            <span
                            onClick={() => vissibilityButton(null)}
                             className="material-symbols-outlined toggle-close-button">close</span>
                         </div>
                         
                         <div className='filters'>

                            <div className='size'>
                            <p
                            onClick={() => avaibilitySizes('type')}
                            >TYPE</p>
                            {showMenu === 'type' ?(
                                <span 
                                onClick={() => avaibilitySizes(null)}
                                className="material-symbols-outlined">
                                keyboard_arrow_down
                               </span>
                            ): (
                                <span 
                                onClick={() => avaibilitySizes('type')}
                                className="material-symbols-outlined">keyboard_arrow_right
                                </span>
                            )}
                            </div>
                            {showMenu === 'type' && (
                            <div className='type-elements'>
                             <p>Haljine</p>
                             <p>Top</p>
                             <p>Torbe</p>
                             <p>Obuca</p>
                            </div>
                            )}
                            <div className='size'>
                            <p
                            onClick={() => avaibilitySizes('size')}
                            >SIZE</p>
                            {showMenu === 'size' ?(
                                <span 
                                onClick={() => avaibilitySizes(null)}
                                class="material-symbols-outlined">
                                keyboard_arrow_down
                               </span>
                            ): (
                                <span 
                                onClick={() => avaibilitySizes('size')}
                                className="material-symbols-outlined">keyboard_arrow_right
                                </span>
                            )}
                            </div>

                            <div className='size-container'>
                            {showMenu === 'size' && (
                                <div className='available-sizes'>
                                    <p>XS</p>
                                    <p>S</p>
                                    <p>M</p>
                                    <p>L</p>
                                    <p>XL</p>
                                </div>
                            )}

                            
                            </div>
                            <div className='size'>
                            <p
                            onClick={() => avaibilitySizes('colors')}
                            >COLORS</p>
                            {showMenu === 'colors' ?(
                                <span 
                                 onClick={() => avaibilitySizes('colors')}
                                 class="material-symbols-outlined">
                                 keyboard_arrow_down
                                </span>
                            ): (
                                <span 
                                 onClick={() => avaibilitySizes('colors')}
                                 className="material-symbols-outlined">keyboard_arrow_right
                                 </span>
                            )}
                            </div>
                            <div className='color-container'>
                                {showMenu === 'colors' && (
                                    <div className='colors'>
                                        <p style={{backgroundColor: "black"}}></p>
                                        <p style={{backgroundColor: "gray"}}></p>
                                        <p style={{backgroundColor: "pink"}}></p>
                                        <p style={{backgroundColor: "purple"}}></p>
                                        <p style={{backgroundColor: "red"}}></p>
                                        <p style={{backgroundColor: "blue"}}></p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div> */}



            <div className='product-and-filter-container'>
                    {products.map((product) => (
                        <div className='product' key={product.id}>
                            <div className='image-box'>
                            <Link to={`/product/${product.id}`}>
                            <img src={getProductImage(product.id)} alt="product" />
                            </Link>
                            <span 
                            onClick={() => addToCart(product,1)}
                            className="material-symbols-outlined">
                            add
                            </span>
                            </div>
                            <Link to={`/product/${product.id}`}>
                                <p className='product-name'>{product.name}</p>
                                <p>{product.price}€</p>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
};

import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { FrontPage } from './Component/FrontPage';
import { HeaderComponent } from './Component/HeaderComponent';
import { LoginComponent } from './Component/LoginComponent';
import { ProductPage } from './Component/ProductPage';
import { ProductDetails } from './Component/ProductDetails';
import { CartProvider } from './Component/CartProvider';
import { CartComponent } from './Component/CartComponent'; 
import { UserProvider } from './Component/UserProvider';
import { ProfileSettings } from './Component/ProfileSettings';
import { NotificationComponent } from './Component/NotificationComponent';
import { OrderComponent } from './Component/OrderComponent';
import { PaymentComponent } from './Component/PaymentComponent';
function App() {
  return (
    <CartProvider>
      <UserProvider>
      <Router>
        <HeaderComponent/>
        <Routes>
          <Route path='/' element={<FrontPage />} />
          <Route path='/login' element={<LoginComponent />} />
          <Route path='/products' element={<ProductPage />} />
          <Route path='/cart' element={<CartComponent />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/profileSettings' element={<ProfileSettings/>}></Route>
          <Route path='/notifications' element={<NotificationComponent/>}></Route>
          <Route path='/orders' element={<OrderComponent/>}></Route>
          <Route path='/payment' element={<PaymentComponent/>}></Route>
        </Routes>
      </Router>
      </UserProvider>
    </CartProvider>
  );
}


export default App;

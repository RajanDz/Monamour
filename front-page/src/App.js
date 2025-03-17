import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { FrontPage } from './Component/FrontPage';
import { HeaderComponent } from './Component/HeaderComponent';
import { LoginComponent } from './Component/LoginComponent';
import { ProductPage } from './Component/ProductPage';
import { ProductDetails } from './Component/ProductDetails';
function App() {
  return (
    <Router>
      <HeaderComponent/>
      <Routes>
        <Route path='/' element={<FrontPage/>}></Route>
        <Route path='/login' element={<LoginComponent/>}></Route>
        <Route path='/products' element={<ProductPage/>}></Route>
        <Route path='/product/:id' element={<ProductDetails/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;

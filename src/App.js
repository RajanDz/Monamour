import logo from './logo.svg';
import './App.css';
import { LoginComponent } from './Component/LoginComponent';
import { MainComponent } from './Component/MainComponent';
import { ListAllProduct } from './Component/ListAllProductComponent';
import { CreateProduct } from './Component/CreateProductComponent';
import { UserProvider } from './Component/UserContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <UserProvider> {/* Ovdje obavezujemo UserProvider */}
      <Router>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route path='/products' element={<ListAllProduct/>}></Route>
          <Route path='/createProduct' element={<CreateProduct/>}></Route>
          <Route path="/" element={<MainComponent />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}


export default App;

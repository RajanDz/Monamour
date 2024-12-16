import logo from './logo.svg';
import './App.css';
import { LoginComponent } from './Component/LoginComponent';
import { MainComponent } from './Component/MainComponent';
import { ListAllProduct } from './Component/ListAllProductComponent';
import { CreateProduct } from './Component/CreateProductComponent';
import { UserProvider } from './Component/UserContext';
import { ProductDetails } from './Component/ProductDetails';
import { Dashboard } from './Component/DashboardComponent';
import { AuditLogsComponent } from './Component/AuditLogsComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <UserProvider>{/* Ovdje obavezujemo UserProvider */}
      <Router>
      <MainComponent></MainComponent>

        <Routes>
          <Route path='/' element={<Dashboard></Dashboard>}></Route>
          <Route path="/login" element={<LoginComponent />} />
          <Route path='/createProduct' element={<CreateProduct/>}></Route>
          <Route path="/products" element={<ListAllProduct />} />
          <Route path='/productDetails/:id' element={<ProductDetails></ProductDetails>}></Route>
          <Route path='/auditLogs' element={<AuditLogsComponent/>}></Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}


export default App;

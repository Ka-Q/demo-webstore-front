import { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import FrontPage from './components/pages/FrontPage/FrontPage';
import ProductPage from './components/pages/ProductPage/ProductPage';
import NavBar from './components/NavBar/NavBar';
import NavBarPadding from './components/NavbarPadding/NavbarPadding';


const API_PATH = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState({});
  useEffect(() => {
    const checkLogin = async() => {
      const f = await fetch(`${API_PATH}/api/check_login`, {
        method: 'POST', 
        credentials: 'include', 
        headers: {
        'Content-Type': 'application/json'
        }
      });
      const data = await f.json();
      if (data.user_email) {
        setUser(data);
      } 
    }
    checkLogin();
  }, []);

  return (
    <Router>
      <NavBar user={user}/>
      <NavBarPadding/>
      <Routes>
        <Route path="/" element={<FrontPage user={user}/>} />
        <Route path="/product" element={<ProductPage user={user}/>} />
      </Routes>

    </Router>
  );
}

export default App;
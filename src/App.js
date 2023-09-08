import { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import FrontPage from './components/pages/FrontPage/FrontPage';
import SearchPage from './components/pages/SearchPage/SearchPage';
import NavBar from './components/NavBar/NavBar';
import NavBarPadding from './components/NavbarPadding/NavbarPadding';
import RegisterPage from './components/pages/RegisterPage/RegisterPage';
import LoadingComponent from './components/LoadingComponent/LoadingComponent';
import WelcomePage from './components/pages/WelcomePage/WelcomePage';
import MainCategoryPage from './components/pages/CategoryPage/MainCategoryPage';
import CategoryPage from './components/pages/CategoryPage/CategoryPage';
import FooterComponent from './components/Footer/FooterComponent';
import ProductPage from './components/pages/ProductPage/ProductPage';


const API_PATH = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
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
        setUser({...data, image_src: "default_pfp.png"});
      } else {
        setUser({});
      }
    }
    checkLogin();
  }, []);

  useEffect(() => {
    const getPfp = async() => {
      const f = await fetch(`${API_PATH}/api/image?image_id=${user.image_id}`, { 
        credentials: 'include', 
        headers: {
        'Content-Type': 'application/json'
        }
      });
      const data = await f.json();
      if (data.data[0] && data.data[0].image_src != "default_pfp.png") {
        setUser({...user, image_src: data.data[0].image_source});
      }
    }
    if (user && user.image_src == "default_pfp.png") {
      getPfp();
    }
    
  }, [user]);

  return (
    <Router>
      <NavBar user={user}/>
      <NavBarPadding/>
      {
      !user? 
        <LoadingComponent/> 
      :
        <Routes>
          <Route path="/" element={<FrontPage user={user}/>} />
          <Route path="/search" element={<SearchPage user={user}/>} />
          <Route path="/product/:id/:productName" element={<ProductPage user={user}/>} />
          <Route path="/categories/:mainCategoryName" element={<MainCategoryPage user={user}/>} />
          <Route path="/categories/:mainCategoryName/:categoryName" element={<CategoryPage user={user}/>} />
          <Route path="/register" element={<RegisterPage user={user}/>} />
          <Route path="/welcome/" element={<WelcomePage user={user}/>} />
        </Routes>
      }
      <FooterComponent/>
    </Router>
  );
}

export default App;
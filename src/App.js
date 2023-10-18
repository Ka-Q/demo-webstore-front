import { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom'
import FrontPage from './components/pages/FrontPage/FrontPage';
import SearchPage from './components/pages/SearchPage/SearchPage';
import CustomNavbar from './components/NavBar/CustomNavbar';
import NavBarPadding from './components/NavbarPadding/NavbarPadding';
import RegisterPage from './components/pages/RegisterPage/RegisterPage';
import LoadingComponent from './components/LoadingComponent/LoadingComponent';
import WelcomePage from './components/pages/WelcomePage/WelcomePage';
import MainCategoryPage from './components/pages/MaincategoryPage/MainCategoryPage';
import CategoryPage from './components/pages/CategoryPage/CategoryPage';
import ProductPage from './components/pages/ProductPage/ProductPage';
import { customFetch, checkLogin, resetSessionTimeout } from './sessionTimer';
import AllCategoriesPage from './components/pages/AllCategoriesPage/AllCategoriesPage';
import Footer from './components/Footer/Footer';

const API_PATH = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLogin = async() => {
      const f = await customFetch(`${API_PATH}/api/check_login`, {
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
      const f = await customFetch(`${API_PATH}/api/image?image_id=${user.image_id}`, { 
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

  const location = useLocation();

  useEffect(() => {
    if (user && user.user_email) {
      resetSessionTimeout();
    }
  }, [location]);

  return (
    <>
      <CustomNavbar user={user}/>
      <NavBarPadding/>
      {
      !user? 
        <LoadingComponent/> 
      :
        <Routes>
          <Route path="/" element={<FrontPage user={user}/>} />
          <Route path="/search" element={<SearchPage user={user}/>} />
          <Route path="/product/:id/:productName" element={<ProductPage user={user}/>} />
          <Route path="/categories" element={<AllCategoriesPage user={user}/>} />
          <Route path="/categories/:mainCategoryName" element={<MainCategoryPage user={user}/>} />
          <Route path="/categories/:mainCategoryName/:categoryName" element={<CategoryPage user={user}/>} />
          <Route path="/register" element={<RegisterPage user={user}/>} />
          <Route path="/welcome/" element={<WelcomePage user={user}/>} />
        </Routes>
      }
      <Footer/>
    </>
  );
}

export default App;
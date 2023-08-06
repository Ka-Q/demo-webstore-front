import { useEffect, useState } from 'react';
import './App.css';
import FrontPage from './components/FrontPage/FrontPage';
import NavBar from './components/NavBar/NavBar';
import { Button, DropdownButton, Dropdown, Form } from 'react-bootstrap';

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
    <>
    <NavBar user={user}/>
    <FrontPage user={user}/>
    </>
  );
}

export default App;
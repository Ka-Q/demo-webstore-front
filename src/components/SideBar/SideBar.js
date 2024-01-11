import { Link } from 'react-router-dom';
import './SideBar.css'
import LoginForm from '../LoginForm/LoginForm';
import { Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
const API_PATH = process.env.REACT_APP_DWS_API_URL;

const SideBar = (props) => {

    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    useEffect(() => {
        if (isSidebarVisible) {
            showSidebar();
        } else {
            hideSidebar();
        }
    }, [isSidebarVisible]);

    const showSidebar = () => {
        const sidebar = document.querySelector('#sidebar');
        const overlay = document.querySelector('#overlay');
        const sideToggle = document.querySelector('#side-toggle');

        sidebar.style.transform =  `translate(0%)`;
        sidebar.style.filter = 'drop-shadow(0 0.5em 0.5em black)';
        overlay.style.display = 'block';
        document.body.style.overflowY = 'hidden';
        sideToggle.style.display = 'block';
    }

    const hideSidebar = () => {
        const sidebar = document.querySelector('#sidebar');
        const overlay = document.querySelector('#overlay');
        const sideToggle = document.querySelector('#side-toggle');

        sidebar.style.transform = `translate(100%)`;
        sidebar.style.filter = 'none';
        overlay.style.display = 'none';
        document.body.style.overflowY = 'auto';
        sideToggle.style.display = 'none';
    }

    const handleLogOut = async () => {
        console.log("logging out");
        await fetch(`${API_PATH}/api/logout`, {
          method: "POST",
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        window.location.reload();
      }
    
    const toggle = props.toggle
    if (toggle) {
        toggle.onclick = (e) => {
            setIsSidebarVisible(true);
            showSidebar();
        }
    }

    return (
        <div id='sidebar-container'>
            <a id='side-toggle' onClick={hideSidebar}>→≡</a>
            <div id='sidebar'>
                <div id='scroll-container'>
                    <div className="list-start">
                    <Link className="list-item shopping-cart hoverable">
                        <span id='list-icon'>🛒</span>
                        Shopping cart
                        <span id="item-count"><br/>(0 items)</span>
                        <span id="proceed-to-check-out">Proceed to Check-Out ➡</span>
                    </Link>
                    <Link className="list-item hoverable" to='/' onClick={hideSidebar}>
                        Front page
                    </Link>
                    <Link className="list-item hoverable" to='/categories' onClick={hideSidebar}>
                        Categories
                    </Link>
                    {props.user && props.user.user_email? 
                    <Link className="list-item hoverable" to='/wishlist' onClick={hideSidebar}>
                        Wishlist
                    </Link>:
                    <></>}
                    <Link className="list-item ad" onClick={hideSidebar}>
                        Advertisement/Banner
                    </Link>
                    </div>
                    <div className='list-end'>
                    <hr className="divider"/>
                    {props.user && props.user.user_email? 
                    <>
                        <Link className="list-item hoverable" onClick={hideSidebar}>
                            <div className='user-image-container'>
                                <Image className='user-image' src={`${API_PATH}/api/imagefile?filename=${props.user.image_src}`}/>
                            </div>
                            Account
                        </Link>
                        <Link className="list-item hoverable" onClick={handleLogOut}>
                            Log out
                        </Link>
                    </> : 
                    <div className='mx-3 text-center'>
                        <h4>Log in</h4>
                        <LoginForm/>
                    </div>
                    }
                    </div>
                </div>
            </div>
            <div id='overlay' onClick={hideSidebar}/>
        </div>
    )
}

export default SideBar;
import './SideBar.css'
const API_PATH = 'http://localhost:5000';

const SideBar = (props) => {

    const sidebar = document.querySelector('#sidebar');
    const overlay = document.querySelector('#overlay');
    const sideToggle = document.querySelector('#side-toggle');

    const showSidebar = () => {
        sidebar.style.transform =  `translate(0%)`;
        sidebar.style.filter = 'drop-shadow(0 0.5em 0.5em black)';
        overlay.style.display = 'block';
        document.body.style.overflowY = 'hidden';
        sideToggle.style.display = 'block';
    }

    const hideSidebar = () => {
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
        showSidebar();
        toggle.onclick = (e) => {
            showSidebar()
        }
    }

    return (
        <div id='sidebar-container'>
            <a id='side-toggle' onClick={hideSidebar}>→≡</a>
            <div id='sidebar'>
                <div id='scroll-container'>
                    <div className="list-start">
                    <a className="list-item shopping-cart hoverable">
                        <span id='list-icon'>🛒</span>
                        Shopping cart
                        <span id="item-count"><br/>(0 items)</span>
                        <span id="proceed-to-check-out">Proceed to Check-Out ➡</span>
                    </a>
                    <a className="list-item hoverable" href='/'>
                        Front page
                    </a>
                    <a className="list-item hoverable" href='/categories'>
                        Categories
                    </a>
                    <a className="list-item hoverable">
                        A third page
                    </a>
                    <a className="list-item ad">
                        Advertisement/Banner
                    </a>
                    </div>
                    <div className='list-end'>
                    <hr className="divider"/>
                    <a className="list-item hoverable">
                        Account
                    </a>
                    <a className="list-item hoverable" onClick={handleLogOut}>
                        Log out
                    </a>
                    </div>
                </div>
            </div>
            <div id='overlay' onClick={hideSidebar}/>
        </div>
    )
}

export default SideBar;
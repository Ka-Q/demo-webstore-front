import './customNavbar.css'
import { useEffect, useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap';
import SideBar from '../SideBar/SideBar';
import LoginComponent from '../Login/LogIn';
import LogOutComponent from '../Logout/LogOut';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import Searchbar from './Searchbar';

const API_PATH = 'http://localhost:5000';

const CustomNavbar = (props) => {

  const [maincategories, setMaincategories] = useState([]);

  useEffect(() => {
    const fetchMaincategories = async () => {
      const f = await fetch(`${API_PATH}/api/maincategory`);
      const data = await f.json();
      setMaincategories(data.data);
    }
    fetchMaincategories();
  }, [])

  useEffect(() => {
    setToggle(document.querySelector('#sidebar-toggle'));
  }, []);

  const [toggle, setToggle] = useState();

  return (
    <>
    <Navbar className="bg-body-tertiary custom-navbar" data-bs-theme="dark">
      <Container fluid>
        <LinkContainer to='/'><Navbar.Brand>DWS</Navbar.Brand></LinkContainer>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll >
            <CategoryDropDown maincategories={maincategories}/>
          </Nav>
          <Searchbar/>
          <Nav>
            <UserLogin user={props.user}/>
            <Nav.Link className='mx-2 large-screen'>🛒 Cart</Nav.Link>
            <Nav.Link className='mx-2 small-screen'>🛒</Nav.Link>
            <Nav.Link id="sidebar-toggle">≡</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <SideBar toggle={toggle} user={props.user}/>
    </>
  )
}

const CategoryDropDown = ({maincategories}) => {
  return (
    <>
      <NavDropdown title="🔖 Categories" id="basic-nav-dropdown" className='large-screen-category'>
        <LinkContainer to='/categories'><NavDropdown.Item>All categories</NavDropdown.Item></LinkContainer>
        <NavDropdown.Divider></NavDropdown.Divider>
        {maincategories.map((n) => {
          return (<MaincategoryDropdown main={n} key={`categoryDropdown${n.maincategory_id}`} drop='end' />);
        })}
      </NavDropdown>
      <NavDropdown title="🔖" id="basic-nav-dropdown" className='small-screen-category'>
        <LinkContainer to='/categories'><NavDropdown.Item>All categories</NavDropdown.Item></LinkContainer>
        <NavDropdown.Divider></NavDropdown.Divider>
        {maincategories.map((n) => {
          return (<MaincategoryDropdown main={n} key={`categoryDropdown${n.maincategory_id}`} drop='end' />);
        })}
      </NavDropdown>
    </>
  )
}

const UserLogin = ({user}) => {
  return (
    <>
      {
        !user || !user.user_id? 
        <>
          <LoginComponent className='large-screen-login'/> 
          <Nav.Link disabled className='large-screen'>🤷‍♂️ Profile</Nav.Link>
          <Nav.Link disabled className='small-screen'>🤷‍♂️</Nav.Link>
        </>
        : 
        <>
          <LogOutComponent className='large-screen-login'/>
          <LinkContainer to='/profile'>
            <Nav.Link className='large-screen'>
              <Image src={`${API_PATH}/api/imagefile?filename=${user.image_src}`} className='custom-navbar-user-login'/> Profile
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to='/profile'>
            <Nav.Link className='small-screen'>
              <Image src={`${API_PATH}/api/imagefile?filename=${user.image_src}`} className='custom-navbar-user-login'/>
            </Nav.Link>
          </LinkContainer>
        </>
      }
    </>
  )
}

const MaincategoryDropdown = (props) => {
  const mainCategory = props.main;
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      const f = await fetch(`${API_PATH}/api/maincategory_category?maincategory_id=${mainCategory.maincategory_id}`);
      const data = await f.json();
      if (data.data) {
        setSubCategories(data.data);
      } else {
        setSubCategories([{category_id: 'error'}]);
      }
    }
    fetchSubCategories();
  }, [])

  return (
      <CustomNavDropdown title={mainCategory.maincategory_name} href={`/categories/${mainCategory.maincategory_name}`} id="basic-nav-dropdown" className="dropdown-submenu" drop={props.drop}>
        {subCategories.map((n, index) => {
          return (<LinkContainer to={`/categories/${mainCategory.maincategory_name}/${n.category_name}`} key={"category" + n.category_id}>
            <NavDropdown.Item >{n.category_name}</NavDropdown.Item>
            </LinkContainer>);
        })}
      </CustomNavDropdown>
  )
}

const CustomNavDropdown = (props) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleHide = () => setShow(false);

  const navigate = useNavigate();

  const setLocation = (e) => {
    if (e.target.id == 'basic-nav-dropdown') navigate(props.href);
  } 

  return (
      <NavDropdown
        {...props}
        show={show}
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onClick={(e) => setLocation(e)}
      >
        {props.children}
      </NavDropdown>
  );
};

export default CustomNavbar;
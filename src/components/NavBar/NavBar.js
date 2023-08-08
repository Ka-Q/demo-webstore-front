import './NavBar.css'
import { useEffect, useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Form, Button, DropdownButton, Dropdown} from 'react-bootstrap';
import SideBar from '../SideBar/SideBar';
import LoginComponent from '../Login/LogIn';
import LogOutComponent from '../Logout/LogOut';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_PATH = 'http://localhost:5000';

const NavBar = (props) => {

  const [maincategories, setMaincategories] = useState([]);

  useEffect(() => {
    const fetchMaincategories = async () => {
      const f = await fetch(`${API_PATH}/api/maincategory`);
      const data = await f.json();
      setMaincategories(data.data);
    }
    fetchMaincategories();
  }, [])

  const [toggle, setToggle] = useState();

  return (
    <>
    <Navbar className="bg-body-tertiary" data-bs-theme="dark" style={{position:"fixed", width: "100%"}}>
      <Container fluid>
        <LinkContainer to='/'><Navbar.Brand >DWS</Navbar.Brand></LinkContainer>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <NavDropdown title="🔖 Categories" id="basic-nav-dropdown">
              <LinkContainer to='/categories'><NavDropdown.Item>All categories</NavDropdown.Item></LinkContainer>
              <NavDropdown.Divider></NavDropdown.Divider>
              {maincategories.map((n, index) => {
                return (<CategoryComponent main={n} key={n.maincategory_id}/>);
              })}
            </NavDropdown>
          </Nav>
          <SearchbarComponent/>
          <Nav>
            {
            !props.user || !props.user.user_id? <>
              <LoginComponent className='large-screen-login'/> 
              <Nav.Link disabled className='large-screen'>🤷‍♂️ Profile</Nav.Link>
              <Nav.Link disabled className='small-screen'>🤷‍♂️</Nav.Link></>
              : 
              <>
                <LogOutComponent className='large-screen-login'/>
                <LinkContainer to='/profile'><Nav.Link className='large-screen'>🤷‍♂️ Profile</Nav.Link></LinkContainer>
                <LinkContainer to='/profile'><Nav.Link className='small-screen'>🤷‍♂️</Nav.Link></LinkContainer>
              </>
            }
            <Nav.Link className='mx-2 large-screen'>🛒 Cart</Nav.Link>
            <Nav.Link className='mx-2 small-screen'>🛒</Nav.Link>
            <Nav.Link id="sidebar-toggle" onClick={(e) => setToggle(e.target)}style={{position: 'relative', scale: '2', transform: 'translate(0%, -.1rem)'}}>≡</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <SideBar toggle={toggle}/>
    </>
  )
}

const CategoryComponent = (props) => {
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
      <CustomNavDropdown title={mainCategory.maincategory_name} href={`/categories/${mainCategory.maincategory_name}`} id="basic-nav-dropdown" className="dropdown-submenu" drop='end'>
        {subCategories.map((n, index) => {
          return (<LinkContainer to={`/categories/${mainCategory.maincategory_name}/${n.category_name}`}>
            <NavDropdown.Item key={n.category_id}>{n.category_name}</NavDropdown.Item>
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
    <LinkContainer to={props.href}>
    <NavDropdown
      {...props}
      show={show}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onClick={(e) => setLocation(e)}
    >
      {props.children}
    </NavDropdown></LinkContainer>
  );
};

const SearchbarComponent = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [resultsVisible, setResultsVisible] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const f = await fetch(`${API_PATH}/api/product?product_name=%${query.trim()}%&limit=5&order=price`);
      if (f.status == 200) {
        const data = await f.json();
        setProducts(data.data);
      }
    }
    if (query.length > 2) {
      fetchProduct();
      showResults();
    } else {
      setProducts([]);
      if (resultsVisible) hideResults();
    }
  }, [query]);


  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/product?product_name=%${query}%`);
  }

  const hideResults = () => {
    const overlay = document.querySelector('#search-overlay');
    overlay.style.display = 'none';
    setResultsVisible(false);
  }

  const showResults = () => {
    const overlay = document.querySelector('#search-overlay');
    overlay.style.display = 'block';
    setResultsVisible(true);
  }

  const handleChange = (e) => {
    setQuery(e.target.value)
    if (e.target.value.length > 2) showResults();
    
  }

  return (
    <>
    <Form className="d-flex mx-auto" onSubmit={(e) => handleSearch(e)} style={{width: "100%", maxWidth: "60%", position: "relative"}}>
      <Form.Control
        type="search"
        placeholder="Search"
        className="mx-2"
        aria-label="Search"
        style={{paddingRight: "2rem"}}
        onChange={(e) => handleChange(e)}
        onClick={(e) => handleChange(e)}
      />
      <button type='submit' style={{position: "absolute", height: "100%", right: ".5rem", background: "transparent", border: "0px"}}>🔍</button>
    </Form>
    <div className="product-search" hidden={!resultsVisible}>
      {products.map((n, index) => {
        return(
          <a className='product-search-result' key={n.product_id}>{n.product_name} - {n.product_name}</a>
        )
      })}
      {products.length > 0? <a className='product-search-result-more'>More search results →</a> : <a className='product-search-result-more'>No results</a>}
    </div>
    <div id='search-overlay' onClick={(e) => hideResults()} onTouchStart={(e) => hideResults()}/>
    </>
  )
}

export default NavBar;
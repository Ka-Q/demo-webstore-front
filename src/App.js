import { useEffect, useState } from 'react';
import './App.css';
import './NavBar.css'
import { Navbar, Container, Nav, NavDropdown, Form, Button, Dropdown, DropdownButton, NavItem } from 'react-bootstrap';

const API_PATH = 'http://localhost:5000';

function App() {
  return (
    <>
    <NavBar/>
    </>
  );
}

const NavBar = () => {

  const [maincategories, setMaincategories] = useState([]);

  useEffect(() => {
    const fetchMaincategories = async () => {
      const f = await fetch(`${API_PATH}/api/maincategory`);
      const data = await f.json();
      setMaincategories(data.data);
    }
    fetchMaincategories();
  }, [])

  return (
    <Navbar className="bg-body-tertiary" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href="#">DWS</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <NavDropdown title="Categories" id="basic-nav-dropdown">
              <NavDropdown.Item href='/categories'>All categories</NavDropdown.Item>
              <NavDropdown.Divider></NavDropdown.Divider>
              {maincategories.map((n, index) => {
                return (<CategoryComponent main={n} key={index}/>);
              })}
            </NavDropdown>
          </Nav>
          <Form className="d-flex mx-auto" style={{width: "100%", maxWidth: "60%", position: "relative"}}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="mx-2"
              aria-label="Search"
              style={{paddingRight: "2rem"}}
            />
            <button style={{position: "absolute", height: "100%", right: ".5rem", background: "transparent", border: "0px"}}>🔍</button>
          </Form>
          <Nav>
            <Nav.Link href="#profile" className='large-screen'>🤷‍♂️ Profile</Nav.Link>
            <Nav.Link href="#cart" className='large-screen'>🛒 Cart</Nav.Link>
            <Nav.Link href="#profile" className='small-screen'>🤷‍♂️</Nav.Link>
            <Nav.Link href="#cart" className='small-screen'>🛒</Nav.Link>
            <Nav.Link href="#menu">◨</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
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
          return (<NavDropdown.Item href={`/categories/${mainCategory.maincategory_name}/${n.category_name}`} key={index}>{n.category_name}</NavDropdown.Item>);
        })}
      </CustomNavDropdown>
  )
}

const CustomNavDropdown = (props) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleHide = () => setShow(false);

  const setLocation = () => {
    window.location.href = props.href
  } 

  return (
    <NavDropdown
      {...props}
      show={show}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
      onClick={setLocation}
    >
      {props.children}
    </NavDropdown>
  );
};

export default App;

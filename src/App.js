import { useState } from 'react';
import './App.css';
import './NavBar.css'
import { Navbar, Container, Nav, NavDropdown, Form, Button, Dropdown, DropdownButton } from 'react-bootstrap';


function App() {
  return (
    <>
    <NavBar/>
    </>
  );
}

const NavBar = () => {
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
              <CustomNavDropdown title="Main Category 1" id="basic-nav-dropdown" className="dropdown-submenu" drop='end'>
                <NavDropdown.Item href="#action/3.2.1">Sub-Category 1.1</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2.2">Sub-Category 1.2</NavDropdown.Item>
              </CustomNavDropdown>
              <CustomNavDropdown title="Main Category 2" id="basic-nav-dropdown" className="dropdown-submenu" drop='end'>
                <NavDropdown.Item href="#action/3.2.1">Sub-Category 2.1</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2.2">Sub-Category 2.2</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2.2">Sub-Category 2.3</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2.2">Sub-Category 2.4</NavDropdown.Item>
              </CustomNavDropdown>
              <NavDropdown.Divider />
              <CustomNavDropdown title="Main Category 3" id="basic-nav-dropdown" className="dropdown-submenu" drop='end'>
                <NavDropdown.Item href="#action/3.2.1">Sub-Category 3.1</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2.2">Sub-Category 3.2</NavDropdown.Item>
              </CustomNavDropdown>
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
            <Nav.Link href="#profile">🤷‍♂️</Nav.Link>
            <Nav.Link href="#cart">🛒</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

const CustomNavDropdown = (props) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleHide = () => setShow(false);

  return (
    <NavDropdown
      {...props}
      show={show}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
    >
      {props.children}
    </NavDropdown>
  );
};

export default App;

import './footer.css'
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div className='footer'>
            <Container className='mx-auto'>
                <Row className='py-3 mx-auto'>
                    <Col xs={12} sm={2} id="footer-section">
                        <Link to="/" className='mx-auto my-auto'><h1>DWS</h1></Link>
                    </Col>
                    <Col sm={3} className='pt-3' id="footer-section" >
                        <ul className="footer-list">
                            <li>
                                <Link><h3>Sitemap</h3></Link>
                            </li>
                            <li>
                                <Link>Front Page</Link>
                            </li>
                            <li>
                                <Link>Categories</Link>
                            </li>
                            <li>
                                <Link>Search</Link>
                            </li>
                            <li>
                                <Link>Log in</Link>
                            </li>
                            <li>
                                <Link>Register</Link>
                            </li>
                            <li>
                                <Link>User account</Link>
                            </li>
                        </ul>
                    </Col>
                    <Col sm={3} className='pt-3' id="footer-section">
                        <ul className="footer-list">
                            <li>
                                <Link><h3>About</h3></Link>
                            </li>
                            <li>
                                <Link>The purpose</Link>
                            </li>
                            <li>
                                <Link>Documentation</Link>
                                <ul className="footer-list">
                                    <li>
                                        <Link>Client</Link>
                                    </li>
                                    <li>
                                        <Link>Server</Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <Link>Source code</Link>
                            </li>
                        </ul>
                    </Col>
                    <Col sm={4} className='pt-3' id="footer-section">
                        <ul className="footer-list">
                            <li>
                                <Link><h3>Contact</h3></Link>
                            </li>
                            <li>
                                <Link>© Aku Laurila 2023</Link>
                            </li>
                            <li>
                                <Link>akulaurila.com</Link>
                            </li>
                            <li>
                                <Link>github.com/user/Ka-Q</Link>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer;
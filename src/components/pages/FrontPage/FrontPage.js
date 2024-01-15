import './FrontPage.css'
import { Row, Col, Image } from "react-bootstrap";
import FrontPageLogin from "./FrontPageLogin";
import FrontPageRegister from "./FrontPageRegister";
import ProductShowcase from "../../ProductShowcase/ProductShowcase"
import { useEffect, useState } from 'react';

const API_PATH = process.env.REACT_APP_DWS_API_URL;

const FrontPage = ({user}) => {

    const [topProducts, setTopProducts] = useState([]);
    const [topDiscounts, setTopDiscounts] = useState([]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            const f = await fetch(`${API_PATH}/api/product_expanded_v2?limit=10&order=avg_review_rating%20desc`);
            const data = await f.json();
            setTopProducts(data.data);
        }

        if (topProducts.length == 0) 
            fetchTopProducts();
    }, [topProducts]);

    useEffect(() => {
        const fetchTopDiscounts = async () => {
            const f = await fetch(`${API_PATH}/api/product_expanded_v2?limit=10&order=discount%20desc`);
            const data = await f.json();
            setTopDiscounts(data.data);
        }

        if (topDiscounts.length == 0) 
            fetchTopDiscounts();
    }, [topDiscounts]);

    return (
        <div className='front-page-root' style={{paddingBottom: "100%"}}>
            {user.user_email? 
                <h1 style={{paddingBottom: "100em"}}>Welcome back {user.user_first_name}!</h1>
            :
            <>
                <h1 style={{textAlign: "center"}}>Welcome to the Demo-WebStore</h1>
                <div className="login-banner py-2 mx-2 mt-5">
                    <Row className="mx-auto">
                        <Col md={4}>
                            <FrontPageLogin/>
                        </Col>
                        <Col md={4}>
                            <img style={{width: "100%", height: "15em", objectFit: "cover"}} src='https://i.pinimg.com/originals/44/a8/da/44a8dabf0e4bf6e2616cd0f6d0ce5912.gif'/>
                        </Col>
                        <Col md={4}>
                            <FrontPageRegister/>
                        </Col>
                    </Row>
                </div>
            </>
            }
            <div className='p-3'>
                <h1>Most liked products</h1>
                <p>
                    These are the products most highly reviewed by our customers. 
                    They may be the highest quality in their category or the best bang for the buck. You can dive in to a specific product's reviews on its page! Happy shopping!
                </p>
                <ProductShowcase products={topProducts} id="top_products"/>
            </div>
            <div className='p-3'>
                <h1>Top discounts</h1>
                <p>
                    SALE SALE SALE!!! View our most discounted products. Amazing deals just a few clicks away!
                </p>
                <ProductShowcase products={topDiscounts} id="top_products_discount"/>
            </div>
                
        </div>
    )
}

export default FrontPage;
import { useEffect, useState } from "react";
import { ImageViewerComponent } from "../../ImageViewerComponent/ImageViewerComponent";
import { Col, Container, Row } from "react-bootstrap";

const API_PATH = 'http://localhost:5000';

const ProductPage = (props) => {

    const [product, setProduct] = useState({});

    useEffect(() => {
        const fetchProduct = async () => {
            const productId = window.location.pathname.split('/')[2];
            const f = await fetch(`${API_PATH}/api/product_expanded?product_id=${productId}`);
            const data = await f.json();
            setProduct(data.data[0]);
            
        }
        fetchProduct();
    }, []);

    return (
        <Container>
            <h1 className="text-center">
                {product.product_name}
            </h1>
            <Row className="mx-auto mt-4">
                <Col sm={5}>
                    {product.images? <ImageViewerComponent images={product.images} path={API_PATH + "/api/imagefile?filename="}/> : <></>}
                </Col>
                <Col>
                    {product.product_description}
                </Col>
            </Row>
        </Container>
    )
}

export default ProductPage;
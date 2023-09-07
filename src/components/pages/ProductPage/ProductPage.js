import { useEffect, useState } from "react";

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
    }, [])

    return (
        <h1 className="text-center">
            {product.product_name + ": " + product.product_description}
        </h1>
    )
}

export default ProductPage;
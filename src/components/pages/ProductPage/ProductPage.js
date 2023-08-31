import { useEffect, useState } from "react";
import { Card, Image } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

const API_PATH = 'http://localhost:5000';

const ProductPage = () => { 

    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            console.log("Fetching products...");
            const f = await fetch(`${API_PATH}/api/product_expanded?product_name=%${searchParams.get('query')}%`);
            const data = await f.json();
            if (data.data == "error" || !data.data[0]) {
                setError(true);
            } else {
                setError(false);
                console.log(data);
                setProducts(data.data);
            }
        }
        fetchProduct();
    }, [searchParams])

    return (
        <>
            <h1>{searchParams.get('query')}</h1>
            <div style={{display: "flow"}}>
            {
            error? 
            <div>
                No results.
            </div>
            :<>
                {products.map((n, index) => {
                    return (
                        <ProductItem product={n} key={"product" + n.product_id}/>
                    )
                })}
            </>}
            </div>
        </>
    )
}

const ProductItem = (props) => {
    let product = props.product;

    if (!product) {
        return (<li>Waiting...</li>)
    } 
    else {
        return (
            <Card bg="dark" text="light" className="p-2 my-1" style={{maxWidth: "33%", height: "15em"}}>
                <div style={{display: "flex"}}>
                    <div style={{width: "33%"}}>
                        <img src="https://i.natgeofe.com/k/8fa25ea4-6409-47fb-b3cc-4af8e0dc9616/red-eyed-tree-frog-on-leaves-3-2_3x2.jpg" style={{width: "100%", objectFit: "cover"}}/>
                        <div><ManufacturerComponent manufacturers={product.manufacturers}/></div>
                    </div>
                    <Card.Body>
                        <Card.Title>{product.product_name}</Card.Title>
                        <ReviewStarsComponent reviews={product.reviews}/>
                        <br/>
                        <>
                            {product.product_description}
                        </>
                    </Card.Body>
                </div>
            </Card>
        )
    }
}

const ManufacturerComponent = (props) => {
    let manufacturers = props.manufacturers;
    return (
        <>
            {manufacturers && manufacturers.length > 0?
                <>
                    {manufacturers.map((n, index) => {
                        return (
                            <span key={"manufacturer" + n.manufacturer_id}>
                                {index == manufacturers.length - 1? 
                                <span>{n.manufacturer_name}</span> 
                                : 
                                <span>{n.manufacturer_name}, <br/></span>}
                            </span>
                        )
                    })}
                </> 
            : <></>}
        </>
    )
}

const ReviewStarsComponent = (props) => {
    let reviews = props.reviews;

    let avg = -1;
    if (reviews && reviews.length > 0) {
        let sum = 0;
        for (let review of reviews) {
            sum += Number(review.review_rating);
        }
        avg = Math.round((sum / reviews.length) * 2) / 2; // Round to nearest .5
    }
    
    return (
        <>{avg > -1? 
            <>user rating: {avg}</> :
            <></>
        }</>
    )
}

export default ProductPage;
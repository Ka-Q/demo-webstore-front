import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import PathNavigator from "../../PathNavigator/PathNavigator";
import ProductShowcase from "../../ProductShowcase/ProductShowcase";

const API_PATH = process.env.REACT_APP_DWS_API_URL;


const CategoryPage = () => {

    const [category, setCategory] = useState();
    const [topProducts, setTopProducts] = useState([]);

    useEffect(() => {
        const fetchCategory = async () => {
            let category_name = window.location.pathname.split('/')[3];
            const f = await fetch(`${API_PATH}/api/category?category_name=${category_name}`);
            const data = await f.json();
            setCategory(data.data[0]);
        }
        fetchCategory();
    }, [])

    useEffect(() => {
        const fetchTopProducts = async () => {
            const f = await fetch(`${API_PATH}/api/product_expanded_v2?&order=avg_review_rating desc&limit=10&category_name[]=${category.category_name}`);
            const data = await f.json(); 
            if (f.status == 200 && !data.error) setTopProducts(data.data);
        }
        if (category){
            fetchTopProducts();
        } 
    }, [category])

    if (!category) return (<></>);

    return (
        <div className='mx-auto mb-5' style={{width: "90%"}}>
            <PathNavigator />
            <div className="mt-5" style={{backgroundColor: "rgb(20,20,20)", border: "2px solid rgb(40,40,40)", borderRadius: ".5em", color: "white", overflow: "clip"}}>
                <Row>
                    <Col xs={{span: 12, order: 2}} sm={{span: 5, order: 1}}>
                        <div  className="pt-3 ps-3">
                            <h1>{category.category_name}</h1>
                            <p>{category.category_description}</p>
                        </div>
                    </Col>
                    <Col className="text-center" xs={{span: 12, order: 1}} sm={{span: 7, order: 2}} style={{overflow: 'clip', height: "20em", objectPosition: "center"}}>
                        <div style={{background: `url(${API_PATH}/api/imagefile?filename=missing_image.png)`, height: "100%", overflow: "hidden", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover", boxShadow: "inset 0px 0px 15px 0px black"}}>
                            
                        </div>
                    </Col>
                </Row>
            </div>
            <hr className="my-5"/>
            <h5 className="mt-3">Top rated products in {category.category_name}: </h5>
            {topProducts.length > 0 && topProducts[0]?<ProductShowcase products={topProducts} id={`top-${category.category_id}`}/> : <>no products in category</>}
            <div className="text-center">
                <Link 
                    to={`/search?category=${category.category_name}`}
                >
                    <Button variant="secondary" className="mt-3">Advanced search →</Button>
                </Link>
            </div>
            <hr className="my-5"/>
        </div>
    )
}

export default CategoryPage;
import './allCategoriesPage.css'
import { useEffect, useLayoutEffect, useState } from "react";
import { Card, Col, Form, FormControl, Row } from "react-bootstrap";
import { Link } from 'react-router-dom';
import ProductShowcase from '../../ProductShowcase/ProductShowcase';
import CategoryCard from '../../CategoryCard/CategoryCard';
import PathNavigator from '../../PathNavigator/PathNavigator';

const API_PATH = 'http://localhost:5000';

const AllCategoriesPage = () => {

    const [loaded, setLoaded] = useState(false);
    useLayoutEffect(() => {
        if (!loaded) {
            window.scrollTo({top: 0, behavior: 'instant'});
            setLoaded(true);
        }
    }, [loaded]);

    const [categoryName, setCategoryName] = useState("");
    const [maincategories, setMaincategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const f = await fetch(`${API_PATH}/api/maincategory_expanded?category_name=%${categoryName}%&order=maincategory_name`);
            const data = await f.json();
            if (f.status == 200) setMaincategories(data.data);
        }
        fetchCategories();
    }, [categoryName])

    return (
        <div className='mx-auto' style={{width: "90%"}}>
            <PathNavigator />
            <div className="text-center my-3">
                <h1>All Categories</h1>
                <h4>Find a category for anything and everything tech  related</h4>
            </div>
            <Row className="mt-5">
                <Col>
                    <Form>
                        <div style={{position: "relative"}}>
                            <FormControl 
                                type="search" 
                                aria-label="Search" 
                                placeholder="Search category" 
                                onChange={(e) => setCategoryName(e.target.value)} 
                                value={categoryName} 
                                className="bg-body-tertiary my-3" 
                                data-bs-theme="dark" 
                                style={{paddingRight: "2rem"}}
                            />
                            <button type='submit' style={{position: "absolute", height: "100%", top: 0, right: 0, background: "transparent", border: "0px"}}>🔍</button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    {maincategories.map((n, index) => {
                        return (
                            <MainCategoryCard maincategory={n}/>
                        )
                    })}
                </Col>
            </Row>
        </div>
    )
}                
    
const MainCategoryCard = ({maincategory}) => {

    const [topProducts, setTopProducts] = useState([]);
    let categoryParams = "&category_name[]=";
    
    useEffect(() => {
        const fetchProducts = async () => {
            const f = await fetch(`${API_PATH}/api/product_expanded_v2?&order=avg_review_rating desc&limit=10${categoryParams}`);
            const data = await f.json(); 
            if (f.status == 200) setTopProducts(data.data);
        }
        fetchProducts();
    }, [])

    if (!maincategory) return (<></>);

    for (let cat of maincategory.categories) {
        categoryParams += cat.category_name + ",";
    }

    return (
        <Card className="p-3 mt-5" style={{backgroundColor: "rgb(40,40,40)", border: "2px solid rgb(60,60,60)", color: "white"}}>
            <Link to={`./${maincategory.maincategory_name}`}><h1>{maincategory.maincategory_name} →</h1></Link>
            <p>{maincategory.maincategory_description}</p>
            <Row>
                {maincategory.categories.map((n, index) => {
                    return (
                        <Col sm={6} md={4} lg={3}><div className='pt-4'><Link to={`./${maincategory.maincategory_name}/${n.category_name}`}><CategoryCard category={n}/></Link></div></Col>
                    )
                })}
            </Row>
            <h5 className="mt-3">Top rated products in these categories: </h5>
            <ProductShowcase products={topProducts} id={maincategory.maincategory_id}/>
        </Card>
    )
}

export default AllCategoriesPage
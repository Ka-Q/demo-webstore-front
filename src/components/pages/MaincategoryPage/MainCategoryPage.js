import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import CategoryCard from "../../CategoryCard/CategoryCard";
import ProductShowcase from "../../ProductShowcase/ProductShowcase";
import { Link, useNavigate } from "react-router-dom";
import PathNavigator from "../../PathNavigator/PathNavigator";

const API_PATH = process.env.REACT_APP_DWS_API_URL;


const MainCategoryPage = () => {
    
    const [maincategory, setMaincategory] = useState();
    const [topProducts, setTopProducts] = useState([]);
    const navigate = useNavigate();

    let categoryParams = "&category_name[]=";

    useEffect(() => {
        const fetchMaincategory = async () => {
            const mainCategoryId = window.location.pathname.split('/')[2];
            const f = await fetch(`${API_PATH}/api/maincategory_expanded?maincategory_name=${mainCategoryId}`);
            const data = await f.json();
            setMaincategory(data.data[0]);
        }
        fetchMaincategory();
    }, [navigate])
    
    useEffect(() => {
        const fetchTopProducts = async () => {
            const f = await fetch(`${API_PATH}/api/product_expanded_v2?&order=avg_review_rating desc&limit=10${categoryParams}`);
            const data = await f.json(); 
            if (f.status == 200) setTopProducts(data.data);
        }
        if (maincategory){
            fetchTopProducts();
        } 
    }, [maincategory])

    if (!maincategory) return (<></>);

    for (let cat of maincategory.categories) {
        categoryParams += cat.category_name + ",";
    }
    
    return (
        <div className='mx-auto mb-5' style={{width: "90%"}}>
            <PathNavigator/>
            <div className="mt-5" style={{backgroundColor: "rgb(20,20,20)", border: "2px solid rgb(40,40,40)", borderRadius: ".5em", color: "white", overflow: "clip"}}>
                <Row>
                    <Col xs={{span: 12, order: 2}} sm={{span: 5, order: 1}} lg={{span: 3, order: 1}}>
                        <div  className="pt-3 ps-3">
                            <h1>{maincategory.maincategory_name}</h1>
                            <p>{maincategory.maincategory_description}</p>
                        </div>
                    </Col>
                    <Col key={`banner-image-${maincategory.image_source}`} className="text-center" xs={{span: 12, order: 1}} sm={{span: 7, order: 2}} lg={{span: 9, order: 2}} style={{overflow: 'clip', height: "40vh", objectPosition: "center"}}>
                        <div style={{background: `url(${API_PATH}/api/imagefile?filename=${maincategory.image_source || "asd"})`, height: "100%", overflow: "hidden", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover", boxShadow: "inset 0px 0px 5px 0px black"}}>
                            
                        </div>
                    </Col>
                </Row>
            </div>
            <h5 className="mt-4">Subcategories: </h5>
            <Row>
                {maincategory.categories.map((n) => {
                    return (
                        <Col sm={6} md={4} lg={3} key={`CategoryCardTop-${n.category_id}`}><div className='pt-4'><Link to={`./${n.category_name}`}><CategoryCard category={n}/></Link></div></Col>
                    )
                })}
            </Row>
            <hr className="my-5"/>
            <h5 className="mt-3">Top rated products in {maincategory.maincategory_name}: </h5>
            {topProducts.length > 0 && topProducts[0]? <ProductShowcase products={topProducts} id={`top-${maincategory.maincategory_id}`}/>:<>no products in category</>}
            <div className="text-center">
                <Link 
                    to={`/search?${maincategory.categories.map((n) => {return (`category=${n.category_name}`)}).join('&')}`}
                >
                    <Button variant="secondary" className="mt-3">Advanced search →</Button>
                </Link>
            </div>
            <hr className="my-5"/>
            <h5 className="mt-4">Subcategories: </h5>
            <Row>
                {maincategory.categories.map((n) => {
                    return (
                        <Col sm={6} md={4} lg={3} key={`CategoryCardBottom-${n.category_id}`}><div className='pt-4'><Link to={`./${n.category_name}`}><CategoryCard category={n}/></Link></div></Col>
                    )
                })}
            </Row>
        </div>
    )
}

export default MainCategoryPage;
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductItem from "./ProductItem";
import { Row, Col, Container } from "react-bootstrap";
import FilterComponent from "./FilterComponent";
import { hideResults } from "../../searchBarControl";

const API_PATH = 'http://localhost:5000';

const ProductPage = () => { 
    
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            console.log("Fetching products...");
            let query = makeQuery();
            console.log(query);
            const f = await fetch(`${API_PATH}/api/product_expanded?${query}`);
            const data = await f.json();
            setProducts(data.data);
        }
        const fetchCategory = async () => {
            console.log("Fetching categories...");
            const f = await fetch(`${API_PATH}/api/category?category_name=%${searchParams.get('query')}%`);
            const data = await f.json();
            setCategories(data.data);
        }
        fetchProduct();
        fetchCategory();
    }, [searchParams]);

    const makeQuery = () => {
        let query = "";
        if (searchParams.get("query")) query += `product_name=%${searchParams.get('query')}%`;
        if (searchParams.getAll("category").length > 0) query += `&category_name[]=${searchParams.getAll('category').join(',')}`;
        if (searchParams.get("min_price")) query += `&min_price=${searchParams.get('min_price')}`;
        if (searchParams.get("max_price")) query += `&max_price=${searchParams.get('max_price')}`;
        return query;
    }

    return (
        <Container className="mx-auto">
        <Row>
            <div>
                <CategoryListComponent categories={categories}/>
            </div>
        </Row>
        <Row>
            <Col md={3}>
                    <FilterComponent searchParams={searchParams} setSearchParams={setSearchParams}/>
            </Col>
            <Col md={9}>
                <ProductListComponent products={products}/>
            </Col>
        </Row>
        </Container>
    )
}

const ProductListComponent = (props) => {
    let products = props.products;
    return (
        <>
            <div style={{display: "flow"}}>
            {
            products.length < 1 || !products[0] || !products? 
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

const CategoryListComponent = (props) => {
    let categories = props.categories;
    return (
        <>
            <div style={{display: "flex", overflow: "auto"}}>
            {categories.length < 1 || !categories[0] || !categories? 
            <></>
            :
            <>
                <div>
                    <h5 style={{whiteSpace: "nowrap"}}>Categories matching your search: </h5>
                </div>
                {categories.map((n, index) => {
                    return (
                        <CategoryItem category={n} key={"categoryitem" + n.category_id}/>
                    )
                })}
            </>
            }
            </div>
        </>
    )
}

const CategoryItem = (props) => {
    let category = props.category;

    return (
        <div>
            <Link to={`/categories/${category.category_name}`} className="mx-3" style={{display: "block", whiteSpace: "nowrap"}}><h5>{category.category_name}</h5></Link>
        </div>
    )
}

export default ProductPage;
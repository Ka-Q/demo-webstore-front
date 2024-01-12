import './SearchPage.css';
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Row, Col, Container, Button, DropdownButton } from "react-bootstrap";
import ProductFilter from "./ProductFilter";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import ProductItem from "../../ProductItem/ProductItem";

const API_PATH = process.env.REACT_APP_DWS_API_URL;

const SearchPage = ({maincategoryFilter}) => {

    const [loaded, setLoaded] = useState(false);
    useLayoutEffect(() => {
        if (!loaded) {
            window.scrollTo({top: 0, behavior: 'instant'});
            setLoaded(true);
        }
    }, [loaded]);

    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [maincategories, setMaincategories] = useState([]);
    
    const loadMoreRef = useRef(null);
    const limit = 5;
    const [offset, setOffset] = useState(0);
    const offsetRef = useRef(offset);
    offsetRef.current = offset;

    const [endOfResults, setEndOfResults] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (maincategoryFilter) {
            let sp = searchParams.getAll('category');
            searchParams.delete('category');
            for (let category of maincategoryFilter.categories) {
                if (sp.includes(category.category_name)) searchParams.append('category', category.category_name);
            }
            
        }
    }, [maincategoryFilter])

    useEffect(() => {

        console.log("params: " + searchParams.toString());
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    console.log(endOfResults + ' '+ products.length, " " + entry.isIntersecting);
                    if (!endOfResults && products.length != 0) {
                        fetchProductInfinite();
                    }
                }
            },
            { root: null, rootMargin: '0px', threshold: 1.0 }
        );
    
        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [searchParams, loadMoreRef, endOfResults, products]);

    useEffect(() => {
        setOffset(0);
        offsetRef.current = 0;
        setEndOfResults(false);
        if (maincategoryFilter) {
            let filters = searchParams.getAll('category');
            if (filters.length == 0) {
                for (let cat of maincategoryFilter.categories) {
                    searchParams.append("category", cat.category_name);
                }
                setSearchParams(searchParams);
            }
        }
        fetchProduct();
        fetchCategory();
    
    }, [searchParams]);

    const fetchProduct = async () => {
        setLoading(true);
        let query = makeQuery();
        console.log("Fetching products... " + query);
        const f = await fetch(`${API_PATH}/api/product_expanded_v2?${query}`);
        const data = await f.json();
        setLoading(false);
        if (data.data && data.data.length > 0 && data.data[0] !== null) {
            setProducts(data.data);
            setOffset(limit);
        } else {
            setProducts([]);
            setEndOfResults(false);
        }
    }

    let lastRun = Date.now();

    const fetchProductInfinite = async () => {
        if (Date.now() - lastRun < 150) return;
        lastRun = Date.now();
        setLoading(true);

        let query = makeQuery();
        console.log("Fetching infinite products... " + query);
        const f = await fetch(`${API_PATH}/api/product_expanded_v2?${query}`);
        const data = await f.json();
        setLoading(false);
        if (data.data && data.data.length > 0 && data.data[0] !== null) {
            setProducts(prevProducts => [...prevProducts, ...data.data]);
            setOffset(prevOffset => prevOffset + limit);
        } else {
            setEndOfResults(true);
        }
    }
    
    const fetchCategory = async () => {
        console.log("Fetching categories...");
        const f = await fetch(`${API_PATH}/api/maincategory_expanded?category_name=%25${searchParams.get('query')}%25&order=category_name`);
        const data = await f.json();

        let sorted = data.data.sort((a, b) => (a.maincategory_name > b.maincategory_name) ? 1 : -1)

        if (sorted.length < 1 || sorted[0] == null) return;

        let previousMaincategoryName = sorted[0].maincategory_name;
        const combinedList = [];
        let combined = sorted[0];

        for (let i in sorted) {
            if (i == 0) continue;
            let maincategory = sorted[i];
            if (previousMaincategoryName != maincategory.maincategory_name) {
                previousMaincategoryName = maincategory.maincategory_name;
                combinedList.push(combined);
                combined = maincategory;
            }
            else {
                combined.categories.push(maincategory.categories[0]);
            }
        }

        combinedList.push(combined);
        setMaincategories(combinedList);
    }

    const makeQuery = () => {
        let query = "";
        if (searchParams.get("query")) query += `product_name=%25${searchParams.get('query') || ""}%25`;
        if (searchParams.getAll("category").length > 0) query += `&category_name[]=${searchParams.getAll('category').join(',')}`;
        if (searchParams.get("min_price")) query += `&min_price=${searchParams.get('min_price') * 100}`;
        if (searchParams.get("max_price")) query += `&max_price=${searchParams.get('max_price') * 100}`;
        if (searchParams.get("order")) {query += `&order=${searchParams.get('order')}`}
        else {query += `&order=avg_review_rating desc`}
        query += `&limit=${limit}`
        query += `&offset=${offsetRef.current}`
        return query;
    }

    const selectedCategories = searchParams.getAll("category");

    return (
        <div style={{position: "relative", minHeight: "100vh"}}>
            <Container className="mx-auto">
                {!maincategoryFilter?
                    <Row>
                        <div className="mt-3">
                            <CategoryListComponent maincategories={maincategories}/>
                        </div>
                    </Row>
                : <></>}
                <Row>
                    <Col md={3}>
                        <ProductFilter searchParams={searchParams} setSearchParams={setSearchParams} maincategoryFilter={maincategoryFilter}/>
                    </Col>
                    <Col md={9}>
                        <div className="text-center my-5">
                            <h1>Showing results for "{searchParams.get('query')}"</h1>
                            <h3 hidden={selectedCategories.length == 0}>
                                in {selectedCategories.length > 1? "categories " : "category "} 
                                {selectedCategories.filter((item, index) => selectedCategories.indexOf(item) === index).join(', ')}
                            </h3>
                        </div>
                        <ProductListSortComponent searchParams={searchParams} setSearchParams={setSearchParams}/>
                        <ProductListComponent products={products}/>
                        <div className="text-center" id="product-list-end" ref={loadMoreRef}>
                            {!endOfResults && products.length > 1? 
                                <Button variant="secondary" disabled={loading} onClick={() => fetchProductInfinite()}>Load more results</Button> 
                            : products.length > 1? 
                                <div className="my-3">End of results</div> 
                            : <></>}
                            {loading && !endOfResults && products.length > 1? <div>Loading more results...</div> : <></>}
                        </div>
                    </Col>
                </Row>
            </Container>
            <ScrollToTopComponent/>
        </div>
    );
};

const ProductListSortComponent = (props) => {
    const searchParams = props.searchParams;
    const setSearchParams = props.setSearchParams;
    const [order, setOrder] = useState(searchParams.get("order") || "avg_review_rating desc");

    let orderString = order.split(' ')[0];
    let directionString = order.split(' ')[1] || 'asc';

    const lookup = {
        avg_review_rating: "Review score",
        product_name: "Product name",
        price: "Price"
    }

    useEffect(() => {
        const newOrder = searchParams.get("order") || "avg_review_rating desc";
        if (newOrder !== order) {
            setOrder(newOrder);
        }
    }, [searchParams]);
    
    useEffect(() => {
        searchParams.set("order", order);
        setSearchParams(searchParams, { replace: true });
    }, [order]);

    return (
        <div style={{display: "flex"}}>
            <div className="my-auto me-2">
                <span>Order: </span>
            </div>
            <div className="me-2">
                <DropdownButton title={lookup[orderString]} variant="secondary" data-bs-theme="dark" onSelect={(e) => setOrder(e)}>
                    <DropdownItem eventKey="avg_review_rating">{lookup.avg_review_rating}</DropdownItem>
                    <DropdownItem eventKey="product_name">{lookup.product_name}</DropdownItem>
                    <DropdownItem eventKey="price">{lookup.price}</DropdownItem>
                </DropdownButton>
            </div>
            <div>
                <Button variant="secondary" onClick={(e) => {directionString == 'asc'? setOrder(orderString + " desc") : setOrder(orderString + " asc")}}>
                    {directionString == 'asc'? '⇈' : '⇊'}
                </Button>
            </div>
        </div>
    )
}

const ProductListComponent = (props) => {
    let products = props.products;
    return (
        <>
            <div style={{display: "flow"}}>
                {
                (products.length < 1 || !products[0] || !products)? 
                <div className="text-center">
                    <p>No results.</p>
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

const CategoryListComponent = ({maincategories}) => {

    useEffect(() => {
        let container = document.querySelector('#category-list-container');

        if (container) {
            container.addEventListener("wheel", function (e) {
                e.preventDefault();
                console.log("scroll");
                if (e.deltaY > 0) container.scrollTo({ left: container.scrollLeft + 25, behavior: 'instant' });
                else container.scrollTo({ left: container.scrollLeft - 25, behavior: 'instant' });
            });
        }
    }, [maincategories]);

    console.log(maincategories);

    return (
        <>
            {maincategories.length < 1 || !maincategories[0] || !maincategories || typeof maincategories == undefined? 
            <></>
            :
            <>
            <h5> Categories matching your search:</h5>
            <div style={{display: "flex", overflow: "clip", position: "relative", borderRadius: ".3em"}}>
                <div className="left-fade"/>
                <div className="right-fade"/>
                <div id='category-list-container' className="category-fade mt-2 pb-2" style={{position: "relative", display: "flex", overflow: "auto"}}>
                    <div className="mx-3"/>
                    {maincategories.map((n, index) => {
                        return (
                            <CategoryItem maincategory={n} key={n.maincategory_id + "categoryitem" + n.categories[0].category_id}/>
                        )
                    })}
                    <div className="mx-3"/>
                </div>
            </div>
            <hr/>
            </>
            }
        </>
    )
}

const CategoryItem = ({maincategory}) => {

    console.log(maincategory);

    return (
        <div className="ms-1">
            <div 
                className="px-3 pt-1" 
                style={{display: "flex", flexDirection: "row", whiteSpace: "nowrap"}}>
                    <h5 className='me-1 p-1' style={{display: "block"}}>
                        {maincategory.maincategory_name} {">"}
                    </h5>
                    <div style={{display: "flex", gap: "1rem"}}>
                        {maincategory.categories.map((n) => {
                            return(
                                <Link className='p-1 flex-category-button'
                                    to={`/categories/${maincategory.maincategory_name}/${n.category_name}`} 
                                    key={`linkto${maincategory.maincategory_name}/${n.category_name}`}
                                    style={{border: "2px solid rgb(60,60,60)", borderRadius: ".5em", userSelect: "none"}}>
                                        {n.category_name}
                                </Link>
                            )
                        })}
                    </div>
            </div>
        </div>
    )
}

const ScrollToTopComponent = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY !== 0) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {visible && 
                <div style={{position: "fixed", right: 20, bottom: 20}}>
                    <Button onClick={() => window.scrollTo(0, 0)}>Back to top ▲</Button>
                </div>
            }
        </>
    )
}

export default SearchPage;
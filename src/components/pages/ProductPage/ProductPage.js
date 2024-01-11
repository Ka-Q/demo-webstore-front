import "./productPage.css";
import { useEffect, useState } from "react";
import { ImageViewer } from "../../ImageViewer/ImageViewer";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const API_PATH = process.env.REACT_APP_DWS_API_URL;

const ProductPage = () => {

    const [product, setProduct] = useState({});

    useEffect(() => {
        const fetchProduct = async () => {
            const productId = window.location.pathname.split('/')[2];
            const f = await fetch(`${API_PATH}/api/product_expanded_v2?product_id=${productId}`);
            const data = await f.json();
            setProduct(data.data[0]);
            
        }
        fetchProduct();
    }, []);

    if (!product || !product.product_name) {
        return (<></>)
    }

    return (
        <Container>
            <Row>
                <Col md={5} className="mt-2">
                    {product.images? <ImageViewer images={product.images} path={API_PATH + "/api/imagefile?filename="}/> : <></>}
                </Col>
                <Col md={7} className="mt-2">
                    <ProductSummary product={product}/>
                </Col>
            </Row>
            <Row>
                <Col className="mt-2">
                    <Card style={{backgroundColor: "rgb(20,20,20)", border: "2px solid rgb(40,40,40)", color: "white", height: "100%"}}>
                        <Card.Header>
                            <div style={{display: "flex"}}>
                                <h3>Reviews: </h3>
                                <div className="ms-auto mt-2"><ReviewStarsComponent product={product}/></div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {product.reviews.map((n) => {
                                return (
                                    <ReviewCard review={n} />
                                )
                            })}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

const ProductSummary = ({product}) => {
    if (!product) {
        return (<>asd</>);
    }
    return (
        <Card style={{backgroundColor: "rgb(20,20,20)", border: "2px solid rgb(40,40,40)", color: "white", height: "100%"}}>
            <Card.Header className="text-center">
                <h1>{product.product_name}</h1>
            </Card.Header>
            <Card.Body>
                <ReviewStarsComponent product={product}/>
                <p className="mt-4">{product.product_description}</p>
                <ProductPriceComponent product={product}/>
                <p><b>Currently in stock: {product.product_stock}</b></p>

                {product.event? <EventInfo event={product.event}/> : <></>}
            </Card.Body>
        </Card>
    )
}

const ReviewStarsComponent = ({product}) => {
    let avg = Math.round((product.avg_review_rating) * 10) / 10;
    let reviews = product.reviews;

    let count = reviews.length || 0;

    let scale = 2;

    let sizeX = 14 * scale;
    let sizeY = 11.2  * scale;
    let width = 68  * scale;
    let width2 = width * (avg)/5;

    if (avg <= 0) {
        width2 = 0;
    } 
    
    return (
        <div className="ms-2" style={{display: "flex", flexWrap: "wrap", height: `${sizeY}px`}}>
            <div style={{ 
                backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.44 19'><polygon fill='%2380868b' points='10,15.27 16.18,19 14.54,11.97 20,7.24 12.81,6.63 10,0 7.19,6.63 0,7.24 5.46,11.97 3.82,19'/></svg>")`,
                backgroundSize: `${sizeX}px ${sizeY}px`,
                height: `${sizeY}px`,
                width: `${width}px`,
                backgroundRepeat: "repeat-x"
                }}>
                <div style={{ 
                    backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.44 19'><polygon fill='%23fdd663' points='10,15.27 16.18,19 14.54,11.97 20,7.24 12.81,6.63 10,0 7.19,6.63 0,7.24 5.46,11.97 3.82,19'/></svg>")`,
                    backgroundSize: `${sizeX}px ${sizeY}px`,
                    height: `${sizeY}px`,
                    width: `${width2}px`,
                    backgroundRepeat: "repeat-x"
                }}>
                </div>
            </div>
            <div style={{marginInlineStart: ".5em", width: "12em"}}>{`${avg} avg / ${count} reviews`}</div>
        </div>
    )
}

const ProductPriceComponent = (props) => {

    let product = props.product;
    let price = product.price / 100;
    return (
        <>
        <Row className="mx-auto">
        {!product.discount? 
            <Col md={3}><span className="me-2" style={{fontSize: "1.5em", fontWeight: "bold", color: "red", whiteSpace: "nowrap"}}>{price}€</span></Col>
            :
            <Col md={5}>
            <span className="me-2" style={{fontSize: "1.5em", fontWeight: "bold", color: "red", whiteSpace: "nowrap"}}>{price - (price / 100 * product.discount)}€ 
                <span className="me-2" style={{fontSize: "1em", fontWeight: "bold", textDecoration: "line-through", color: "darkred"}}> {price}€</span> 
            </span>
            {product.event? 
                <EventCountdown event={product.event}/>
            : 
                <></>}
            </Col>
            }
            <Col style={{fontSize: "1.5em"}}>
                <div className="text-center mt-2 ms-auto" style={{background: "green", border: "2px solid rgb(0, 175, 0)", borderRadius: ".2em", cursor: "pointer", width: "11rem", whiteSpace: "nowrap"}}>🛒 Add to cart</div>
            </Col>
        </Row>
        </>
    )
}

const EventCountdown = ({event}) => {
    const [time, setTime] = useState({});

    useEffect(() => {
        let eventEndDate = event.event_end_date ? new Date(event.event_end_date) : new Date(Date.now() + 86400000);

        const intervalId = setInterval(() => {
            const diff = eventEndDate - Date.now();
            if (diff <= 0) {
                clearInterval(intervalId);
                setTime({});
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                setTime({ hours, minutes });
            }
        }, 1000); // update every second

        // cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []); // empty dependency array means this effect runs once on mount and cleanup on unmount

    return (
        time.hours !== undefined ? 
        <span className="px-1" style={{border: "1px solid orange", borderRadius: ".2em", color: "orange", textDecoration: "none", whiteSpace: "nowrap"}}>
            🕑 {time.hours}h {time.minutes}min
        </span>
        : 
        <></>
    );
}

const EventInfo = ({event}) => {
    return (
        <>
            <p><b>Currently part of a limited time Sales event!</b></p>
            <Card>
                <Card.Header>
                    {event.event_name || "event name"}
                </Card.Header>
                <Card.Body>
                    {event.event_description || "event description"}
                    <br/>
                    until {event.event_end_date || new Date().toISOString()}
                </Card.Body>
            </Card>
        </>
    )
}

const ReviewCard = ({review}) => {

    const [user, setUser] = useState({
        user_id: -1,
        user_username: "Anonymous",
        image_id: -1,
        image_src: "default_pfp.png",
      });

    useEffect(() => {
        const fetchUser = async () => {
            const f = await fetch(`${API_PATH}/api/public_user_profile?user_id=${review.user_id}`);
            const data = await f.json();
            setUser(data.data[0]);
        }
        if (review.user_id > -1) {
            fetchUser();
        }
    }, []);

    return (
        <Card className="mt-2" style={{backgroundColor: "rgb(30,30,30)", border: "2px solid rgb(50,50,50)", color: "white"}}>
            <Card.Header>
                <Link to={`/profile/${user.user_id}`} style={{display: "flex"}}>
                    <span className='review-user-image-container'>
                        <Image className='user-image' src={`${API_PATH}/api/imagefile?filename=${user.image_src}`}/>
                    </span>
                    <h4 className="my-auto">
                        {user.user_username}
                    </h4>
                    <span className="my-auto">
                        <Stars review={review} />
                    </span>
                </Link>
            </Card.Header>
            <Card.Body>
                {review.review_description}
            </Card.Body>
        </Card>
    )
}

const Stars = ({review}) => {
    let score = review.review_rating;

    let scale = 2;

    let sizeX = 14 * scale;
    let sizeY = 11.2  * scale;
    let width = 68  * scale;
    let width2 = width * (score)/5;

    if (score <= 0) {
        width2 = 0;
    } 
    
    return (
        <div className="ms-2" style={{display: "flex", flexWrap: "wrap", height: `${sizeY}px`}}>
            <div style={{ 
                backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.44 19'><polygon fill='%2380868b' points='10,15.27 16.18,19 14.54,11.97 20,7.24 12.81,6.63 10,0 7.19,6.63 0,7.24 5.46,11.97 3.82,19'/></svg>")`,
                backgroundSize: `${sizeX}px ${sizeY}px`,
                height: `${sizeY}px`,
                width: `${width}px`,
                backgroundRepeat: "repeat-x"
                }}>
                <div style={{ 
                    backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.44 19'><polygon fill='%23fdd663' points='10,15.27 16.18,19 14.54,11.97 20,7.24 12.81,6.63 10,0 7.19,6.63 0,7.24 5.46,11.97 3.82,19'/></svg>")`,
                    backgroundSize: `${sizeX}px ${sizeY}px`,
                    height: `${sizeY}px`,
                    width: `${width2}px`,
                    backgroundRepeat: "repeat-x"
                }}>
                </div>
            </div>
            <div style={{marginInlineStart: ".5em", width: "12em"}}>{`( ${score} / 5 )`}</div>
        </div>
    )
}

export default ProductPage;
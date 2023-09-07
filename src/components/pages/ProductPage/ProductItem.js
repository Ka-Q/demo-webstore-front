import "./ProductItem.css"
import { Card, Col, Image, Row } from "react-bootstrap";

const ProductItem = (props) => {
    let product = props.product;

    if (!product) {
        return (<li>Waiting...</li>)
    } 
    else {
        return (
            <Card className=" my-1" style={{backgroundColor: "rgb(20,20,20)", border: "2px solid black", color: "white"}}>
                <Row>
                    <Col sm={6} className="text-center">
                        <ProductImageComponent src="https://media.istockphoto.com/id/175422366/photo/frog-eating-a-fly.jpg?s=612x612&w=0&k=20&c=Jqki5v4ohuT-FebvDd4dP1Q4gj4SFCS0ZhEOfHATTmc="/>
                        <ManufacturerComponent manufacturers={product.manufacturers}/>
                    </Col>
                    <Col sm={6}>
                        <h4><a href={"/product/" + product.product_id + "/" + product.product_name}>{product.product_name}</a></h4>
                        <ReviewStarsComponent reviews={product.reviews} avg={product.avg_review_rating}/>
                        <ProductPriceComponent product={product}/>
                        <p className="mx-1">
                            {product.product_description} ({product.categories.map((n, index)=>{return (<span key={'descCat'+n.category_id}>{n.category_name}, </span>)})})
                            ...
                        </p>
                    </Col>
                </Row>
            </Card>
        )
    }
}

const ManufacturerComponent = (props) => {
    let manufacturers = props.manufacturers;
    
    return (
        <div>
            {manufacturers && manufacturers.length > 0?
                <div className="m-2 mx-auto" 
                >
                    {manufacturers.map((n, index) => {
                        return (
                            <span key={"manufacturer" + n.manufacturer_id}>
                                {index == manufacturers.length - 1? 
                                <a href="#"> {n.manufacturer_name}</a> 
                                : 
                                <><a href="#"> {n.manufacturer_name}</a>, </>}
                            </span>
                        )
                    })}
                    <br/>
                </div> 
            : <></>}
        </div>
    )
}

const ProductPriceComponent = (props) => {

    let product = props.product;
    let price = product.price;
    return (
        <div className="mt-4 mb-3" style={{position: "relative", color: 'red', fontSize: "1.5rem", fontWeight: "bold"}}>
            {price}€
            <div style={{position: "absolute", top: "0", right: "1em", width: "3rem", height: "3rem", backgroundColor: "green", color: "white", border: "2px solid black", borderRadius: ".2em", textAlign: "center", cursor: "pointer"}}>
                🛒
            </div>
        </div>
    )
}

const ProductImageComponent = (props) => {
    let imgsrc = props.src;

    let width = 15;
    let height = 15;

    return (
        <div 
        className="m-2 mx-auto" 
        style={{width: `${width}em`, 
            height: `${height}em`, 
            backgroundImage: `url(${imgsrc})`, 
            backgroundPosition: "center", 
            backgroundRepeat: "no-repeat", 
            backgroundSize: "cover", 
            border: "2px solid black", 
            borderRadius: ".5rem",
            cursor: "pointer"}}>
        </div>
    )
}

const ReviewStarsComponent = (props) => {
    let avg = Math.round((props.avg) * 10) / 10;
    let reviews = props.reviews;

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
        <div style={{display: "flex", flexWrap: "wrap", height: `${sizeY}px`}}>
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

export default ProductItem;
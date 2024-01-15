import './productShowcase.css'
import { Col, Row } from "react-bootstrap";
import ProductItem from "../ProductItem/ProductItem";


const hasHorizontalScrollBar = (container) => {

    if (!container) return false;

    let hasSrollwheel = !! container.scrollLeft;

    if (!hasSrollwheel) {
        container.scrollLeft = 1;
        hasSrollwheel = !!container.scrollLeft;
        container.scrollLeft = 0;
    }

    return hasSrollwheel;
}

const ProductShowcase = ({products, id}) => {

    if (!products || !id) {
        return (<></>);
    }

    const scrollList = (dir) => {
        let container = document.querySelector(`#horizontal-list-container-${id}`);
        if (!container) return;

        if (container.scrollLeft < 1 && dir < 1) {
            container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
            return;
        } 

        let endReached = container.scrollLeft + container.clientWidth >= container.scrollWidth;
        if (endReached && dir > 0) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
            return;
        } 
        let width = container.children[0].getBoundingClientRect().width;
        
        if (dir > 0) {
            container.scrollTo({ left: container.scrollLeft + width, behavior: 'smooth' });
        } else {
            container.scrollTo({ left: container.scrollLeft - width, behavior: 'smooth' });
        }
    }

    return (
        <div style={{position: "relative"}}>
                <div className='scroll-button scroll-button-left' title="Scroll left" onClick={() => scrollList(-1)} hidden={!hasHorizontalScrollBar(document.querySelector(`#horizontal-list-container-${id}`))}>
                    <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%) scale(2)"}}>⇠</div>
                </div>

                <div className='scroll-button scroll-button-right' title="Scroll right" onClick={() => scrollList(1)} hidden={!hasHorizontalScrollBar(document.querySelector(`#horizontal-list-container-${id}`))}>
                    <div style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%) scale(2)"}}>⇢</div>
                </div>
            <div>
                <Row id={`horizontal-list-container-${id}`} className="horizontal-list-container">
                    {products.map((n) => {
                        return (
                            <Col xs={12} md={11} lg={7} xxl={5} key={`ProductItem${id}-${n.product_id}`} className='p-1 pb-2'>
                                <div style={{height: "100%"}}><ProductItem product={n}/></div>
                            </Col>
                        )
                    })}
                </Row>
            </div>
        </div>
    )
}


export default ProductShowcase;
import './FrontPage.css'
import { Row, Col, Image } from "react-bootstrap";
import FrontPageLogin from "./FrontPageLogin";
import FrontPageRegister from "./FrontPageRegister";

const FrontPage = (props) => {
    const user = props.user;
    console.log(user);
    return (
        <div className='front-page-root' style={{paddingBottom: "100%"}}>
                {user.user_email? 
                    <h1 style={{paddingBottom: "100em"}}>Welcome back {props.user.user_first_name}!</h1>
                :
                <>
                <h1 style={{textAlign: "center"}}>Welcome to the Demo-WebStore</h1>
                <div className="login-banner py-2 mx-2 mt-5">
                    <Row className="mx-auto">
                        <Col md={4}>
                            <FrontPageLogin/>
                        </Col>
                        <Col md={4}>
                            <img style={{width: "100%", height: "15em", objectFit: "cover"}} src='https://i.pinimg.com/originals/44/a8/da/44a8dabf0e4bf6e2616cd0f6d0ce5912.gif'/>
                        </Col>
                        <Col md={4}>
                            <FrontPageRegister/>
                        </Col>
                    </Row>
                </div>
                </>
                }
        </div>
    )
}

export default FrontPage;
import './FrontPageLogin.css'
import LoginForm from "../../Login/LoginForm";

const FrontPageLogin = () => {
    return (
        <div className="bg-body-tertiary" id="frontpage-login" data-bs-theme="dark" >
            <h3>Log in to ease your shopping</h3>
            <LoginForm />
        </div>
    );
};

export default FrontPageLogin;
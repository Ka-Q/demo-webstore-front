import './loginForm.css'
import { useState } from 'react';
import { Form, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const API_PATH = process.env.REACT_APP_DWS_API_URL;

const LoginForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogIn = async () => {
        console.log(email + " " + password);
        const f = await fetch(`${API_PATH}/api/login`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_email: email, user_password: password })
        });
        if (f.status == 200) {
            window.location.reload();
        } else {
            setError('Something went wrong.')
        }
    }

    return (
        <Form>
            <Form.Control
                type="text"
                placeholder="email"
                aria-label="Search"
                onChange={(e) => setEmail(e.target.value)}
                className='my-1'
            />
            <Form.Control
                type="password"
                placeholder="password"
                aria-label="Search"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogIn} variant='success' className='my-1 me-2 login-form-button'>Log in</Button> 
            <br/>
            <span>No account? Register <Link to={'/register'} className='login-form-link'>here!</Link></span>
            <p>{error}</p>
        </Form>
    )
}

export default LoginForm
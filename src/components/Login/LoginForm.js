import { useState } from 'react';
import { Form, Button} from 'react-bootstrap';

const API_PATH = 'http://localhost:5000';

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
                className='my-1'
            />
            <Button onClick={handleLogIn} style={{ minWidth: "100%" }} variant='success'>Log in</Button>
            <Button href="/register" style={{ minWidth: "100%" }} className='my-1'>Register</Button>
            <p>{error}</p>
        </Form>
    )
}

export default LoginForm
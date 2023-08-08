import { useState } from 'react';
import { Form, Button, Row, Col} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const API_PATH = 'http://localhost:5000';

const RegisterPage = (props) => {

    if (props.user.user_email) {
        window.location.href = "/"
    }

    return (
        <div style={{height: "100vh"}}>
            <h1 style={{textAlign: 'center'}} className='my-4'>Welcome to our new customer!</h1>
            <div style={{textAlign: 'center', maxWidth: "40em", margin: "auto"}}>
                <RegisterForm/>
            </div>
        </div>
    )
}

const RegisterForm = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const navigate = useNavigate();

    const [error, setError] = useState("");

    const checkEmail = () => {
        let splitAT = email.split('@');
        if (splitAT.length != 2) return false;
        return true;
    }

    const checkPassword = () => {
        return (password == confirmedPassword);
    }

    const handleRegister = async () => {
        let err = "";
        if (!checkEmail()) {
            err += "Email is not valid. ";
        }
        if (!checkPassword()) {
            err += "Passwords do not match. ";
        }

        if (err.length == 0) {
            const f = await fetch(`${API_PATH}/api/register`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_email: email, user_password: password, user_first_name: firstName, user_last_name: lastName })
            });
            if (f.status == 200) {
                const f = await fetch(`${API_PATH}/api/login`, {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ user_email: email, user_password: password })
                });
                navigate('/welcome')
            } else {
                setError('Something went wrong... This Email might already be in use.')
            }
        } else {
            setError(err);
        }
    }

    return (
        <Form>
            <Row>
                <Col sm={6}>
                    <Form.Label>Email: 
                        <Form.Control
                            type="text"
                            placeholder="email"
                            aria-label="Search"
                            onChange={(e) => setEmail(e.target.value)}
                            className='mb-1'
                        />
                    </Form.Label>
                    <br/>
                    <Form.Label>Password: 
                        <Form.Control
                            type="password"
                            placeholder="password"
                            aria-label="Search"
                            onChange={(e) => setPassword(e.target.value)}
                            className='mb-1'
                        />
                    </Form.Label>
                    <br/>
                    <Form.Label>Comfirm Password: 
                        <Form.Control
                            type="password"
                            placeholder="confirm password"
                            aria-label="Search"
                            onChange={(e) => setConfirmedPassword(e.target.value)}
                            className='mb-1'
                        />
                    </Form.Label>
                </Col>
                <Col sm={6}>
                    <Form.Label>First name: 
                        <Form.Control
                            type="text"
                            placeholder="first name"
                            aria-label="Search"
                            onChange={(e) => setFirstName(e.target.value)}
                            className='mb-1'
                        />
                    </Form.Label>
                    <br/>
                    <Form.Label>Last name: 
                        <Form.Control
                            type="text"
                            placeholder="last name"
                            aria-label="Search"
                            onChange={(e) => setLastName(e.target.value)}
                            className='mb-1'
                        />
                    </Form.Label>
                </Col>
            </Row>
            <Button onClick={handleRegister} style={{ minWidth: "60%" }} variant='success' className='mx-5 mt-3'>Register</Button>
            <p>{error}</p>
        </Form>
    )
}

export default RegisterPage;
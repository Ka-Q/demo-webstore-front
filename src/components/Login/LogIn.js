import './Login.css'
import { DropdownButton, Dropdown} from 'react-bootstrap';
import LoginForm from '../LoginForm/LoginForm';

const LoginComponent = (props) => {
    
    return (
        <div className={props.className}>
            <DropdownButton title="Log In" variant='outline-success' align={'end'} className='navbar-login'>
                <Dropdown.ItemText style={{ minWidth: "15em" }}>
                    <LoginForm/>
                </Dropdown.ItemText>
            </DropdownButton>
        </div>
    )
}

export default LoginComponent;
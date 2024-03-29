import './logOut.css';

import { Button} from 'react-bootstrap';
const API_PATH = process.env.REACT_APP_DWS_API_URL;

const LogOutComponent = (props) => {

    const handleLogOut = async () => {
        await fetch(`${API_PATH}/api/logout`, {
            method: "POST",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        window.location.reload();
    }

    return (
        <div className={props.className}>
            <Button variant='outline-success' onClick={handleLogOut} className='text-nowrap log-out-button'>Log Out</Button>
        </div>
    )
}

export default LogOutComponent;
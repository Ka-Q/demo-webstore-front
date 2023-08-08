
import { Button} from 'react-bootstrap';
const API_PATH = 'http://localhost:5000';

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
            <Button variant='outline-success' onClick={handleLogOut} className='text-nowrap' style={{ width: "5.5em" }}>Log Out</Button>
        </div>
    )
}

export default LogOutComponent;
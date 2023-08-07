import { Button } from "react-bootstrap";

const FrontPageRegister = () => {
    return (
        <>
            <h3>Not a member yet? Register now to manage your wishlist, review products and ease your ordering process! </h3>
            <br/>
            <Button href="/register" style={{ minWidth: "100%", lineHeight: "3em"}} className='my-1'>Register here!</Button>
        </>
    )
}

export default FrontPageRegister;
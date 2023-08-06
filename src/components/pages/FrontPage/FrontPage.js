
const FrontPage = (props) => {
    return (
        <h1 style={{paddingBottom: "100em"}}>Hi {props.user.user_first_name} {props.user.user_last_name} ({props.user.user_username}/{props.user.user_id})</h1>
    )
}

export default FrontPage;
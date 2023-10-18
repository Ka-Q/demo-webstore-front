import { Link } from "react-router-dom";

const PathNavigator = () => {

    const paths = window.location.pathname.split('/');

    return (
        <h5> 
            <Link to={`/`} key={`PathNavigator-${0}`}><u>DWS</u> </Link>
            {paths.map((n, index) => {
                let path = "";

                for (let i = 0; i < index + 1; i++) {
                    path += paths[i] + "/";
                }
                if (index == paths.length - 1) {
                    return (
                        <u key={`PathNavigator-${n}`}><Link to={path}>{decodeURI(n)}</Link></u>
                    )
                }

                return (
                    <span key={`PathNavigator-${n}`}><u><Link to={path}>{decodeURI(n)}</Link></u> / </span>
                )
            })}
        </h5>
    )
}

export default PathNavigator;
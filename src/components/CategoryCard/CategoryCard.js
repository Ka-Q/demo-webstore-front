import { Card } from "react-bootstrap";
import { Link } from 'react-router-dom';

const CategoryCard = ({category}) => {

    if (!category) return (<></>);

    return (
        <Card className="p-3 category-card" style={{height: "7em", backgroundColor: "rgb(20,20,20)", border: "2px solid rgb(60,60,60)", color: "white"}}>
            <Card.Title>{category.category_name}</Card.Title>
            <Card.Text>{category.category_description}</Card.Text>
        </Card>
    )
}

export default CategoryCard
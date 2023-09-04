import { useEffect, useState } from "react";
import { Button, Card, FormControl, Form, Row, Col } from "react-bootstrap";
import { hideResults } from "../../searchBarControl";
import MultiRangeSlider from "../../multiRangeSlider/MultiRangeSlider";

import "./FilterComponent.css";

const API_PATH = 'http://localhost:5000';

const FilterComponent = (props) => {
    const searchParams = props.searchParams;
    const setSearchParams = props.setSearchParams;
    const [productName, setProductName] = useState(searchParams.get("query"));

    useEffect(() => {
        const updateProductName = () => {
            setProductName(searchParams.get("query"));
        }
        updateProductName();
    }, [searchParams])

    const updateQuery = () => {
        searchParams.set("query", productName);
        setSearchParams(searchParams);
        hideResults();
    }

    return (
        <Card bg="dark" text="light" className="sticky-top my-1" style={{width: "100%", maxWidth: "100%", top: 80, zIndex: 0}}>
            <div className="mx-auto" style={{width: "100%", backgroundColor: "rgb(20,20,20)", borderRadius: "inherit", border: "2px solid black"}}>
                <h2 style={{textAlign: "center"}}>Filter products</h2>
                <Form className="mx-2">
                    <FormControl placeholder="Product name" onChange={(e) => setProductName(e.target.value)} value={productName}/>
                    <CategoryFilterComponent searchParams={searchParams}/>
                    <PricefilterComponent searchParams={searchParams}/>
                    <Button onClick={() => updateQuery()}>Filter</Button>
                </Form>
            </div>
        </Card>
    )
}

const CategoryFilterComponent = (props) => {
    const searchParams = props.searchParams;
    const [maincategories, setMaincategories] = useState([]);

    useEffect(() => {
        const fetchMaincategories = async () => {
            const f = await fetch(`${API_PATH}/api/maincategory`);
            const data = await f.json();
            setMaincategories(data.data);
        }
        fetchMaincategories();
    }, []);

    return (
        <div>
            Filter by category:
            {maincategories.map((n, index) => {
                return (
                    <div key={"maincategoryFilter" + n.maincategory_id}>
                        <MainCategoryFilterItem main={n} searchParams={searchParams}/>
                    </div>
                )
            })}
        </div>
    )
}

const MainCategoryFilterItem = (props) => {

    const mainCategory = props.main;
    const [subCategories, setSubCategories] = useState([]);

    const searchParams = props.searchParams;

    useEffect(() => {
        const fetchSubCategories = async () => {
            const f = await fetch(`${API_PATH}/api/maincategory_category?maincategory_id=${mainCategory.maincategory_id}`);
            const data = await f.json();
            if (data.data) {
                setSubCategories(data.data);
            } else {
                setSubCategories([{category_id: 'error'}]);
            }
        }
        fetchSubCategories();
    }, [])

    const toggleMainCategory = (e) => {
        if(e.target.checked) {
            for (let cat of subCategories) {
                let checkbox = document.querySelector(`#categoryCheck${cat.category_id}`);
                checkbox.checked = true;
                searchParams.append('category', cat.category_name);
            }
        } else {
            for (let cat of subCategories) {
                let checkbox = document.querySelector(`#categoryCheck${cat.category_id}`);
                checkbox.checked = false;
                searchParams.delete('category');
            }
        }
    }

    console.log(mainCategory);

    return (
        <div className="my-1 pb-2" style={{borderBottom: "1px solid rgb(100,100,100)"}}>
            <input 
                type="checkbox" 
                name={mainCategory.maincategory_name + "mainCategoryCheck"} 
                id={`mainCategoryCheck${mainCategory.maincategory_id}`} 
                className="filter-checkbox"
                value={mainCategory.maincategory_name}
                onChange={(e) => toggleMainCategory(e)}
            />
            <label htmlFor={"mainCategoryCheck" + mainCategory.maincategory_id}>{mainCategory.maincategory_name}</label><br/>
            {subCategories.map((n, index) => {
                return (<CategoryFilterItem key={"categoryFilterItem" + n.category_id} category={n} searchParams={searchParams}/>)
            })}
        </div>
    )
}

const CategoryFilterItem = (props) => {
    const searchParams = props.searchParams;
    const category = props.category;

    const toggleCategory = (e) => {
        let categories = searchParams.getAll('category');

        if (e.target.checked) {
            categories.push(e.target.value);
        } 
        else {
            categories = categories.filter(category => category !== e.target.value);
        }
        searchParams.delete('category');
        for (const category of categories) {
            searchParams.append('category', category);
        }
    }

    return (
        <div className="ms-4" key={"categoryFilter" + category.category_name}>
            <input 
                type="checkbox" name={category.category_name + "Radio"} 
                id={"categoryCheck" + category.category_id} 
                className="filter-checkbox"
                value={category.category_name}
                onChange={(e) => toggleCategory(e)}
            />
            <label htmlFor={"categoryCheck" + category.category_id}>{category.category_name}</label><br/>
        </div>
    )
}

const PricefilterComponent = (props) => {
    const searchParams = props.searchParams;

    const [disabled, setDisabled] = useState(true);

    const min = 0;
    const max = 3000;

    const updateMinMax = (minVal, maxVal) => {
        if (!disabled) {
            if (minVal != min) {
                searchParams.set("min_price", minVal);
            } else {
                searchParams.delete("min_price");
            }
            
            if (maxVal != max) {
                searchParams.set("max_price", maxVal);
            } else {
                searchParams.delete("max_price");
            }
        } else {
            searchParams.delete("min_price");
            searchParams.delete("max_price");
        }
    }

    const toggle = (e) => {
        setDisabled(!e.target.checked) 
    }

    return (
        <div className="">
            <label htmlFor="filter-price-checkbox">Filter by price: </label>
            <input type="checkbox" id="filter-price-checkbox" className="filter-checkbox" onClick={(e) => toggle(e)}/>
            <MultiRangeSlider
                min={min}
                max={max}
                onChange={({ min, max }) => updateMinMax(min, max)}
                disabledVal={disabled}
            />

        </div>
    )
}

export default FilterComponent;
import { useEffect, useState } from "react";
import { Button, Card, FormControl, Form } from "react-bootstrap";
import { hideResults } from "../../searchBarControl";
import MultiRangeSlider from "../../multiRangeSlider/MultiRangeSlider";

import "./FilterComponent.css";

const API_PATH = 'http://localhost:5000';

const FilterComponent = (props) => {
    const searchParams = props.searchParams;
    const setSearchParams = props.setSearchParams;
    const [productName, setProductName] = useState(searchParams.get("query"));

    const [keyNum, setKeyNum] = useState(0);

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

    const clearFilters = () => {
        let keys = [];
        for (let key of searchParams.keys()) {
            keys.push(key)
        }
        for (let key of keys) {
            searchParams.delete(key);
        }
        searchParams.set("query", productName);
        setSearchParams(searchParams);
        setKeyNum(keyNum + 1);
    }

    return (
        <Card bg="dark" text="light" className="sticky-top my-1" style={{width: "100%", maxWidth: "100%", top: 80, zIndex: 0}}>
            <div className="mx-auto" style={{width: "100%", backgroundColor: "rgb(20,20,20)", borderRadius: "inherit", border: "2px solid black"}}>
                <h2 style={{textAlign: "center"}}>Filter products</h2>
                <Form className="mx-2">
                    <FormControl placeholder="Product name" onChange={(e) => setProductName(e.target.value)} value={productName}/>
                    <CategoryFilterComponent searchParams={searchParams} key={"Categoryfilter" + keyNum}/>
                    <PricefilterComponent searchParams={searchParams} key={"Pricefilter" + keyNum}/>
                    <Button onClick={() => updateQuery()}>Filter</Button> <Button onClick={() => clearFilters()}>Clear filters</Button>
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

    let filtered = false;
    for (let param of searchParams.getAll('category')) {
        if (param == category.category_name) {
            filtered = true;
            break;
        }
    }

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
                defaultChecked={filtered}
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
  
    const min = 0;
    const max = 3000;
  
    const filteredMin = searchParams.get('min_price');
    const filteredMax = searchParams.get('max_price');

    const [disabled, setDisabled] = useState((filteredMin == min && filteredMax == max) || (!filteredMin && !filteredMax));

    const updateMinMax = (minVal, maxVal) => {
      if (!disabled) {
        searchParams.set("min_price", minVal);
        searchParams.set("max_price", maxVal);
      }
    }
  
    const toggle = (e) => {
        setDisabled(!e.target.checked);
        if (!e.target.checked) {
            searchParams.delete("min_price");
            searchParams.delete("max_price");
        }
    }
  
    return (
      <div className="">
        <label htmlFor="filter-price-checkbox">Filter by price: </label>
        <input defaultChecked={!disabled} type="checkbox" id="filter-price-checkbox" className="filter-checkbox" onClick={(e) => toggle(e)}/>
        <MultiRangeSlider
          min={Number(min)}
          max={Number(max)}
          onChange={({ min, max }) => updateMinMax(min, max)}
          disabledVal={disabled}
          initialMin={filteredMin}
          initialMax={filteredMax}
        />
      </div>
    )
  }
  

export default FilterComponent;
import { useEffect, useState } from "react";
import { Button, Card, FormControl, Form, Collapse } from "react-bootstrap";
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
        <Card className="my-1 mx-auto" style={{color: "white", width: "100%", backgroundColor: "rgb(20,20,20)", border: "2px solid rgb(40,40,40)", maxWidth: "100%", zIndex: 0, overflow: "auto"}}>
            <div>
                <h2 className="mt-3" style={{textAlign: "center"}}>Filter results</h2>
                <Form className="mx-2">
                    <FormControl placeholder="Product name" onChange={(e) => setProductName(e.target.value)} value={productName} className="bg-body-tertiary my-3" data-bs-theme="dark"/>
                    <CategoryFilterComponent searchParams={searchParams} key={"Categoryfilter" + keyNum}/>
                    <PricefilterComponent searchParams={searchParams} key={"Pricefilter" + keyNum}/>
                    <div className="mb-2" style={{display: "flex"}}>
                        <Button onClick={() => clearFilters()} style={{backgroundColor: "rgb(50,50,50)"}}>Clear filters</Button>
                        <Button onClick={() => updateQuery()} style={{}} className="ms-auto">Filter</Button>
                    </div>
                </Form>
            </div>
        </Card>
    )
}

const CategoryFilterComponent = (props) => {
    const searchParams = props.searchParams;
    const [maincategories, setMaincategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(searchParams.getAll('category'));

    const [openAll, setOpenAll] = useState(false);
    const [openAllCounter, setOpenAllCounter] = useState(0);

    useEffect(() => {
        const fetchMaincategories = async () => {
            const f = await fetch(`${API_PATH}/api/maincategory_expanded`);
            const data = await f.json();
            setMaincategories(data.data);
        }
        fetchMaincategories();
    }, []);

    useEffect(() => {
        searchParams.delete('category');
        for (let category of selectedCategories) {
            searchParams.append('category', category);
        }
    }, [selectedCategories])

    return (
        <div>
            <div style={{display: "flex"}}>
            <span>Filter by category:</span>
            <span className="ms-auto" onClick={() => {setOpenAll(!openAll); setOpenAllCounter(openAllCounter + 1)}}>{!openAll? "Open all" : "Collapse All"}</span>
            </div>
            {maincategories.map((n, index) => {
                return (
                    <div key={"maincategoryFilter" + n.maincategory_id}>
                        <MainCategoryFilterItem main={n} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} searchParams={searchParams} openAll={openAll} openAllCounter={openAllCounter}/>
                    </div>
                )
            })}
        </div>
    )
}

const MainCategoryFilterItem = (props) => {

    const mainCategory = props.main;
    const subCategories = mainCategory.categories

    const selectedCategories = props.selectedCategories;
    const setSelectedCategories = props.setSelectedCategories;

    const [open, setOpen] = useState(subCategories.map((n) => {return (n.category_name)}).some(cat => selectedCategories.indexOf(cat) >= 0));

    useEffect(() => {
        if (subCategories.map((n) => {return (n.category_name)}).some(cat => selectedCategories.indexOf(cat) >= 0)) {
            setOpen(true);
        } else {
            setOpen(false);
        }

    }, [props.searchParams])

    useEffect(() => {
        if (props.openAllCounter > 0) setOpen(props.openAll);
    }, [props.openAllCounter])

    const toggleMainCategory = (e) => {

        const isChecked = e.target.checked;
        if (isChecked) {
            setSelectedCategories([...selectedCategories, ...subCategories.map((n) => {return (n.category_name)})]);
            setOpen(true);
        } else {
            const newSelectedCategories = selectedCategories.filter((c) => {
                return !subCategories.map((n) => {return (n.category_name)}).includes(c);
            });
            console.log(newSelectedCategories);
            setSelectedCategories(newSelectedCategories);
            setOpen(true);
        }
    }

    return (
        <div className="my-1 pb-2">
            <div style={{display: "flex", backgroundColor: "rgb(10,10,10)", borderTop: "1px solid rgb(50,50,50)", lineHeight: "2em", cursor: "pointer"}}  onClick={() => setOpen(!open)}>
                <input 
                    type="checkbox" 
                    name={mainCategory.maincategory_name + "mainCategoryCheck"} 
                    id={`mainCategoryCheck${mainCategory.maincategory_id}`} 
                    className="filter-checkbox"
                    value={mainCategory.maincategory_name}
                    checked={subCategories.map((n) => {return (n.category_name)}).every(cat => selectedCategories.includes(cat))}
                    onChange={(e) => toggleMainCategory(e)}
                />
                <label htmlFor={"mainCategoryCheck" + mainCategory.maincategory_id}>{mainCategory.maincategory_name}</label>
                <span className="ms-auto px-3" style={{cursor: "pointer", userSelect: "none"}}>{open? "hide ▲" : "show ▼"}</span><br/>
            </div>
            <Collapse in={open}>
                <div style={{border: "3px solid rgb(10,10,10)"}}>
                    {subCategories.map((n, index) => {
                        return (<CategoryFilterItem key={"categoryFilterItem" + n.category_id} category={n} mainCategory={mainCategory} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}/>)
                    })}
                </div>
            </Collapse>
        </div>
    )
}

const CategoryFilterItem = (props) => {
    const category = props.category;
    const selectedCategories = props.selectedCategories;
    const setSelectedCategories = props.setSelectedCategories;

    return (
        <div className="ms-4" key={"categoryFilter" + category.category_name}>
            <input 
                type="checkbox" name={category.category_name + "Radio"} 
                id={`categoryCheck${props.mainCategory.maincategory_id}-${category.category_id}`} 
                className="filter-checkbox"
                value={category.category_name}
                checked={selectedCategories.includes(category.category_name)}
                onChange={(event) => {
                    const isChecked = event.target.checked;
                    if (isChecked) {
                        setSelectedCategories([...selectedCategories, category.category_name]);
                    } else {
                        const newSelectedCategories = selectedCategories.filter((c) => c !== category.category_name);
                        setSelectedCategories(newSelectedCategories);
                    }
                }}
            />
            <label htmlFor={`categoryCheck${props.mainCategory.maincategory_id}-${category.category_id}`}>{category.category_name}</label><br/>
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
      <div>
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
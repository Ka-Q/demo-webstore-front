import { useEffect, useState } from "react";
import { Button, Card, FormControl, Form, Collapse } from "react-bootstrap";
import { hideResults } from "../../searchBarControl";
import MultiRangeSlider from "../../MultiRangeSlider/MultiRangeSlider"

import "./productFilter.css";

const API_PATH = 'http://localhost:5000';

const ProductFilter = ({searchParams, setSearchParams, maincategoryFilter}) => {
    const [productName, setProductName] = useState("");

    const [keyNum, setKeyNum] = useState(0);

    useEffect(() => {
        const updateProductName = () => {
            setProductName(searchParams.get("query") || "");
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
        <Card className="my-1 mx-auto product-filter">
            <div>
                <h2 className="mt-3 text-center">Filter results</h2>
                <Form className="mx-2" onSubmit={(e) => {e.preventDefault(); updateQuery();}}>
                    <div className="product-filter-form">
                        <FormControl 
                            type="search" 
                            aria-label="Search" 
                            placeholder="Product name" 
                            onChange={(e) => setProductName(e.target.value)} 
                            value={productName} 
                            className="bg-body-tertiary my-3 product-filter-input" 
                            data-bs-theme="dark" 
                        />
                        <button type='submit' className="product-filter-button-magnify">🔍</button>
                    </div>
                    <CategoryFilterComponent searchParams={searchParams} maincategoryFilter={maincategoryFilter} key={"Categoryfilter" + keyNum}/>
                    <PricefilterComponent searchParams={searchParams} key={"Pricefilter" + keyNum}/>
                    <div className="mb-2 product-filter-container-buttons">
                        <Button className='product-filter-button-clear' onClick={() => clearFilters()}>Clear filters</Button>
                        <Button className="ms-auto" onClick={() => updateQuery()}>Filter</Button>
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
        const fetchFilteredMaincategory = async () => {
            const f = await fetch(`${API_PATH}/api/maincategory_expanded?maincategory.maincategory_id=${props.maincategoryFilter.maincategory_id}`);
            const data = await f.json();
            setMaincategories(data.data);
        }
        if (!props.maincategoryFilter) {
            fetchMaincategories();
        } else {
            fetchFilteredMaincategory();
        }
        
    }, []);

    useEffect(() => {
        searchParams.delete('category');
        for (let category of selectedCategories) {
            searchParams.append('category', category);
        }
    }, [selectedCategories])

    return (
        <div>
            <div className="product-filter-category-header">
                <span>Filter by category:</span>
                <span className="ms-auto px-1 product-filter-hoverable" onClick={() => {setOpenAll(!openAll); setOpenAllCounter(openAllCounter + 1)}}>{!openAll? "Open all" : "Collapse All"}</span>
            </div>
            {maincategories.map((n) => {
                return (
                    <div key={"maincategoryFilter" + n.maincategory_id}>
                        <MainCategoryFilterItem 
                            main={n} 
                            selectedCategories={selectedCategories} 
                            setSelectedCategories={setSelectedCategories} 
                            searchParams={searchParams} openAll={openAll} 
                            openAllCounter={openAllCounter}
                        />
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
            <div className="product-filter-maincategory-toggle" onClick={() => setOpen(!open)}>
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
                <span className="ms-auto px-3 product-filter-hoverable">{open? "hide ▲" : "show ▼"}</span><br/>
            </div>
            <Collapse in={open}>
                <div className="product-filter-category-list">
                    {subCategories.map((n, index) => {
                        return (
                            <CategoryFilterItem 
                                key={"categoryFilterItem" + n.category_id} 
                                category={n} mainCategory={mainCategory} 
                                selectedCategories={selectedCategories} 
                                setSelectedCategories={setSelectedCategories}
                            />
                        )
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
        <label htmlFor={`categoryCheck${props.mainCategory.maincategory_id}-${category.category_id}`} className="product-filter-hoverable">
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
        </label>
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

export default ProductFilter;
import './searchbar.css'
import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { hideResults, showResults } from '../searchBarControl';

const API_PATH = process.env.REACT_APP_DWS_API_URL;

const Searchbar = () => {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [resultsVisible, setResultsVisible] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
  
    const navigate = useNavigate();
  
    useEffect(() => {
      if (searchParams.get('query')) setQuery(searchParams.get('query'));
      hideResults();
    }, [searchParams])
  
    useEffect(() => {
      const fetchProduct = async () => {
        const f = await fetch(`${API_PATH}/api/product?product_name=%25${query.trim()}%25&limit=5`);
        if (f.status == 200) {
          const data = await f.json();
          setProducts(data.data);
        }
      }
      if (query && query.length > 2) {
        fetchProduct();
      } else {
        setProducts([]);
        if (resultsVisible) hideResults();
      }
    }, [query]);
  
    const handleSearch = (e) => {
      e.preventDefault();
      navigate(`/search?query=${query}`);
      hideResults(setResultsVisible);
    }
  
    const handleChange = (e) => {
      setQuery(e.target.value)
      if (e.target.value.length > 2) {
        showResults(setResultsVisible);
      } else {
        hideResults(setResultsVisible);
      }
    }
  
    return (
      <>
      <Form className="d-flex mx-auto searchbar-form" onSubmit={(e) => handleSearch(e)}>
        <Form.Control
          type="search"
          placeholder="Search"
          className="mx-2 searchbar-input"
          aria-label="Search"
          onChange={(e) => handleChange(e)}
          onClick={(e) => handleChange(e)}
          value={query}
        />
        <button type='submit' className='searchbar-button'>🔍</button>
      </Form>
      <div className="searchbar-results" hidden={!resultsVisible}>
        {products.map((n, index) => {
          return(
            <a href={"/product/" + n.product_id + "/" + n.product_name} className='searchbar-results-product ' key={n.product_id}>{n.product_name} - {n.product_name}</a>
          )
        })}
        {products.length > 0? 
          <Link to={`/search?query=${query}`} 
                className='searchbar-results-more '
                onClick={(e) => hideResults(setResultsVisible)}
          >
            More search results →
          </Link> 
        : 
          <a className='product-search-result-more'>
            No results
          </a>}
      </div>
      <div id='search-overlay' onClick={(e) => hideResults(setResultsVisible)} onTouchStart={(e) => hideResults(setResultsVisible)}/>
      </>
    )
  }

  export default Searchbar;
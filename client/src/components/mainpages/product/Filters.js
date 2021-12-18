import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
//import {GlobalState} from '../../../GlobalState';

function Filters() {
   // const state = useContext(GlobalState)
    //const [categories] =state.categoriesAPI.categories
    //const [category, setCategory] = state.productAPI.category
    //const [sort, setSort] =state.productAPI.sort
    const history = useHistory();
    const [search, setSearch] =useState('')

    /*const handleCategory = e => {
        setCategory(e.target.value)
        setSearch('')
    }*/

    const handelSubmit = () => {
        history.push(`/products/${search.toUpperCase()}`)
    }

    return (
        <form onSubmit={handelSubmit}>
    <div className="filter_menu">
    <input type="text" style={{textAlign: 'center', letterSpacing:'1px', textTransform:"capitalize"}} value={search} placeholder="search by category eg. Necklace, Ring, etc..." 
        onChange={e => setSearch(e.target.value)}/>
        <button className="btn btn-danger" type='submit'>Search</button>
    </div>
    </form>
        
    );
}

export default Filters;

/*<div className="row category">    
        <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value= ''>Newest</option>
                <option value= 'sort=oldest'>Oldest</option>
                <option value= 'sort=sold'>Best Sales</option>
                <option value= 'sort=-price'>Price: High-Low</option>
                <option value= 'sort=price'>Price: Low-High</option>
            </select>
        </div> */

/*<select name="category" value={category} onChange={handleCategory}>
                <option value= ''>All Products</option>
                {
                    categories.map(category => (
                        <option value={"category=" + category._id} key={category._id} >
                            {category.name}
                        </option>
                    ))
                }
            </select> */
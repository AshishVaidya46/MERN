import React, {useState, useContext} from 'react';
import {GlobalState} from '../../../GlobalState';
import axios from 'axios'
import Loading from '../utils/loading/Loading'

function Categories() {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories
    const [category, setCategory] = useState('')
    const [token] =state.token
    const [callback, setCallback] =state.categoriesAPI.callback
    const [onEdit, setOnEdit] = useState(false)
    const [id, setID] = useState('')
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isAdmin] = state.userAPI.isAdmin

    const createCategory = async e => {
        e.preventDefault()
        try {
            if(onEdit){
            const res = await axios.put(`/api/category/${id}`, {name: category.toUpperCase(), images: images},{
                    headers: {Authorization: token}
            })
            alert(res.data.msg)
            }else{
                const res = await axios.post('/api/category', {name: category.toUpperCase() , images: images}, {
                    headers: {Authorization: token}
            })

            alert(res.data.msg)
            }
            setOnEdit(false)
            setCategory('')
            setImages(false)
            setCallback(!callback)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleUpload = async e =>{
        e.preventDefault()
        try {
            if(!isAdmin) return alert("You're not an admin")
            const file = e.target.files[0]
            
            if(!file) return alert("File not exist.")

            if(file.size > 1024 * 1024) // 1mb
                return alert("Size too large!")

            if(file.type !== 'image/jpeg' && file.type !== 'image/png') // 1mb
                return alert("File format is incorrect.")

            let formData = new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload_category', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
            setLoading(false)
            setImages(res.data)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestroy = async () => {
        try {
            if(!isAdmin) return alert("You're not an admin")
            setLoading(true)
            await axios.post('/api/destroy', {public_id: images.public_id}, {
                headers: {Authorization: token}
            })
            setLoading(false)
            setImages(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const editCategory = async (id, name, images) =>{
        setID(id)
        setCategory(name)
        setImages(images)
        setOnEdit(true)
    }

    const deleteCategory = async (id) => {
        try {
            const res = await axios.delete(`/api/category/${id}`, {
                headers: {Authorization: token}
            })
            alert(res.data.msg)
            setCallback(!callback)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const styleUpload = {
        display: images ? "block" : "none"
    }

    return (
        <div className= "categories">
        <div className="create_product">
        <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload}/>
                {
                    loading ? <div id="file_img"><Loading /></div>

                    :<div id="file_img" style={styleUpload}>
                        <img src={images ? images.url : ''} alt=""/>
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
                
            </div>
        </div>
            <form onSubmit={createCategory}>
                <label htmlFor="category">Category</label>
                <input type= "text" name= "category" value={category} required 
                    onChange={e => setCategory(e.target.value)}
                />

                <button type="submit">{onEdit ? "Update" : "Create"}</button>
            </form>
            <div className="mx-auto">
            <div className="text-secondary table-responsive my-3">
            <table className="table my-3">
            <tbody>
            {
                    categories.map(category => (
                        <tr key={category._id}>
                        <td style={{width: '100px', overflow: 'hidden'}}>
                            <img src={category.images.url} alt={category.images.url}
                            className="img-thumbnail w-100" style={{minWidth: '80px', height: '80px'}} />
                        </td>
                            <td>{category.name}</td>
                            <td>
                                <button onClick={()=> editCategory(category._id, category.name, category.images)}>Edit</button>
                                </td>
                                <td>
                                <button onClick={()=> deleteCategory(category._id)}>Delete</button>
                            </td>
                        </tr>
                        
                    ))
                }
            </tbody>
            </table>
            </div>
            </div>
        </div>
    );
}

export default Categories;
const Category =require('../models/categoryModel')
const Products = require('../models/productModel')

const categoryCtrl = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find()
            res.json(categories)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
     },
     createCategory: async (req, res) => {
         try {

            //if user have role = 1 ---> admin
            //only admin can create, delete and update category
           // console.log(req.body)
            const {name, images} =req.body;
            const category = await Category.findOne({name})
            if(category) return res.status(400).json({msg: "This category already exit."})

            const newCategory = new Category({name, images})

            await newCategory.save()
            res.json({msg:'category added successfuly.'})
         } catch (err) {
            return res.status(500).json({msg: err.message})  
         }
     },
     deleteCategory: async (req, res) => {
         try {
             const products = await Products.findOne({category: req.params.id})
             if(products) return res.status(400).json({
                 msg: "Please delete all products with a relationship."
             })

             await Category.findByIdAndDelete(req.params.id)
             res.json({msg: "Deleted a Category"})
         } catch (err) {
            return res.status(500).json({msg: err.message})  
         }
     },
     updateCategory: async (req, res) => {
         try {
            const {name, images} =req.body;
            await Category.findOneAndUpdate({_id: req.params.id},{name, images})
            res.json({msg: "Update a category"})
         } catch (err) {
            return res.status(500).json({msg: err.message})  
         }
     } 
}

module.exports = categoryCtrl
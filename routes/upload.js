const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')
const { Promise } = require('mongoose')

//we will upload image on cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

//upload image only admin can use
router.post('/upload',auth,authAdmin, async(req, res) =>{ 
    try {
        if(!req.files || Object.keys(req.files).length ===0)
            return res.status(400).send('No files were uploaded.')
        
        const file = [...req.files.file];

            let upload_len = file.length;
            upload_res = new Array();
//console.log(upload_len)
                for(let i=0; i <= upload_len ; i++){
                //console.log(files)
                if(upload_res.length === upload_len)
                    {
                        res.json({'response':upload_res})
                    }else{
                        let files = file[i];
                await cloudinary.v2.uploader.upload(files.tempFilePath,{folder:'test'}, async(error, result) => {
                     if(result)
                    {
                        removeTmp(files.tempFilePath)
                        upload_res.push({public_id: result.public_id, url: result.secure_url});
                       // console.log(upload_res)
                    }else if(error){
                        console.log(error)
                        reject(error)
                    }
                })
            }
            }
           
        /*if(file.size > 1024*1024){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "Size too large"})
        }

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "File format is incorrect"})
        }
        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "test"}, async(err, result) =>{
            if(err) throw err;

            removeTmp(file.tempFilePath)

            res.json({public_id: result.public_id, url: result.secure_url})
        })*/
    } catch (err) {
        return res.status(500).json({msg:err.messege})
    }
})

//category image 
router.post('/upload_category',auth , authAdmin, (req, res) =>{
    try {
        if(!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({msg: 'No files were uploaded.'})
        
        const file = req.files.file;
        if(file.size > 1024*1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "Size too large"})
        }

        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "File format is incorrect."})
        }

        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "test"}, async(err, result)=>{
            if(err) throw err;

            removeTmp(file.tempFilePath)

            res.json({public_id: result.public_id, url: result.secure_url})
        })


    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
})
//delete image only admin can use
router.post('/destroy',auth,authAdmin, (req,res) => {
    try {
        const {public_id} = req.body;
        if(!public_id) return res.status(400).json({msg:'No image Selected'})

        cloudinary.v2.uploader.destroy(public_id, async(err, result) => {
            if(err) throw err;

            res.json({msg: "Image Deleted"})
        })
    } catch (err) {
        res.status(500).json({msg:err.messege})
    }

})

const removeTmp = (path) => {
    fs.unlink(path, err =>{
        if(err) throw err;
    })
}
module.exports = router
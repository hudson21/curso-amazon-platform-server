const router = require('express').Router();
const Product = require('../models/product');

//Amazon Web Services
const aws = require('aws-sdk');//Library for communicating with the aws(keys)
const multer = require('multer');//Library to aprove images
const multers3 = require('multer-s3');
const s3 = new aws.S3({accessKeyId: 'AKIAJZ5YUVKTMPGSL7JQ', secretAccessKey: 'UwZ/DUb1PNMRnrys8B95ng1210eo+UpM13CiG9Jy'});
//Communicate with our story bucket and the secret key

const faker = require('faker');

const checkJWT = require('../middlewares/check-jwt');

const upload = multer({
    storage: multers3({
        s3:s3,
        bucket: 'amazonowebapplication',
        metadata: function(req, file, cb){
            cb(null, {fieldName: file.fieldName});
        },
        key: function(req, file, cb){
            cb(null, Date.now().toString());
        } 
    })
});

router.route('/products')
    .get(checkJWT, (req, res, next) =>{
        Product.find({owner: req.decoded.user._id})
            .populate('owner')
            .populate('category')
            .exec((err, products) =>{
                if(products){
                    res.json({
                        success: true,
                        message: 'Products',
                        products: products 
                    });
                }
            });
    })

    //single means we are only uploading one picture 
    //In this method we have to use form-data because we are uploading an image
    .post([checkJWT, upload.single('product_picture')], (req, res, next) =>{
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.file.location;
        product.save();
        res.json({
            success: true,
            message: 'Successfully Added the product :)'
        });
    });

//Just for testing (fake library for fake data)  faker javascript
router.get('/faker/test', (req, res, next)=>{
    for(i = 0; i < 20; i++){
        let product = new Product();
        product.category = '5b33d5eb8312572608dea5da';
        product.owner = '5b323c82c5574c1770f0f3a9';
        product.image = faker.image.cats();
        product.title = faker.commerce.productName();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();
        product.save();
    }

    res.json({
        message:'Succesfully added 20 pictures'
    });

});


module.exports = router;

const router = require('express').Router();
const async = require('async');
const Category = require('../models/category');
const Product = require('../models/product');

router.route('/categories')
    .get((req, res, next) =>{
        Category.find({}, (err, categories) =>{
            res.json({
                success: true,
                message: 'Success',
                categories: categories
            });
        });
    })
    .post((req, res, next) => {
        let category = new Category();
        category.name = req.body.category;
        category.save();
        res.json({
            success: true,
            message:'Successful'
        }); 
    });

router.get('/categories/:id', (req, res, next) =>{
    const perPage = 10; 
    const page = req.query.page

    //waterfall function
    //We are using waterfall method because we wanna run multiple functions at the same time
    //The second function depends on the first function
    /*async.waterfall([
        function(callback){
           Product.count({ category: req.params.id}, (err, count) =>{
               var totalProducts = count;
               callback(err, totalProducts);
           });
        },
        function(totalProducts, callback){
            Product.find({ category: req.params.id })
                // example: 10* 4 = 40 (skip 30, always less than that)
                .skip(perPage * page)
                .limit(perPage)
                .populate('category')
                .populate('owner')
                .exec((err, products) =>{
                    if(err) return next(err);
                    callback(err, products, totalProducts);
                });    
        },
        function(products, totalProducts, callback){
            Category.findOne({ _id: req.params.id}, (err, category) =>{
                res.json({
                    success: true,
                    message: 'category',
                    products: products,
                    categoryName: category.name,
                    totalProducts: totalProducts,
                    pages: Math.ceil(totalProducts / perPage)
                });
            });
        }
    ]);*/

    //Parallel: It is a container of functions that run at the same time but separately
    async.parallel([
        function(callback){
           Product.count({ category: req.params.id}, (err, count) =>{
               var totalProducts = count;
               callback(err, totalProducts);
           });
        },
        function(callback){
            Product.find({ category: req.params.id })
                // example: 10* 4 = 40 (skip 30, always less than that)
                .skip(perPage * page)
                .limit(perPage)
                .populate('category')
                .populate('owner')
                .exec((err, products) =>{
                    if(err) return next(err);
                    callback(err, products);
                });    
        },
        function(callback){
            Category.findOne({ _id: req.params.id}, (err, category) =>{
                callback(err, category)
            });
        }

    ], function(err, results){
        var totalProducts = results[0];
        var products = results[1];
        var category = results[2];

        res.json({
            success: true,
            message: 'category',
            products: products,
            categoryName:category.name,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)
        });
    });
});

router.get('/product/:id', (req, res, next) =>{
    Product.findById({_id: req.params.id })
        .populate('category')
        .populate('owner')
        .exec((err, product) =>{
            if(err){
                res.json({
                    success:false,
                    message: 'Product is not found'
                });
            }else{
              if(product){
                res.json({
                    success:true,
                    product: product
                });
              } 
            } 
        });
});


router.get('/products', (req, res, next) =>{
    const perPage = 10; 
    const page = req.query.page

    //Parallel: It is a container of functions that run at the same time but separately
    async.parallel([
        function(callback){
           Product.count({}, (err, count) =>{
               var totalProducts = count;
               callback(err, totalProducts);
           });
        },
        function(callback){
            Product.find({})
                // example: 10* 4 = 40 (skip 30, always less than that)
                .skip(perPage * page)
                .limit(perPage)
                .populate('category')
                .populate('owner')
                .exec((err, products) =>{
                    if(err) return next(err);
                    callback(err, products);
                });    
        }

    ], function(err, results){
        var totalProducts = results[0];
        var products = results[1];

        res.json({
            success: true,
            message: 'category',
            products: products,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)
        });
    });
});



module.exports = router;


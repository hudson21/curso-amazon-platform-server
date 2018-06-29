const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch('SN9PPA0IWK','e75c06718117efd92d36475ee3c4e2f3');
const index = client.initIndex('amazonov1');//Name of the Index

router.get('/', (req, res, next) =>{
    if(req.query.query){
        index.search({
            query: req.query.query,
            page: req.query.page,   
        }, (err, content) =>{
            res.json({
                success: true,
                message: 'Here is your search',
                status: 200,
                content: content,
                search_result:req.query.query 
            });
        });
    }
});

module.exports = router;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deepPopulate = require('mongoose-deep-populate')(mongoose);
const mongooseAlgolia = require('mongoose-algolia');

const ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    image: String,
    title: String,
    description: String,
    price: Number,
    created: { type: Date, default: Date.now }
}, {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    });

//Virtual Objects
ProductSchema
    .virtual('averageRating')
    .get(function () {
        var rating = 0;
        if (this.reviews.length == 0) {
            rating = 0;
        } else {
            this.reviews.map((review) => {
                rating += review.rating;
            });
            rating = rating / this.reviews.length;
        }

        return rating;
    })

//This is the way for adding deep populating to the ProductSchema
ProductSchema.plugin(deepPopulate);

ProductSchema.plugin(mongooseAlgolia, {
    appId: 'SN9PPA0IWK',
    apiKey: 'e75c06718117efd92d36475ee3c4e2f3',//Admin API Key
    indexName: 'amazonov1',//THe name of the Algolia Index
    selector: '_id title image reviews description price owner created averageRating',//The attributes you want Algolia looks for it
    populate: {
        path: 'owner reviews',
        select: 'name rating' //You wanna select name from owner and rating from reviews
    },
    defaults: {
        author: 'unknown'
    },
    mappings: {
        title: function (value) {
            return `${value}`
        }
    },
    virtuals: {
        averageRating1: function (doc) {
            var rating = 0;
            if (doc.reviews.length == 0) {
                rating = 0;
            } else {
                doc.reviews.map((review) => {
                    rating += review.rating;
                });
                rating = rating / doc.reviews.length;
            }

            return rating;
        }
    },
    debug: true

});

let Model = mongoose.model('Product', ProductSchema);
Model.SyncToAlgolia();
Model.SetAlgoliaSettings({
    searchableAttributes: ['title']
});
module.exports = Model; 
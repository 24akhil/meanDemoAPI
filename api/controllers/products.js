const Product = require('../models/product');

exports.get_all_products = (req, res, next) => {

    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id
                        }
                    };
                })
            };
            res.status(200).json(response);           
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}
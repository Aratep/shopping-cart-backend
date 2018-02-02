const express = require('express');
const router = express.Router();

const Product = require('../../models/schemas/products');
const Variant = require('../../models/schemas/variants');
const Cart = require('../../models/schemas/cart');

router.create_product = (req, res, next) => {
    const name = req.body.values.name;
    const imagePath = req.body.values.path;
    const description = req.body.values.description;
    const price = req.body.values.price;
    const available_quantity = req.body.values.quantity;
    const status = req.body.values.status;

    const product = {name, imagePath, description, price, available_quantity, status};
    const newProduct = new Product(product);

    newProduct.save()
        .then(prod => {
            return res.json(prod);
        })
        .catch(err => console.log(err))
};

router.get_all_products = (req, res) => {

    Product.find({}).exec((err, products) => {
        if (err) throw err;
        // console.log(products)
        Variant.find({}).exec((eror, variants) => {
            if (eror) throw eror;
            Product.count().then(count => {
                res.status(200).json({
                    products,
                    variants,
                    count
                })
            })

            // const prodIds = variants.map(c => c.prod_id);
            // console.log(prodIds);
        })
        // Product.count().then(count => {
        //     // const token = jwt.sign({products: products, countOfUsers: count}, 'secret_key');
        //     res.status(200).json({
        //         products,
        //         count
        //     })
        // })
    })

};

router.add_new_variant = (req, res, next) => {

    const prod_id = req.body.id;
    const variant_name = req.body.values.variantName;
    const variant_price = req.body.values.variantPrice;
    const variant_status = req.body.values.variantStatus;
    const variant_image_path = req.body.values.variantImagePath;

    const variant = {prod_id, variant_name, variant_price, variant_status, variant_image_path};
    const newVariant = new Variant(variant);

    newVariant.save()
        .then(variant => {
            res.status(200).json({variant})
        })
        .catch(err => console.log(err))
}

router.update_product = (req, res, next) => {
    const name = req.body.values.name;
    const imagePath = req.body.values.path;
    const description = req.body.values.description;
    const price = req.body.values.price;
    const available_quantity = req.body.values.quantity;
    const status = req.body.values.status;
    const id = req.body.id;

    Product.findOne({_id: id})
        .then(product => {
            if (product) {
                Product.updateOne(
                    {_id: id},
                    {$set: {name, imagePath, description, price, available_quantity, status}},
                    {runValidators: true, context: 'query'}
                )
                    .then(() => {
                            res.status(200).json({
                                    updated: {name, imagePath, description, price, available_quantity, status}
                                }
                            );
                        }
                    )
                    .catch(err => {
                        for (let i in err.errors) {
                            return res.status(400).send({
                                message: err.errors[i].message
                            });
                        }
                    })
            }
        })
        .catch(err => console.log(err));
}

router.delete_product = (req, res) => {
    const id = req.body.id;
    Product.findOne({_id: id})
        .then(product => {
            if (product) {
                Variant.remove({prod_id: id}).then(() => console.log('variant is deleted'));
                Product.remove({_id: id})
                    .then(() => {
                        res.status(200).json({message: `${product.name} is deleted`});
                    });
                Cart.remove({prod_id: id}).then(() => console.log('variant is deleted'));
            }
        })
        .catch(err => console.log(err))
};


module.exports = router;



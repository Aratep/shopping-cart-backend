const express = require('express');
const router = express.Router();

const Product = require('../../models/schemas/products');
const Variant = require('../../models/schemas/variants');
const Cart = require('../../models/schemas/cart');

router.add_to_cart = (req, res, next) => {
    const prod_id = req.body.prod_id;
    const user_id = req.body.user_id;

    const toCart = {prod_id, user_id};
    const newToCart = new Cart(toCart);

    newToCart.save()
        .then(cart => {
            return res.json(cart);
        })
        .catch(err => console.log(err))
};

router.get_cart_list = (req, res) => {
    console.log(req.body);
    const user_id = req.body.user_id;

    Cart.find({user_id: user_id}).exec((err, ids) => {
        if (err) throw err;
        console.log(ids)
        res.status(200).json({ids})
    })
    // Product.find({}).exec((err, products) => {
    //     if (err) throw err;
    //     // console.log(products)
    //     Variant.find({}).exec((eror, variants) => {
    //         if (eror) throw eror;
    //         Product.count().then(count => {
    //             // const token = jwt.sign({products: products, countOfUsers: count}, 'secret_key');
    //             res.status(200).json({
    //                 products,
    //                 variants,
    //                 count
    //             })
    //         })
    //
    //         // const prodIds = variants.map(c => c.prod_id);
    //         // console.log(prodIds);
    //     })
    // })

};


router.update_product = (req, res, next) => {
    const name = req.body.values.name;
    const imagePath = req.body.values.path;
    const description = req.body.values.description;
    const price = req.body.values.price;
    const available_quantity = req.body.values.quantity;
    const status = req.body.values.status;
    const id = req.body.id;

    // console.log(req.body);

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

            }
        })
        .catch(err => console.log(err))
};


module.exports = router;



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
            res.status(200).json({cart});
        })
        .catch(err => {
            for (let i in err.errors) {
                return res.status(400).send({
                    message: err.errors[i].message
                });
            }
        })
};

router.get_cart_list = (req, res) => {
    const user_id = req.body.user_id;

    Cart.find({user_id: user_id}).exec((err, ids) => {
        if (err) throw err;
        const prodIds = ids.map(c => c.prod_id);
        Product.find({_id: { $in: prodIds }}).exec((error, userProduct) => {
            if(error) throw err;

            console.log(userProduct)
            res.status(200).json({userProduct});
        })
    })
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



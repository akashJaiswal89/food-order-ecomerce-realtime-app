const Order = require('../../../models/order')
const moment = require('moment')
const { session } = require('passport')


function orderController() {
    return {
        store(req, res) {
            // validate request
            const { phone, address } = req.body
            if (!phone || !address) {
                req.flash('error', "All fields are required")
                return res.redirect('/cart')
            }
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: phone,
                address: address
            })
            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, resu) => {
                    req.flash('success', 'Order place succsesfully')
                    delete req.session.cart
                        // emit socket
                    const eventEmitter = req.app.get('eventEmitter') //app.set('eventEmitter', eventEmitter) from server file
                    eventEmitter.emit('orderPlaced', result)

                    return res.redirect('/customerorders')
                })

            }).catch(err => {
                req.flash('err', 'something went rong')
                return res.redirect('/cart')
            })

        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } })
            res.header('Cache-Control', 'no-cache,private,no-store,must-revalidate')
            res.render('customers/order', { orders: orders, moment: moment })

        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            if (req.user._id.toString() === order.customerId.toString()) {
                res.render('customers/singleOrder', { order: order })
            } else {
                res.redirect('/')
            }
        }
    }
}
module.exports = orderController
const Order = require('../../../models/order')

function statusController() {
    return {
        update(req, res) {
            Order.updateOne({ _id: req.body.orderId }, { status: req.body.status }, (err, data) => {

                const eventEmitter = req.app.get('eventEmitter') //app.set('eventEmitter', eventEmitter) from server file
                eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })

                res.redirect('/adminOrders')
            })
        }

    }
}
module.exports = statusController
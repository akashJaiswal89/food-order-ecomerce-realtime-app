const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const guest = require('../app/http/middleware/gest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')
const adminController = require('../app/http/controllers/admin/orderController')
const statusController = require('../app/http/controllers/admin/statusController')


function initRoutes(app) {
    app.get("/", homeController().index)
    app.get("/login", guest, authController().login)
    app.post("/login", authController().postLogin)
    app.get("/register", guest, authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)
    app.get("/cart", cartController().index)
    app.post("/update-cart", cartController().update)


    app.post('/orders', auth, orderController().store)
    app.get('/customerOrders', auth, orderController().index)
    app.get('/customerorders:id', auth, orderController().show)

    app.get('/adminOrders', admin, adminController().index)

    app.post('/admin/order/status', admin, statusController().update)
    app.get('*', homeController().index)



}

module.exports = initRoutes
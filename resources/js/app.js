import axios from 'axios' //for ajex call yarn add axios
import moment from 'moment'
import Noty, { button } from 'noty'
import { initAdmin } from './admin'

let addToCart = document.querySelectorAll(".add-to-cart")
let cardCounter = document.querySelector('#cartCounter')


function updateCart(pizza) {
    axios.post('/update-cart', pizza).then(res => {
        cardCounter.innerText = res.data.totalQty
        new Noty({
            type: "success",
            timeout: 1000,
            text: 'Item Added To Cart',
            progressBar: false,
        }).show();
    }).catch(err => {
        new Noty({
            type: "error",
            timeout: 1000,
            text: 'somthing went worng',
            progressBar: false,
            zz
        }).show()

    })
}

addToCart.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza) //get data data-pizza pizza is atribute of data 
        updateCart(pizza)
    })
});

const alert = document.querySelector('#success-alert')
if (alert) {
    setTimeout(() => {
        alert.remove()
    }, 2000);
}


// change order status
let statuses = document.querySelectorAll('.status_line')


let input = document.querySelector('#headden')
let order = input ? input.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status

        if (stepCompleted) {
            status.classList.add('step-completed')
        }
        if (dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(order)

// socket

let socket = io()
if (order) {

    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes('admin')) {
    initAdmin()
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = {...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: "success",
        timeout: 1000,
        text: 'Order Updated',
        progressBar: false,
    }).show();
})
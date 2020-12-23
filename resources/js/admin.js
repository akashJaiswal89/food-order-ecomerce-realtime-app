import axios from 'axios'
import moment from 'moment'
import Noty from 'noty'

export function initAdmin() {
    const orderTableBody = document.querySelector('#orderTableBody')
    let orders = []
    let markup

    axios.get('/adminOrders', {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {

        orders = res.data;
        markup = generateMarkup(orders);
        orderTableBody.innerHTML = markup;

    }).catch(err => {
        console.log(err);
    })

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p class="pAdmin">${ menuItem.item.name }</p>
                <p class="pAdmin">${ menuItem.qty } pcs </p>
            `
        }).join('')
    }

    function generateMarkup(orders) {
        return orders.map(order => {
            return `
            <tr>
                <td class="border px-4 py-2 text-green-900 font-3">
                    
                     <div>${ renderItems(order.items) }</div>
                </td>
                <td class="border px-4 py-2 font-3 width">${ order.customerId.name }</td>
                <td class="border px-4 py-2 font-3 width">${ order.address }</td>
                <td class="border px-4 py-2 font-3 width">
                    <div class="inline-block relative ">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${ order._id }">
                            <select name="status" onchange="this.form.submit()"
                                class=" block border border-gray-400 hover:border-gray-500 adminO">
                                <option value="order_placed"
                                    ${ order.status === 'order_placed' ? 'selected' : '' }>
                                    Placed</option>
                                <option value="confirmed" ${ order.status === 'confirmed' ? 'selected' : '' }>
                                    Confirmed</option>
                                <option value="prepared" ${ order.status === 'prepared' ? 'selected' : '' }>
                                    Prepared</option>
                                <option value="delivered" ${ order.status === 'delivered' ? 'selected' : '' }>
                                    Delivered
                                </option>
                                <option value="completed" ${ order.status === 'completed' ? 'selected' : '' }>
                                    Completed
                                </option>
                            </select>
                        </form>
                        
                    </div>
                </td>
                <td class="border px-4 py-2 font-3 width-1">
                    ${ moment(order.createdAt).format('hh:mm A') }</br>
                    ${ order.paymentStatus ? 'paid' : 'Not paid' }
                </td>
                
            </tr>
            `
        }).join('')
    }
    let socket = io()

    let adminAreaPath = window.location.pathname;
    if (adminAreaPath.includes('admin')) {
        socket.emit('join', 'adminRoom')
    }


    socket.on('orderPlaced', (data) => {

        new Noty({
            type: "success",
            timeout: 1000,
            text: 'New order',
            progressBar: false,
        }).show();
        console.log(data);

        orders.unshift(data)
        orderTableBody.innerHTML = ""
        orderTableBody.innerHTML = generateMarkup(orders)
    })
}
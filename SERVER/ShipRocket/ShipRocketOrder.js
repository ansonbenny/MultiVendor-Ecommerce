import axiosLib from "axios";
let axios = axiosLib.default;
import qs from 'qs'

export default (
    payment,
    products, token
) => {
    return new Promise(async (resolve, reject) => {
        products.map(async (obj, key) => {
            var params = qs.stringify({
                "order_id": obj.secretOrderId,
                "order_date": new Date(),
                "channel_id": "",
                "pickup_location": obj.pickup_location,
                "billing_customer_name": obj.details.name,
                "billing_last_name": " ",
                "billing_address": obj.details.address,
                "billing_address_2": obj.details.locality,
                "billing_city": obj.details.city,
                "billing_pincode": obj.details.pin,
                "billing_state": obj.details.state,
                "billing_country": "India",
                "billing_email": obj.details.email,
                "billing_phone": obj.details.number,
                "shipping_is_billing": 1,
                "order_items": [{
                    selling_price: obj.selling_price,
                    name: `${obj.proName} ${obj.variantSize === 'S' ||
                        obj.variantSize === 'M' || obj.variantSize === 'L' ||
                        obj.variantSize === 'XL' ? 'Size ' + obj.variantSize : ''}`,
                    sku: obj.product.toString(),
                    discount: obj.discount,
                    tax: 0,
                    hsn: 121,
                    units: obj.quantity,
                }],
                "payment_method": payment, //or Postpaid
                "shipping_charges": 0,
                "giftwrap_charges": 0,
                "transaction_charges": 0,
                "total_discount": 0,
                "sub_total": obj.price,
                "length": 10,
                "breadth": 15,
                "height": 20,
                "weight": 2.5
            })

            params = params.toString()

            const url = `https://apiv2.shiprocket.in/v1/external/orders/create/adhoc?${params}`;

            let response = await axios({
                method: "POST",
                url,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                redirect: "follow",
            }).catch((err) => {
                products[key].order_id_shiprocket = null
                products[key].shipment_id = null
                if (key === products.length - 1) {
                    resolve(products)
                }
            })

            if (response) {
                if (response.status === 200) {
                    products[key].order_id_shiprocket = response.data.order_id
                    products[key].shipment_id = response.data.shipment_id
                }
            }

            if (key === products.length - 1) {
                resolve(products)
            }

        })
    })
}
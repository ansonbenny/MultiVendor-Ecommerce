import axios from "axios";

export default (orderId, token) => {
    return new Promise((resolve, reject) => {
        var data = JSON.stringify({
            "ids": [
                orderId
            ]
        });

        var config = {
            method: 'post',
            url: 'https://apiv2.shiprocket.in/v1/external/orders/print/invoice',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: data
        };

        axios(config).then((response) => {
            if(response.status === 200){
                resolve(response.data)
            }else{
                reject()
            }
        }).catch((err) => {
            reject()
        });
    })
}
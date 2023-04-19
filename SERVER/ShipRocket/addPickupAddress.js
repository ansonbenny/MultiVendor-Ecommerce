import axiosLib from "axios";
let axios = axiosLib.default;

export default (data, token) => {
    return new Promise(async (resolve, reject) => {
        console.log(data)

        var config = {
            method: 'post',
            url: 'https://apiv2.shiprocket.in/v1/external/settings/company/addpickup',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify(data)
        };

        const response = await axios(config).catch((err) => {
            reject()
        })

        if (response) {
            if (response.data.success) {
                resolve()
            } else {
                reject()
            }
        } else {
            reject()
        }
    })
}
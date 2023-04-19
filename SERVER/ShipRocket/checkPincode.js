import axiosLib from "axios";
let axios = axiosLib.default;

export default (parameter, token) => {

    const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${parameter}`;

    const requestOptions = {
        url,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        redirect: "follow",
    };

    return new Promise(async (resolve, reject) => {
        const response = await axios(requestOptions).catch((err) => {
            reject()
        })

        if (response) {
            if (response.data.status === 200) {
                if (response.data.data && response.data.data['available_courier_companies'].length !== 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            } else {
                resolve(false)
            }
        } else {
            reject()
        }
    })
}
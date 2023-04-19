import axiosLib from 'axios';
const axios = axiosLib.default;

export default () => {
    const url = "https://apiv2.shiprocket.in/v1/external/auth/login";

    const raw = JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASS,
    });

    const requestOptions = {
        method: "POST",
        url,
        headers: {
            "Content-Type": "application/json",
        },
        data: raw,
        redirect: "follow",
    };

    return new Promise(async (resolve, reject) => {
        const response = await axios(requestOptions).catch((err) => {
            reject()
        })

        if (response) {
            if (response.status === 200) {
                const token = response.data.token
                resolve(token)
            } else {
                reject()
            }
        } else {
            reject()
        }
    })
};
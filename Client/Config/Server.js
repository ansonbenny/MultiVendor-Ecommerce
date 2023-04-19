import axios from 'axios'

export const ServerId = process.env.ServerId // For Files

const ServerUrl = process.env.ServerUrl // For HTTP Request

export const userAxios = (callback) => {
    let token = localStorage.getItem('token')
    callback(axios.create({
        baseURL: ServerUrl,
        headers: {
            'x-access-token': token
        }
    }))
}

export const userCheck = (token, callback) => {
    axios.get(`${ServerUrl}/users/getUserData`, {
        headers: {
            'x-access-token': token
        }
    }).then((user) => {
        callback(user.data)
    }).catch((err) => {
        callback({
            status: null
        })
    })
}

export const vendorCheck = (token, callback) => {
    axios.get(`${ServerUrl}/vendor/getVendorData`, {
        headers: {
            'x-access-token': token
        }
    }).then((res) => {
        callback(res.data)
    }).catch(() => {
        callback({ status: false })
    })
}

export const vendorAxios = (callback) => {
    let token = localStorage.getItem('vendorToken')
    callback(axios.create({
        baseURL: ServerUrl,
        headers: {
            'x-access-token': token
        }
    }))
}

export const adminCheck = (token, callback) => {
    axios.get(`${ServerUrl}/admin/getAdminData`, {
        headers: {
            'x-access-token': token
        }
    }).then((res) => {
        callback(res.data)
    }).catch(() => {
        callback({ status: false })
    })
}

export const adminAxios = (callback) => {
    let token = localStorage.getItem('adminToken')
    callback(axios.create({
        baseURL: ServerUrl,
        headers: {
            'x-access-token': token
        }
    }))
}

export default axios.create({
    baseURL: ServerUrl
});

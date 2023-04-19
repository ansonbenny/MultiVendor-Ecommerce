import db from '../Config/Connection.js'
import collections from '../Config/Collection.js'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'

export default {
    CheckUser: (details) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USERS).findOne({
                email: details.email
            }).catch((err) => {
                reject(err)
            })

            if (user === null) {
                resolve({ found: false })
            } else {
                resolve({ found: true })
            }
        })
    },
    checkOtp: ({ email }, type, otpFor) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.OTP).findOne({
                email: email,
                type: type,
                for: otpFor
            }).then((data) => {
                resolve(data)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    matchOtp: ({ email, otp }, type, otpFor) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.OTP).findOne({
                email: email,
                otp: otp,
                type: type,
                for: otpFor
            }).then((data) => {
                if (data) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }).catch((err) => {
                reject(err)
            })
        })
    },
    insertOtp: (email, otp, type, otpFor) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.OTP).createIndex({ "createdAt": 1 }, { expireAfterSeconds: 10 }).then((done) => {
                db.get().collection(collections.OTP).insertOne({
                    createdAt: new Date(),
                    email: email,
                    otp: otp,
                    type: type,
                    for: otpFor
                }).then((done) => {
                    resolve(done)
                }).catch((err) => {
                    reject(err)
                })
            }).catch((err) => {
                if (err.code === 85) {
                    db.get().collection(collections.OTP).insertOne({
                        createdAt: new Date(),
                        email: email,
                        otp: otp,
                        type: type,
                        for: otpFor
                    }).then((done) => {
                        resolve(done)
                    }).catch((err) => {
                        reject(err)
                    })
                } else {
                    reject(err)
                }
            })
        })
    },
    CreateUser: (details) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USERS).findOne({
                email: details.email
            }).catch((err) => {
                reject(err)
            })

            if (user === null) {
                details.password = await bcrypt.hash(details.password, 10)

                db.get().collection(collections.USERS).insertOne(details).then(() => {
                    resolve(true)
                }).catch((err) => {
                    reject(err)
                })
            } else {
                resolve(false)
            }
        })
    },
    LoginUser: (details) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USERS).findOne({
                email: details.email
            }).catch((err) => {
                reject(err)
            })

            if (user !== null) {
                bcrypt.compare(details.password, user.password).then((status) => {
                    if (status) {
                        resolve({ login: true, user })
                    } else {
                        resolve({ login: false })
                    }
                }).catch((err) => {
                    reject(err)
                })
            } else {
                resolve({ login: false })
            }
        })
    },
    getUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USERS).findOne({
                _id: ObjectId(userId)
            }).then((user) => {
                resolve(user)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    changeUserInfo: (details) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USERS).findOne({
                email: details.email
            }).catch(() => {
                reject()
            })

            if (user) {
                let status = await bcrypt.compare(details.password, user.password).catch(() => {
                    reject()
                })
                if (status) {
                    db.get().collection(collections.USERS).updateOne({
                        email: details.email
                    }, {
                        $set: {
                            name: details.name,
                            number: details.number
                        }
                    }).then(() => {
                        resolve(true)
                    }).catch(() => {
                        reject()
                    })
                } else {
                    resolve(false)
                }
            } else {
                reject()
            }
        })
    },
    changeEmail: (details) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USERS).findOne({
                email: details.email
            }).catch(() => {
                reject()
            })

            if (user) {
                let already = await db.get().collection(collections.USERS).findOne({
                    email: details.newEmail
                }).catch(() => {
                    reject()
                })

                if (!already) {
                    let status = await bcrypt.compare(details.password, user.password).catch(() => {
                        reject()
                    })

                    if (status) {
                        db.get().collection(collections.USERS).updateOne({
                            email: details.email
                        }, {
                            $set: {
                                email: details.newEmail
                            }
                        }).then(() => {
                            resolve({ done: true })
                        }).catch(() => {
                            reject()
                        })
                    } else {
                        resolve({ already: false, pass: true, done: false })
                    }
                } else {
                    resolve({ already: true, done: false })
                }
            } else {
                reject()
            }
        })
    },
    changePassword: (details) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USERS).findOne({
                email: details.email
            }).catch(() => {
                reject()
            })

            if (user) {
                details.newPass = await bcrypt.hash(details.newPass, 10)

                let status = await bcrypt.compare(details.currPass, user.password).catch(() => {
                    reject()
                })

                if (status) {
                    db.get().collection(collections.USERS).updateOne({
                        email: details.email
                    }, {
                        $set: {
                            password: details.newPass
                        }
                    }).then(() => {
                        resolve(true)
                    }).catch(() => {
                        reject()
                    })
                } else {
                    resolve(false)
                }
            } else {
                reject()
            }
        })
    },
    forgotPassword: (details) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collections.USERS).findOne({
                email: details.email
            }).catch(() => {
                reject()
            })

            if (user) {
                details.password = await bcrypt.hash(details.password, 10)
                db.get().collection(collections.USERS).updateOne({
                    email: details.email
                }, {
                    $set: {
                        password: details.password
                    }
                }).then(() => {
                    resolve(true)
                }).catch(() => {
                    reject()
                })
            } else {
                reject()
            }
        })
    },
    addToCart: ({ userId, item }) => {
        return new Promise(async (resolve, reject) => {
            let cart = await db.get().collection(collections.CART).findOne({
                user: userId
            }).catch((err) => {
                reject(err)
            })

            if (cart) {
                db.get().collection(collections.CART).findOne({
                    user: userId,
                    'items.proId': item.proId
                }).then((done) => {
                    if (!done) {
                        db.get().collection(collections.CART).updateOne({
                            user: userId
                        }, {
                            $addToSet: {
                                items: item
                            }
                        }).then((done) => {
                            resolve({ found: false })
                        }).catch((err) => {
                            reject(err)
                        })
                    } else {
                        resolve({ found: true })
                    }
                }).catch((err) => {
                    reject(err)
                })

            } else {
                db.get().collection(collections.CART).insertOne({
                    user: userId,
                    items: [item]
                }).then((done) => {
                    resolve({ found: false })
                }).catch((err) => {
                    reject(err)
                })
            }
        })
    },
    checkItemInCart: ({ userId, proId }) => {
        return new Promise(async (resolve, reject) => {
            let result = await db.get().collection(collections.CART).aggregate([
                {
                    $match: {
                        user: userId
                    }
                }, {
                    $unwind: '$items',
                }, {
                    $project: {
                        product: '$items.proId'
                    }
                }, {
                    $match: {
                        product: proId
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })

            if (result.length !== 0) {
                resolve({ incart: true })
            } else {
                resolve({ incart: false })
            }
        })
    },
    getCartItems: (userId) => {
        return new Promise(async (resolve, reject) => {
            let result = await db.get().collection(collections.CART).aggregate([
                {
                    $match: {
                        user: userId
                    }
                }, {
                    $unwind: '$items'
                }, {
                    $project: {
                        user: userId,
                        item: {
                            $toObjectId: '$items.proId'
                        },
                        quantity: '$items.quantity',
                        price: '$items.price',
                        mrp: '$items.mrp',
                        variantSize: '$items.variantSize'
                    }
                }, {
                    $lookup: {
                        from: collections.PRODUCTS,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                }, {
                    $project: {
                        user: 1,
                        item: { $arrayElemAt: ['$product', 0] },
                        quantity: 1,
                        price: 1,
                        mrp: 1,
                        variantSize: 1,
                    }
                }, {
                    $match: {
                        item: { $exists: true },
                        "item.available": 'true'
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })

            let amount = await db.get().collection(collections.CART).aggregate([
                {
                    $match: {
                        user: userId
                    }
                }, {
                    $unwind: '$items'
                }, {
                    $project: {
                        user: userId,
                        item: {
                            $toObjectId: '$items.proId'
                        },
                        quantity: '$items.quantity',
                        price: {
                            $toInt: '$items.price'
                        },
                        mrp: {
                            $toInt: '$items.mrp'
                        },
                    }
                }, {
                    $lookup: {
                        from: collections.PRODUCTS,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                }, {
                    $project: {
                        user: 1,
                        item: { $arrayElemAt: ['$product', 0] },
                        quantity: 1,
                        price: 1,
                        mrp: 1,
                    }
                }, {
                    $match: {
                        item: { $exists: true },
                        "item.available": "true"
                    }
                }, {
                    $group: {
                        _id: '$user',
                        totalPrice: { $sum: { $multiply: ['$quantity', '$price'] } },
                        totalDiscount: {
                            $sum: {
                                $multiply: ['$quantity', {
                                    $subtract: ['$mrp', '$price']
                                }]
                            }
                        },
                        totalMrp: { $sum: { $multiply: ['$quantity', '$mrp'] } }
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })

            if (amount.length !== 0) {
                amount = amount[0]
            } else {
                amount = {

                    _id: '',
                    totalPrice: 0,
                    totalDiscount: 0,
                    totalMrp: 0

                }
            }

            resolve({
                result: result,
                amount: amount
            })
        })
    },
    addToWishlist: ({ userId, item }) => {
        return new Promise(async (resolve, reject) => {
            let wishlist = await db.get().collection(collections.WISHLIST).findOne({
                user: userId
            }).catch((err) => {
                reject(err)
            })

            if (wishlist) {
                db.get().collection(collections.WISHLIST).updateOne({
                    user: userId
                }, {
                    $addToSet: {
                        items: item
                    }
                }).then((done) => {
                    resolve(done)
                }).catch((err) => {
                    reject(err)
                })
            } else {
                db.get().collection(collections.WISHLIST).insertOne({
                    user: userId,
                    items: [item]
                }).then((done) => {
                    resolve(done)
                }).catch((err) => {
                    reject(err)
                })
            }
        })
    },
    getWishlistItems: (userId) => {
        return new Promise(async (resolve, reject) => {
            let result = await db.get().collection(collections.WISHLIST).aggregate([
                {
                    $match: {
                        user: userId
                    }
                }, {
                    $unwind: '$items'
                }, {
                    $project: {
                        user: userId,
                        proId: {
                            $toObjectId: '$items.proId'
                        },
                        price: {
                            $toInt: '$items.price'
                        },
                        mrp: {
                            $toInt: '$items.mrp'
                        },
                        variantSize: '$items.variantSize'
                    }
                }, {
                    $lookup: {
                        from: collections.PRODUCTS,
                        localField: 'proId',
                        foreignField: '_id',
                        as: 'product'
                    }
                }, {
                    $project: {
                        user: 1,
                        proId: 1,
                        price: 1,
                        mrp: 1,
                        variantSize: 1,
                        item: { $arrayElemAt: ['$product', 0] },
                        discount: {
                            $trunc: [{
                                $multiply: [{
                                    $divide: [{
                                        $subtract: ['$mrp', "$price"]
                                    }, '$mrp']
                                }, 100]
                            }]
                        }
                    }
                }, {
                    $match: {
                        item: { $exists: true }
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })

            resolve(result)
        })
    },
    removeItemWihslist: ({ userId, proId }) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.WISHLIST).updateOne({
                user: userId
            }, {
                $pull: {
                    items: { proId: proId }
                }
            }).then((done) => {
                resolve(done)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    removeItemCart: ({ userId, proId }) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART).updateOne({
                user: userId
            }, {
                $pull: {
                    items: { proId: proId }
                }
            }).then((done) => {
                resolve(done)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    changeQuantityCart: ({ userId, proId, action, quantity }) => {
        return new Promise((resolve, reject) => {
            if (quantity + action === 0) {
                resolve()
            } else {
                db.get().collection(collections.CART).updateOne({
                    user: userId,
                    'items.proId': proId
                }, {
                    $inc: {
                        'items.$.quantity': action
                    }
                }).then(() => {
                    resolve()
                }).catch((err) => {
                    reject()
                })
            }
        })
    },
    getCartTotalPrice: (userId) => {
        return new Promise(async (resolve, reject) => {
            let amount = await db.get().collection(collections.CART).aggregate([
                {
                    $match: {
                        user: userId
                    }
                }, {
                    $unwind: '$items'
                }, {
                    $project: {
                        user: userId,
                        item: {
                            $toObjectId: '$items.proId'
                        },
                        quantity: '$items.quantity',
                        price: {
                            $toInt: '$items.price'
                        },
                        mrp: {
                            $toInt: '$items.mrp'
                        },
                    }
                }, {
                    $lookup: {
                        from: collections.PRODUCTS,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                }, {
                    $project: {
                        user: 1,
                        item: { $arrayElemAt: ['$product', 0] },
                        quantity: 1,
                        price: 1,
                        mrp: 1
                    }
                }, {
                    $match: {
                        item: { $exists: true },
                        "item.available": "true"
                    }
                }, {
                    $group: {
                        _id: '$user',
                        totalPrice: { $sum: { $multiply: ['$quantity', '$price'] } },
                        totalDiscount: {
                            $sum: {
                                $multiply: ['$quantity', {
                                    $subtract: ['$mrp', '$price']
                                }]
                            }
                        },
                        totalMrp: { $sum: { $multiply: ['$quantity', '$mrp'] } }
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })

            if (amount) {
                if (amount.length !== 0) {
                    amount = amount[0]
                } else {
                    amount = {

                        _id: '',
                        totalPrice: 0,
                        totalDiscount: 0,
                        totalMrp: 0
                    }
                }

                resolve(amount)
            } else {
                reject()
            }
        })
    },
    getCartTotalPriceCheckout: (userId, discount) => {
        return new Promise(async (resolve, reject) => {
            let amount = await db.get().collection(collections.CART).aggregate([
                {
                    $match: {
                        user: userId
                    }
                }, {
                    $unwind: '$items'
                }, {
                    $project: {
                        user: userId,
                        item: {
                            $toObjectId: '$items.proId'
                        },
                        quantity: '$items.quantity',
                        price: {
                            $toInt: '$items.price'
                        },
                        mrp: {
                            $toInt: '$items.mrp'
                        }
                    }
                }, {
                    $lookup: {
                        from: collections.PRODUCTS,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                }, {
                    $project: {
                        user: 1,
                        item: { $arrayElemAt: ['$product', 0] },
                        quantity: 1,
                        price: 1,
                        mrp: 1
                    }
                }, {
                    $match: {
                        item: { $exists: true },
                        "item.available": "true"
                    }
                }, {
                    $project: {
                        user: 1,
                        price: {
                            $cond: {
                                if: {
                                    $gte: ['$price', parseInt(discount.min)]
                                }, then: {
                                    $subtract: ['$price', {
                                        $multiply: ['$price', parseFloat(`.${discount.discount}`)]
                                    }]
                                }, else: "$price"
                            }
                        },
                        mrp: 1,
                    }
                }, {
                    $group: {
                        _id: '$user',
                        totalPrice: {
                            $sum: '$price'
                        },
                        totalDiscount: {
                            $sum: {
                                $subtract: ['$mrp', '$price']
                            }
                        },
                        totalMrp: {
                            $sum: {
                                $toInt: '$mrp'
                            }
                        }
                    }
                }, {
                    $project: {
                        _id: 1,
                        totalPrice: {
                            $trunc: ['$totalPrice', 1]
                        },
                        totalDiscount: {
                            $trunc: ['$totalDiscount', 1]
                        },
                        totalMrp: 1,
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })

            if (amount.length !== 0) {
                amount = amount[0]
            } else {
                amount = {

                    _id: '',
                    totalPrice: 0,
                    totalDiscount: 0,
                    totalMrp: 0
                }
            }

            resolve(amount)

        })
    },
    getCartProduct4Order: ({ userId, payment_id }, { discount }, details, OrderId, extraDiscount) => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collections.CART).aggregate([
                {
                    $match: {
                        user: userId
                    }
                }, {
                    $unwind: '$items'
                }, {
                    $project: {
                        user: userId,
                        item: {
                            $toObjectId: '$items.proId'
                        },
                        quantity: '$items.quantity',
                        price: {
                            $toInt: '$items.price'
                        },
                        mrp: {
                            $toInt: '$items.mrp'
                        },
                        variantSize: '$items.variantSize'
                    }
                }, {
                    $lookup: {
                        from: collections.PRODUCTS,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                }, {
                    $project: {
                        user: 1,
                        item: { $arrayElemAt: ['$product', 0] },
                        quantity: 1,
                        price: 1,
                        mrp: 1,
                        variantSize: 1
                    }
                }, {
                    $match: {
                        item: { $exists: true },
                        "item.available": "true"
                    }
                }, {
                    $project: {
                        user: 1,
                        product: '$item._id',
                        variantSize: 1,
                        proName: '$item.name',
                        pickup_location: '$item.pickup_location',
                        secretOrderId: {
                            $concat: [OrderId, '$item.uni_id_1']
                        },
                        quantity: 1,
                        price: {
                            $cond: {
                                if: {
                                    $gte: [{
                                        $multiply: ['$quantity', '$price']
                                    }, parseInt(discount.min)]
                                }, then: {
                                    $trunc: [{
                                        $subtract: [{
                                            $multiply: ['$quantity', '$price']
                                        }, {
                                            $multiply: [{
                                                $multiply: ['$quantity', '$price']
                                            }, parseFloat(`.${discount.discount}`)]
                                        }]
                                    }, 1]
                                }, else: {
                                    $multiply: ['$quantity', '$price']
                                }
                            }
                        },
                        mrp: {
                            $toInt: {
                                $multiply: ['$quantity', '$mrp']
                            }
                        },
                        unitPrice: {
                            $cond: {
                                if: {
                                    $gte: ['$price', parseInt(discount.min)]
                                }, then: {
                                    $trunc: [{
                                        $subtract: ['$price', {
                                            $multiply: ['$price', parseFloat(`.${discount.discount}`)]
                                        }]
                                    }, 1]
                                }, else: "$price"
                            }
                        },
                        selling_price: '$price',
                        details: details,
                        OrderId: OrderId,
                        payId: payment_id,
                        return: '$item.return',
                        cancellation: '$item.cancellation',
                        slug: '$item.slug',
                        files: '$item.files',
                        vendorId: "$item.vendorId",
                        uni_id_Mix: {
                            $concat: ['$item.uni_id_1', '$item.uni_id_2']
                        }
                    }
                }, {
                    $project: {
                        user: 1,
                        quantity: 1,
                        product: 1,
                        variantSize: 1,
                        proName: 1,
                        pickup_location: 1,
                        secretOrderId: 1,
                        price: {
                            $trunc: [{
                                $subtract: ['$price', {
                                    $multiply: ['$price', parseFloat(`.${extraDiscount}`)]
                                }]
                            }, 1]
                        },
                        unitPrice: {
                            $trunc: [{
                                $subtract: ['$unitPrice', {
                                    $multiply: ['$unitPrice', parseFloat(`.${extraDiscount}`)]
                                }]
                            }, 1]
                        },
                        mrp: 1,
                        details: 1,
                        OrderId: 1,
                        return: 1,
                        cancellation: 1,
                        payId: 1,
                        selling_price: 1,
                        slug: 1,
                        files: 1,
                        uni_id_Mix: 1,
                        vendorId: 1
                    }
                }, {
                    $group: {
                        _id: {
                            $toObjectId: '$user'
                        },
                        order: {
                            $push: {
                                quantity: '$quantity',
                                variantSize: "$variantSize",
                                proName: '$proName',
                                pickup_location: '$pickup_location',
                                vendorId: "$vendorId",
                                product: '$product',
                                secretOrderId: '$secretOrderId',
                                price: '$price',
                                mrp: "$mrp",
                                details: '$details',
                                OrderId: '$OrderId',
                                OrderStatus: 'Pending',
                                payId: '$payId',
                                selling_price: '$selling_price',
                                return: '$return',
                                cancellation: '$cancellation',
                                slug: '$slug',
                                files: '$files',
                                uni_id_Mix: '$uni_id_Mix',
                                discount: {
                                    $subtract: ['$selling_price', '$unitPrice']
                                },
                                order_id_shiprocket: 'null',
                                shipment_id: 'null',
                                date: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
                            }
                        }
                    }
                }
            ]).toArray().catch((err) => {
                console.log(err)
                reject(err)
            })

            if (products) {
                if (products.length !== 0) {
                    resolve(products[0])
                } else {
                    reject()
                }
            } else {
                reject()
            }

        })
    },
    createOrder: (details) => {
        return new Promise(async (resolve, reject) => {
            let found = await db.get().collection(collections.ORDERS).findOne({
                _id: details._id
            }).catch(() => {
                reject()
            })

            if (found) {
                db.get().collection(collections.ORDERS).updateOne({
                    _id: details._id
                }, {
                    $push: {
                        order: {
                            $each: details.order
                        }
                    }
                }).then(() => {
                    resolve()
                }).catch(() => {
                    reject()
                })
            } else {
                db.get().collection(collections.ORDERS).insertOne(details).then(() => {
                    resolve()
                }).catch(() => {
                    reject()
                })
            }
        })
    },
    emtyCart: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CART).deleteOne({
                user: userId
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            })
        })
    },
    getTotalPriceProduct: ({ proId, quantity, discount, buyDetails }) => {
        return new Promise(async (resolve, reject) => {
            let amount = await db.get().collection(collections.PRODUCTS).aggregate([
                {
                    $match: {
                        _id: ObjectId(proId),
                        available: 'true'
                    }
                }, {
                    $project: {
                        price: {
                            $multiply: [parseInt(quantity), parseInt(buyDetails.price)]
                        },
                        mrp: {
                            $multiply: [parseInt(quantity), parseInt(buyDetails.mrp)]
                        },
                    }
                }, {
                    $project: {
                        price: {
                            $cond: {
                                if: {
                                    $gte: ['$price', parseInt(discount.min)]
                                }, then: {
                                    $subtract: ['$price', {
                                        $multiply: ['$price', parseFloat(`.${discount.discount}`)]
                                    }]
                                }, else: '$price'
                            }
                        },
                        mrp: 1
                    }
                }, {
                    $project: {
                        price: {
                            $trunc: ['$price', 1]
                        },
                        discount: {
                            $trunc: [{
                                $subtract: ['$mrp', '$price']
                            }, 1]
                        },
                        mrp: {
                            $toInt: '$mrp'
                        }
                    }
                }
            ]).toArray()

            if (amount.length !== 0) {
                amount = {
                    _id: 'buy',
                    totalPrice: amount[0].price,
                    totalDiscount: amount[0].discount,
                    totalMrp: amount[0].mrp
                }
            } else {
                amount = {
                    _id: '',
                    totalPrice: 0,
                    totalDiscount: 0,
                    totalMrp: 0
                }
            }

            resolve(amount)
        })
    },
    getBuyProduct4Order: ({ userId, payment_id }, { discount, order }, details, OrderId, extraDiscount) => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collections.PRODUCTS).aggregate([
                {
                    $match: {
                        _id: ObjectId(order.proId),
                        available: 'true'
                    }
                }, {
                    $project: {
                        user: userId,
                        product: '$_id',
                        pickup_location: '$pickup_location',
                        vendorId: '$vendorId',
                        secretOrderId: {
                            $concat: [OrderId, '$uni_id_1']
                        },
                        quantity: `${order.quantity}`,
                        price: {
                            $cond: {
                                if: {
                                    $gte: [{
                                        $multiply: [parseInt(order.quantity), parseInt(order.buyDetails.price)]
                                    }, parseInt(discount.min)]
                                }, then: {
                                    $trunc: [{
                                        $subtract: [{
                                            $multiply: [parseInt(order.quantity), parseInt(order.buyDetails.price)]
                                        }, {
                                            $multiply: [{
                                                $multiply: [parseInt(order.quantity), parseInt(order.buyDetails.price)]
                                            }, parseFloat(`.${discount.discount}`)]
                                        }]
                                    }, 1]
                                }, else: {
                                    $multiply: [parseInt(order.quantity), parseInt(order.buyDetails.price)]
                                }
                            }
                        },
                        mrp: {
                            $toInt: {
                                $multiply: [parseInt(order.quantity), parseInt(order.buyDetails.mrp)]
                            }
                        },
                        unitPrice: {
                            $cond: {
                                if: {
                                    $gte: [parseInt(order.buyDetails.price), parseInt(discount.min)]
                                }, then: {
                                    $trunc: [{
                                        $subtract: [parseInt(order.buyDetails.price), {
                                            $multiply: [parseInt(order.buyDetails.price), parseFloat(`.${discount.discount}`)]
                                        }]
                                    }, 1]
                                }, else: parseInt(order.buyDetails.price)
                            }
                        },
                        selling_price: {
                            $toInt: order.buyDetails.price,
                        },
                        details: details,
                        OrderId: OrderId,
                        payId: payment_id,
                        proName: "$name",
                        return: '$return',
                        cancellation: '$cancellation',
                        slug: '$slug',
                        files: '$files',
                        uni_id_Mix: {
                            $concat: ['$uni_id_1', '$uni_id_2']
                        }
                    }
                }, {
                    $project: {
                        user: 1,
                        quantity: 1,
                        pickup_location: 1,
                        vendorId: 1,
                        product: 1,
                        proName: 1,
                        secretOrderId: 1,
                        selling_price: 1,
                        price: {
                            $trunc: [{
                                $subtract: ['$price', {
                                    $multiply: ['$price', parseFloat(`.${extraDiscount}`)]
                                }]
                            }, 1]
                        },
                        unitPrice: {
                            $trunc: [{
                                $subtract: ['$unitPrice', {
                                    $multiply: ['$unitPrice', parseFloat(`.${extraDiscount}`)]
                                }]
                            }, 1]
                        },
                        mrp: 1,
                        details: 1,
                        OrderId: 1,
                        payId: 1,
                        return: 1,
                        cancellation: 1,
                        slug: 1,
                        files: 1,
                        uni_id_Mix: 1
                    }
                }, {
                    $group: {
                        _id: {
                            $toObjectId: '$user'
                        },
                        order: {
                            $push: {
                                quantity: '$quantity',
                                variantSize: order.buyDetails.variantSize,
                                product: '$product',
                                proName: '$proName',
                                pickup_location: '$pickup_location',
                                vendorId: "$vendorId",
                                secretOrderId: '$secretOrderId',
                                price: '$price',
                                selling_price: '$selling_price',
                                mrp: "$mrp",
                                details: '$details',
                                OrderId: '$OrderId',
                                OrderStatus: 'Pending',
                                payId: '$payId',
                                return: '$return',
                                cancellation: '$cancellation',
                                slug: '$slug',
                                files: '$files',
                                uni_id_Mix: '$uni_id_Mix',
                                discount: {
                                    $subtract: ['$selling_price', '$unitPrice']
                                },
                                order_id_shiprocket: 'null',
                                shipment_id: 'null',
                                date: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
                            }
                        }
                    }
                }
            ]).toArray().catch((err) => {
                reject(err)
            })

            if (products) {
                if (products.length !== 0) {
                    resolve(products[0])
                } else {
                    reject()
                }
            } else {
                reject()
            }

        })
    },
    getOrdersTotal: ({ userId, search }) => {
        return new Promise(async (resolve, reject) => {
            let Total = await db.get().collection(collections.ORDERS).aggregate([
                {
                    $match: {
                        _id: ObjectId(userId)
                    }
                }, {
                    $unwind: '$order'
                }, {
                    $project: {
                        _id: 0,
                        userId: userId,
                        product: '$order.product',
                        name: '$order.proName',
                    }
                }, {
                    $match: {
                        name: {
                            $regex: search, $options: 'i'
                        }
                    }
                }, {
                    $sort: {
                        OrderId: -1
                    }
                }, {
                    $group: {
                        _id: null,
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]).toArray().catch(() => {
                reject()
            })

            if (Total) {
                if (Total.length !== 0) {
                    resolve(Total[0].count)
                } else {
                    resolve(0)
                }
            } else {
                reject()
            }
        })
    },
    getOrders: ({ userId, search, skip }, limit) => {
        return new Promise(async (resolve, reject) => {
            let Orders = await db.get().collection(collections.ORDERS).aggregate([
                {
                    $match: {
                        _id: ObjectId(userId)
                    }
                }, {
                    $unwind: '$order'
                }, {
                    $project: {
                        _id: 0,
                        userId: userId,
                        product: '$order.product',
                        price: '$order.price',
                        mrp: "$order.mrp",
                        OrderId: '$order.OrderId',
                        secretOrderId: '$order.secretOrderId',
                        OrderStatus: '$order.OrderStatus',
                        date: '$order.date',
                        quantity: '$order.quantity',
                        userId: 1,
                        name: '$order.proName',
                        files: '$order.files',
                        uni_id_Mix: '$order.uni_id_Mix',
                    }
                }, {
                    $match: {
                        name: {
                            $regex: search, $options: 'i'
                        }
                    }
                }, {
                    $sort: {
                        OrderId: -1
                    }
                }, {
                    $skip: parseInt(skip)
                }, {
                    $limit: limit
                }
            ]).toArray().catch(() => {
                reject()
            })

            if (Orders) {
                resolve(Orders)
            } else {
                reject()
            }
        })
    },
    getSpecificOrder: ({ userId, orderId }) => {
        return new Promise(async (resolve, reject) => {
            let order = await db.get().collection(collections.ORDERS).aggregate([
                {
                    $match: {
                        _id: ObjectId(userId)
                    }
                }, {
                    $unwind: '$order'
                }, {
                    $match: {
                        'order.secretOrderId': orderId
                    }
                }, {
                    $project: {
                        userId: userId,
                        proName: '$order.proName',
                        proId: '$order.product',
                        secretOrderId: orderId,
                        created: '$order.date',
                        quantity: '$order.quantity',
                        discount: {
                            $trunc: [{
                                $multiply: [{
                                    $toInt: '$order.quantity'
                                }, '$order.discount']
                            }, 1]
                        },
                        price: '$order.price',
                        mrp: '$order.mrp',
                        order_id_shiprocket: '$order.order_id_shiprocket',
                        shipment_id: '$order.shipment_id',
                        payId: '$order.payId',
                        OrderStatus: '$order.OrderStatus',
                        details: '$order.details',
                        return: '$order.return',
                        cancellation: '$order.cancellation',
                        updated: '$order.updated',
                        shipment_track_activities: '$order.shipment_track_activities',
                        etd: '$order.etd',
                        track_url: '$order.track_url',
                        files: '$order.files',
                        uni_id_Mix: '$order.uni_id_Mix',
                        variantSize: '$order.variantSize'
                    }
                }
            ]).toArray().catch((err) => {
                console.log(err)
                reject()
            })

            if (order && order.length !== 0) {
                resolve(order[0])
            } else {
                reject()
            }
        })
    },
    cancelOrder: ({ userId, secretOrderId }) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDERS).updateOne({
                _id: ObjectId(userId),
                'order.secretOrderId': secretOrderId
            }, {
                $set: {
                    'order.$.OrderStatus': 'Cancelled'
                }
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            })
        })
    },
    returnOrder: ({ userId, secretOrderId, reason }) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDERS).updateOne({
                _id: ObjectId(userId),
                'order.secretOrderId': secretOrderId
            }, {
                $set: {
                    'order.$.OrderStatus': 'Return',
                    'order.$.returnReason': reason
                }
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            })
        })
    },
    changeOrderStatus: ({ etd, track_url, shipment_track_activities, OrderStatus, userId, secretOrderId, updated }) => {
        return new Promise(async (resolve, reject) => {
            let response = await db.get().collection(collections.ORDERS).updateOne({
                _id: ObjectId(userId),
                'order.secretOrderId': secretOrderId
            }, {
                $set: {
                    'order.$.shipment_track_activities': shipment_track_activities,
                    'order.$.etd': etd,
                    'order.$.OrderStatus': OrderStatus,
                    'order.$.updated': updated,
                    'order.$.track_url': track_url
                }
            }).catch((err) => {
                reject()
            })

            resolve()
        })
    },
    AddAddress: ({ name, number, pin, locality, address, city, state }, userId) => {
        return new Promise(async (resolve, reject) => {
            let saved = await db.get().collection(collections.ADDRESS).findOne({
                userId: userId,
                'saved.name': name,
                'saved.number': number,
                'saved.pin': pin,
                'saved.locality': locality,
                'saved.address': address,
                'saved.city': city,
                'saved.state': state
            }).catch(() => {
                reject()
            })

            if (!saved) {
                db.get().collection(collections.ADDRESS).updateOne({
                    userId: userId
                }, {
                    $push: {
                        saved: {
                            id: new ObjectId().toHexString(),
                            name: name,
                            number: number,
                            pin: pin,
                            locality: locality,
                            address: address,
                            city: city,
                            state: state
                        }
                    }
                }, { upsert: true }).then(() => {
                    resolve()
                }).catch(() => {
                    reject()
                })
            } else {
                resolve()
            }
        })
    },
    getAllAddress: (userId) => {
        return new Promise(async (resolve, reject) => {
            let address = await db.get().collection(collections.ADDRESS).findOne({
                userId: userId
            }).catch(() => {
                reject()
            })

            resolve(address || { saved: [] })
        })
    },
    editAddress: (details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ADDRESS).updateOne({
                userId: details.userId,
                'saved.id': details.id
            }, {
                $set: {
                    'saved.$.name': details.name,
                    'saved.$.number': details.number,
                    'saved.$.pin': details.pin,
                    'saved.$.locality': details.locality,
                    'saved.$.address': details.address,
                    'saved.$.city': details.city,
                    'saved.$.state': details.state
                }
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            })
        })
    },
    deleteAddress: ({ userId, id }) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ADDRESS).updateOne({
                userId: userId
            }, {
                $pull: {
                    saved: {
                        id: id
                    }
                }
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            })
        })
    }
}
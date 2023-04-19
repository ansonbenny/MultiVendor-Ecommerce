import db from '../Config/Connection.js'
import collections from '../Config/Collection.js'
import { ObjectId } from 'mongodb'

export default {
    addVendor: (details) => {
        return new Promise(async (resolve, reject) => {
            let vendor = await db.get().collection(collections.VENDORS).findOne({
                email: details.email
            }).catch(() => {
                reject()
            })

            if (!vendor) {
                db.get().collection(collections.VENDORS).insertOne(details).then(() => {
                    resolve({
                        found: false
                    })
                }).catch(() => {
                    reject()
                })
            } else {
                resolve({
                    found: true
                })
            }
        })
    },
    checkVendorAccept: (email) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.VENDORS).findOne({
                email: email,
                accept: true
            }).then((user) => {
                if (user) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }).catch(() => {
                reject()
            })
        })
    },
    checkOtp: (email, type, otpFor) => {
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
    getVendorAccepted: (email) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.VENDORS).findOne({
                email: email,
                accept: true
            }).then((vendor) => {
                resolve(vendor)
            }).catch(() => {
                reject()
            })
        })
    },
    getVendor: (Id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.VENDORS).findOne({
                _id: ObjectId(Id)
            }).then((vendor) => {
                resolve(vendor)
            }).catch(() => {
                reject()
            })
        })
    },
    getOneProduct: (vendorId, proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCTS).findOne({
                _id: ObjectId(proId),
                vendor: true,
                vendorId: vendorId
            }).then((data) => {
                resolve(data)
            }).catch(() => {
                reject()
            })
        })
    },
    addProduct: (details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCTS).insertOne(details).then((done) => {
                resolve(done)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    updateProduct: (data, vendorId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCTS).updateOne({
                _id: ObjectId(data._id),
                vendor: true,
                vendorId: vendorId
            }, {
                $set: {
                    name: data.name,
                    slug: data.slug,
                    price: data.price,
                    mrp: data.mrp,
                    available: data.available,
                    category: data.category,
                    categorySlug: data.categorySlug,
                    srtDescription: data.srtDescription,
                    description: data.description,
                    seoDescription: data.seoDescription,
                    seoKeyword: data.seoKeyword,
                    seoTitle: data.seoTitle,
                    vendor: true,
                    vendorId: vendorId,
                    files: data.serverImg,
                    discount: data.discount,
                    return: data.return,
                    cancellation: data.cancellation,
                    pickup_location: data.pickup_location,
                    variant: data.variant,
                    variantDetails: data.variantDetails,
                    currVariantSize: data.currVariantSize
                }
            }).then((done) => {
                resolve()
            }).catch((err) => {
                reject()
            })
        })
    },
    getVendorProducts: (skip, limit, vendorId) => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collections.PRODUCTS).find({
                vendor: true,
                vendorId: vendorId
            }).sort({ _id: -1 }).skip(skip).limit(limit).toArray().catch((err) => {
                reject(err)
            })
            resolve(products)
        })
    },
    getProductVendorCount: (vendorId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCTS).countDocuments({
                vendor: true,
                vendorId: vendorId
            }).then((count) => {
                resolve(count)
            }).catch((err) => {
                console.log(err)
            })
        })
    },
    getProductCountVendorSearch: (search, vendorId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCTS).countDocuments({
                name: { $regex: search, $options: 'i' },
                vendor: true,
                vendorId: vendorId
            }).then((count) => {
                resolve(count)
            }).catch((err) => {
                console.log(err)
            })
        })
    },
    getVendorProductsSearch: (search, skip, limit, vendorId) => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collections.PRODUCTS).find({
                name: { $regex: search, $options: 'i' },
                vendor: true,
                vendorId: vendorId
            }).sort({ _id: -1 }).skip(skip).limit(limit).toArray().catch((err) => {
                reject(err)
            })
            resolve(products)
        })
    },
    deleteProduct: ({ proId, vendorId }) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCTS).deleteOne({
                _id: ObjectId(proId),
                vendor: true,
                vendorId: vendorId
            }).then((data) => {
                if (data.deletedCount > 0) {
                    resolve()
                } else {
                    reject()
                }
            }).catch((err) => {
                reject()
            })
        })
    },
    getAllOrders: ({ search, skip, vendorId }, limit) => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collections.ORDERS).aggregate([
                {
                    $unwind: '$order'
                }, {
                    $project: {
                        userId: '$_id',
                        date: '$order.date',
                        product: {
                            $toString: '$order.product'
                        },
                        secretOrderId: '$order.secretOrderId',
                        customer: '$order.details.name',
                        payStatus: '$order.payStatus',
                        payType: '$order.details.payType',
                        OrderId: '$order.OrderId',
                        OrderStatus: '$order.OrderStatus',
                        price: '$order.price',
                        vendorId: '$order.vendorId',
                    }
                }, {
                    $match: {
                        vendorId: vendorId,
                        customer: {
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

            if (orders) {
                resolve(orders)
            } else {
                reject()
            }
        })
    },
    getTotalOrders: ({ search, vendorId }) => {
        return new Promise(async (resolve, reject) => {
            let total = await db.get().collection(collections.ORDERS).aggregate([
                {
                    $unwind: '$order'
                }, {
                    $project: {
                        customer: '$order.details.name',
                        vendorId: '$order.vendorId',
                    }
                }, {
                    $match: {
                        vendorId: vendorId,
                        customer: {
                            $regex: search, $options: 'i'
                        }
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

            if (total) {
                if (total.length !== 0) {
                    resolve(total[0].count)
                } else {
                    resolve(0)
                }
            } else {
                reject()
            }
        })
    },
    getOrderSpecific: ({ orderId, userId, vendorId }) => {
        return new Promise(async (resolve, reject) => {
            if (userId.length === 24) {
                let order = await db.get().collection(collections.ORDERS).aggregate([
                    {
                        $match: {
                            _id: ObjectId(userId)
                        }
                    }, {
                        $unwind: '$order'
                    }, {
                        $match: {
                            'order.secretOrderId': orderId,
                            'order.vendorId': vendorId
                        }
                    }, {
                        $project: {
                            userId: userId,
                            proName: '$order.proName',
                            proId: '$order.product',
                            secretOrderId: orderId,
                            created: '$order.date',
                            quantity: '$order.quantity',
                            price: '$order.price',
                            mrp: '$order.mrp',
                            order_id_shiprocket: '$order.order_id_shiprocket',
                            shipment_id: '$order.shipment_id',
                            payId: '$order.payId',
                            OrderStatus: '$order.OrderStatus',
                            details: '$order.details',
                            updated: '$order.updated',
                            returnReason: '$order.returnReason',
                            slug: '$order.slug',
                            vendorId: '$order.vendorId',
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
            } else {
                reject()
            }
        })
    },
    updateUserDetails: ({ email, number, vendorId }) => {
        return new Promise(async (resolve, reject) => {
            let ownEmail = await db.get().collection(collections.VENDORS).findOne({
                _id: ObjectId(vendorId),
                email: email
            }).catch(() => {
                reject()
            })

            if (ownEmail) {
                db.get().collection(collections.VENDORS).updateOne({
                    _id: ObjectId(vendorId)
                }, {
                    $set: {
                        number: number
                    }
                }).then(() => {
                    resolve({ email: false })
                }).catch(() => {
                    reject()
                })
            } else {
                let vendor = await db.get().collection(collections.VENDORS).findOne({
                    email: email
                }).catch(() => {
                    reject()
                })

                if (vendor) {
                    resolve({ email: true })
                } else {
                    db.get().collection(collections.VENDORS).updateOne({
                        _id: ObjectId(vendorId)
                    }, {
                        $set: {
                            email: email,
                            number: number
                        }
                    }).then(() => {
                        resolve({ email: false })
                    }).catch(() => {
                        reject()
                    })
                }
            }
        })
    },
    updateBankAccount: (details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.VENDORS).updateOne({
                _id: ObjectId(details.vendorId)
            }, {
                $set: {
                    bankAccOwner: details.bankAccOwner,
                    bankName: details.bankName,
                    bankAccNumber: details.bankAccNumber,
                    bankIFSC: details.bankIFSC,
                    bankBranchName: details.bankBranchName,
                    bankBranchNumber: details.bankBranchNumber,
                }
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            })
        })
    },
    getDashboardTotal: (vendorId) => {
        return new Promise(async (resolve, reject) => {
            let totalDelivered = await db.get().collection(collections.ORDERS).aggregate([
                {
                    $unwind: '$order'
                }, {
                    $match: {
                        'order.vendorId': vendorId,
                        'order.OrderStatus': 'Delivered'
                    }
                }, {
                    $group: {
                        _id: 'Delivered',
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]).toArray().catch(() => {
                reject()
            })

            let totalReturn = await db.get().collection(collections.ORDERS).aggregate([
                {
                    $unwind: '$order'
                }, {
                    $match: {
                        'order.vendorId': vendorId,
                        'order.OrderStatus': 'Return'
                    }
                }, {
                    $group: {
                        _id: 'Return',
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]).toArray().catch(() => {
                reject()
            })

            let totalCancelled = await db.get().collection(collections.ORDERS).aggregate([
                {
                    $unwind: '$order'
                }, {
                    $match: {
                        'order.vendorId': vendorId,
                        'order.OrderStatus': 'Cancelled'
                    }
                }, {
                    $group: {
                        _id: 'Cancelled',
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]).toArray().catch(() => {
                reject()
            })

            let totalAmount = await db.get().collection(collections.ORDERS).aggregate([
                {
                    $unwind: '$order'
                }, {
                    $match: {
                        'order.vendorId': vendorId,
                        'order.OrderStatus': 'Delivered'
                    }
                }, {
                    $group: {
                        _id: 'Amount',
                        amount: {
                            $sum: '$order.price'
                        }
                    }
                }
            ]).toArray().catch(() => {
                reject()
            })

            if (Array.isArray(totalDelivered) && Array.isArray(totalReturn)
                && Array.isArray(totalCancelled) && Array.isArray(totalAmount)
            ) {

                if (totalAmount.length == 0) {
                    totalAmount[0] = { amount: 0 }
                }

                if (totalDelivered.length == 0) {
                    totalDelivered[0] = { count: 0 }
                }

                if (totalCancelled.length == 0) {
                    totalCancelled[0] = { count: 0 }
                }

                if (totalReturn.length == 0) {
                    totalReturn[0] = { count: 0 }
                }

                resolve({
                    totalAmount: totalAmount[0].amount,
                    totalDelivered: totalDelivered[0].count,
                    totalReturn: totalReturn[0].count,
                    totalCancelled: totalCancelled[0].count
                })
            } else {
                reject()
            }
        })
    }
}
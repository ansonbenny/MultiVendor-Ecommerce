import Loading from '@/Component/Loading/Loading'
import ContentControl from '@/ContentControl/ContentControl'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { useEffect } from 'react'
import { adminAxios } from '../../../Config/Server'

function Vendors({ loaded, setLoaded }) {

  const { setAdminLogged } = useContext(ContentControl)

  const navigate = useRouter()

  const [vendors, setVendors] = useState([])

  const [total, setTotal] = useState(0)

  const [accepted, setAccepted] = useState(true)

  const logOut = () => {
    setAdminLogged({ status: false })
    localStorage.removeItem("adminToken")
    setLoaded(true)
    navigate.push('/admin/login')
  }

  const getVendors = (type) => {
    setLoaded(false)
    adminAxios((server) => {
      server.get('/admin/getVendors', {
        params: {
          accept: type,
          skip: 0
        }
      }).then((res) => {
        setLoaded(true)
        if (res.data.login) {
          logOut()
        } else {
          setVendors(res.data.vendors)
          setTotal(res.data.total)
        }
      }).catch(() => {
        setLoaded(true)
        alert("Error")
      })
    })
  }
  useEffect(() => {
    getVendors(true)
  }, [])
  return (
    <>
      {
        loaded ? (
          <div className='vendorsComp' >
            <div className='AdminContainer pb-3'>

              <div className="BtnsSections text-center pt-3">
                <div className="row">
                  <div className="col-12 col-md-4 pb-2">
                    <button onClick={() => {
                      getVendors(true)
                      setAccepted(true)
                    }}>Accepted Vendors</button>
                  </div>
                  <div className="col-12 col-md-4 pb-2">
                    <button onClick={() => {
                      getVendors(false)
                      setAccepted(false)
                    }}>Pending Vendors</button>
                  </div>

                </div>
              </div>

              <div className='MainTable text-center'>
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Number</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      vendors.map((obj, key) => {
                        return (
                          <tr key={key}>
                            <td>{obj.adharName}</td>
                            <td>{obj.email}</td>
                            <td>{obj.number}</td>
                            <td>
                              {obj.accept ? 'Accepted' : 'Pending'}
                            </td>
                            <td>
                              <button className='ActionBtn' onClick={() => {
                                navigate.push(`/admin/vendor/details/${obj._id}`)
                              }}>Details</button>

                              {obj.accept ? <button className='ActionBtn' onClick={() => {
                                navigate.push(`/admin/vendor/products/${obj._id}`)
                              }}>Products</button>
                                : <button className='ActionBtn' onClick={() => {
                                  adminAxios((server) => {
                                    server.put('/admin/acceptVendor', {
                                      email: obj.email,
                                      address: {
                                        pickup_location: obj._id,
                                        name: obj.adharName,
                                        email: obj.email,
                                        phone: obj.number,
                                        address: `${obj.address} pin code ${obj.pinCode}`,
                                        address_2: "",
                                        pin_code: obj.pinCode,
                                        city: obj.city,
                                        state: obj.state,
                                        country: "India",
                                      }
                                    }).then((res) => {
                                      if (res.data.login) {
                                        logOut()
                                      } else {
                                        alert("Done")
                                        getVendors(false)
                                      }
                                    }).catch(() => {
                                      alert("Error")
                                    })
                                  })
                                }}>Accept</button>}

                              {
                                obj.accept ? <button className='ActionBtn' onClick={() => {
                                  if (window.confirm(`Do you want delete vendor ${obj.adharName}`)) {
                                    adminAxios((server) => {
                                      server.delete('/admin/deleteVendor', {
                                        data: {
                                          email: obj.email,
                                          vendorId: obj._id
                                        }
                                      }).then((res) => {
                                        if (res.data.login) {
                                          logOut()
                                        } else {
                                          alert("Done")
                                          getVendors(true)
                                        }
                                      }).catch(() => {
                                        alert("Error")
                                      })
                                    })
                                  }
                                }}>Delete</button> : <button className='ActionBtn' onClick={() => {
                                  if (window.confirm(`Do you want delete vendor ${obj.adharName}`)) {
                                    adminAxios((server) => {
                                      server.delete('/admin/deleteVendor', {
                                        data: {
                                          email: obj.email,
                                          vendorId: obj._id
                                        }
                                      }).then((res) => {
                                        if (res.data.login) {
                                          logOut()
                                        } else {
                                          alert("Done")
                                          getVendors(false)
                                        }
                                      }).catch(() => {
                                        alert("Error")
                                      })
                                    })
                                  }
                                }}>Delete</button>
                              }
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>

              {
                vendors.length !== total && <div>
                  <button data-for="loadMore" onClick={() => {
                    if (accepted) {
                      setLoaded(false)
                      adminAxios((server) => {
                        server.get('/admin/getVendors', {
                          params: {
                            accept: true,
                            skip: vendors.length
                          }
                        }).then((res) => {
                          if (res.data.login) {
                            logOut()
                          } else {
                            setTotal(res.data.total)
                            setVendors([...vendors, ...res.data.vendors])
                            setLoaded(true)
                          }
                        }).catch(() => {
                          alert("Error")
                          setLoaded(true)
                        })
                      })
                    } else {
                      setLoaded(false)
                      adminAxios((server) => {
                        server.get('/admin/getVendors', {
                          params: {
                            accept: false,
                            skip: vendors.length
                          }
                        }).then((res) => {
                          if (res.data.login) {
                            logOut()
                          } else {
                            setTotal(res.data.total)
                            setVendors([...vendors, ...res.data.vendors])
                            setLoaded(true)
                          }
                        }).catch(() => {
                          alert("Error")
                          setLoaded(true)
                        })
                      })
                    }
                  }}>Load More</button>
                </div>
              }

            </div>
          </div>
        ) : <Loading />
      }
    </>
  )
}

export default Vendors
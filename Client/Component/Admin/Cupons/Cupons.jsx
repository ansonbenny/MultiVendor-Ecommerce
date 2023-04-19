import { useContext, useState } from 'react'
import Modal from './Modal'
import { useEffect } from 'react'
import { adminAxios } from '../../../Config/Server'
import Loading from '@/Component/Loading/Loading'
import { useRouter } from 'next/router'
import ContentControl from '@/ContentControl/ContentControl'

function Cupons({ loaded, setLoaded }) {
  const { setAdminLogged } = useContext(ContentControl)
  const [mainModal, setMainModal] = useState({
    btn: false,
    active: false,
  })

  const navigate = useRouter()

  const logOut = () => {
    setAdminLogged({ status: false })
    localStorage.removeItem("adminToken")
    setLoaded(true)
    navigate.push('/admin/login')
  }

  const [cupons, setCupons] = useState([])

  function getCupons() {
    setLoaded(false)
    adminAxios((server) => {
      server.get('/admin/getCupons').then((res) => {
        if (res.data.login) {
          logOut()
        } else {
          setCupons(res.data)
          setLoaded(true)
        }
      }).catch(() => {
        setLoaded(true)
        console.log("error")
      })
    })
  }

  useEffect(() => {
    getCupons()
  }, [])

  return (
    <>
      {
        loaded ? (
          <div className='CuponsComp'>
            {
              mainModal.active && <Modal MainModal={mainModal}
                getCupons={getCupons} setMainModal={setMainModal} logOut={logOut}
              />
            }
            <div className='AdminContainer pb-3'>

              <div className="BtnsSections text-center pt-3">
                <div className="row">
                  <div className="col-12 col-md-3 pb-2">
                    <button className='BUTTONS' onClick={() => {
                      setMainModal({
                        ...mainModal,
                        active: true,
                        btn: true
                      })
                    }}>Add Cupon</button>
                  </div>

                </div>
              </div>

              <div className='MainTable text-center'>
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Starting Price</th>
                      <th>Discount %</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      cupons.map((obj, key) => {
                        return (
                          <tr key={key}>
                            <td>{obj.code}</td>
                            <td>{obj.min}</td>
                            <td>{obj.discount} %</td>
                            <td><button className='ActionBtn' onClick={() => {
                              if (window.confirm(`Do you want delete cupon ${obj.code}`)) {
                                adminAxios((server) => {
                                  server.delete('/admin/deleteCupon', {
                                    data: {
                                      Id: obj._id
                                    }
                                  }).then((res) => {
                                    if (res.data.login) {
                                      logOut()
                                    } else {
                                      alert("Deleted")
                                      getCupons()
                                    }
                                  }).catch(() => {
                                    alert("Error")
                                  })
                                })
                              }
                            }}>Delete</button></td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : <Loading />
      }
    </>
  )
}

export default Cupons
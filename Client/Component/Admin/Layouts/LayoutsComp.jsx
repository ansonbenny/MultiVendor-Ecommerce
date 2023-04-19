import Loading from '@/Component/Loading/Loading'
import ContentControl from '@/ContentControl/ContentControl'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { adminAxios, ServerId } from '../../../Config/Server'
import ExtraModals from './ExtraModals'
import SectionMadals from './SectionMadals'

function LayoutsComp({ setLoaded, loaded }) {

  const { setAdminLogged } = useContext(ContentControl)

  const navigate = useRouter()

  const logOut = () => {
    setAdminLogged({ status: false })
    localStorage.removeItem("adminToken")
    setLoaded(true)
    navigate.push('/admin/login')
  }

  const [activeSecModal, setActiveSecModal] = useState({
    bun: false,
    active: false,
  })

  const [activeExtraModal, setActiveExtraModal] = useState({
    bun: false,
    active: false,
    for: ''
  })

  const [sectionOne, setSectionOne] = useState({
    title: '',
    subTitle: '',
    items: []
  })

  const [sectionTwo, setSectionTwo] = useState({
    title: '',
    subTitle: '',
    items: [],
    items2: []
  })

  const [sectionThree, setSectionThree] = useState({
    title: '',
    subTitle: '',
    items: [],
    items2: []
  })

  const [sectionFour, setSectionFour] = useState({
    title: '',
    subTitle: '',
    items: []
  })

  const [sliderOne, setSliderOne] = useState({
    items: []
  })

  const [sliderTwo, setSliderTwo] = useState({
    items: []
  })

  const [banner, setBanner] = useState({
    file: '',
    link: ''
  })

  const [currTable, setCurrTable] = useState('sectionone')

  function GetAllLayouts() {
    setLoaded(false)
    adminAxios((server) => {
      server.get('/admin/getLayouts').then((layout) => {
        if (layout.data.login) {
          logOut()
        } else {
          setSectionOne(layout.data.sectionone)
          setSectionFour(layout.data.sectionfour)

          setSectionTwo(layout.data.sectiontwo)
          setSectionThree(layout.data.sectionthree)

          if (layout.data.sliderOne !== null) {
            setSliderOne(layout.data.sliderOne)
          }

          if (layout.data.sliderTwo !== null) {
            setSliderTwo(layout.data.sliderTwo)
          }

          if (layout.data.banner !== null) {
            setBanner(layout.data.banner)
          }
        }

        setLoaded(true)
      }).catch((err) => {
        console.log('error')
        setLoaded(true)
      })
    })
  }

  useEffect(() => {

    GetAllLayouts()

  }, [])

  return (
    <div className="LayoutsComp">

      {activeSecModal.active && <SectionMadals
        setActiveModal={setActiveSecModal}
        activeModal={activeSecModal}
        sectionOneDetails={sectionOne}
        setSectionOneDetails={setSectionOne}
        sectionFourDetails={sectionFour}
        setSectionFourDetails={setSectionFour}
        setSectionTwoDetails={setSectionTwo}
        sectionTwoDetails={sectionTwo}
        setSectionThreeDetails={setSectionThree}
        sectionThreeDetails={sectionThree}
        logOut={logOut}
      />}

      {activeExtraModal.active && <ExtraModals
        setActiveModal={setActiveExtraModal}
        activeModal={activeExtraModal}
        setSliderOne={setSliderOne}
        setSliderTwo={setSliderTwo}
        setBannerPage={setBanner}
        logOut={logOut}
      />
      }

      {
        loaded ? (
          <div className='AdminContainer pb-3'>
            <div className='ActionAreaDiv text-center pt-3 pb-5'>
              <div className="row">
                <div className="col-12 col-md-3 pb-1">
                  <button className='BUTTONS'
                    onClick={() => {
                      setActiveExtraModal({
                        ...activeExtraModal,
                        btn: true,
                        active: true,
                        for: 'slider'
                      })
                    }}>
                    Add Slider
                  </button>
                </div>
                <div className="col-12 col-md-3 pb-1">
                  <button className='BUTTONS'
                    onClick={() => {
                      setActiveExtraModal({
                        ...activeExtraModal,
                        btn: true,
                        active: true,
                        for: 'slidertwo'
                      })
                    }}>Add Slider 2</button>
                </div>
                <div className="col-12 col-md-3 pb-1">
                  <button className='BUTTONS'
                    onClick={() => {
                      setActiveExtraModal({
                        ...activeExtraModal,
                        btn: true,
                        active: true,
                        for: 'banner'
                      })
                    }}>Add Banner</button>
                </div>

                <div className="col-12 col-md-3 pb-1">
                  <button className='BUTTONS'
                    onClick={() => {
                      setActiveSecModal({
                        ...activeSecModal,
                        btn: true,
                        active: true
                      })
                    }}>
                    Add Section Items
                  </button>
                </div>
              </div>
            </div>

            <div className="BtnsSections text-center">
              <div className="row">
                <div className="col-12 col-md-3 pb-2">
                  <button className='BUTTONS' onClick={() => {
                    GetAllLayouts()
                    setCurrTable('sliderOne')
                  }}>Show Slider 1</button>
                </div>
                <div className="col-12 col-md-3 pb-2">
                  <button className='BUTTONS' onClick={() => {
                    GetAllLayouts()
                    setCurrTable('sliderTwo')
                  }}>Show Slider 2</button>
                </div>
                <div className="col-12 col-md-3 pb-2">
                  <button className='BUTTONS' onClick={() => {
                    GetAllLayouts()
                    setCurrTable('banner')
                  }}>Show Banner</button>
                </div>

                <div className="col-12 col-md-3 pb-2">
                  <noscript>SPACE</noscript>
                </div>

                <div className="col-12 col-md-3 pb-2">
                  <button className='BUTTONS' onClick={() => {
                    GetAllLayouts()
                    setCurrTable('sectionone')
                  }}>Show Section 1</button>
                </div>

                <div className="col-12 col-md-3 pb-2">
                  <button className='BUTTONS' onClick={() => {
                    GetAllLayouts()
                    setCurrTable('sectiontwo')
                  }}>Show Section 2</button>
                </div>

                <div className="col-12 col-md-3 pb-2">
                  <button className='BUTTONS' onClick={() => {
                    GetAllLayouts()
                    setCurrTable('sectionthree')
                  }}>Show Section 3</button>
                </div>

                <div className="col-12 col-md-3 pb-2">
                  <button className='BUTTONS' onClick={() => {
                    GetAllLayouts()
                    setCurrTable('sectionfour')
                  }}>Show Section 4</button>
                </div>
              </div>
            </div>

            {
              currTable === 'sliderOne' && (
                <div className="Main text-center">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Button</th>
                        <th>Sub</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        sliderOne['items'].map((obj, key) => {
                          return (
                            <tr key={key}>
                              <td className='col-2'>
                                <img className='TableImg'
                                  src={`${ServerId}/${sliderOne.for}/${obj.uni_id}/${obj.file.filename}`}
                                  alt={obj.title}
                                />
                              </td>
                              <td className='col-2'>
                                {obj.title}
                              </td>
                              <td className='col-2' dangerouslySetInnerHTML={{ __html: obj.content }}></td>
                              <td className='col-2'>
                                <button className='cateActionBtn' onClick={() => {
                                  window.open(obj.btnLink, '_blank')
                                }}>{obj.btn}</button>
                              </td>
                              <td className='col-2'>
                                {obj.subContent}
                              </td>

                              <td className='col-2'>

                                <button className='cateActionBtn' onClick={() => {
                                  if (window.confirm(`Do you want remove ${obj.title}`)) {
                                    adminAxios((server) => {
                                      server.put('/admin/removeSlider', {
                                        for: 'sliderOne',
                                        item: obj
                                      }).then((res) => {
                                        if (res.data.login) {
                                          logOut()
                                        } else {
                                          GetAllLayouts()
                                        }
                                      }).catch((err) => {
                                        alert("We Are Facing Error")
                                      })
                                    })
                                  }
                                }}>Delete</button>
                              </td>
                            </tr>
                          )

                        })
                      }

                    </tbody>
                  </table>
                </div>
              )
            }

            {
              currTable === 'sliderTwo' && (
                <div className="Main text-center">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        sliderTwo['items'].map((obj, key) => {
                          return (
                            <tr key={key}>
                              <td className='col-10'>
                                <img className='TableImgTwo' style={{ cursor: 'pointer' }}
                                  src={`${ServerId}/${sliderTwo.for}/${obj.uni_id}/${obj.file.filename}`}
                                  onClick={() => {
                                    window.open(obj.link, '_blank')
                                  }}
                                  alt='slider'
                                />
                              </td>

                              <td className='col-2'>

                                <button className='cateActionBtn' onClick={() => {
                                  if (window.confirm(`Do you want remove`)) {
                                    adminAxios((server) => {
                                      server.put('/admin/removeSlider', {
                                        for: 'sliderTwo',
                                        item: obj
                                      }).then((res) => {
                                        if (res.data.login) {
                                          logOut()
                                        } else {
                                          GetAllLayouts()
                                        }
                                      }).catch((err) => {
                                        alert("We Are Facing Error")
                                      })
                                    })
                                  }
                                }}>Delete</button>
                              </td>
                            </tr>
                          )

                        })
                      }

                    </tbody>
                  </table>
                </div>
              )
            }

            {
              currTable === 'banner' && (
                <div className="Main text-center">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        banner.file.length !== 0 && (
                          <tr>
                            <td className='col-10'>
                              <img className='TableImgTwo' style={{ cursor: 'pointer' }}
                                src={`${ServerId}/banner/${banner.file.filename}`}
                                alt='banner' onClick={() => {
                                  window.open(banner.link, '_blank')
                                }}
                              />
                            </td>

                            <td className='col-2'>

                              <button className='cateActionBtn' onClick={() => {
                                if (window.confirm(`Do you want remove`)) {
                                  adminAxios((server) => {
                                    server.delete('/admin/deleteBanner').then((res) => {
                                      if (res.data.login) {
                                        logOut()
                                      } else {
                                        GetAllLayouts()
                                      }
                                    }).catch((err) => {
                                      alert("We Are Facing Error")
                                    })
                                  })
                                }
                              }}>Delete</button>
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                  </table>
                </div>
              )
            }

            {
              currTable === 'sectionone' && (
                <div className="Main text-center">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        sectionOne['items'].map((obj, key) => {
                          if (obj._id !== undefined) {
                            return (
                              <tr key={key}>
                                <td className='col-4'>
                                  <img className='TableImg'
                                    src={`${ServerId}/category/${obj.uni_id1}${obj.uni_id2}/${obj.file.filename}`}
                                    alt={obj.name}
                                  />
                                </td>
                                <td className='col-4'>{obj.name}</td>
                                <td className='col-4'>

                                  <button className='cateActionBtn' onClick={() => {
                                    window.open(`/c/${obj.slug}`, '_blank')
                                  }}>View</button>

                                  <button className='cateActionBtn' onClick={() => {
                                    if (window.confirm(`Do you want remove ${obj.name}`)) {
                                      adminAxios((server) => {
                                        server.put('/admin/removeItemRowOne', {
                                          section: 'sectionone',
                                          item: {
                                            _id: obj._id
                                          }
                                        }).then((res) => {
                                          if (res.data.login) {
                                            logOut()
                                          } else {
                                            GetAllLayouts()
                                          }
                                        }).catch((err) => {
                                          alert("We Are Facing Error")
                                        })
                                      })
                                    }
                                  }}>Remove</button>
                                </td>
                              </tr>
                            )
                          } else {
                            return null
                          }
                        })
                      }

                    </tbody>
                  </table>
                </div>
              )
            }

            {
              currTable === 'sectiontwo' && (
                <div className="Main text-center">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Row</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        sectionTwo['items'].map((obj, key) => {
                          if (obj._id !== undefined) {
                            return (
                              <tr key={key}>
                                <td className='col-2'>
                                  <img className='TableImg'
                                    src={`${ServerId}/product/${obj.uni_id_1}${obj.uni_id_2}/${obj.files[0].filename}`}
                                    alt={obj.name}
                                  />
                                </td>
                                <td className='col-2'>One</td>
                                <td className='col-4 oneLineTxtMax-300'>{obj.name}</td>
                                <td className='col-4'>

                                  <button className='cateActionBtn' onClick={() => {
                                    window.open(`/p/${obj.slug}/${obj._id}`, '_blank')
                                  }}>View</button>

                                  <button className='cateActionBtn' onClick={() => {
                                    if (window.confirm(`Do you want remove ${obj.name}`)) {
                                      adminAxios((server) => {
                                        server.put('/admin/removeItemRowOne', {
                                          section: 'sectiontwo',
                                          item: {
                                            _id: obj._id
                                          }
                                        }).then((res) => {
                                          if (res.data.login) {
                                            logOut()
                                          } else {
                                            GetAllLayouts()
                                          }
                                        }).catch((err) => {
                                          alert("We Are Facing Error")
                                        })
                                      })
                                    }
                                  }}>Remove</button>
                                </td>
                              </tr>
                            )
                          } else {
                            return null
                          }
                        })
                      }

                      {
                        sectionTwo['items2'].map((obj, key) => {
                          if (obj._id !== undefined) {
                            return (
                              <tr key={key}>
                                <td className='col-2'>
                                  <img className='TableImg'
                                    src={`${ServerId}/product/${obj.uni_id_1}${obj.uni_id_2}/${obj.files[0].filename}`}
                                    alt={obj.name}
                                  />
                                </td>
                                <td className='col-2'>Two</td>
                                <td className='col-4 oneLineTxtMax-300'>{obj.name}</td>
                                <td className='col-4'>

                                  <button className='cateActionBtn' onClick={() => {
                                    window.open(`/p/${obj.slug}/${obj._id}`, '_blank')
                                  }}>View</button>

                                  <button className='cateActionBtn' onClick={() => {
                                    if (window.confirm(`Do you want remove ${obj.name}`)) {
                                      adminAxios((server) => {
                                        server.put('/admin/removeItemRowTwo', {
                                          section: 'sectiontwo',
                                          item: {
                                            _id: obj._id
                                          }
                                        }).then((res) => {
                                          if (res.data.login) {
                                            logOut()
                                          } else {
                                            GetAllLayouts()
                                          }
                                        }).catch((err) => {
                                          alert("We Are Facing Error")
                                        })
                                      })
                                    }
                                  }}>Remove</button>
                                </td>
                              </tr>
                            )
                          } else {
                            return null
                          }
                        })
                      }

                    </tbody>
                  </table>
                </div>
              )
            }

            {
              currTable === 'sectionthree' && (
                <div className="Main text-center">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Row</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        sectionThree['items'].map((obj, key) => {
                          if (obj._id !== undefined) {
                            return (
                              <tr key={key}>
                                <td className='col-2'>
                                  <img className='TableImg'
                                    src={`${ServerId}/product/${obj.uni_id_1}${obj.uni_id_2}/${obj.files[0].filename}`}
                                    alt={obj.name}
                                  />
                                </td>
                                <td className='col-2'>One</td>
                                <td className='col-4 oneLineTxtMax-300'>{obj.name}</td>
                                <td className='col-4'>

                                  <button className='cateActionBtn' onClick={() => {
                                    window.open(`/p/${obj.slug}/${obj._id}`, '_blank')
                                  }}>View</button>

                                  <button className='cateActionBtn' onClick={() => {
                                    if (window.confirm(`Do you want remove ${obj.name}`)) {
                                      adminAxios((server) => {
                                        server.put('/admin/removeItemRowOne', {
                                          section: 'sectionthree',
                                          item: {
                                            _id: obj._id
                                          }
                                        }).then((res) => {
                                          if (res.data.login) {
                                            logOut()
                                          } else {
                                            GetAllLayouts()
                                          }
                                        }).catch((err) => {
                                          alert("We Are Facing Error")
                                        })
                                      })
                                    }
                                  }}>Remove</button>
                                </td>
                              </tr>
                            )
                          } else {
                            return null
                          }
                        })
                      }

                      {
                        sectionThree['items2'].map((obj, key) => {
                          if (obj._id !== undefined) {
                            return (
                              <tr key={key}>
                                <td className='col-2'>
                                  <img className='TableImg'
                                    src={`${ServerId}/product/${obj.uni_id_1}${obj.uni_id_2}/${obj.files[0].filename}`}
                                    alt={obj.name}
                                  />
                                </td>
                                <td className='col-2'>Two</td>
                                <td className='col-4 oneLineTxtMax-300'>{obj.name}</td>
                                <td className='col-4'>

                                  <button className='cateActionBtn' onClick={() => {
                                    window.open(`/p/${obj.slug}/${obj._id}`, '_blank')
                                  }}>View</button>

                                  <button className='cateActionBtn' onClick={() => {
                                    if (window.confirm(`Do you want remove ${obj.name}`)) {
                                      adminAxios((server) => {
                                        server.put('/admin/removeItemRowTwo', {
                                          section: 'sectionthree',
                                          item: {
                                            _id: obj._id
                                          }
                                        }).then((res) => {
                                          if (res.data.login) {
                                            logOut()
                                          } else {
                                            GetAllLayouts()
                                          }
                                        }).catch((err) => {
                                          alert("We Are Facing Error")
                                        })
                                      })
                                    }
                                  }}>Remove</button>
                                </td>
                              </tr>
                            )
                          } else {
                            return null
                          }
                        })
                      }

                    </tbody>
                  </table>
                </div>
              )
            }

            {
              currTable === 'sectionfour' && (
                <div className="Main text-center">
                  <table className="table align-middle">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        sectionFour['items'].map((obj, key) => {
                          if (obj._id !== undefined) {
                            return (
                              <tr key={key}>
                                <td className='col-4'>
                                  <img className='TableImg'
                                    src={`${ServerId}/product/${obj.uni_id_1}${obj.uni_id_2}/${obj.files[0].filename}`}
                                    alt={obj.name}
                                  />
                                </td>
                                <td className='col-4 oneLineTxtMax-300'>{obj.name}</td>
                                <td className='col-4'>

                                  <button className='cateActionBtn' onClick={() => {
                                    window.open(`/p/${obj.slug}/${obj._id}`, '_blank')
                                  }}>View</button>

                                  <button className='cateActionBtn' onClick={() => {
                                    if (window.confirm(`Do you want remove ${obj.name}`)) {
                                      adminAxios((server) => {
                                        server.put('/admin/removeItemRowOne', {
                                          section: 'sectionfour',
                                          item: {
                                            _id: obj._id
                                          }
                                        }).then((res) => {
                                          if (res.data.login) {
                                            logOut()
                                          } else {
                                            GetAllLayouts()
                                          }
                                        }).catch((err) => {
                                          alert("We Are Facing Error")
                                        })
                                      })
                                    }
                                  }}>Remove</button>
                                </td>
                              </tr>
                            )
                          } else {
                            return null
                          }
                        })
                      }

                    </tbody>
                  </table>
                </div>
              )
            }

          </div>
        ) : <Loading />
      }
    </div >
  )
}

export default LayoutsComp
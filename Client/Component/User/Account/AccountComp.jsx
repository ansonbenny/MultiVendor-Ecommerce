import UserIcon from '../../../Assets/UserIcon'
import TruckIcon from '../../../Assets/TruckIcon'
import HeartIcon from '../../../Assets/HeartIcon'
import CartIcon from '../../../Assets/CartIcon'
import LocationIcon from '../../../Assets/LocationIcon'
import LogoutIcon from '../../../Assets/logoutIcon'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import ContentControl from '../../../ContentControl/ContentControl'
import { useState } from 'react'
import { userAxios, userCheck } from '../../../Config/Server'

function AccountComp() {
  const navigate = useRouter()
  const { userLogged, setUserLogged } = useContext(ContentControl)

  const [profile, setProfile] = useState({
    name: userLogged.name,
    number: userLogged.number,
    email: userLogged.email,
    password: '',
    pass4email: ''
  })

  const [password, setPassword] = useState({
    old: '',
    new: '',
    err: false
  })

  const UserUpdate = () => {
    const token = localStorage.getItem('token')
    userCheck(token, (user) => {
      if (user.status) {
        setProfile(profile => ({
          ...profile,
          name: user.name,
          number: user.number,
          email: user.email,
          password: '',
          pass4email: ''
        }))
        setUserLogged(user)
      }
    })
  }

  const changeInfo = (e) => {
    e.preventDefault()
    userAxios((server) => {
      server.put('/users/changeUserInfo', {
        name: profile.name,
        number: profile.number,
        password: profile.password,
        email: userLogged.email,
      }).then((res) => {
        if (res.data.login) {
          localStorage.removeItem('token')
          setUserLogged({ status: false })
        } else {
          if (res.data) {
            UserUpdate()
            alert("Done")
          } else {
            alert("Entered Password Wrong")
          }
        }
      }).catch(() => {
        alert("Sorry for error")
      })
    })
  }

  const changeEmail = (e) => {
    e.preventDefault()
    userAxios((server) => {
      server.put('/users/changeEmail', {
        password: profile.pass4email,
        email: userLogged.email,
        newEmail: profile.email
      }).then((res) => {
        if (res.data.login) {
          localStorage.removeItem('token')
          setUserLogged({ status: false })
        } else {
          if (res.data.done) {
            UserUpdate()
            alert("Done")
          } else if (res.data.already) {
            alert("Email Already Used")
          } else if (res.data.pass) {
            alert("Wrong Password")
          }
        }
      }).catch(() => {
        alert("Sorry for error")
      })
    })
  }

  const changePassword = (e) => {
    e.preventDefault()

    userAxios((server) => {
      if (password.new.length >= 8) {
        server.put('/users/changePassword', {
          newPass: password.new,
          email: userLogged.email,
          currPass: password.old
        }).then((res) => {
          if (res.data.login) {
            localStorage.removeItem('token')
            setUserLogged({ status: false })
          } else {
            if (res.data) {
              UserUpdate()
              setPassword({
                ...password,
                new: '',
                old: ''
              })
              alert("Done")
            } else {
              alert("Wrong Password")
            }
          }
        }).catch(() => {
          alert("Sorry for error")
        })
      }
    })
  }

  return (
    <div className='AccountComp'>
      <div className="container container-fluid pt-5 pb-5">

        <div>
          <div className='pb-4 MobNon'>
            <h3 className='UserBlackMain font-bold'>My Account</h3>
          </div>

          <div className="row">

            <div className="col-12 col-md-3">
              <div className="Menu">

                <div className='BtnDiv'>
                  <button className='active'>
                    <span><UserIcon color={'#ffffff'} /></span>
                    <span className='span2'>My Details</span>
                  </button>
                </div>

                <div className='BtnDiv'>
                  <button onClick={() => {
                    navigate.push('/address')
                  }}>
                    <span><LocationIcon color={'#333'} /></span>
                    <span className='span2'>My Address</span>
                  </button>
                </div>

                <div className='BtnDiv'>
                  <button onClick={() => {
                    navigate.push('/orders')
                  }}>
                    <span><TruckIcon color={'#333'} /></span>
                    <span className='span2'>My Orders</span>
                  </button>
                </div>

                <div className='BtnDiv'>
                  <button onClick={() => {
                    navigate.push('/wishlist')
                  }}>
                    <span><HeartIcon color={'#333'} /></span>
                    <span className='span2'>My Wishlist</span>
                  </button>
                </div>

                <div className='BtnDiv'>
                  <button onClick={() => {
                    navigate.push('/cart')
                  }}>
                    <span><CartIcon color={'#333'} /></span>
                    <span className='span2'>My Cart</span>
                  </button>
                </div>

                <div className='BtnDiv'>
                  <button onClick={() => {
                    setUserLogged({ status: false })
                    localStorage.removeItem('token')
                  }}>
                    <span><LogoutIcon color={'#333'} /></span>
                    <span className='span2'>Logout</span>
                  </button>
                </div>

              </div>
            </div>

            <div className="col-12 col-md-9">
              <div className="MainCard">
                <div className='pb-3'>
                  <h4 className='UserBlackMain font-bold'>My Details</h4>
                </div>

                <div className="row">

                  <div className="col-12">
                    <div className="SubTitle">
                      <h6 className='UserBlackMain font-bold text-small'>Personal Information</h6>
                    </div>

                    <div className='pt-3'>

                      <div className="row">
                        <div className="col-12 MobNon col-md-4">
                          <h6 className='text-small UserGrayMain'>A user profile is a collection of settings and information associated with a user. It contains critical information that is used to identify an individual.</h6>
                        </div>

                        <div className="col-12 col-md-8">

                          <div className="row">

                            <form onSubmit={changeInfo}>
                              <div className="col-12">
                                <label className='UserBlackMain font-bold text-small pb-2'>NAME</label>
                                <br />
                                <input value={profile.name} onInput={(e) => {
                                  setProfile({
                                    ...profile,
                                    name: e.target.value
                                  })
                                }} placeholder='Enter Name' type="text" required />
                              </div>

                              <div className="col-12 pt-3">
                                <label className='UserBlackMain font-bold text-small pb-2'>PHONE NUMBER</label>
                                <br />
                                <input value={profile.number} onInput={(e) => {
                                  setProfile({
                                    ...profile,
                                    number: e.target.value
                                  })
                                }} placeholder='Enter Number' type="number" required />
                              </div>
                              <div className="col-12 pt-4">
                                <input value={profile.password} onInput={(e) => {
                                  setProfile({
                                    ...profile,
                                    password: e.target.value
                                  })
                                }} type="password" placeholder='Enter Password' required />
                              </div>

                              <div className="col-12 pt-4">
                                <button>SAVE</button>
                              </div>
                            </form>

                          </div>

                        </div>
                      </div>

                    </div>

                  </div>

                  <div className="col-12 pt-4">
                    <div className="SubTitle">
                      <h6 className='UserBlackMain font-bold text-small'>E-mail address</h6>
                    </div>

                    <div className='pt-3'>

                      <div className="row">
                        <div className="col-12 col-md-4 MobNon">
                          <h6 className='text-small UserGrayMain'>A user profile is a collection of settings and information associated with a user. It contains critical information that is used to identify an individual.</h6>
                        </div>

                        <div className="col-12 col-md-8">

                          <div className="row">

                            <form onSubmit={changeEmail}>
                              <div className="col-12">
                                <label className='UserBlackMain font-bold text-small pb-2'>E-MAIL ADDRESS</label>
                                <br />
                                <input value={profile.email} onInput={(e) => {
                                  setProfile({
                                    ...profile,
                                    email: e.target.value
                                  })
                                }} placeholder='Enter E-mail' type="email" required />
                              </div>

                              <div className="col-12 pt-4">
                                <input value={profile.pass4email} onInput={(e) => {
                                  setProfile({
                                    ...profile,
                                    pass4email: e.target.value
                                  })
                                }} type="password" placeholder='Enter Password' required />
                              </div>

                              <div className="col-12 pt-4">
                                <button>SAVE</button>
                              </div>
                            </form>

                          </div>

                        </div>
                      </div>

                    </div>

                  </div>

                  <div className="col-12 pt-4">
                    <div className="SubTitle">
                      <h6 className='UserBlackMain font-bold text-small'>Security</h6>
                    </div>

                    <div className='pt-3'>

                      <div className="row">
                        <div className="col-12 col-md-4 MobNon">
                          <h6 className='text-small UserGrayMain'>Passwords provide the first line of defense against unauthorized access to your account.</h6>
                        </div>

                        <div className="col-12 col-md-8">

                          <div className="row">

                            <form onSubmit={changePassword}>
                              <div className="col-12">
                                <label className='UserBlackMain font-bold text-small pb-2'>NEW PASSWORD</label>
                                <br />
                                <input value={password.new} onInput={(e) => {

                                  if (e.target.value.length < 8 && e.target.value.length !== 0) {
                                    setPassword({
                                      ...password,
                                      err: true,
                                      new: e.target.value
                                    })
                                  } else {
                                    setPassword({
                                      ...password,
                                      err: false,
                                      new: e.target.value
                                    })
                                  }

                                }} placeholder='Enter New Password' type="password" required />
                                {
                                  password.err && (
                                    <label className='text-small' style={{ color: 'red' }}>Password must 8 character</label>
                                  )
                                }
                              </div>

                              <div className="col-12 pt-4">
                                <input value={password.old} onInput={(e) => {
                                  setPassword({
                                    ...password,
                                    old: e.target.value
                                  })
                                }} type="password" placeholder='Enter Current Password' required />
                              </div>

                              <div className="col-12 pt-4">
                                <button>SAVE</button>
                              </div>
                            </form>

                          </div>

                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default AccountComp
import Script from 'next/script'
import React, { Fragment } from 'react'
import Link from 'next/link'

function Header() {
  return (
    <Fragment>
      <div className='MenuBarAdmin'>

        <nav className="navbar navbar-expand-md ">
          <div className="container container-fluid">
            <Link className="navbar-brand font-bold" href={'/admin/dashboard'}>ADMIN PANEL</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span><i className="fa-solid fa-bars"></i></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link " aria-current="page" href="/admin/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/admin/products">Products</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/admin/categories">Categories</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/admin/layouts">Layouts</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/admin/cupons">Cupons</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/admin/orders">Orders</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/admin/vendors">Vendors</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/admin/login" onClick={()=>{
                    localStorage.removeItem('adminToken')
                  }}>Logout</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

      </div>
      <Script
        src="/font-awesome/js/all-min.js"
        referrerPolicy='no-referrer'
        strategy='afterInteractive'
      />
    </Fragment>
  )
}

export default Header
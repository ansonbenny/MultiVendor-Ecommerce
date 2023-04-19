import { useRouter } from 'next/router'
import React, { Fragment, useContext } from 'react'
import Link from 'next/link'
import ContentControl from '../../../ContentControl/ContentControl'
import Script from 'next/script'

function Header() {
    const { setVendorLogged } = useContext(ContentControl)
    const router = useRouter()
    return (
        <Fragment>
            <nav className="navbar navbar-expand-md bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" href="/vendor/dashboard">Vendor Panel</Link>
                    <button className='toggleButton' data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="fa-solid fa-bars fa-lg"></i>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" href={'/vendor/dashboard'} >Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href={'/vendor/products'}>Products</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href={'/vendor/orders'} >Orders</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href={'/vendor/settings'}>Settings</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" onClick={() => {
                                    setVendorLogged({ status: false })
                                    localStorage.removeItem('vendorToken')
                                    alert("LogOut")
                                }} href={'/vendor/login'}>Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Script
                src="/font-awesome/js/all-min.js"
                referrerPolicy='no-referrer'
                strategy='afterInteractive'
            />
        </Fragment>
    )
}

export default Header
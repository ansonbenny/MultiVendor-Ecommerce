import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import style from './Footer.module.scss'
import Script from 'next/script';

function Footer() {
    const [year, setYear] = useState('')

    useEffect(() => {
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        (function () {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/63f323a031ebfa0fe7ee35ac/1gpms6b79';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
        })();
        var currYear = new Date()
        currYear = currYear.getFullYear()

        setYear(currYear)
    }, [])
    return (
        <>
            <div className="container pt-5">
                <div className="row">
                    <div className="col-12 col-md-3">
                        <h6 className='font-bolder'>Useful Links</h6>
                        <ul className={style.FooterItems}>
                            <li><Link href={'/account'}>Account & Settings</Link></li>
                            <li><Link href={'/wishlist'}>Wishlist</Link></li>
                            <li><Link href={'/vendor/login'}>Vendor Login</Link></li>
                        </ul>
                    </div>
                    <div className="col-12 col-md-3">
                        <h6 className='font-bolder'>Company Info</h6>
                        <ul className={style.FooterItems}>
                            <li><Link href="/help">Help & FAQs</Link></li>
                            <li><Link href="/company">Company Info</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                        </ul>
                    </div>
                    <div className="col-12 col-md-3">
                        <h6 className='font-bolder'>Policy</h6>
                        <ul className={style.FooterItems}>
                            <li><Link href="/terms">Terms & Condition</Link></li>
                            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link href="/shipping">Shipping & Delivery</Link></li>
                        </ul>
                    </div>
                    <div className="col-12 col-md-3">
                        <h6 className='font-bolder'>Social Media</h6>

                        <ul className={style.FooterSMicons}>
                            <li><button><i className="fa-brands fa-facebook-f"></i></button></li>
                            <li><button><i className="fa-brands fa-instagram"></i></button></li>
                            <li><button><i className="fa-brands fa-youtube"></i></button></li>
                        </ul>

                    </div>
                </div>

                <div className={style.CopyRightArea}>
                    <p className='pt-4 text-center text-small font-normal UserGrayMain'>&#169; {year} All Rights Reserved.</p>
                </div>
            </div>
            <Script
                src="/font-awesome/js/all-min.js"
                referrerPolicy='no-referrer'
                strategy='afterInteractive'
            />
        </>
    )
}

export default Footer
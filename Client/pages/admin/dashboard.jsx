import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Fragment, useContext, useState } from 'react'
const Header = dynamic(() => import('@/Component/Admin/Header/Header'))
const DashboardComp = dynamic(() => import('@/Component/Admin/Dashboard/DashboardComp'))

export default function Dashboard() {

  return (
    <Fragment>
      <Head>
        <title>Aquariun - Admin Dashboard</title>
        <meta name="description" content="Aquariun Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className='Admin'>
        <Header />
        <DashboardComp />
      </main>
    </Fragment>
  )
}

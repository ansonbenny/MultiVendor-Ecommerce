import dynamic from 'next/dynamic'
import Head from 'next/head'
import { Fragment } from 'react'
const LoginComp = dynamic(() => import('@/Component/Admin/Login/Login'))

export default function Dashboard() {

  return (
    <Fragment>
      <Head>
        <title>Aquariun - Admin Login</title>
        <meta name="description" content="Aquariun Admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className='Admin'>
        <LoginComp />
      </main>
    </Fragment>
  )
}

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="author" content="Anson Benny" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png"></link>
        <meta name="theme-color" content="#000" />
        <link href='/Poppins/Poppins.css' rel='stylesheet' />
        <link rel="stylesheet" href="/font-awesome/css/all-min.css" referrerPolicy="no-referrer" />
        <link rel='stylesheet' href='/bootstrap/dist/css/bootstrap.min.css' />
        <script src='/bootstrap/dist/js/bootstrap.bundle.js' />
        <developer dangerouslySetInnerHTML={{
          __html: `
<!--
Author: Anson Benny
Author URL: https://ansonbenny.ml
-->
` }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'
import style from './Offline.module.scss'

function Offline() {
  const navigate = useRouter()

  function RfreshPage() {
    navigate.reload()
  }

  useEffect(() => {
    window.addEventListener("online", () => {
      RfreshPage()
    });

    return () => {
      window.removeEventListener("online", () => {
        RfreshPage()
      });
    };
  });

  return (
    <div className={style.OfflineComp}>
      <div className="container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          viewBox="0 0 512.000000 512.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill="#000000"
            stroke="none"
          >
            <path d="M134 5110 c-68 -21 -134 -114 -134 -190 0 -81 8 -91 361 -445 186 -187 339 -344 339 -347 0 -4 -43 -36 -95 -73 -150 -104 -309 -239 -451 -380 -112 -112 -133 -137 -144 -178 -23 -86 6 -168 79 -221 38 -27 51 -31 109 -31 83 0 93 6 268 175 72 70 180 165 240 211 112 87 252 185 280 196 11 4 93 -71 290 -268 l273 -273 -117 -61 c-203 -105 -375 -226 -570 -403 -103 -95 -138 -157 -129 -234 11 -93 78 -162 168 -174 78 -11 119 8 221 103 213 197 436 343 668 437 l64 26 318 -317 c337 -336 332 -331 246 -332 -153 -3 -442 -110 -629 -234 -181 -119 -279 -230 -279 -316 0 -56 43 -134 93 -167 36 -24 52 -29 109 -29 73 0 76 1 215 116 144 119 334 204 516 230 156 23 366 -16 529 -97 43 -21 227 -199 948 -919 821 -819 899 -894 940 -905 158 -42 292 92 250 250 -11 42 -187 221 -2388 2423 -1307 1308 -2393 2389 -2413 2403 -41 28 -124 40 -175 24z" />
            <path d="M2290 4660 c-261 -25 -509 -71 -561 -105 -49 -32 -79 -84 -86 -147 -4 -45 -1 -61 24 -108 23 -44 39 -60 83 -83 63 -33 66 -33 290 6 630 111 1288 18 1850 -263 304 -151 530 -311 770 -545 167 -162 178 -170 262 -170 58 0 71 4 109 31 73 53 102 135 79 221 -11 42 -31 66 -149 183 -550 545 -1225 871 -1996 966 -153 18 -540 26 -675 14z" />
            <path d="M2865 3454 c-132 -68 -153 -233 -42 -331 28 -25 57 -36 149 -57 410 -96 719 -263 1041 -563 85 -80 130 -99 207 -89 89 12 156 82 167 174 8 75 -20 128 -119 222 -340 320 -754 544 -1185 639 -111 25 -177 26 -218 5z" />
            <path d="M2460 1106 c-119 -33 -205 -128 -231 -253 -47 -227 157 -431 383 -384 137 28 231 122 259 259 49 238 -174 443 -411 378z" />
          </g>
        </svg>
        <h3 className='pt-5'>Sorry You Can't Access Site</h3>
        <h4>Please Connect Internet</h4>
        <button className={style.Retry} onClick={() => {
          RfreshPage()
        }}>ReTry</button>
      </div>
    </div>
  )
}

export default Offline
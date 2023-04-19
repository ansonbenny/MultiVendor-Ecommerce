import style from './ErrorComp.module.scss'

function ErrorComp() {
  return (
    <div className='text-center container'>
      <div className={style.ErrorComp}>
        <h1 className={style.ErrorCode + ' UserBlackMain'}>404&nbsp;<i className="fa-solid fa-file"></i></h1>
        <h5 className='UserGrayMain'>We're sorry, but the page you were looking for doesn't exist.</h5>
      </div>
    </div>
  )
}

export default ErrorComp
const TimedNotif = ({classes, children, time, hide}) => {

  setTimeout(() => {
    hide()
  }, time || 1000);

  return(
    <div className={`${classes}`} style={{animationDuration: `${time + 100}ms`}} >
      {children}
    </div>
  )
}
export default TimedNotif
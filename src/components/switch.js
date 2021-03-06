const Switch = ({onChange, id, checked, classes}) => {

  return(
    <div className={`switch ${classes}`}>
        <input className="switch-input" onChange={onChange} checked={checked} type="checkbox" id={id} />
        <label className="switch-label" htmlFor={id} /> 
    </div>
  )
}
export default Switch
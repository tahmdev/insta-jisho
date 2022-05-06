const Navbar = ({setQuery, query ,setType, type, setShowInput, showInput}) => {

  const slideElementInOut = (showName, id, setShow, condition) => {
    if (condition) {
      document.getElementById(id).classList.add("slide-out-top")
      setTimeout(() => {
        setShow(null)
      }, 200);
    }else{
      setShow(showName)
    }
  }

  const handleRadical = () => {
    slideElementInOut("radical", "radical-lookup-wrapper", setShowInput, showInput === "radical")
  }

  const handleHandwriting = () => {
    slideElementInOut("handwriting", "handwriting-wrapper", setShowInput, showInput === "handwriting")
  }
  return(
    <nav className='flex-center'>
      <button tabIndex={-1} onClick={handleRadical} > Radical </button>
      <button tabIndex={-1} onClick={handleHandwriting}>Handwriting</button>
      <input onChange={e => setQuery(e.target.value)} value={query} />
      <select tabIndex={-1} onChange={e => setType(e.target.value)} value={type}>
        <option>Includes</option>
        <option>Exact</option>  
        <option>Prefix</option>  
        <option>Suffix</option>  
      </select>
    </nav>
  )
}
export default Navbar
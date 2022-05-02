const Navbar = ({setQuery, query ,setType, setShowRadicalInput, showRadicalInput}) => {

  const handleRadical = () => {
    if (showRadicalInput) {
      //handles unmount via onTransitionEnd 
      document.getElementById("radical-lookup-wrapper").style.transform = "translateY(-100%)"
    }else{
      return setShowRadicalInput(true)
    }
  }

  return(
    <nav className='flex-center'>
      <button onClick={handleRadical} > Radical </button>
      <input onChange={e => setQuery(e.target.value)} value={query} />
      <select onChange={e => setType(e.target.value)}>
        <option>Includes</option>
        <option>Exact</option>  
        <option>Prefix</option>  
        <option>Suffix</option>  
      </select>
    </nav>
  )
}
export default Navbar
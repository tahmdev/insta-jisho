import { useEffect } from "react";

const Navbar = ({setQuery, query ,setType, setShowRadicalInput, showRadicalInput}) => {

  const handleRadical = () => {
    if (showRadicalInput) {
      document.getElementById("radical-lookup-wrapper").classList.add("slide-out-top")
      setTimeout(() => {
        setShowRadicalInput(false)
      }, 300);
    }else{
      setShowRadicalInput(true)
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
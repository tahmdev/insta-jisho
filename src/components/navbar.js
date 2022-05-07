const Navbar = ({setQuery, query ,setType, type, setShowInput, showInput, setShowAbout, showExamples, setShowExamples}) => {

  const handleRadical = () => {
    if (showInput=== "radical") {
      let element = document.getElementById("radical-lookup-wrapper")
      element.classList.add("slide-out-top")
      element.onanimationend = () => setShowInput(null)
    }else{
      setShowInput("radical")
    }
  }

  const handleHandwriting = () => {
    if (showInput === "handwriting") {
      let element = document.getElementById("handwriting-wrapper")
      element.classList.add("slide-out-top-canvas")
      element.onanimationend = () => setShowInput(null)
    }else{
      setShowInput("handwriting")
    }
  }

  const activeStyle = (condition) => {
    if(condition){
      return (
        {
          borderBottom: "4px solid orange",
          marginBottom: "-4px"
        }
      )
    }
  } 
  return(
    <nav className='flex-center'>
      
      <div>
        <button className="input-method-button" 
          onClick={handleRadical} 
          style={activeStyle(showInput === "radical")}
        >
          <div>部</div>
          <div className="button-desc">Radical</div>
        </button>
        <button className="input-method-button" 
          onClick={handleHandwriting}
          style={activeStyle(showInput === "handwriting")}  
        >
          <div>✏️</div>
          <div className="button-desc">Draw</div>
        </button>
        <button className="small-only" onClick={() => setShowExamples(prev => !prev)}> {showExamples ? "Definition" : "Examples"} </button>
      </div>

      <div className="search-select-wrapper">
        <input id="search" onChange={e => setQuery(e.target.value)} value={query} autoComplete="off" />
        <select tabIndex={-1} onChange={e => setType(e.target.value)} value={type}>
          <option>Includes</option>
          <option>Exact</option>  
          <option>Prefix</option>  
          <option>Suffix</option>  
        </select>
      </div>
      <button onClick={() => setShowAbout(true)} >About</button>

    </nav>
  )
}
export default Navbar
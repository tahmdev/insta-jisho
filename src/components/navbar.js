import { useEffect } from "react"
import useLocalstorage from "../hooks/useLocalStorage"

const Navbar = ({setQuery, query ,setType, type, setShowInput, showInput, setShowAbout, showExamples, setShowExamples}) => {

  let [lightmode, setLightmode] = useLocalstorage("lightmode", false)

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

  const handleLightmode = (e) => {
    if(e.target.checked){
      setLightmode(true)
    }else{
      setLightmode(false)
    }
  }

  useEffect(() => {
    let root = document.documentElement;
    if(lightmode){
      root.style.setProperty("--bg-100", "white")
      root.style.setProperty("--bg-200", "rgb(226, 226, 226)")
      root.style.setProperty("--bg-300", "rgb(197, 197, 197)")
      root.style.setProperty("--primary-color-600", "rgb(89, 131, 236)")
      root.style.setProperty("--text-color", "black")
    }else{
      root.style.setProperty("--bg-100", "rgb(43, 43, 43)")
      root.style.setProperty("--bg-200", "rgb(70, 70, 70)")
      root.style.setProperty("--bg-300", "rgb(122, 122, 122)")
      root.style.setProperty("--primary-color-600", "rgb(89, 248, 195)")
      root.style.setProperty("--text-color", "white")
    }
  }, [lightmode])
  return(
    <nav className='flex-center'>
      
      <div className="about-settings-wrapper">
        <input className="lightmode-input" onChange={handleLightmode} checked={lightmode} type="checkbox" id="lightmode"/>
        <label className="lightmode-label" htmlFor="lightmode" /> 
        <button className="about-button" onClick={() => setShowAbout(true)} >About</button>
      </div>

      <div className="nav-button-wrapper">
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
        </div>
        <button className="small-only example-switch" onClick={() => setShowExamples(prev => !prev)}> {showExamples ? "Definition" : "Examples"} </button>
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

    </nav>
  )
}
export default Navbar
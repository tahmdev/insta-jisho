import './App.css';
import { useEffect, useRef, useState } from 'react';
import ResultSelect from './components/result-select';
import DefinitionDisplay from './components/definition-display';
import RadicalLookup from './components/radical-lookup';
import Navbar from './components/navbar';
import HandwritingInput from './components/handwriting';
import useEventListener from './components/useEventListener';
import Popup from './components/popup';

// romaji query, if exact match found parse as JP 
function App() {
  let [query, setQuery] = useState("")
  let [type, setType] = useState(() => {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has("type")) {
      let type = searchParams.get("type")
      switch (type){
        case "e":
          return "Exact"
          break;
        case "i":
          return "Includes"
          break;
        case "p":
          return "Prefix"
          break;
        case "s":
          return "Suffix"
          break;
        default:
          return "Includes"
          break;
      }
    }
    else return "Includes"
  })
  let [results, setResults] = useState()
  let [examples, setExamples] = useState()
  let [showExamples, setShowExamples] = useState(false)
  let [selected, setSelected] = useState()
  let [showInput, setShowInput] = useState("none")
  let [showAbout, setShowAbout] = useState(false)
  let queryTimeout = useRef()
  let idleTimeout = useRef()
  // Fetch initial results and examples on search links
  useEffect(() => {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has("search")) {
      let query = searchParams.get("search")
      fetchData(query)
    }
  }, [])

  // fetch data on search update  
  useEffect(() => {
    if(queryTimeout.current) clearTimeout(queryTimeout.current)
    if (query.length > 0){
      queryTimeout.current = setTimeout(() => {
        fetchData(query)
      }, 200);
    }
  }, [query])

  const fetchData = (query) => {
    // fetch word definitions
    fetch("http://192.168.178.22:9000/jisho/word/" + query)
    .then(res => res.json())
    .then(json => setResults(json))

    //fetch examples sentences, limited to 15
    fetch("http://192.168.178.22:9000/jisho/example/tatoeba/" + query)
    .then(res => res.json())
    .then(json => {
      setExamples(json.filter((item, idx) => idx < 15))
    })
  }

  const resetIdleTimer = () => {
    clearTimeout(idleTimeout.current)
    // reset query after inactivity
    idleTimeout.current = setTimeout(() => {
      setQuery("")
    }, 10000);
  }
  
  const handleKeyDown = (e) => {
    resetIdleTimer()
    if (e.key === "Tab"){
      e.preventDefault()
      let active = document.activeElement
      if (active === document.getElementById("search")){
        document.getElementById("result-select").focus()
      }else{
        document.getElementById("search").focus()
      }
    }
  }
  useEventListener("keydown", handleKeyDown, window)
  useEventListener("mousedown", resetIdleTimer, window)
  return (
    <div className="App">
      {showAbout&&
        <Popup
          classes={"aboutPopup"}
          setShow={setShowAbout}
        >
          <span>
            ABOUT HERE
          </span>
        </Popup>
      }
      <Navbar 
        setQuery={setQuery}
        query={query}
        setType={setType}
        type={type}
        setShowInput={setShowInput}
        showInput={showInput}
        setShowAbout={setShowAbout}
        setShowExamples={setShowExamples}
        showExamples={showExamples}
      />

      {showInput === "radical" && 
        <div id="radical-lookup-wrapper" className='container' >
          <RadicalLookup setQuery={setQuery} showInput={showInput} />
        </div>
      }

      {showInput === "handwriting" && 
        <div id="handwriting-wrapper">
          <HandwritingInput 
            vw={95} 
            minWidth={200} 
            maxWidth={450} 
            height={300} 
            language={"ja"}
            handleButton={e => setQuery(prev => prev + e.target.value)}
          />
        </div>
      }

      <main>
        <div className='container flex'>
          
          {
          results 
            ? <ResultSelect results={results[type]} setSelected={setSelected} selected={selected}/>  
            : <select className='result-select' size={2}></select>
          }

          {selected && 
          <div className='container flex'>
            
            <div className={`definition-wrapper ${showExamples ? "large-only" : ""}`}>
              <DefinitionDisplay selected={selected} />
            </div>
            
            {examples &&
            <div className={`example-wrapper ${showExamples ? "visible" : "large-only"}`}>
              <ul>
                {examples.map(item => <li> {item.text} </li>)}
              </ul>
            </div>
            }

          </div>
          }
          
        </div>
      </main>
        
    </div>
  );
}

export default App;

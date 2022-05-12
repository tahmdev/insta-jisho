import './App.css';
import { useEffect, useRef, useState } from 'react';
import ResultSelect from './components/result-select';
import DefinitionDisplay from './components/definition-display';
import RadicalLookup from './components/radical-lookup';
import Navbar from './components/navbar';
import HandwritingInput from './components/handwriting';
import useEventListener from './components/useEventListener';
import Popup from './components/popup';
import TimedNotif from './components/timedNotif';

// include forvo link somewhere

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
  let [showCopyNotif, setShowCopyNotif] = useState(false)
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
    fetch("https://instant-jisho.herokuapp.com/jisho/word/" + query)
    .then(res => res.json())
    .then(json => setResults(json))

    //fetch examples sentences, limited to 15
    fetch("https://instant-jisho.herokuapp.com/jisho/example/tatoeba/" + query)
    .then(res => res.json())
    .then(json => {
      setExamples(json.filter((item, idx) => idx < 15))
    })
  }

  // fetch example sentences on select change 
  useEffect(() => {
    if(selected){
      let query = selected.k_ele
      ? selected.k_ele[0].keb[0]
      : selected.r_ele[0].reb[0]
      fetch("https://instant-jisho.herokuapp.com/jisho/example/tatoeba/" + query)
      .then(res => res.json())
      .then(json => {
        setExamples(json.filter((item, idx) => idx < 15))
      })
    }
  }, [selected])

  // handle tabbing back and forth between select and search,
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

  // reset query after inactivity
  const resetIdleTimer = () => {
    clearTimeout(idleTimeout.current)
    idleTimeout.current = setTimeout(() => {
      setQuery("")
    }, 10000);
  }

  const inputButton = (e) => {
    console.log(e.target.value)
    setQuery(prev => prev + e.target.value)
    document.getElementById("search").focus()
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
          <h2>Sources:</h2>
          <p> Definitions are sourced from Jim Breen's <a href='http://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project'>JMdict</a> </p>
          <p> Radical information is used sources from Jim Breen's <a href='http://www.edrdg.org/krad/kradinf.html'>RADKFILE</a>  </p>
          <p> Example sentences are sourced from <a href='https://tatoeba.org/en'> Tatoeba </a> </p>
        </Popup>
      }

      {showCopyNotif &&
        <TimedNotif 
          classes={"copy-notif"}
          time={600}
          hide={() => setShowCopyNotif(false)}
        >
          <span> Saved to clipboard </span>
        </TimedNotif>
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
          <RadicalLookup setQuery={setQuery} handleButton={inputButton} />
        </div>
      }

      {showInput === "handwriting" && 
        <div id="handwriting-wrapper">
          <HandwritingInput 
            vw={95} 
            minWidth={200} 
            maxWidth={450} 
            vh={40}
            maxHeight={300}
            language={"ja"}
            options={{color: "#3D86F0"}}
            handleButton={inputButton}
          />
        </div>
      }

      <main>
        <div className='container flex'>
          
          {
          !results
          ? <div className='no-results'> 
              <p className='large-only' >Press TAB to quickly switch between the search bar and the results.</p>
              <p className='large-only'>Use WASD to navigate the results or CTRL+C to copy a direct link to the current result.</p>
              <p>Enter a word in the search bar to get started :)</p>
            </div>
          : results.Includes.length > 0
          ? <ResultSelect
              results={results[type]} 
              setSelected={setSelected} 
              selected={selected} 
              exact={results.Exact[0]} 
              setShowCopyNotif={setShowCopyNotif}
            />
          : <span className='no-results'> No results found :( </span>
          }

          {selected && results.Includes.length > 0 &&
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

import './App.css';
import { useEffect, useRef, useState } from 'react';
import ResultSelect from './components/result-select';
import DefinitionDisplay from './components/definition-display';
import RadicalLookup from './components/radical-lookup';
import Navbar from './components/navbar';
import HandwritingInput from './components/handwriting';

// wasd on select
// After 10 seconds of inactivity: select query input & add to history
// Add e => j search, check if no japanese characters && length > 1
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
  let [selected, setSelected] = useState()
  let [showInput, setShowInput] = useState("none")
  let queryTimeout = useRef()

  // Fetch initial results and examples on search links
  useEffect(() => {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has("search")) {
      let query = searchParams.get("search")
      fetch("http://localhost:9000/jisho/word/" + query)
        .then(res => res.json())
        .then(json => setResults(json))
    
        fetch("http://localhost:9000/jisho/example/tatoeba/" + query)
        .then(res => res.json())
        .then(json => {
          setExamples(json.filter((item, idx) => idx < 20))
        })
    }
  }, [])

  // fetch data on search update  
  useEffect(() => {
    if(queryTimeout.current) clearTimeout(queryTimeout.current)
    if (query.length > 0){
      queryTimeout.current = setTimeout(() => {
        // fetch word definitions
        fetch("http://localhost:9000/jisho/word/" + query)
        .then(res => res.json())
        .then(json => setResults(json))
      }, 300);
        
      //fetch examples sentences, limited to 20
      fetch("http://localhost:9000/jisho/example/tatoeba/" + query)
      .then(res => res.json())
      .then(json => {
        setExamples(json.filter((item, idx) => idx < 20))
      })
    }
  }, [query])

  return (
    <div className="App">
      <Navbar 
        setQuery={setQuery}
        query={query}
        setType={setType}
        type={type}
        setShowInput={setShowInput}
        showInput={showInput}
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
            
            <div className='definition-wrapper'>
              <DefinitionDisplay selected={selected} />
            </div>
            
            {examples &&
            <div className='example-wrapper'>
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

import './App.css';
import { useEffect, useRef, useState } from 'react';
import ResultSelect from './components/result-select';
import DefinitionDisplay from './components/definition-display';
import RadicalLookup from './components/radical-lookup';
import Navbar from './components/navbar';
import HandwritingInput from './components/handwriting';

// Add kb controls 
// slide in handwriting input 
// Button that clears + focuses search bar
// button that focuses select 
// wasd on select

function App() {
  let [query, setQuery] = useState("")
  let [results, setResults] = useState()
  let [examples, setExamples] = useState()
  let [type, setType] = useState("Includes")
  let [selected, setSelected] = useState()
  let [showInput, setShowInput] = useState("none")
  let timeoutID = useRef()
  
  // fetch data on search update  
  useEffect(() => {
    if(timeoutID.current) clearTimeout(timeoutID.current)
    if (query.length > 0){
      timeoutID.current = setTimeout(() => {
        // fetch word definitions
        fetch("http://localhost:9000/jisho/word/" + query)
        .then(res => res.json())
        .then(json => setResults(json))
        }, 50);
        
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
        setShowInput={setShowInput}
        showInput={showInput}
      />

     {showInput === "radical" && 
      <div id="radical-lookup-wrapper" className='container' >
        <RadicalLookup setQuery={setQuery} showInput={showInput} />
      </div>}
      
      <HandwritingInput 
        vw={95} 
        minWidth={200} 
        maxWidth={450} 
        height={300} 
        language={"ja"}
        handleButton={e => setQuery(prev => prev + e.target.value)}
      />

      <main>
        <div className='container flex'>
          
          {
          results 
            ? <ResultSelect array={results[type]} setSelected={setSelected} />  
            : <select className='result-select' size={2}></select>
          }

          {selected && 
          <div className='container flex'>
            
            <div className='definition-wrapper'>
              <DefinitionDisplay selected={selected} />
            </div>
            
            <div className='example-wrapper'>
              <ul>
                {examples.map(item => <li> {item.text} </li>)}
              </ul>
            </div>
          </div>}
        </div>
      </main>
        
    </div>
  );
}

export default App;

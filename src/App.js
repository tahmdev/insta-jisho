import './App.css';
import { useEffect, useRef, useState } from 'react';
import ResultSelect from './components/result-select';
import DefinitionDisplay from './components/definition-display';
import RadicalLookup from './components/radical-lookup';
import Navbar from './components/navbar';
import HandwritingInput from './components/handwriting';

// Add Handwriting input <= Add language prop, options prop({lineCap: "", lineJoin, "", color: (strokeStyle), lineWidth: ""})
// Add kb controls 

function App() {
  let [query, setQuery] = useState("")
  let [results, setResults] = useState()
  let [examples, setExamples] = useState()
  let [type, setType] = useState("Includes")
  let [selected, setSelected] = useState()
  let [showRadicalInput, setShowRadicalInput] = useState(false)
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
        setShowRadicalInput={setShowRadicalInput}
        showRadicalInput={showRadicalInput}
      />

     {showRadicalInput && 
      <div id="radical-lookup-wrapper" className='container' onTransitionEnd={() => setShowRadicalInput(false)} >
        <RadicalLookup setQuery={setQuery} showRadicalInput={showRadicalInput} />
      </div>}

      <HandwritingInput 
        vw={50} 
        minWidth={200} 
        maxWidth={727} 
        height={300} 
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

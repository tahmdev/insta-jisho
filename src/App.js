import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import ResultSelect from './components/result-select';
import DefinitionDisplay from './components/definition-display';
import RadicalLookup from './components/radical-lookup';
// Add Handwriting input
// Add radical input
// Add kb controls 

function App() {
  let [query, setQuery] = useState("")
  let [results, setResults] = useState()
  let [examples, setExamples] = useState()
  let [type, setType] = useState("Includes")
  let [selected, setSelected] = useState()
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
      <nav className='flex-center'>
        <input onChange={e => setQuery(e.target.value)} value={query} />
        <select onChange={e => setType(e.target.value)}>
          <option>Includes</option>
          <option>Exact</option>  
          <option>Prefix</option>  
          <option>Suffix</option>  
        </select>
      </nav>

      <div className='container radical-lookup-wrapper'>
        <RadicalLookup setQuery={setQuery} />
      </div>

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

import { useEffect, useRef, useState } from "react"
import radicalData from "../radk.json"

const RadicalLookup = ({setQuery}) => {
  let [selected, setSelected] = useState([])

  useEffect(() => {
    // Calculate Possible options 
  }, [selected])

  const handleUpdateSelected = (e, value) => {
    console.log(value)
    if (e.target.checked) setSelected(prev => [value, ...prev])

    if (!e.target.checked) setSelected(prev => {
      let idxToRemove = prev.findIndex(i => i === value)
      if (idxToRemove !== -1) prev.splice(idxToRemove, 1)
      return [...prev]
    })
  }

  //takes an array of arrays and returns one array containing all mutual children
  const mutualChildren = (initArray) => {
    if (initArray.length > 1){
      const getAmount = (array, entry) => {
        return array.filter(item => item === entry).length
      }
      
      const removeDuplicates = (array) => {
        return [...new Set(array)]
      }
  
      return (
        [...removeDuplicates(initArray.map(item => removeDuplicates(item))
          .flat()
          .filter((item, idx, arr) => getAmount(arr, item) === initArray.length
          ))
        ]
      )
    }
    else return initArray.flat()
  }
  
  const hasMutualChildren = (arr1, arr2) => {
    if(arr1.length === 0) return true
    return mutualChildren(arr1).some(i => arr2.includes(i))
  }
  return(
    <div onTransitionEnd={() => console.log("a")} >
      <div className="radical-select">
        {mutualChildren(selected).map(item => {
          return(
            <button onClick={() => setQuery(prev => prev + item)} > {item} </button>
          )
        })}
      </div>

      <div className="radical-input">
        {
          Object.keys(radicalData).map((key, idx, arr) => {
            // render stroke count if previous stroke count < new stroke count
            const renderStrokeCount = idx === 0 || radicalData[key].strokes !== radicalData[arr[idx-1]].strokes
            return(
              <>
              {renderStrokeCount && <span> {radicalData[key].strokes} </span>}

              <div className="radical-button" >

                <input 
                  className="radical-checkbox" 
                  type="checkbox"
                  id={key}
                  value={radicalData[key]}
                  onChange={e => handleUpdateSelected(e, radicalData[key].kanji)} 
                />
                <label  
                htmlFor={key} 
                className={`${hasMutualChildren(selected, radicalData[key].kanji) ? "enabled-radical" : "disabled-radical"}`}
                > 
                  {key}
                </label>
              </div> 
              </>
              
            )
          })
        }
      </div>
      <button onClick={() => console.log(mutualChildren(selected))}> LOG </button>
    </div>
  )
}
export default RadicalLookup
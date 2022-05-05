import { useEffect, useState } from "react"
import radicalData from "../radk.json"

const RadicalLookup = ({setQuery}) => {
  let [selected, setSelected] = useState([])
  let [mutualChildren, setMutualChildren] = useState([])
  let [enabled, setEnabled] = useState([])

  const handleUpdateSelected = (e, value) => {
    if (e.target.checked) setSelected(prev => [value, ...prev])

    if (!e.target.checked) setSelected(prev => {
      let idxToRemove = prev.findIndex(i => i === value)
      if (idxToRemove !== -1) prev.splice(idxToRemove, 1)
      return [...prev]
    })
  }

  useEffect(() => {
    setMutualChildren(getMutualChildren(selected))
  }, [selected])

  //takes an array of arrays and returns one array containing all mutual children
  //by checking whether an item appears as many times as there are arrays
  const getMutualChildren = (initArray) => {
    if (initArray.length > 1){
      const getAmount = (array, entry) => {
        return array.filter(item => item === entry).length
      }
      
      const removeDuplicates = (array) => {
        return [...new Set(array)]
      }
  
      return (
        [...removeDuplicates(initArray
          .map(item => removeDuplicates(item))
          .flat()
          .filter((item, idx, arr) => getAmount(arr, item) === initArray.length
          ))
        ]
      )
    }
    else return initArray.flat()
  }
  
  useEffect(() => {
    if (selected.length === 0) setEnabled(Object.keys(radicalData))
    else {let newArr = Object.keys(radicalData).filter(key => {
      return radicalData[key].kanji
      .some(kanji => mutualChildren.includes(kanji))
    })
    setEnabled(newArr)}
  }, [mutualChildren])

  return(
    <div>
      <div className="radical-select">
        {mutualChildren.map(item => {
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
                  onChange={e => handleUpdateSelected(e, radicalData[key].kanji)} 
                />
                <label  
                htmlFor={key} 
                className={`${enabled.includes(key) ? "enabled-radical" : "disabled-radical"}`}
                > 
                  {key}
                </label>
              </div> 
              </>
            )
          })
        }
      </div>
    </div>
  )
}
export default RadicalLookup
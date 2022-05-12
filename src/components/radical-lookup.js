import { useEffect, useState } from "react"
import radicalData from "../radk.json"

const RadicalLookup = ({handleButton}) => {
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

  const handleReset = () => {
    setSelected([])
    document.querySelectorAll("input[type=checkbox]").forEach(element => element.checked = false)
  }

  useEffect(() => {
    fetch("https://instant-jisho.herokuapp.com/jisho/radical", 
    {
      method: "POST",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selected)
    })
    .then(res => res.json())
    .then(json => {
      setMutualChildren(json.mutualChildren)
      setEnabled(json.enabled)
    })
  }, [selected])

  return(
    <div>
      <div className="radical-select">
        {mutualChildren.map((item, idx) => {
          const renderStrokeCount = idx === 0 || mutualChildren[idx].strokes !== mutualChildren[idx - 1].strokes
          return(
            <>
              {renderStrokeCount && <span className="flex-center"> {item.strokes} </span>}
              <button onClick={handleButton} value={item.kanji} > {item.kanji} </button>
            </>
          )
        })}
      </div>

      <div className="radical-input">
        <button className="reset-button" onClick={handleReset} >reset</button>
        {
          
          Object.keys(radicalData).map((key, idx, arr) => {
            // render stroke count if previous stroke count < new stroke count
            const renderStrokeCount = idx === 0 || radicalData[key].strokes !== radicalData[arr[idx-1]].strokes
            
            return(
              <>
              {renderStrokeCount && <span className="flex-center"> {radicalData[key].strokes} </span>}

              <div className="radical-button" >

                <input 
                  className="radical-checkbox" 
                  type="checkbox"
                  id={key}
                  onChange={e => handleUpdateSelected(e, key)} 
                />
                <label  
                htmlFor={key} 
                className={`${enabled.includes(key) ? "enabled-radical" : "disabled-radical"} flex-center`}
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
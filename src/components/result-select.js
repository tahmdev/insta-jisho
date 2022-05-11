import { useEffect, useRef, useState } from "react"
import useEventListener from "./useEventListener"

const ResultSelect = ({results, setSelected, selected, exact}) => {
  const selectRef = useRef()
  let controlDown = useRef()
  let [selectedIndex, setSelectedIndex] = useState(0)
  let [sortedResults, setSortedResults] = useState()

  useEffect(() => {
    setSortedResults(sortResults(results))
  }, [results])

  const sortResults = (array) => {
    //sort by common word
    array = array.sort((a, b) => {
      if (a.r_ele[0].re_pri && !b.r_ele[0].re_pri) return -1
      if (!a.r_ele[0].re_pri && b.r_ele[0].re_pri) return 1
      return 0
    })
    
    //sort by length
    array = array.sort((a, b) => {
      let aLength
      let bLength
      if (a.k_ele) aLength = a.k_ele[0].keb[0].length
      else aLength = a.r_ele[0].reb[0].length
      if (b.k_ele) bLength = b.k_ele[0].keb[0].length
      else bLength = b.r_ele[0].reb[0].length
      return aLength - bLength
    })

    //sort by exact match
    if(exact){
      return array.sort(a => {
        let exactQuery
        if (exact.k_ele) exactQuery = exact.k_ele[0].keb[0]
        else         exactQuery = exact.r_ele[0].reb[0]
        
        if (a.k_ele) {
          return a.k_ele.some(i => i.keb.includes(exactQuery))
          ? -1
          : 1
        }else{
          return a.r_ele.some(i => i.reb.includes(exactQuery))
          ? -1
          : 1
        }
      })
    }else return array
  }

  useEffect(() => {
    if (sortedResults !== undefined){
      //display definition of top result when results change
      setSelected(sortedResults[0])
      
      //select top result when results change
      if(results.length) {
        setSelectedIndex(0)
      }
    }
  }, [sortedResults])

  useEffect(() => {
    if (sortedResults !== undefined){
      // display definition of selected option
      setSelected(sortedResults[selectedIndex])

      // select correct item, allows for WASD controls
      if(results.length) {
        document.getElementById('result-select').getElementsByTagName('option')[selectedIndex].selected = 'selected'
      }
    }
  }, [selectedIndex])

  const handleKeyDown = (e) => {
    if (e.key === "Control") controlDown.current = true
    if (e.key === "c" && controlDown.current) {
      let query = selected.k_ele
      ? selected.k_ele[0].keb
      : selected.r_ele[0].reb
      navigator.clipboard.writeText(`http://localhost:3000/?search=${query}&type=e`)
    }

    if(e.key === "s"){
      if(selectedIndex + 1 >= results.length) setSelectedIndex(0)
      else setSelectedIndex(prev => prev += 1)
    }
    if(e.key === "w"){
      if(selectedIndex - 1 < 0) setSelectedIndex(results.length -1)
      else setSelectedIndex(prev => prev -= 1)
    }
    if(e.key === "d"){
      if(selectedIndex + 5 >= results.length) setSelectedIndex(results.length -1)
      else setSelectedIndex(prev => prev += 5)
    }
    if(e.key === "a"){
      if(selectedIndex - 5 < 0) setSelectedIndex(0)
      else setSelectedIndex(prev => prev -= 5)
    }
  }
  
  const handleKeyUp = (e) => {
    if (e.key === "Control") controlDown.current = false
  }
  
  useEventListener("keydown", handleKeyDown, selectRef)
  useEventListener("keyup", handleKeyUp, selectRef)

  return(
    <select 
      id="result-select" 
      className='result-select' 
      size={2}
      onChange={e => setSelectedIndex(parseInt(e.target.value))}
      ref={selectRef}
    >
      { sortedResults && 
      sortedResults.map((item, idx) => {
        return(
          <option key={idx} value={idx}>
            {item.k_ele
            ? item.k_ele[0].keb
            : item.r_ele[0].reb
          }
          </option>
        )
      })
    }
    </select>
  )
}
export default ResultSelect
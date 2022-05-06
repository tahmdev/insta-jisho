import { useEffect, useRef, useState } from "react"
import useEventListener from "./useEventListener"

const ResultSelect = ({results, setSelected, selected}) => {
  const selectRef = useRef()
  let controlDown = useRef()
  let [selectedIndex, setSelectedIndex] = useState(0)
  const sortArray = (array) => {
    array = array.sort((a, b) => {
      let aLength
      let bLength
      if (a.k_ele) aLength = a.k_ele[0].keb[0].length
      else aLength = a.r_ele[0].reb[0].length
      if (b.k_ele) bLength = b.k_ele[0].keb[0].length
      else bLength = b.r_ele[0].reb[0].length
      return aLength - bLength
    })
  
    // sort by common word
    return array.sort((a, b) => {
      if (a.r_ele[0].re_pri && !b.r_ele[0].re_pri) return -1
      if (!a.r_ele[0].re_pri && b.r_ele[0].re_pri) return 1
      return 0

    })
  }
  useEffect(() => {
    //display definition of top result when results change
    setSelected(sortArray(results)[0])
    
    //select top result when results change
    if(results.length) {
      document.getElementById('result-select').getElementsByTagName('option')[0].selected = 'selected'
    }
  }, [results])

  useEffect(() => {
    // display definition of selected option
    setSelected(sortArray(results)[selectedIndex])

    // select correct item, allows for WASD controls
    if(results.length) {
      document.getElementById('result-select').getElementsByTagName('option')[selectedIndex].selected = 'selected'
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
  useEventListener("keydown", handleKeyDown, selectRef)

  const handleKeyUp = (e) => {
    if (e.key === "Control") controlDown.current = false
  }
  useEventListener("keyup", handleKeyUp, selectRef)

  return(
    <select id="result-select" className='result-select' size={6} 
      onChange={e => setSelectedIndex(parseInt(e.target.value))}
      ref={selectRef}
    >
      { 
      sortArray(results).map((item, idx) => {
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
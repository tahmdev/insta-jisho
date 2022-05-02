import { useEffect, useState } from "react";
import HandwritingCanvas from "./handwriting-canvas";

const HandwritingInput = () => {
  let [ink, setInk] = useState([])

  useEffect(() => {
    //console.log(ink)
  },[ink])

  const test = () => {
    
    let data = JSON.stringify({
      "options": "enable_pre_space",
      "requests": [{
          "writing_guide": {
              "writing_area_width": 425,
              "writing_area_height": 194,
          },
          "ink": ink,
          "language": "ja"
      }]
    });
    fetch("https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8", {method: "POST", headers: {'Content-Type': 'application/json'}  ,body: data})
    .then(res => res.json())
    .then(json => console.log(json))
  }
  return(
    <div>
      <HandwritingCanvas setInk={setInk} />
      <button onClick={test}>
          test
        </button>
    </div>
  )
}
export default HandwritingInput
import { useState } from "react";
import HandwritingCanvas from "./handwriting-canvas";
import useEventListener from "./useEventListener";
const HandwritingInput = ({width, height, maxHeight, maxWidth, minHeight, minWidth, vw, vh}) => {
  let [ink, setInk] = useState([])
  let [results, setResults] = useState()
  let [widthRes, setWidthRes] = useState(minMax(percentOf(vw, window.screen.width), minWidth || -Infinity, maxWidth || Infinity))
  let [heightRes, setHeightRes] = useState(minMax(percentOf(vh, window.screen.width), minWidth || -Infinity, maxWidth || Infinity))


  const handleResize = () => {
    setWidthRes(minMax(percentOf(vw, window.innerWidth), minWidth || -Infinity, maxWidth || Infinity))
    setHeightRes(minMax(percentOf(vh, window.innerHeight), minHeight || -Infinity, maxHeight || Infinity))
  }
  useEventListener("resize", handleResize, window, vw !== undefined || vh !== undefined)

  const test = () => {
    let data = JSON.stringify({
      "options": "enable_pre_space",
      "requests": [{
          "writing_guide": {
              "writing_area_width": widthRes || width,
              "writing_area_height": heightRes || height,
          },
          "ink": ink,
          "language": "ja"
      }]
    });
    fetch("https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8", {method: "POST", headers: {'Content-Type': 'application/json'}  ,body: data})
    .then(res => res.json())
    .then(json => {
      if (json.length === 2){
        setResults(json[1][0][1])
      } 
    })
  }

  const debug = () => {
    console.log(document.getElementById("cv").width)
  }
  return(
    <div id="handwriting-wrapper">
      <HandwritingCanvas setInk={setInk} ink={ink} w={widthRes || width} h={heightRes || height} />
      <button onClick={test}>
        test
      </button>
      <button onClick={() => setInk([])}>Clear</button>
      <button onClick={debug}>Debug</button>
      <span> {results} </span>
    </div>
  )
}
export default HandwritingInput

const percentOf = (percent, parent) => {
  return percent / 100 * parent
}
const minMax = (num, min, max) => {
  return (
    num > max
    ? max
    : num < min
    ? min
    : num
  )
}
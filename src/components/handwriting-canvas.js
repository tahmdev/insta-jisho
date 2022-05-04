import { useEffect, useRef, useState } from "react"
import useEventListener from "./useEventListener"

const HandwritingCanvas = ({w, h, setResults, ink, setInk, language, options = {}}) => {
  let [active, setActive] = useState(false)
  let [currentInput, setCurrentInput] = useState()

  const ref = useRef()
  let timer = useRef(null)


  const lookUp = () => {
    let data = JSON.stringify({
      "options": "enable_pre_space",
      "requests": [{
          "writing_guide": {
              "writing_area_width": w,
              "writing_area_height": h,
          },
          "ink": ink,
          "language": language
      }]
    });
    fetch("https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8", {method: "POST", headers: {'Content-Type': 'application/json'}  ,body: data})
    .then(res => res.json())
    .then(json => {
      // check if lookup was successful
      if (json.length === 2){ 
        setResults(json[1][0][1])
      } 
    })
  }

  // Handle resize and stroke style
  useEffect(() => {
    let context = ref.current.getContext("2d")
    context.canvas.width = w
    context.canvas.height = h
    context.lineWidth = options.lineWidth || 5
    context.lineCap = options.lineCap || "round"
    context.lineJoin = options.lineJoin || "round"
    context.strokeStyle = options.color || "#FFF"
  }, [w, h])

  // Handle clear canvas and lookUp
  useEffect(() => {
    if (ink.length === 0) {
      let canvas = ref.current
      let context = canvas.getContext("2d")
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    else lookUp()
  }, [ink])

  const handleMouseDown = (e) => {
    const canvas = ref.current
    let context = canvas.getContext("2d")
    context.beginPath()
    let x = e.pageX - canvas.offsetLeft
    let y = e.pageY - canvas.offsetTop
    context.moveTo(x, y)
    context.lineTo(x, y);
    context.stroke();
    setCurrentInput([[x], [y], []])
    setActive(true)
  }
  
  const handleMove = (e) => {
    if(active){
      const canvas = ref.current
      let context = canvas.getContext("2d")

      let x = e.pageX - canvas.offsetLeft
      let y = e.pageY - canvas.offsetTop
      context.lineTo(x, y);
      context.stroke();
      if(!timer.current){
        setCurrentInput(prev => [[...prev[0], x], [...prev[1], y], []])
      }
    }
    if(!timer.current){
      timer.current = setTimeout(() => {
        timer.current = null
      }, 20);
    }
  }
 
  const handleMouseUp = () => {
    // call getResults here after 500ms
    if(currentInput) setInk(prev => [...prev, currentInput])
    setCurrentInput()
    setActive(false)
  }

  const handleTouchStart = (e) => handleMouseDown(e.touches[0])
  const handleTouchMove = (e) => {handleMove(e.touches[0]); e.preventDefault();}
  const handleTouchEnd = (e) => handleMouseUp(e.touches[0])

  useEventListener("mousedown", handleMouseDown, ref)
  useEventListener("mousemove", handleMove, ref)
  useEventListener("mouseup", handleMouseUp, window)

  useEventListener("touchstart", handleTouchStart, ref)
  useEventListener("touchmove", handleTouchMove, ref)
  useEventListener("touchend", handleTouchEnd, ref)


  return(
    <canvas id="cv" className="handwriting-canvas" ref={ref} />
  )
}
export default HandwritingCanvas




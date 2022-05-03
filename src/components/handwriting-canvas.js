import { useEffect, useRef, useState } from "react"
import useEventListener from "./useEventListener"

const HandwritingCanvas = ({setInk, ink, w, h}) => {
  let [active, setActive] = useState(false)
  let [context, setContext] = useState()
  let [currentInput, setCurrentInput] = useState()
  const ref = useRef()
  let timer = useRef(null)

  // Handle resize and stroke style
  useEffect(() => {
    let context = ref.current.getContext("2d")
    context.canvas.width = w
    context.canvas.height = h
    context.lineWidth = 5
    context.lineCap = "round"
    context.lineJoin = "round"
    context.strokeStyle = "#FFF"
  }, [w, h])

  useEffect(() => {
    if (ink.length === 0) {
      let canvas = ref.current
      let context = canvas.getContext("2d")
      context.clearRect(0, 0, canvas.width, canvas.height); 
    }
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
      console.log(x, y)
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
 
  const handleMouseUp = (e) => {
    // call getResults here after 500ms
    if(currentInput) setInk(prev => [...prev, currentInput])
    setCurrentInput()
    setActive(false)
  }
  // https://stackoverflow.com/questions/16057256/draw-on-a-canvas-via-mouse-and-touch
  useEventListener("mousedown", handleMouseDown, ref)
  useEventListener("mousemove", handleMove, ref)
  useEventListener("mouseup", handleMouseUp, window)


  return(
    <canvas id="cv" className="handwriting-canvas" ref={ref} />
  )
}
export default HandwritingCanvas
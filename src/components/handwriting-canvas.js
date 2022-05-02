import { useEffect, useRef, useState } from "react"
import useEventListener from "./useEventListener"

const HandwritingCanvas = ({setInk}) => {
  let [active, setActive] = useState(false)
  let [context, setContext] = useState()
  let [currentInput, setCurrentInput] = useState()
  const ref = useRef()
  let timer = useRef(null)

  
  useEffect(() => {
    context = ref.current.getContext("2d")
    context.lineWidth = 5
    context.lineCap = "round"
    context.lineJoin = "round"
    context.strokeStyle = "#FFF"
    setContext(context)
  }, [])

  useEffect(() => {
    //console.log(currentInput)
  }, [currentInput])

  const handleMouseDown = (e) => {
    const canvas = ref.current
    context.beginPath()
    let x = e.pageX - canvas.offsetLeft
    let y = e.pageY - canvas.offsetTop
    console.log(x, y)
    context.moveTo(x, y)
    setCurrentInput([[x], [y], []])
    setActive(true)
    
  }
  
  const handleMove = (e) => {
    
    if(active){
      const canvas = ref.current
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
    setInk(prev => [...prev, currentInput])
    setActive(false)
  }

  useEventListener("mousedown", handleMouseDown, ref)
  useEventListener("mousemove", handleMove, ref)
  useEventListener("mouseup", handleMouseUp, null, window)

  return(
    <canvas className="handwriting-canvas" ref={ref} width="450" height="300" />
  )
}
export default HandwritingCanvas
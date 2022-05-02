import { useEffect, useRef } from "react";
export default function useEventListener(type, callback, ref, element) {
  useEffect(() => {
    if (ref) element = ref.current
    element.addEventListener(type, callback)
    return () => element.removeEventListener(type, callback)
  }, [callback])
}
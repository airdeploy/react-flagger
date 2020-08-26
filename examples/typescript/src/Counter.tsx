import React, {useState} from 'react'
import {useCallback} from 'react'

export const Counter = () => {
  const [counter, setCounter] = useState(0)
  const onInc = useCallback(() => {
    setCounter((c) => c + 1)
  }, [setCounter])
  const onDec = useCallback(() => {
    setCounter((c) => c - 1)
  }, [setCounter])
  return (
    <div>
      <button onClick={onDec}>-</button>
      <button onClick={onInc}>+</button>
      <div>{counter}</div>
    </div>
  )
}

export default Counter

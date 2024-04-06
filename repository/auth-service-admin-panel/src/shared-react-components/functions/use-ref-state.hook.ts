import { useEffect, useRef, useState } from 'react'

export const useRefState = <T>() => {
    const refValue = useRef<T>()

    const [refState, setRefState] = useState<T>()

    useEffect(() => {
        setRefState(refValue.current)
    },[refValue, refValue.current])

    return {
        ref: refValue,
        state : refState,
        setState: setRefState
    }
}
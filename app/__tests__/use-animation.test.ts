import { act, renderHook } from '@testing-library/react'
import useAnimation from '../_hooks/use-animation'
import { Word } from '../_types'

jest.useFakeTimers()

describe('useAnimation', () => {
  it('initializes with no animation active', () => {
    const { result } = renderHook(() => useAnimation())
    expect(result.current.guessAnimationState).toEqual({ show: false, index: -1 })
    expect(result.current.wrongGuessAnimationState).toBe(false)
  })

  it('animateWrongGuess sets wrongGuessAnimationState true then false', async () => {
    const { result } = renderHook(() => useAnimation())

    let promise: Promise<void>
    act(() => {
      promise = result.current.animateWrongGuess()
    })

    expect(result.current.wrongGuessAnimationState).toBe(true)

    await act(async () => {
      await jest.runAllTimersAsync()
      await promise!
    })

    expect(result.current.wrongGuessAnimationState).toBe(false)
  })

  it('animateGuess resets to show:false after completing', async () => {
    const { result } = renderHook(() => useAnimation())

    const words: Word[] = [
      { word: 'A', level: 1, selected: true },
      { word: 'B', level: 1, selected: true },
    ]

    await act(async () => {
      const promise = result.current.animateGuess(words)
      await jest.runAllTimersAsync()
      await promise
    })

    expect(result.current.guessAnimationState).toEqual({ show: false, index: -1 })
  })

  it('animateGuess starts with show:true on first selected word', async () => {
    const { result } = renderHook(() => useAnimation())

    const words: Word[] = [{ word: 'A', level: 1, selected: true }]

    act(() => {
      result.current.animateGuess(words)
    })

    expect(result.current.guessAnimationState.show).toBe(true)
    expect(result.current.guessAnimationState.index).toBe(0)

    // Clean up pending timers
    await act(async () => {
      await jest.runAllTimersAsync()
    })
  })

  it('animateGuess skips unselected words', async () => {
    const { result } = renderHook(() => useAnimation())

    const words: Word[] = [
      { word: 'A', level: 1, selected: false },
      { word: 'B', level: 1, selected: true },
    ]

    act(() => {
      result.current.animateGuess(words)
    })

    // Index 0 was unselected, should jump to index 1
    expect(result.current.guessAnimationState.index).toBe(1)

    await act(async () => {
      await jest.runAllTimersAsync()
    })
  })
})

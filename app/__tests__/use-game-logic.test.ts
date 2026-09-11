import { act, renderHook } from '@testing-library/react'
import { categories } from '../_examples'
import useGameLogic from '../_hooks/use-game-logic'

jest.useFakeTimers()

function selectWords(
  result: ReturnType<typeof renderHook<ReturnType<typeof useGameLogic>, unknown>>['result'],
  words: { word: string; level: 1 | 2 | 3 | 4 }[]
) {
  for (const w of words) {
    act(() => {
      result.current.selectWord(w)
    })
  }
}

describe('useGameLogic', () => {
  it('initializes with 16 game words', () => {
    const { result } = renderHook(() => useGameLogic())
    act(() => {})
    expect(result.current.gameWords).toHaveLength(16)
  })

  it('initializes with no selected words', () => {
    const { result } = renderHook(() => useGameLogic())
    act(() => {})
    expect(result.current.selectedWords).toHaveLength(0)
  })

  it('initializes with 4 mistakes remaining', () => {
    const { result } = renderHook(() => useGameLogic())
    expect(result.current.mistakesRemaining).toBe(4)
  })

  it('initializes with game not won or lost', () => {
    const { result } = renderHook(() => useGameLogic())
    expect(result.current.isWon).toBe(false)
    expect(result.current.isLost).toBe(false)
  })

  it('selects a word', () => {
    const { result } = renderHook(() => useGameLogic())
    act(() => {})

    const word = result.current.gameWords[0]
    act(() => {
      result.current.selectWord(word)
    })

    expect(result.current.selectedWords).toHaveLength(1)
    expect(result.current.selectedWords[0].word).toBe(word.word)
  })

  it('deselects word on second click', () => {
    const { result } = renderHook(() => useGameLogic())
    act(() => {})

    const word = result.current.gameWords[0]
    act(() => {
      result.current.selectWord(word)
    })
    act(() => {
      result.current.selectWord(result.current.gameWords.find(w => w.word === word.word)!)
    })

    expect(result.current.selectedWords).toHaveLength(0)
  })

  it('caps selection at 4 words', () => {
    const { result } = renderHook(() => useGameLogic())
    act(() => {})

    selectWords(result, result.current.gameWords.slice(0, 5))

    expect(result.current.selectedWords).toHaveLength(4)
  })

  it('deselectAllWords clears selection', () => {
    const { result } = renderHook(() => useGameLogic())
    act(() => {})

    selectWords(result, result.current.gameWords.slice(0, 3))
    expect(result.current.selectedWords).toHaveLength(3)

    act(() => {
      result.current.deselectAllWords()
    })
    expect(result.current.selectedWords).toHaveLength(0)
  })

  it('shuffleWords keeps same words', () => {
    const { result } = renderHook(() => useGameLogic())
    act(() => {})

    const before = result.current.gameWords.map(w => w.word).sort()
    act(() => {
      result.current.shuffleWords()
    })
    const after = result.current.gameWords.map(w => w.word).sort()

    expect(after).toEqual(before)
  })

  it('getSubmitResult returns correct for valid category guess', () => {
    const { result } = renderHook(() => useGameLogic())
    act(() => {})

    const cat = categories[0]
    selectWords(
      result,
      result.current.gameWords.filter(w => cat.items.includes(w.word))
    )

    expect(result.current.selectedWords).toHaveLength(4)

    let submitResult: ReturnType<typeof result.current.getSubmitResult>
    act(() => {
      submitResult = result.current.getSubmitResult()
    })

    expect(submitResult!.result).toBe('correct')
  })

  it('getSubmitResult returns incorrect for wrong guess', () => {
    const { result } = renderHook(() => useGameLogic())
    act(() => {})

    // One word from each different category — can't be correct (different levels)
    const mixedWords = categories.map(
      cat => result.current.gameWords.find(w => w.word === cat.items[0])!
    )
    selectWords(result, mixedWords)

    let submitResult: ReturnType<typeof result.current.getSubmitResult>
    act(() => {
      submitResult = result.current.getSubmitResult()
    })

    expect(['incorrect', 'one-away']).toContain(submitResult!.result)
  })

  it('decrements mistakesRemaining on wrong guess', () => {
    const { result } = renderHook(() => useGameLogic())
    act(() => {})

    const mixedWords = categories.map(
      cat => result.current.gameWords.find(w => w.word === cat.items[0])!
    )
    selectWords(result, mixedWords)
    act(() => {
      result.current.getSubmitResult()
    })

    expect(result.current.mistakesRemaining).toBe(3)
  })

  it('getSubmitResult returns loss on last mistake', () => {
    const { result } = renderHook(() => useGameLogic())
    act(() => {})

    for (let i = 0; i < 4; i++) {
      const mixedWords = categories.map(
        cat => result.current.gameWords.find(w => w.word === cat.items[0])!
      )
      selectWords(result, mixedWords)
      let res: ReturnType<typeof result.current.getSubmitResult>
      act(() => {
        res = result.current.getSubmitResult()
      })
      if (res!.result === 'loss') {
        expect(res!.result).toBe('loss')
        return
      }
      act(() => {
        result.current.deselectAllWords()
      })
    }
    throw new Error('expected loss before 4 guesses')
  })

  it('getSubmitResult returns win when all categories correct', () => {
    const { result } = renderHook(() => useGameLogic())
    act(() => {})

    let lastResult: ReturnType<typeof result.current.getSubmitResult>

    for (let i = 0; i < 4; i++) {
      const cat = categories[i]
      const catWords = result.current.gameWords.filter(w => cat.items.includes(w.word))
      selectWords(result, catWords)
      act(() => {
        lastResult = result.current.getSubmitResult()
      })
      if (i < 3) {
        act(() => {
          result.current.deselectAllWords()
        })
      }
    }

    expect(lastResult!.result).toBe('win')
  })
})

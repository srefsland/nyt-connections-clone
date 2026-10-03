import { getPerfection, getWordColor, shuffleArray } from '../_utils'

describe('shuffleArray', () => {
  it('returns array with same elements', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = shuffleArray(arr)
    expect(result).toHaveLength(arr.length)
    expect(result.sort()).toEqual([...arr].sort())
  })

  it('does not mutate original array', () => {
    const arr = [1, 2, 3]
    const original = [...arr]
    shuffleArray(arr)
    expect(arr).toEqual(original)
  })

  it('handles empty array', () => {
    expect(shuffleArray([])).toEqual([])
  })

  it('handles single element', () => {
    expect(shuffleArray([42])).toEqual([42])
  })
})

describe('getWordColor', () => {
  it('returns yellow for level 1', () => {
    expect(getWordColor(1)).toBe('bg-yellow-300')
  })

  it('returns lime for level 2', () => {
    expect(getWordColor(2)).toBe('bg-lime-500')
  })

  it('returns blue for level 3', () => {
    expect(getWordColor(3)).toBe('bg-blue-300')
  })

  it('returns purple for level 4', () => {
    expect(getWordColor(4)).toBe('bg-purple-400')
  })
})

describe('getPerfection', () => {
  it('returns Perfect! for 4 mistakes remaining', () => {
    expect(getPerfection(4)).toBe('Perfect!')
  })

  it('returns Nice! for 3 mistakes remaining', () => {
    expect(getPerfection(3)).toBe('Nice!')
  })

  it('returns Good! for 2 mistakes remaining', () => {
    expect(getPerfection(2)).toBe('Good!')
  })

  it('returns Phew! for 1 or 0 mistakes remaining', () => {
    expect(getPerfection(1)).toBe('Phew!')
    expect(getPerfection(0)).toBe('Phew!')
  })
})

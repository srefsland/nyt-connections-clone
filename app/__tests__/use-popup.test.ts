import { act, renderHook } from '@testing-library/react'
import usePopup from '../_hooks/use-popup'

jest.useFakeTimers()

describe('usePopup', () => {
  it('starts with popup hidden', () => {
    const { result } = renderHook(() => usePopup())
    const [popupState] = result.current
    expect(popupState.show).toBe(false)
    expect(popupState.message).toBe('')
  })

  it('shows popup with message', async () => {
    const { result } = renderHook(() => usePopup())

    await act(async () => {
      const [, showPopup] = result.current
      showPopup('Hello!')
      // Let the state update happen
      await Promise.resolve()
    })

    const [popupState] = result.current
    expect(popupState.show).toBe(true)
    expect(popupState.message).toBe('Hello!')
  })

  it('hides popup after 1500ms', async () => {
    const { result } = renderHook(() => usePopup())

    await act(async () => {
      const [, showPopup] = result.current
      showPopup('Bye!')
      await Promise.resolve()
    })

    expect(result.current[0].show).toBe(true)

    await act(async () => {
      jest.advanceTimersByTime(1500)
      await Promise.resolve()
    })

    expect(result.current[0].show).toBe(false)
    expect(result.current[0].message).toBe('')
  })
})

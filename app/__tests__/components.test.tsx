import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ControlButton from '../_components/button/control-button'
import Cell from '../_components/game/cell'
import ClearedCategory from '../_components/game/cleared-category'
import Popup from '../_components/popup'
import { Word } from '../_types'

describe('Popup', () => {
  it('renders nothing when show is false', () => {
    const { container } = render(<Popup show={false} message="hello" />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders message when show is true', () => {
    render(<Popup show={true} message="One away..." />)
    expect(screen.getByText('One away...')).toBeInTheDocument()
  })
})

describe('ControlButton', () => {
  it('renders button text', () => {
    render(<ControlButton text="Shuffle" onClick={() => {}} />)
    expect(screen.getByText('Shuffle')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn()
    render(<ControlButton text="Submit" onClick={onClick} />)
    await userEvent.click(screen.getByText('Submit'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies unclickable styles when unclickable prop set', () => {
    render(<ControlButton text="Submit" onClick={() => {}} unclickable={true} />)
    const btn = screen.getByText('Submit').closest('button')!
    expect(btn.className).toContain('pointer-events-none')
  })

  it('does not apply unclickable styles by default', () => {
    render(<ControlButton text="Submit" onClick={() => {}} />)
    const btn = screen.getByText('Submit').closest('button')!
    expect(btn.className).not.toContain('pointer-events-none')
  })
})

describe('Cell', () => {
  const word: Word = { word: 'ORANGE', level: 2 }

  it('renders word text uppercase', () => {
    render(
      <Cell cellValue={word} onClick={() => {}} animateGuess={false} animateWrongGuess={false} />
    )
    expect(screen.getByText('ORANGE')).toBeInTheDocument()
  })

  it('calls onClick with word when clicked', async () => {
    const onClick = jest.fn()
    render(
      <Cell cellValue={word} onClick={onClick} animateGuess={false} animateWrongGuess={false} />
    )
    await userEvent.click(screen.getByText('ORANGE'))
    expect(onClick).toHaveBeenCalledWith(word)
  })

  it('shows selected style when word is selected', () => {
    const selected: Word = { ...word, selected: true }
    render(
      <Cell
        cellValue={selected}
        onClick={() => {}}
        animateGuess={false}
        animateWrongGuess={false}
      />
    )
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-slate-500')
  })

  it('shows unselected style when word is not selected', () => {
    render(
      <Cell cellValue={word} onClick={() => {}} animateGuess={false} animateWrongGuess={false} />
    )
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-slate-200')
  })

  it('applies guess animation class', () => {
    render(
      <Cell cellValue={word} onClick={() => {}} animateGuess={true} animateWrongGuess={false} />
    )
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('-translate-y-2')
  })
})

describe('ClearedCategory', () => {
  it('renders category name and items', () => {
    render(
      <ClearedCategory
        category={{
          category: 'SPHERICAL FOODS',
          items: ['JAWBREAKER', 'MEATBALL', 'MOZZARELLA', 'ORANGE'],
          level: 2,
        }}
      />
    )
    expect(screen.getByText('SPHERICAL FOODS')).toBeInTheDocument()
    expect(screen.getByText('JAWBREAKER, MEATBALL, MOZZARELLA, ORANGE')).toBeInTheDocument()
  })
})

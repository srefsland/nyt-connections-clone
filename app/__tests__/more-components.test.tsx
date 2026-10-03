import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GameModal from '../_components/modal/game-modal'
import GameLostModal from '../_components/modal/game-lost-modal'
import GameWonModal from '../_components/modal/game-won-modal'
import Grid from '../_components/game/grid'
import GuessHistory from '../_components/guess-history'
import { Word } from '../_types'

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn()
  HTMLDialogElement.prototype.close = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('GameModal', () => {
  it('renders children', () => {
    render(
      <GameModal isOpen={true} onClose={() => {}}>
        <span>inner content</span>
      </GameModal>
    )
    expect(screen.getByText('inner content')).toBeInTheDocument()
  })

  it('calls showModal when isOpen becomes true', () => {
    render(
      <GameModal isOpen={true} onClose={() => {}}>
        <span />
      </GameModal>
    )
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1)
  })

  it('calls close when isOpen is false', () => {
    render(
      <GameModal isOpen={false} onClose={() => {}}>
        <span />
      </GameModal>
    )
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when clicked outside bounding rect', async () => {
    const onClose = jest.fn()
    const { container } = render(
      <GameModal isOpen={true} onClose={onClose}>
        <span>modal body</span>
      </GameModal>
    )
    const dialog = container.querySelector('dialog')!
    // jsdom getBoundingClientRect() returns all zeros; clientX=-1 satisfies clientX < left(0)
    fireEvent.click(dialog, { clientX: -1, clientY: -1 })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('GameWonModal', () => {
  const guessHistory: Word[][] = [
    [
      { word: 'A', level: 1 },
      { word: 'B', level: 1 },
      { word: 'C', level: 1 },
      { word: 'D', level: 1 },
    ],
  ]

  it('renders perfection message', () => {
    render(
      <GameWonModal
        isOpen={true}
        onClose={() => {}}
        guessHistory={guessHistory}
        perfection="Perfect!"
      />
    )
    expect(screen.getByText('Perfect!')).toBeInTheDocument()
  })

  it('renders win message', () => {
    render(
      <GameWonModal
        isOpen={true}
        onClose={() => {}}
        guessHistory={guessHistory}
        perfection="Nice!"
      />
    )
    expect(screen.getByText("You've won the game!")).toBeInTheDocument()
  })

  it('calls onClose when Exit clicked', async () => {
    const onClose = jest.fn()
    render(
      <GameWonModal
        isOpen={true}
        onClose={onClose}
        guessHistory={guessHistory}
        perfection="Nice!"
      />
    )
    await userEvent.click(screen.getByText('Exit'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('GameLostModal', () => {
  const guessHistory: Word[][] = []

  it('renders next time message', () => {
    render(<GameLostModal isOpen={true} onClose={() => {}} guessHistory={guessHistory} />)
    expect(screen.getByText('Next time!')).toBeInTheDocument()
  })

  it('calls onClose when Exit clicked', async () => {
    const onClose = jest.fn()
    render(<GameLostModal isOpen={true} onClose={onClose} guessHistory={guessHistory} />)
    await userEvent.click(screen.getByText('Exit'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('GuessHistory', () => {
  it('renders colored tiles for each guess', () => {
    const guessHistory: Word[][] = [
      [
        { word: 'A', level: 1 },
        { word: 'B', level: 2 },
        { word: 'C', level: 3 },
        { word: 'D', level: 4 },
      ],
    ]
    const { container } = render(<GuessHistory guessHistory={guessHistory} />)
    const tiles = container.querySelectorAll('.size-12')
    expect(tiles).toHaveLength(4)
    expect(tiles[0].className).toContain('bg-yellow-300')
    expect(tiles[1].className).toContain('bg-lime-500')
    expect(tiles[2].className).toContain('bg-blue-300')
    expect(tiles[3].className).toContain('bg-purple-400')
  })

  it('renders empty grid for no guesses', () => {
    const { container } = render(<GuessHistory guessHistory={[]} />)
    expect(container.querySelectorAll('.size-12')).toHaveLength(0)
  })
})

describe('Grid', () => {
  const words: Word[] = [
    { word: 'APPLE', level: 1 },
    { word: 'BANANA', level: 2 },
  ]

  it('renders all words as cells', () => {
    render(
      <Grid
        words={words}
        selectedWords={[]}
        clearedCategories={[]}
        onClick={() => {}}
        guessAnimationState={{ show: false, index: -1 }}
        wrongGuessAnimationState={false}
      />
    )
    expect(screen.getByText('APPLE')).toBeInTheDocument()
    expect(screen.getByText('BANANA')).toBeInTheDocument()
  })

  it('renders cleared categories', () => {
    render(
      <Grid
        words={[]}
        selectedWords={[]}
        clearedCategories={[
          { category: 'FRUITS', items: ['APPLE', 'BANANA', 'CHERRY', 'DATE'], level: 1 },
        ]}
        onClick={() => {}}
        guessAnimationState={{ show: false, index: -1 }}
        wrongGuessAnimationState={false}
      />
    )
    expect(screen.getByText('FRUITS')).toBeInTheDocument()
  })

  it('calls onClick when a cell is clicked', async () => {
    const onClick = jest.fn()
    render(
      <Grid
        words={words}
        selectedWords={[]}
        clearedCategories={[]}
        onClick={onClick}
        guessAnimationState={{ show: false, index: -1 }}
        wrongGuessAnimationState={false}
      />
    )
    await userEvent.click(screen.getByText('APPLE'))
    expect(onClick).toHaveBeenCalledWith(words[0])
  })

  it('passes animateGuess to selected word at matching index', () => {
    render(
      <Grid
        words={words}
        selectedWords={[words[0]]}
        clearedCategories={[]}
        onClick={() => {}}
        guessAnimationState={{ show: true, index: 0 }}
        wrongGuessAnimationState={false}
      />
    )
    const appleBtn = screen.getByText('APPLE').closest('button')!
    expect(appleBtn.className).toContain('-translate-y-2')
  })
})

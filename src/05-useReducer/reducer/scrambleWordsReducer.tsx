export interface ScrambleWordsState {
  words: string[];
  currentWord: string;
  scrambledWord: string;
  guess: string;
  points: number;
  errorCounter: number;
  maxAllowErrors: number;
  skipCounter: number;
  maxSkips: number;
  isGameOver: boolean;
  totalWords: number;
};

export type ScrambleWordsAction =
  | { type: 'SET_GUESS'; payload: string; }
  | { type: 'CHECK_ANSWER'; }
  | { type: 'SKIP_WORD'; }
  | { type: 'START_NEW_GAME'; payload: ScrambleWordsState };

const GAME_WORDS = [
  'REACT',
  'JAVASCRIPT',
  'TYPESCRIPT',
  'HTML',
  'ANGULAR',
  'SOLID',
  'NODE',
  'VUEJS',
  'SVELTE',
  'EXPRESS',
  'MONGODB',
  'POSTGRES',
  'DOCKER',
  'KUBERNETES',
  'WEBPACK',
  'VITE',
  'TAILWIND',
];

// Esta función mezcla el arreglo para que siempre sea aleatorio
const shuffleArray = (array: string[]) => {
  return array.sort(() => Math.random() - 0.5);
};

// Esta función mezcla las letras de la palabra
const scrambleWord = (word: string = '') => {
  return word
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

export const getInitialState = (): ScrambleWordsState => {
  const shuffledWords = shuffleArray([...GAME_WORDS]);
  return {
    words: shuffledWords,
    currentWord: shuffledWords[0],
    scrambledWord: scrambleWord(shuffledWords[0]),
    guess: '',
    points: 0,
    errorCounter: 0,
    maxAllowErrors: 3,
    skipCounter: 0,
    maxSkips: 3,
    isGameOver: false,
    totalWords: shuffledWords.length,
  };
};

export const scrambleWordsReducer = (state: ScrambleWordsState, action: ScrambleWordsAction): ScrambleWordsState => {
  switch (action.type) {
    case 'SET_GUESS':
      return {
        ...state,
        guess: action.payload.trim().toLocaleUpperCase(),
      }

    case 'CHECK_ANSWER': {
      if (state.currentWord !== state.guess) {
        return {
          ...state,
          guess: '',
          errorCounter: state.errorCounter + 1,
          isGameOver: state.errorCounter + 1 >= state.maxAllowErrors,
        };
      }

      const newWordsArray = state.words.filter(word => word !== state.currentWord);
      const newWord = newWordsArray[Math.floor(Math.random() * (state.words.length - 1))];

      return {
        ...state,
        words: newWordsArray,
        currentWord: newWord,
        scrambledWord: scrambleWord(newWord),
        points: state.points + 1,
        guess: '',
      };
    }

    case 'SKIP_WORD': {
      if (state.skipCounter >= state.maxSkips) return state;

      const newWordsArray = state.words.filter(word => word !== state.currentWord);
      const newWord = newWordsArray[Math.floor(Math.random() * (state.words.length - 1))];
      return {
        ...state,
        skipCounter: state.skipCounter + 1,
        words: newWordsArray,
        currentWord: newWord,
        scrambledWord: scrambleWord(newWord),
        guess: '',
      }
    }

    case 'START_NEW_GAME':
      return action.payload;

    default:
      return state;
  }
}

import { useState, useEffect, useCallback } from 'react';
import { CardData, GameState } from '../utils/cardTypes';
import { fisherYatesShuffle } from '../utils/shuffle';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'icebreaker-game-state';

export function useCardDeck() {
  const [gameState, setGameState] = useLocalStorage<GameState | null>(
    STORAGE_KEY,
    null
  );
  const [availableCards, setAvailableCards] = useState<CardData[]>([]);
  const [drawnCards, setDrawnCards] = useState<CardData[]>([]);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize game from JSON file
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if we have saved state first
        if (gameState && gameState.availableCards && gameState.drawnCards) {
          // Restore from saved state
          setAvailableCards(gameState.availableCards);
          setDrawnCards(gameState.drawnCards);
          setIsLoading(false);
          return;
        }

        // Fetch and initialize new game
        const response = await fetch('/perguntas.json');
        if (!response.ok) {
          throw new Error('Failed to fetch perguntas.json');
        }

        const data = await response.json();
        const allCards: CardData[] = data.cartas_quebra_gelo || [];

        if (allCards.length === 0) {
          throw new Error('No cards found in perguntas.json');
        }

        // Initialize new game with shuffle
        const shuffled = fisherYatesShuffle(allCards);
        setAvailableCards(shuffled);
        setDrawnCards([]);

        // Save initial state
        const initialState: GameState = {
          availableCards: shuffled,
          drawnCards: [],
          lastReset: Date.now(),
        };
        setGameState(initialState);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error initializing game:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
  }, []); // Only run on mount

  // Sync state to localStorage whenever it changes (but not during initial load)
  useEffect(() => {
    if (!isLoading && (availableCards.length > 0 || drawnCards.length > 0)) {
      const newState: GameState = {
        availableCards,
        drawnCards,
        lastReset: gameState?.lastReset || Date.now(),
      };
      setGameState(newState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableCards, drawnCards, isLoading]);

  const drawCard = useCallback(() => {
    if (availableCards.length === 0) {
      return null;
    }

    const newCard = availableCards[0];
    const newAvailable = availableCards.slice(1);
    const newDrawn = [...drawnCards, newCard];

    setAvailableCards(newAvailable);
    setDrawnCards(newDrawn);
    setCurrentCard(newCard);

    return newCard;
  }, [availableCards, drawnCards]);

  const resetGame = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/perguntas.json');
      if (!response.ok) {
        throw new Error('Failed to fetch perguntas.json');
      }

      const data = await response.json();
      const allCards: CardData[] = data.cartas_quebra_gelo || [];

      const shuffled = fisherYatesShuffle(allCards);
      setAvailableCards(shuffled);
      setDrawnCards([]);
      setCurrentCard(null);

      const newState: GameState = {
        availableCards: shuffled,
        drawnCards: [],
        lastReset: Date.now(),
      };
      setGameState(newState);
    } catch (err) {
      console.error('Error resetting game:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [setGameState]);

  return {
    availableCards,
    drawnCards,
    currentCard,
    drawCard,
    resetGame,
    isLoading,
    error,
    cardsRemaining: availableCards.length,
    totalCards: availableCards.length + drawnCards.length,
  };
}


import { useState } from 'react';
import { useCardDeck } from './hooks/useCardDeck';
import { Card } from './components/Card';
import { CardStack } from './components/CardStack';
import './App.css';

function App() {
  const {
    availableCards,
    currentCard,
    drawCard,
    resetGame,
    isLoading,
    error,
    cardsRemaining,
    totalCards,
  } = useCardDeck();

  const [isDrawing, setIsDrawing] = useState(false);

  const handleDrawCard = () => {
    if (availableCards.length === 0) return;
    setIsDrawing(true);
    drawCard();
    setTimeout(() => {
      setIsDrawing(false);
    }, 100);
  };

  const handleNextCard = () => {
    if (availableCards.length > 0) {
      handleDrawCard();
    }
  };

  const handleReset = () => {
    resetGame();
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Carregando cartas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-screen">
          <h2>Erro ao carregar o jogo</h2>
          <p>{error}</p>
          <button onClick={handleReset} className="reset-button">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Icebreaker</h1>
        <p className="app-subtitle">Quebra-Gelo</p>
      </header>

      <main className="app-main">
        {/* Stats Bar - Compact at top */}
        <div className="stats-bar">
          <div className="stat-compact">
            <span className="stat-label-compact">Restantes</span>
            <span className="stat-value-compact">{cardsRemaining}</span>
          </div>
          <div className="stat-compact">
            <span className="stat-label-compact">Usadas</span>
            <span className="stat-value-compact">{totalCards - cardsRemaining}</span>
          </div>
          <div className="stat-compact">
            <span className="stat-label-compact">Total</span>
            <span className="stat-value-compact">{totalCards}</span>
          </div>
        </div>

        <div className="game-area">
          {/* Stack Section - Desktop only */}
          <div className="stack-section desktop-only">
            <CardStack cards={availableCards} />
            {currentCard === null && availableCards.length > 0 && (
              <button
                className="draw-button"
                onClick={handleDrawCard}
                disabled={isDrawing}
              >
                Tirar Carta
              </button>
            )}
          </div>

          {/* Card Section - Main focus */}
          <div className="card-section">
            {currentCard ? (
              <Card
                card={currentCard}
                onNext={handleNextCard}
                hasMoreCards={cardsRemaining > 0}
                isDrawing={isDrawing}
              />
            ) : (
              <div className="no-card-message">
                <CardStack cards={availableCards} />
                {availableCards.length > 0 ? (
                  <button
                    className="draw-button draw-button-large"
                    onClick={handleDrawCard}
                    disabled={isDrawing}
                  >
                    Tirar Carta
                  </button>
                ) : (
                  <p>Todas as cartas foram usadas!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="game-controls">
          <button className="reset-button" onClick={handleReset}>
            Resetar Jogo
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;


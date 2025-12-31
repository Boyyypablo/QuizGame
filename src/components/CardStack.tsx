import { CardData } from '../utils/cardTypes';
import './CardStack.css';

interface CardStackProps {
  cards: CardData[];
}

export function CardStack({ cards }: CardStackProps) {
  // Show only the top 10 cards for performance
  const visibleCards = cards.slice(0, 10);

  if (cards.length === 0) {
    return (
      <div className="card-stack-container">
        <div className="stack-empty">
          <p>Todas as cartas foram usadas!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-stack-container">
      <div className="card-stack" style={{ perspective: '1000px' }}>
        {visibleCards.map((card, index) => {
          const zOffset = -index * 5;
          const shadowOpacity = 0.3 - index * 0.03;
          const scale = 1 - index * 0.02;

          return (
            <div
              key={card.id}
              className="stack-card"
              style={{
                transform: `translateZ(${zOffset}px) scale(${scale})`,
                zIndex: cards.length - index,
                boxShadow: `0 ${10 + index * 2}px ${20 + index * 3}px rgba(0, 0, 0, ${shadowOpacity})`,
              }}
            >
              <div className="stack-card-back"></div>
            </div>
          );
        })}
      </div>
      <div className="stack-counter">
        <span className="counter-number">{cards.length}</span>
        <span className="counter-label">cartas restantes</span>
      </div>
    </div>
  );
}


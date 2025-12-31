import { CardData } from '../utils/cardTypes';
import './CardFront.css';

interface CardFrontProps {
  card: CardData;
  onNext: () => void;
  hasMoreCards: boolean;
}

export function CardFront({ card, onNext, hasMoreCards }: CardFrontProps) {
  return (
    <div className="card-front">
      <div className="card-header">
        <span className="card-number">#{card.id}</span>
      </div>
      <div className="card-content">
        <h3 className="card-title">Perguntas</h3>
        <div className="questions-list">
          {card.perguntas.map((pergunta, index) => (
            <div key={index} className="question-item">
              <span className="question-number">{index + 1}</span>
              <p className="question-text">{pergunta}</p>
            </div>
          ))}
        </div>
      </div>
      {hasMoreCards && (
        <button className="next-card-button" onClick={onNext}>
          Próxima Carta
        </button>
      )}
    </div>
  );
}


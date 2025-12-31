import './CardBack.css';

export function CardBack() {
  return (
    <div className="card-back">
      <div className="card-back-pattern">
        <div className="pattern-circle circle-1"></div>
        <div className="pattern-circle circle-2"></div>
        <div className="pattern-circle circle-3"></div>
        <div className="pattern-line line-1"></div>
        <div className="pattern-line line-2"></div>
        <div className="pattern-line line-3"></div>
      </div>
      <div className="card-back-logo">
        <h2>Icebreaker</h2>
        <p>Quebra-Gelo</p>
      </div>
    </div>
  );
}


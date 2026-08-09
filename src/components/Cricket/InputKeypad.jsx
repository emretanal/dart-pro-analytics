const TARGETS = ['20', '19', '18', '17', '16', '15', 'Bull'];

export default function InputKeypad({ onHit, onNextTurn, dartsThrown }) {
  return (
    <div className="keypad-container">
      <div className="target-grid">
        {TARGETS.map((target) => (
          <button
            key={target}
            className="btn btn-target"
            onClick={() => onHit(target)}
            disabled={dartsThrown >= 3}
          >
            {target}
          </button>
        ))}
      </div>
      <button 
        className="btn btn-next-turn" 
        onClick={onNextTurn}
      >
        NEXT PLAYER ({dartsThrown}/3 Darts) ➔
      </button>
    </div>
  );
}
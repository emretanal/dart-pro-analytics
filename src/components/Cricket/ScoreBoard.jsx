const CRICKET_TARGETS = ['20', '19', '18', '17', '16', '15', 'Bull'];

// Mark gösterim haritası: 0: ○, 1: /, 2: X, 3+: ⭕
const MARK_SYMBOLS = ['○', '/', 'X', '⭕'];

export default function ScoreBoard({ players, activePlayerIndex, scores }) {
  const getSymbol = (marks = 0) => {
    if (marks >= 3) return MARK_SYMBOLS[3];
    return MARK_SYMBOLS[marks] || MARK_SYMBOLS[0];
  };

  return (
    <div className="scoreboard-container">
      <table className="cricket-table">
        <thead>
          <tr>
            <th>Sayı</th>
            {players.map((p, idx) => (
              <th 
                key={idx} 
                className={idx === activePlayerIndex ? 'active-column-header' : ''}
              >
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CRICKET_TARGETS.map((target) => (
            <tr key={target}>
              <td className="target-cell">{target}</td>
              {players.map((_, pIdx) => {
                const marks = scores[pIdx]?.[target] || 0;
                return (
                  <td 
                    key={pIdx} 
                    className={`mark-cell ${pIdx === activePlayerIndex ? 'active-column' : ''}`}
                  >
                    <span className={`mark mark-${marks > 3 ? 3 : marks}`}>
                      {getSymbol(marks)}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="score-row">
            <td className="target-cell">Puan</td>
            {players.map((_, pIdx) => (
              <td 
                key={pIdx} 
                className={`score-cell ${pIdx === activePlayerIndex ? 'active-column' : ''}`}
              >
                0
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
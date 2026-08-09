import { useState } from 'react';
import PlayerCountStep from './components/Setup/PlayerCountStep';
import PlayerNamesStep from './components/Setup/PlayerNamesStep';
import GameSelectStep from './components/Setup/GameSelectStep';
import LegTargetStep from './components/Setup/LegTargetStep';
import './App.css';

const DEFAULT_CRICKET_TARGETS = [
  { id: '20', display: '20', points: 20 },
  { id: '19', display: '19', points: 19 },
  { id: '18', display: '18', points: 18 },
  { id: '17', display: '17', points: 17 },
  { id: '16', display: '16', points: 16 },
  { id: '15', display: '15', points: 15 },
  { id: 'Bull', display: 'B', points: 25 },
];

const EXTENDED_CRICKET_TARGETS = [
  { id: '20', display: '20', points: 20 },
  { id: '19', display: '19', points: 19 },
  { id: '18', display: '18', points: 18 },
  { id: '17', display: '17', points: 17 },
  { id: '16', display: '16', points: 16 },
  { id: '15', display: '15', points: 15 },
  { id: '14', display: '14', points: 14 },
  { id: '13', display: '13', points: 13 },
  { id: '12', display: '12', points: 12 },
  { id: '11', display: '11', points: 11 },
  { id: '10', display: '10', points: 10 },
  { id: 'Bull', display: 'B', points: 25 },
  { id: 'Triple', display: 'T', points: 30 },
  { id: 'Double', display: 'D', points: 20 },
  { id: 'House', display: 'H', points: 15 },
];

const MARK_SYMBOLS = ['', '/', 'X', '⭕'];

const IMPOSSIBLE_X01_SCORES = [163, 166, 169, 172, 173, 175, 176, 178, 179];

export default function App() {
  const [step, setStep] = useState(1);
  const [playerCount, setPlayerCount] = useState(1);
  const [players, setPlayers] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null); 
  const [gameMode, setGameMode] = useState('standard'); 
  const [targetLegs, setTargetLegs] = useState(3);
  const [winner, setWinner] = useState(null);

  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [currentTargets, setCurrentTargets] = useState(DEFAULT_CRICKET_TARGETS);
  
  const [scores, setScores] = useState({});
  const [penaltyPoints, setPenaltyPoints] = useState({});
  const [turnDartsCount, setTurnDartsCount] = useState(0);

  const [x01Scores, setX01Scores] = useState({});
  const [numpadInput, setNumpadInput] = useState('');

  const [roundsWon, setRoundsWon] = useState({});
  const [playerRoundsCount, setPlayerRoundsCount] = useState({});
  const [gameHistory, setGameHistory] = useState([]);

  const getTargetsForMode = (mode) => {
    if (mode === 'extended') return EXTENDED_CRICKET_TARGETS;
    if (mode === 'wildcard') return generateWildcardTargets();
    return DEFAULT_CRICKET_TARGETS;
  };

  const generateWildcardTargets = () => {
    const allNumbers = Array.from({ length: 20 }, (_, i) => (i + 1).toString());
    const shuffled = [...allNumbers].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6).sort((a, b) => parseInt(b) - parseInt(a));
    
    const targets = selected.map(num => ({
      id: num,
      display: num,
      points: parseInt(num)
    }));

    targets.push({ id: 'Bull', display: 'B', points: 25 });
    return targets;
  };

  const handlePlayerCountSelect = (count) => {
    setPlayerCount(count);
    setStep(2);
  };

  const handlePlayerNamesSubmit = (namesList) => {
    setPlayers(namesList);
    setStep(3);
  };

  const handleGameSelect = (gameId, mode = 'standard') => {
    setSelectedGame(gameId);
    setGameMode(mode);
    setStep(4);
  };

  const handleLegTargetSelect = (legs) => {
    setTargetLegs(legs);
    resetBoard(players, selectedGame, gameMode);
    setStep(5);
  };

  const resetBoard = (playerList, gameType = selectedGame, mode = gameMode) => {
    const initialRounds = {};
    const initialPlayerRounds = {};
    const initialScores = {};
    const initialPenalties = {};
    const initialX01 = {};

    const startScore = parseInt(mode) || 501;

    playerList.forEach((_, idx) => {
      initialRounds[idx] = 0;
      initialPlayerRounds[idx] = 0;
      initialPenalties[idx] = 0;
      initialX01[idx] = startScore;

      initialScores[idx] = {};
      const activeTargets = getTargetsForMode(mode);
      activeTargets.forEach(target => {
        initialScores[idx][target.id] = 0;
      });
    });

    if (gameType === 'cricket') {
      setCurrentTargets(getTargetsForMode(mode));
    }

    setScores(initialScores);
    setPenaltyPoints(initialPenalties);
    setX01Scores(initialX01);
    setRoundsWon(initialRounds);
    setPlayerRoundsCount(initialPlayerRounds);
    setActivePlayerIndex(0);
    setTurnDartsCount(0);
    setNumpadInput('');
    setWinner(null);
    setGameHistory([]);
  };

  const startNextLeg = (winnerIdx) => {
    const newWonCount = (roundsWon[winnerIdx] || 0) + 1;
    const updatedRoundsWon = {
      ...roundsWon,
      [winnerIdx]: newWonCount,
    };

    setRoundsWon(updatedRoundsWon);

    if (newWonCount >= targetLegs) {
      setWinner(players[winnerIdx]);
      return;
    }

    const startScore = parseInt(gameMode) || 501;
    const newScores = {};
    const newPlayerRounds = {};
    const newPenalties = {};
    const newX01 = {};

    const activeTargets = getTargetsForMode(gameMode);
    if (selectedGame === 'cricket') {
      setCurrentTargets(activeTargets);
    }

    players.forEach((_, idx) => {
      newScores[idx] = {};
      newPlayerRounds[idx] = 0;
      newPenalties[idx] = 0;
      newX01[idx] = startScore;
      activeTargets.forEach((target) => {
        newScores[idx][target.id] = 0;
      });
    });

    setScores(newScores);
    setPenaltyPoints(newPenalties);
    setX01Scores(newX01);
    setPlayerRoundsCount(newPlayerRounds);
    setActivePlayerIndex(0);
    setTurnDartsCount(0);
    setNumpadInput('');
    setGameHistory([]);
  };

  const saveStateToHistory = () => {
    setGameHistory((prevHistory) => [
      ...prevHistory,
      {
        scores: JSON.parse(JSON.stringify(scores)),
        x01Scores: { ...x01Scores },
        penaltyPoints: { ...penaltyPoints },
        playerRoundsCount: { ...playerRoundsCount },
        activePlayerIndex,
        turnDartsCount,
        currentTargets: [...currentTargets]
      },
    ]);
  };

  const handleCellClick = (playerIdx, targetId) => {
    if (playerIdx !== activePlayerIndex || winner) return;

    if (turnDartsCount >= 3) {
      alert("Bu turda 3 dart hakkınızı kullandınız! END TURN butonuna basarak sırayı devredin.");
      return;
    }

    saveStateToHistory();

    const targetObj = currentTargets.find(t => t.id === targetId);
    const currentMarks = scores[playerIdx]?.[targetId] || 0;
    const newMarks = currentMarks + 1;

    if (gameMode === 'cutthroat' && currentMarks >= 3) {
      const updatedPenalties = { ...penaltyPoints };
      players.forEach((_, pIdx) => {
        if (pIdx !== playerIdx) {
          const otherMarks = scores[pIdx]?.[targetId] || 0;
          if (otherMarks < 3) {
            updatedPenalties[pIdx] = (updatedPenalties[pIdx] || 0) + targetObj.points;
          }
        }
      });
      setPenaltyPoints(updatedPenalties);
    }

    const updatedPlayerScores = {
      ...scores[playerIdx],
      [targetId]: newMarks,
    };

    const updatedScores = {
      ...scores,
      [playerIdx]: updatedPlayerScores,
    };

    setScores(updatedScores);
    setTurnDartsCount((prev) => prev + 1);

    const hasClosedAll = currentTargets.every(
      (target) => (updatedPlayerScores[target.id] || 0) >= 3
    );

    if (hasClosedAll) {
      if (gameMode === 'cutthroat') {
        const myPenalties = penaltyPoints[playerIdx] || 0;
        const isLowestPenalty = players.every((_, pIdx) => (penaltyPoints[pIdx] || 0) >= myPenalties);

        if (isLowestPenalty) {
          setTimeout(() => startNextLeg(playerIdx), 50);
        }
      } else {
        setTimeout(() => startNextLeg(playerIdx), 50);
      }
    }
  };

  const handleNumpadPress = (val) => {
    if (val === 'DEL') {
      setNumpadInput((prev) => prev.slice(0, -1));
    } else if (val === 'ENTER') {
      submitX01Score();
    } else {
      if (numpadInput.length < 3) {
        setNumpadInput((prev) => prev + val);
      }
    }
  };

  const submitX01Score = () => {
    const enteredScore = parseInt(numpadInput) || 0;

    if (enteredScore > 180) {
      alert("Bir turda maksimum 180 puan atılabilir!");
      setNumpadInput('');
      return;
    }

    if (IMPOSSIBLE_X01_SCORES.includes(enteredScore)) {
      alert(`${enteredScore} skoru 3 dart ile atılması imkansız bir skordur! Lütfen doğru puanı girin.`);
      setNumpadInput('');
      return;
    }

    saveStateToHistory();

    const currentScore = x01Scores[activePlayerIndex];
    const remaining = currentScore - enteredScore;

    if (remaining < 0 || remaining === 1) {
      alert(`BUST! (${enteredScore} puan geçersiz. Skor değiştirilmedi)`);
    } else if (remaining === 0) {
      setX01Scores((prev) => ({ ...prev, [activePlayerIndex]: 0 }));
      setTimeout(() => startNextLeg(activePlayerIndex), 50);
      return;
    } else {
      setX01Scores((prev) => ({ ...prev, [activePlayerIndex]: remaining }));
    }

    setPlayerRoundsCount((prev) => ({
      ...prev,
      [activePlayerIndex]: (prev[activePlayerIndex] || 0) + 1,
    }));

    setActivePlayerIndex((prev) => (prev + 1) % players.length);
    setNumpadInput('');
  };

  const handleNextTurn = () => {
    if (winner) return;
    saveStateToHistory();

    setPlayerRoundsCount((prev) => ({
      ...prev,
      [activePlayerIndex]: (prev[activePlayerIndex] || 0) + 1,
    }));

    setActivePlayerIndex((prev) => (prev + 1) % players.length);
    setTurnDartsCount(0);
  };

  const handleUndo = () => {
    if (gameHistory.length === 0 || winner) return;

    const lastState = gameHistory[gameHistory.length - 1];

    setScores(lastState.scores);
    setX01Scores(lastState.x01Scores || {});
    setPenaltyPoints(lastState.penaltyPoints || {});
    setPlayerRoundsCount(lastState.playerRoundsCount);
    setActivePlayerIndex(lastState.activePlayerIndex);
    setTurnDartsCount(lastState.turnDartsCount);
    if (lastState.currentTargets) setCurrentTargets(lastState.currentTargets);
    setGameHistory((prev) => prev.slice(0, -1));
  };

  const handleResetGame = () => {
    if (window.confirm("Yeni oyun başlatmak istediğinize emin misiniz?")) {
      setStep(1);
      setPlayers([]);
      setScores({});
      setX01Scores({});
      setPenaltyPoints({});
      setRoundsWon({});
      setPlayerRoundsCount({});
      setWinner(null);
      setGameHistory([]);
    }
  };

  const getSymbol = (marks = 0) => {
    if (marks >= 3) return MARK_SYMBOLS[3];
    return MARK_SYMBOLS[marks] || MARK_SYMBOLS[0];
  };

  const getTotalDarts = (playerIdx) => {
    const completedRounds = playerRoundsCount[playerIdx] || 0;
    const currentTurnDarts = playerIdx === activePlayerIndex ? turnDartsCount : 0;
    return (completedRounds * 3) + currentTurnDarts;
  };

  const calculateMPR = (playerIdx) => {
    const totalDarts = getTotalDarts(playerIdx);
    if (totalDarts === 0) return '0.00';

    let totalMarks = 0;
    currentTargets.forEach((target) => {
      const markCount = scores[playerIdx]?.[target.id] || 0;
      totalMarks += Math.min(markCount, 3);
    });

    const mpr = (totalMarks / totalDarts) * 3;
    return mpr.toFixed(2);
  };

  const calculateX01Avg = (playerIdx) => {
    const rounds = playerRoundsCount[playerIdx] || 0;
    if (rounds === 0) return '0.0';
    const startScore = parseInt(gameMode) || 501;
    const currentScore = x01Scores[playerIdx] || startScore;
    const scored = startScore - currentScore;
    const avg = (scored / rounds);
    return avg.toFixed(1);
  };

  return (
    <div className="app-container">
      <main className="app-content">
        {step === 1 && <PlayerCountStep onSelect={handlePlayerCountSelect} />}
        {step === 2 && <PlayerNamesStep playerCount={playerCount} onSubmit={handlePlayerNamesSubmit} onBack={() => setStep(1)} />}
        {step === 3 && <GameSelectStep onSelect={handleGameSelect} onBack={() => setStep(2)} />}
        {step === 4 && <LegTargetStep onSelect={handleLegTargetSelect} onBack={() => setStep(3)} />}

        {/* OYUN EKRANI: CRICKET */}
        {step === 5 && selectedGame === 'cricket' && (
          <div className={`darts-score-theme ${gameMode === 'extended' ? 'compact-extended' : ''}`}>
            
            <div className="board-scroll-wrapper">
              <table className="cricket-board-table">
                <thead>
                  <tr className="header-row">
                    <th className="num-col">Target</th>
                    {players.map((name, idx) => (
                      <th 
                        key={idx} 
                        className={`player-col-header ${idx === activePlayerIndex ? 'active' : ''}`}
                      >
                        <div className="rounds-label">Rounds: {roundsWon[idx] || 0} / {targetLegs}</div>
                        <div className="p-name">{name}</div>
                        <div className="p-score">{roundsWon[idx] || 0}</div>
                        
                        <div className="analytics-box">
                          <div><span className="analytics-label">Darts:</span> {getTotalDarts(idx)}</div>
                          <div><span className="analytics-label">MPR:</span> {calculateMPR(idx)}</div>
                          
                          {gameMode === 'cutthroat' && (
                            <div className="penalty-box">
                              <span className="penalty-label">Ceza:</span> {penaltyPoints[idx] || 0}
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentTargets.map((target) => (
                    <tr key={target.id} className="target-row">
                      <td className="target-num-cell">{target.display}</td>
                      {players.map((_, pIdx) => (
                        <td key={pIdx} className="mark-cell-td">
                          <button
                            className={`board-mark-btn ${pIdx === activePlayerIndex ? 'active-turn' : ''}`}
                            onClick={() => handleCellClick(pIdx, target.id)}
                          >
                            {getSymbol(scores[pIdx]?.[target.id])}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="action-bar">
              <button className="btn-text" onClick={handleResetGame}>Exit</button>
              <button className="btn-next" onClick={handleNextTurn}>
                END TURN ({turnDartsCount}/3)
              </button>
              <button 
                className="btn-text" 
                onClick={handleUndo}
                style={{ opacity: gameHistory.length === 0 ? 0.3 : 1 }}
                disabled={gameHistory.length === 0}
              >
                Undo
              </button>
            </div>

          </div>
        )}

        {/* OYUN EKRANI: X01 */}
        {step === 5 && selectedGame === 'x01' && (
          <div className="darts-score-theme x01-theme">
            
            <div className="x01-header-grid" style={{ gridTemplateColumns: `repeat(${players.length}, 1fr)` }}>
              {players.map((name, idx) => (
                <div key={idx} className={`x01-player-card ${idx === activePlayerIndex ? 'active' : ''}`}>
                  <div className="rounds-label">Legs: {roundsWon[idx] || 0} / {targetLegs}</div>
                  <div className="p-name">{name}</div>
                  <div className="x01-big-score">{x01Scores[idx]}</div>
                  <div className="analytics-box">
                    <div><span className="analytics-label">3-Dart Avg:</span> {calculateX01Avg(idx)}</div>
                    <div><span className="analytics-label">Darts:</span> {(playerRoundsCount[idx] || 0) * 3}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="numpad-container">
              <div className="numpad-display">
                <span className="numpad-label">Girilen Skor:</span>
                <span className="numpad-value">{numpadInput || '0'}</span>
              </div>

              <div className="numpad-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'DEL', 0, 'ENTER'].map((btn) => (
                  <button
                    key={btn}
                    className={`numpad-btn ${btn === 'ENTER' ? 'btn-enter' : btn === 'DEL' ? 'btn-del' : ''}`}
                    onClick={() => handleNumpadPress(btn.toString())}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>

            <div className="action-bar">
              <button className="btn-text" onClick={handleResetGame}>Exit</button>
              <button 
                className="btn-text" 
                onClick={handleUndo}
                style={{ opacity: gameHistory.length === 0 ? 0.3 : 1 }}
                disabled={gameHistory.length === 0}
              >
                Undo
              </button>
            </div>

          </div>
        )}

        {winner && (
          <div className="winner-overlay">
            <div className="winner-modal">
              <div className="trophy-icon">🏆</div>
              <h1>TEBRİKLER!</h1>
              <h2 className="winner-name">{winner}</h2>
              <p className="winner-desc">{targetLegs} Leg galibiyeti alarak oyunu kazandı!</p>
              
              <button className="btn-setup-submit btn-large" onClick={handleResetGame}>
                Yeni Oyun Başlat
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
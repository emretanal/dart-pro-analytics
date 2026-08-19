import { useState, useEffect } from 'react';
import PlayerCountStep from './components/Setup/PlayerCountStep';
import PlayerNamesStep from './components/Setup/PlayerNamesStep';
import GameSelectStep from './components/Setup/GameSelectStep';
import LegTargetStep from './components/Setup/LegTargetStep';
import BullOffStep from './components/Setup/BullOffStep';
import HowToPlayModal from './components/Help/HowToPlayModal';
import SettingsModal from './components/Settings/SettingsModal';
import { getCheckoutSuggestion } from './utils/checkoutTable';
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

/* Puanın oyuncunun KENDİSİNE yazıldığı Cricket modları.
   Kapatılan bir hedefe atılan fazla isabetler, o hedefi henüz kapatmamış
   en az bir rakip varsa puan kazandırır; tüm rakipler kapattıysa hedef
   "ölür" ve puan getirmez. Kazanmak için tüm hedefleri kapatmak VE puanın
   rakiplerden düşük olmaması gerekir.
   - cutthroat: puan rakiplere yazılır, en DÜŞÜK puan kazanır (ayrı ele alınır)
   - no-score:  puan hiç tutulmaz, ilk kapatan kazanır */
const CRICKET_SCORING_MODES = ['standard', 'extended', 'wildcard'];

/* Üst çubukta gösterilen Cricket mod adları */
const CRICKET_MODE_LABELS = {
  standard: { tr: 'Standart', en: 'Standard' },
  extended: { tr: 'Extended', en: 'Extended' },
  cutthroat: { tr: 'Cezalı', en: 'Cut-Throat' },
  'no-score': { tr: 'No-Score', en: 'No-Score' },
  wildcard: { tr: 'Wild-Card', en: 'Wild-Card' },
};

const TRANSLATIONS = {
  tr: {
    targetCol: 'Hedef',
    historyLogs: 'Geçmiş',
    howToPlay: 'Nasıl Oynanır?',
    options: 'Seçenekler',
    noHistory: 'Henüz kaydedilmiş bir maç bulunmuyor.',
    clearLogs: 'Tüm Maç Geçmişini Temizle',
    clearLogsConfirm: 'Tüm maç geçmişini silmek istediğinize emin misiniz?',
    resetConfirm: 'Yeni oyun başlatmak istediğinize emin misiniz? Akıştaki maç sıfırlanacak.',
    turnLimitErr: 'Bu turda 3 dart hakkınızı kullandınız! TURU BİTİR butonuna basın.',
    close: '✕ Kapat',
    winner: 'Kazanan',
    congrats: 'TEBRİKLER!',
    wonText: 'Leg galibiyeti alarak oyunu kazandı!',
    newGame: 'Yeni Oyun Başlat',
    exit: 'Çıkış',
    endTurn: 'TURU BİTİR',
    undo: 'Geri Al',
    penalty: 'Ceza',
    points: 'Puan',
    legs: 'Leg',
    darts: 'Dart',
    rounds: 'Tur',
    checkoutRoute: 'Bitiş Rotası',
    welcomeTitle: 'DART PRO ANALYTICS',
    welcomeSub: 'Skor Takip & İstatistik Sistemi',
    doubleInErr: 'Double In kuralı aktif! Oyuna girmek için ilk vuruşunuzun Double olması gerekir.',
    doubleOutErr: 'Double Out kuralı aktif! Bitiş vuruşu Double olmak zorundadır.',
    turnCompleted: 'TUR TAMAMLANDI'
  },
  en: {
    targetCol: 'Target',
    historyLogs: 'History',
    howToPlay: 'How to Play?',
    options: 'Options',
    noHistory: 'No match logs recorded yet.',
    clearLogs: 'Clear All Match Logs',
    clearLogsConfirm: 'Are you sure you want to clear all match history?',
    resetConfirm: 'Are you sure you want to start a new game? Current match will be reset.',
    turnLimitErr: 'You used all 3 darts for this turn! Press END TURN.',
    close: '✕ Close',
    winner: 'Winner',
    congrats: 'CONGRATULATIONS!',
    wonText: 'Legs won to win the match!',
    newGame: 'Start New Game',
    exit: 'Exit',
    endTurn: 'END TURN',
    undo: 'Undo',
    penalty: 'Penalty',
    points: 'Points',
    legs: 'Legs',
    darts: 'Darts',
    rounds: 'Rounds',
    checkoutRoute: 'Checkout Route',
    welcomeTitle: 'DART PRO ANALYTICS',
    welcomeSub: 'Scorekeeper & Analytics',
    doubleInErr: 'Double In active! You must hit a double to start scoring.',
    doubleOutErr: 'Double Out active! You must finish on a double.',
    turnCompleted: 'TURN COMPLETED'
  }
};

export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('dart_lang') || 'tr');
  const t = TRANSLATIONS[lang];

  // Gece (varsayılan, siyah ağırlıklı) / Gündüz mod anahtarı
  const [theme, setTheme] = useState(() => localStorage.getItem('dart_theme') || 'dark');

  const [showSplash, setShowSplash] = useState(() => {
    const isMidGame = localStorage.getItem('dart_step') === '6';
    return !isMidGame;
  });

  const [step, setStep] = useState(() => parseInt(localStorage.getItem('dart_step')) || 1);
  const [selectedGame, setSelectedGame] = useState(() => localStorage.getItem('dart_selectedGame') || null);
  const [gameMode, setGameMode] = useState(() => localStorage.getItem('dart_gameMode') || 'standard');
  const [x01Rules, setX01Rules] = useState(() => {
    const saved = localStorage.getItem('dart_x01Rules');
    return saved ? JSON.parse(saved) : { doubleIn: false, doubleOut: true };
  });

  const [playerCount, setPlayerCount] = useState(() => parseInt(localStorage.getItem('dart_playerCount')) || 1);
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('dart_players');
    return saved ? JSON.parse(saved) : [];
  });
  const [targetLegs, setTargetLegs] = useState(() => parseInt(localStorage.getItem('dart_targetLegs')) || 3);
  const [winner, setWinner] = useState(() => localStorage.getItem('dart_winner') || null);

  const [bullOffOrder, setBullOffOrder] = useState(() => {
    const saved = localStorage.getItem('dart_bullOffOrder');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentLegNumber, setCurrentLegNumber] = useState(() => parseInt(localStorage.getItem('dart_currentLegNumber')) || 1);

  const [activePlayerIndex, setActivePlayerIndex] = useState(() => parseInt(localStorage.getItem('dart_activePlayerIndex')) || 0);
  const [currentTargets, setCurrentTargets] = useState(() => {
    const saved = localStorage.getItem('dart_currentTargets');
    return saved ? JSON.parse(saved) : DEFAULT_CRICKET_TARGETS;
  });

  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('dart_scores');
    return saved ? JSON.parse(saved) : {};
  });
  const [penaltyPoints, setPenaltyPoints] = useState(() => {
    const saved = localStorage.getItem('dart_penaltyPoints');
    return saved ? JSON.parse(saved) : {};
  });
  // Puan toplayan Cricket modlarında (Standart / Extended / Wild-Card)
  // oyuncunun kendi topladığı puan. Cezalı modda kullanılmaz.
  const [cricketPoints, setCricketPoints] = useState(() => {
    const saved = localStorage.getItem('dart_cricketPoints');
    return saved ? JSON.parse(saved) : {};
  });
  const [penaltyToast, setPenaltyToast] = useState(null);

  const [turnDartsCount, setTurnDartsCount] = useState(() => parseInt(localStorage.getItem('dart_turnDartsCount')) || 0);
  const [multiplier, setMultiplier] = useState('single');

  const [x01Scores, setX01Scores] = useState(() => {
    const saved = localStorage.getItem('dart_x01Scores');
    return saved ? JSON.parse(saved) : {};
  });
  const [x01InStatus, setX01InStatus] = useState(() => {
    const saved = localStorage.getItem('dart_x01InStatus');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentTurnDarts, setCurrentTurnDarts] = useState([]);
  const [isTurnFlashing, setIsTurnFlashing] = useState(false);
  const [showBustOverlay, setShowBustOverlay] = useState(false);
  const [showCricketSummaryOverlay, setShowCricketSummaryOverlay] = useState(false);

  const [roundsWon, setRoundsWon] = useState(() => {
    const saved = localStorage.getItem('dart_roundsWon');
    return saved ? JSON.parse(saved) : {};
  });
  const [playerRoundsCount, setPlayerRoundsCount] = useState(() => {
    const saved = localStorage.getItem('dart_playerRoundsCount');
    return saved ? JSON.parse(saved) : {};
  });
  const [gameHistory, setGameHistory] = useState(() => {
    const saved = localStorage.getItem('dart_gameHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [matchLogs, setMatchLogs] = useState(() => {
    const saved = localStorage.getItem('dart_match_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Oyun seçim ekranının (adım 1) kendi iç alt-adımı: App'in "step" state'i
  // sadece 1'den 2'ye geçtiğinde GameSelectStep unmount olur; "Geri" ile adım
  // 1'e dönüldüğünde bu state'ler burada tutulduğu için sıfırlanmadan kalır.
  const [gameSelectSubStep, setGameSelectSubStep] = useState('main');
  const [x01ModeDraft, setX01ModeDraft] = useState('501');
  const [x01RulesDraft, setX01RulesDraft] = useState({ doubleIn: false, doubleOut: true });

  // Splash Screen süresi yarıya (1500ms) düşürüldü
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  // <html lang> özniteliğini arayüz diliyle eşitle: Türkçe'de büyük harfe
  // çevirme (örn. "i" -> "İ") ve tireleme bu değere göre doğru çalışır.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('dart_lang', lang);
    localStorage.setItem('dart_theme', theme);
    localStorage.setItem('dart_step', step);
    localStorage.setItem('dart_playerCount', playerCount);
    localStorage.setItem('dart_players', JSON.stringify(players));
    if (selectedGame) localStorage.setItem('dart_selectedGame', selectedGame);
    localStorage.setItem('dart_gameMode', gameMode);
    localStorage.setItem('dart_x01Rules', JSON.stringify(x01Rules));
    localStorage.setItem('dart_targetLegs', targetLegs);
    if (winner) localStorage.setItem('dart_winner', winner); else localStorage.removeItem('dart_winner');
    localStorage.setItem('dart_activePlayerIndex', activePlayerIndex);
    localStorage.setItem('dart_bullOffOrder', JSON.stringify(bullOffOrder));
    localStorage.setItem('dart_currentLegNumber', currentLegNumber);
    localStorage.setItem('dart_currentTargets', JSON.stringify(currentTargets));
    localStorage.setItem('dart_scores', JSON.stringify(scores));
    localStorage.setItem('dart_penaltyPoints', JSON.stringify(penaltyPoints));
    localStorage.setItem('dart_cricketPoints', JSON.stringify(cricketPoints));
    localStorage.setItem('dart_turnDartsCount', turnDartsCount);
    localStorage.setItem('dart_x01Scores', JSON.stringify(x01Scores));
    localStorage.setItem('dart_x01InStatus', JSON.stringify(x01InStatus));
    localStorage.setItem('dart_roundsWon', JSON.stringify(roundsWon));
    localStorage.setItem('dart_playerRoundsCount', JSON.stringify(playerRoundsCount));
    localStorage.setItem('dart_gameHistory', JSON.stringify(gameHistory));
    localStorage.setItem('dart_match_logs', JSON.stringify(matchLogs));
  }, [
    lang, theme, step, playerCount, players, selectedGame, gameMode, x01Rules, targetLegs, winner,
    activePlayerIndex, bullOffOrder, currentLegNumber, currentTargets, scores, penaltyPoints, cricketPoints, turnDartsCount,
    x01Scores, x01InStatus, roundsWon, playerRoundsCount, gameHistory, matchLogs
  ]);

  const saveMatchToLogs = (winnerName, finalRoundsWon) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')} - ${now.toLocaleTimeString(lang === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`;

    let gameTypeLabel = selectedGame === 'cricket' ? `Cricket (${gameMode})` : `X01 (${gameMode})`;
    if (selectedGame === 'x01') {
      const rulesStr = [x01Rules.doubleIn ? 'DI' : 'SI', x01Rules.doubleOut ? 'DO' : 'SO'].join('/');
      gameTypeLabel += ` [${rulesStr}]`;
    }

    const playerStats = players.map((name, idx) => ({
      name,
      roundsWon: finalRoundsWon[idx] || 0,
      dartsThrown: getTotalDarts(idx),
      statLabel: selectedGame === 'cricket' ? 'MPR' : 'Avg',
      statValue: selectedGame === 'cricket' ? calculateMPR(idx) : calculateX01Avg(idx),
      // Cricket modlarında son leg'in puanı (Cezalı'da ceza puanı)
      cricketScore:
        selectedGame !== 'cricket'
          ? null
          : gameMode === 'cutthroat'
            ? penaltyPoints[idx] || 0
            : CRICKET_SCORING_MODES.includes(gameMode)
              ? cricketPoints[idx] || 0
              : null,
    }));

    const newMatchRecord = {
      id: Date.now(),
      date: formattedDate,
      gameType: gameTypeLabel,
      targetLegs,
      winner: winnerName,
      playerStats
    };

    setMatchLogs((prev) => [newMatchRecord, ...prev]);
  };

  const getTargetsForMode = (mode) => {
    if (mode === 'extended') return EXTENDED_CRICKET_TARGETS;
    if (mode === 'wildcard') return generateWildcardTargets();
    return DEFAULT_CRICKET_TARGETS;
  };

  const generateWildcardTargets = () => {
    const allNumbers = Array.from({ length: 20 }, (_, i) => (i + 1).toString());
    const shuffled = [...allNumbers].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6).sort((a, b) => parseInt(b) - parseInt(a));
    const targets = selected.map(num => ({ id: num, display: num, points: parseInt(num) }));
    targets.push({ id: 'Bull', display: 'B', points: 25 });
    return targets;
  };

  const handleGameSelect = (gameId, mode = 'standard', options = { doubleIn: false, doubleOut: true }) => {
    setSelectedGame(gameId);
    setGameMode(mode);
    setX01Rules(options);
    setStep(2);
  };

  const handlePlayerCountSelect = (count) => {
    setPlayerCount(count);
    setStep(3);
  };

  const handlePlayerNamesSubmit = (namesList) => {
    setPlayers(namesList);
    setStep(4);
  };

  const handleLegTargetSelect = (legs) => {
    setTargetLegs(legs);
    setStep(5);
  };

  const handleBullOffComplete = (orderedIndices) => {
    const reorderedPlayers = orderedIndices.map((idx) => players[idx]);
    setPlayers(reorderedPlayers);

    const newOrderIndices = reorderedPlayers.map((_, i) => i);
    setBullOffOrder(newOrderIndices);
    setCurrentLegNumber(1);

    resetBoard(reorderedPlayers, selectedGame, gameMode, 0);
    setStep(6);
  };

  const resetBoard = (playerList, gameType = selectedGame, mode = gameMode, starterPlayerIdx = 0) => {
    const initialRounds = {};
    const initialPlayerRounds = {};
    const initialScores = {};
    const initialPenalties = {};
    const initialX01 = {};
    const initialInStatus = {};
    const startScore = parseInt(mode) || 501;

    playerList.forEach((_, idx) => {
      initialRounds[idx] = 0;
      initialPlayerRounds[idx] = 0;
      initialPenalties[idx] = 0;
      initialX01[idx] = startScore;
      initialInStatus[idx] = !x01Rules.doubleIn;
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
    setCricketPoints(initialPenalties);
    setX01Scores(initialX01);
    setX01InStatus(initialInStatus);
    setRoundsWon(initialRounds);
    setPlayerRoundsCount(initialPlayerRounds);
    setActivePlayerIndex(starterPlayerIdx);
    setTurnDartsCount(0);
    setMultiplier('single');
    setCurrentTurnDarts([]);
    setIsTurnFlashing(false);
    setShowBustOverlay(false);
    setShowCricketSummaryOverlay(false);
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
      const winnerName = players[winnerIdx];
      setWinner(winnerName);
      saveMatchToLogs(winnerName, updatedRoundsWon);
      return;
    }

    const nextLegNum = currentLegNumber + 1;
    setCurrentLegNumber(nextLegNum);

    const nextStarterIdx = (nextLegNum - 1) % players.length;

    const startScore = parseInt(gameMode) || 501;
    const newScores = {};
    const newPlayerRounds = {};
    const newPenalties = {};
    const newX01 = {};
    const newInStatus = {};

    const activeTargets = getTargetsForMode(gameMode);
    if (selectedGame === 'cricket') {
      setCurrentTargets(activeTargets);
    }

    players.forEach((_, idx) => {
      newScores[idx] = {};
      newPlayerRounds[idx] = 0;
      newPenalties[idx] = 0;
      newX01[idx] = startScore;
      newInStatus[idx] = !x01Rules.doubleIn;
      activeTargets.forEach((target) => {
        newScores[idx][target.id] = 0;
      });
    });

    setScores(newScores);
    setPenaltyPoints(newPenalties);
    setCricketPoints({ ...newPenalties });
    setX01Scores(newX01);
    setX01InStatus(newInStatus);
    setPlayerRoundsCount(newPlayerRounds);
    setActivePlayerIndex(nextStarterIdx);
    setTurnDartsCount(0);
    setMultiplier('single');
    setCurrentTurnDarts([]);
    setIsTurnFlashing(false);
    setShowBustOverlay(false);
    setShowCricketSummaryOverlay(false);
    setGameHistory([]);
  };

  const saveStateToHistory = () => {
    setGameHistory((prevHistory) => [
      ...prevHistory,
      {
        scores: JSON.parse(JSON.stringify(scores)),
        x01Scores: { ...x01Scores },
        x01InStatus: { ...x01InStatus },
        penaltyPoints: { ...penaltyPoints },
        cricketPoints: { ...cricketPoints },
        playerRoundsCount: { ...playerRoundsCount },
        activePlayerIndex,
        turnDartsCount,
        currentTurnDarts: [...currentTurnDarts],
        currentTargets: [...currentTargets]
      },
    ]);
  };

  const handleCellClick = (playerIdx, targetId) => {
    if (playerIdx !== activePlayerIndex || winner || isTurnFlashing || showBustOverlay || showCricketSummaryOverlay) return;

    if (turnDartsCount >= 3) {
      return;
    }

    saveStateToHistory();

    const targetObj = currentTargets.find(t => t.id === targetId);
    const currentMarks = scores[playerIdx]?.[targetId] || 0;

    let addedMarks = 1;
    if (multiplier === 'double') addedMarks = 2;
    if (multiplier === 'triple') addedMarks = 3;

    if (targetId === 'Bull' && multiplier === 'triple') {
      addedMarks = 2;
    }

    let hitLabel = targetObj.display;
    if (multiplier === 'double') hitLabel = `D${targetObj.display}`;
    if (multiplier === 'triple') hitLabel = `T${targetObj.display}`;
    if (targetId === 'Bull') {
      if (multiplier === 'double' || multiplier === 'triple') hitLabel = 'D-BULL';
      else hitLabel = 'BULL';
    }

    const newTurnDarts = [...currentTurnDarts, { label: hitLabel }];
    setCurrentTurnDarts(newTurnDarts);

    const newMarks = currentMarks + addedMarks;

    // Kapatma sonrası fazla isabetler. extraMarks = 3'ü aşan isabet sayısı.
    const extraMarks = newMarks > 3 ? Math.min(addedMarks, newMarks - 3) : 0;
    const gainAmount = targetObj.points * extraMarks;

    // Hedefi henüz kapatmamış rakipler (hedef "ölü" mü değil mi).
    const openOpponents = players
      .map((_, pIdx) => pIdx)
      .filter((pIdx) => pIdx !== playerIdx && (scores[pIdx]?.[targetId] || 0) < 3);

    // Tek kişilik oyunda rakip yoktur; alıştırma amacıyla puan yine yazılır.
    const isSoloPlay = players.length === 1;

    let updatedPenalties = penaltyPoints;
    let updatedCricketPoints = cricketPoints;

    if (gameMode === 'cutthroat' && extraMarks > 0) {
      // CEZALI: puan, hedefi kapatmamış TÜM rakiplere yazılır.
      updatedPenalties = { ...penaltyPoints };
      openOpponents.forEach((pIdx) => {
        updatedPenalties[pIdx] = (updatedPenalties[pIdx] || 0) + gainAmount;
      });

      if (openOpponents.length > 0 && gainAmount > 0) {
        setPenaltyToast(`+${gainAmount} ${t.penalty.toUpperCase()}!`);
        setTimeout(() => {
          setPenaltyToast(null);
        }, 500);
      }

      setPenaltyPoints(updatedPenalties);
    } else if (CRICKET_SCORING_MODES.includes(gameMode) && extraMarks > 0) {
      // STANDART / EXTENDED / WILD-CARD: puan oyuncunun KENDİSİNE yazılır,
      // ancak hedefi kapatmamış en az bir rakip varsa (yoksa hedef ölüdür).
      if ((openOpponents.length > 0 || isSoloPlay) && gainAmount > 0) {
        updatedCricketPoints = {
          ...cricketPoints,
          [playerIdx]: (cricketPoints[playerIdx] || 0) + gainAmount,
        };
        setCricketPoints(updatedCricketPoints);

        setPenaltyToast(`+${gainAmount} ${t.points.toUpperCase()}!`);
        setTimeout(() => {
          setPenaltyToast(null);
        }, 500);
      }
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
    const newDartsCount = turnDartsCount + 1;
    setTurnDartsCount(newDartsCount);
    setMultiplier('single');

    const hasClosedAll = currentTargets.every(
      (target) => (updatedPlayerScores[target.id] || 0) >= 3
    );

    if (hasClosedAll) {
      let isLegWon = true;
      if (gameMode === 'cutthroat') {
        // Cezalı: en DÜŞÜK puan kazanır.
        // NOT: burada güncel (updatedPenalties) değerler kullanılmalı; state
        // henüz yazılmadığı için penaltyPoints bu atışı içermez.
        const myPenalties = updatedPenalties[playerIdx] || 0;
        isLegWon = players.every((_, pIdx) => (updatedPenalties[pIdx] || 0) >= myPenalties);
      } else if (CRICKET_SCORING_MODES.includes(gameMode)) {
        // Standart / Extended / Wild-Card: en YÜKSEK puan kazanır.
        // Tüm hedefleri kapatmak tek başına yetmez; puan da geride olmamalı.
        const myPoints = updatedCricketPoints[playerIdx] || 0;
        isLegWon = players.every((_, pIdx) => (updatedCricketPoints[pIdx] || 0) <= myPoints);
      }

      if (isLegWon) {
        setTimeout(() => startNextLeg(playerIdx), 50);
        return;
      }
    }

    if (newDartsCount === 3) {
      setShowCricketSummaryOverlay(true);
      setIsTurnFlashing(true);

      setTimeout(() => {
        setShowCricketSummaryOverlay(false);
        setIsTurnFlashing(false);
        handleNextTurn();
      }, 3000);
    }
  };

  const handleX01DartHit = (baseValue) => {
    if (winner || isTurnFlashing || showBustOverlay || showCricketSummaryOverlay) return;

    if (currentTurnDarts.length >= 3) {
      return;
    }

    saveStateToHistory();

    let isDouble = multiplier === 'double';
    let isTriple = multiplier === 'triple';
    let points = baseValue;
    let label = baseValue.toString();

    if (baseValue === 25) {
      if (isDouble || isTriple) {
        points = 50;
        label = 'D-BULL';
        isDouble = true;
      } else {
        points = 25;
        label = 'BULL';
      }
    } else if (baseValue === 0) {
      points = 0;
      label = 'MISS';
      isDouble = false;
      isTriple = false;
    } else {
      if (isDouble) {
        points = baseValue * 2;
        label = `D${baseValue}`;
      } else if (isTriple) {
        points = baseValue * 3;
        label = `T${baseValue}`;
      }
    }

    const isIn = x01InStatus[activePlayerIndex];
    if (x01Rules.doubleIn && !isIn) {
      if (!isDouble) {
        alert(t.doubleInErr);
        setMultiplier('single');
        return;
      } else {
        setX01InStatus((prev) => ({ ...prev, [activePlayerIndex]: true }));
      }
    }

    const currentScore = x01Scores[activePlayerIndex];
    const remaining = currentScore - points;

    const turnStartScore = currentScore + currentTurnDarts.reduce((sum, d) => sum + d.points, 0);

    const isBust = remaining < 0 ||
                   (x01Rules.doubleOut && remaining === 1) ||
                   (x01Rules.doubleOut && remaining === 0 && !isDouble);

    if (isBust) {
      setX01Scores((prev) => ({ ...prev, [activePlayerIndex]: turnStartScore }));
      setCurrentTurnDarts((prev) => [...prev, { label: `${label} (BUST)`, points: 0 }]);
      setMultiplier('single');

      setShowBustOverlay(true);
      setIsTurnFlashing(true);

      setTimeout(() => {
        setShowBustOverlay(false);
        setIsTurnFlashing(false);
        handleNextTurn();
      }, 3000);
      return;
    }

    setX01Scores((prev) => ({ ...prev, [activePlayerIndex]: remaining }));
    const newTurnDarts = [...currentTurnDarts, { label, points }];
    setCurrentTurnDarts(newTurnDarts);
    setMultiplier('single');

    if (remaining === 0) {
      setTimeout(() => startNextLeg(activePlayerIndex), 100);
      return;
    }

    if (newTurnDarts.length === 3) {
      setIsTurnFlashing(true);
      setTimeout(() => {
        setIsTurnFlashing(false);
        handleNextTurn();
      }, 3000);
    }
  };

  const toggleMultiplier = (type) => {
    if (multiplier === type) {
      setMultiplier('single');
    } else {
      setMultiplier(type);
    }
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
    setCurrentTurnDarts([]);
    setMultiplier('single');
    setIsTurnFlashing(false);
    setShowBustOverlay(false);
    setShowCricketSummaryOverlay(false);
  };

  const handleUndo = () => {
    if (gameHistory.length === 0 || winner || isTurnFlashing || showBustOverlay || showCricketSummaryOverlay) return;

    const lastState = gameHistory[gameHistory.length - 1];

    setScores(lastState.scores);
    setX01Scores(lastState.x01Scores || {});
    setX01InStatus(lastState.x01InStatus || {});
    setPenaltyPoints(lastState.penaltyPoints || {});
    setCricketPoints(lastState.cricketPoints || {});
    setPlayerRoundsCount(lastState.playerRoundsCount);
    setActivePlayerIndex(lastState.activePlayerIndex);
    setTurnDartsCount(lastState.turnDartsCount);
    setCurrentTurnDarts(lastState.currentTurnDarts || []);
    if (lastState.currentTargets) setCurrentTargets(lastState.currentTargets);
    setGameHistory((prev) => prev.slice(0, -1));
    setMultiplier('single');
    setIsTurnFlashing(false);
    setShowBustOverlay(false);
    setShowCricketSummaryOverlay(false);
  };

  const handleResetGame = () => {
    if (window.confirm(t.resetConfirm)) {
      setStep(1);
      setPlayers([]);
      setSelectedGame(null);
      setGameMode('standard');
      setScores({});
      setX01Scores({});
      setX01InStatus({});
      setPenaltyPoints({});
    setCricketPoints({});
      setRoundsWon({});
      setPlayerRoundsCount({});
      setWinner(null);
      setGameHistory([]);
      setGameSelectSubStep('main');
      setX01ModeDraft('501');
      setX01RulesDraft({ doubleIn: false, doubleOut: true });
    }
  };

  const handleExitToGameSelect = () => {
    setStep(1);
    setPlayers([]);
    setSelectedGame(null);
    setGameMode('standard');
    setScores({});
    setX01Scores({});
    setX01InStatus({});
    setPenaltyPoints({});
    setCricketPoints({});
    setRoundsWon({});
    setPlayerRoundsCount({});
    setWinner(null);
    setGameHistory([]);
    setGameSelectSubStep('main');
    setX01ModeDraft('501');
    setX01RulesDraft({ doubleIn: false, doubleOut: true });
  };

  const clearAllMatchLogs = () => {
    if (window.confirm(t.clearLogsConfirm)) {
      setMatchLogs([]);
      localStorage.removeItem('dart_match_logs');
    }
  };

  const getSymbol = (marks = 0) => {
    if (marks >= 3) return MARK_SYMBOLS[3];
    return MARK_SYMBOLS[marks] || MARK_SYMBOLS[0];
  };

  const getTotalDarts = (playerIdx) => {
    const completedRounds = playerRoundsCount[playerIdx] || 0;
    const currentTurnDartsCount = playerIdx === activePlayerIndex ? currentTurnDarts.length : 0;
    return (completedRounds * 3) + currentTurnDartsCount;
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

  const renderCheckoutRoute = (routeString) => {
    if (!routeString) return null;
    const parts = routeString.split(' ');
    return parts.map((part, idx) => {
      if (part === 'BULL') {
        return (
          <span key={idx} className="checkout-part-bull">
            {part}{' '}
          </span>
        );
      }
      if (part === 'D-BULL') {
        return (
          <span key={idx} className="checkout-part-dbull">
            {part}{' '}
          </span>
        );
      }
      return <span key={idx}>{part} </span>;
    });
  };

  const dartsLeftInTurn = 3 - currentTurnDarts.length;
  const currentActiveRemaining = x01Scores[activePlayerIndex];
  const checkoutSuggestion = getCheckoutSuggestion(currentActiveRemaining, dartsLeftInTurn);

  if (showSplash) {
    return (
      <div className="app-container setup-mode-container" data-theme={theme}>
        <div className="splash-screen">
          <div className="splash-content">
            <div className="splash-logo">🎯</div>
            <h1 className="splash-title">{t.welcomeTitle}</h1>
            <p className="splash-subtitle">{t.welcomeSub}</p>
            <div className="splash-loader"></div>
          </div>
        </div>
      </div>
    );
  }

  const x01NumbersList = [
    20, 19, 18, 17, 16,
    15, 14, 13, 12, 11,
    10, 9, 8, 7, 6,
    5, 4, 3, 2, 1
  ];

  const isSetupMode = step < 6;

  // Üst çubukta gösterilecek aktif oyun bilgisi (ana ekran dışındaki ekranlarda)
  const gameContextLabel =
    selectedGame === 'cricket'
      ? `🏏 Cricket · ${CRICKET_MODE_LABELS[gameMode]?.[lang] || gameMode}`
      : selectedGame === 'x01'
        ? `🔢 X01 · ${gameMode}`
        : '';

  return (
    <div className={`app-container ${isSetupMode ? 'setup-mode-container' : 'game-mode-container'}`} data-theme={theme}>
      {/* Üst çubuk:
          - Ana ekran (step 1): Seçenekler + Geçmiş + Rehber
          - Diğer tüm ekranlar: aktif oyun bilgisi + Rehber
          Böylece çubuk hiçbir zaman 3 öğeyi geçmez ve dar telefonlarda taşmaz. */}
      <div className="top-header-bar">
        {step === 1 ? (
          <>
            <div className="header-side">
              <button className="btn-header-action" onClick={() => setShowSettingsModal(true)}>
                ⚙️ <span className="btn-label-text">{t.options}</span>
              </button>
            </div>
            <div className="header-side">
              <button className="btn-header-action" onClick={() => setShowHistoryModal(true)}>
                📊 <span className="btn-label-text">{t.historyLogs}</span> ({matchLogs.length})
              </button>
              <button className="btn-header-action" onClick={() => setShowGuideModal(true)}>
                📖 <span className="btn-label-text">{t.howToPlay}</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="header-side">
              <span className="header-context-label">{gameContextLabel}</span>
            </div>
            <div className="header-side">
              <button className="btn-header-action" onClick={() => setShowGuideModal(true)}>
                📖 <span className="btn-label-text">{t.howToPlay}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Oyun ekranlarında dış katman kaydırılmamalı; yalnızca skor tablosunun
          kendi alanı kaydırılır, böylece alt aksiyon çubuğu hep görünür kalır. */}
      <main className={`app-content ${step === 6 ? 'is-game-screen' : ''}`}>
        {step === 1 && (
          <GameSelectStep
            onSelect={handleGameSelect}
            onBack={() => {}}
            isFirstStep={true}
            lang={lang}
            subStep={gameSelectSubStep}
            setSubStep={setGameSelectSubStep}
            selectedX01Mode={x01ModeDraft}
            setSelectedX01Mode={setX01ModeDraft}
            x01Rules={x01RulesDraft}
            setX01Rules={setX01RulesDraft}
          />
        )}
        {step === 2 && <PlayerCountStep onSelect={handlePlayerCountSelect} onBack={() => setStep(1)} lang={lang} />}
        {step === 3 && <PlayerNamesStep playerCount={playerCount} onSubmit={handlePlayerNamesSubmit} onBack={() => setStep(2)} lang={lang} />}
        {step === 4 && <LegTargetStep onSelect={handleLegTargetSelect} onBack={() => setStep(3)} lang={lang} />}
        {step === 5 && <BullOffStep players={players} onComplete={handleBullOffComplete} onBack={() => setStep(4)} lang={lang} />}

        {step === 6 && selectedGame === 'cricket' && (
          <div className={`darts-score-theme ${gameMode === 'extended' ? 'compact-extended' : ''}`}>
            <div className="board-scroll-wrapper">
              <table className="cricket-board-table">
                <thead>
                  <tr className="header-row">
                    <th className="num-col">{t.targetCol}</th>
                    {players.map((name, idx) => (
                      <th key={idx} className={`player-col-header ${idx === activePlayerIndex ? 'active' : ''}`}>
                        {/* İçerik ayrı bir kart içinde: <th> üzerinde border-radius
                            çalışmadığı için yuvarlak köşeler bu div'e uygulanıyor. */}
                        <div className="player-header-card">
                          <div className="rounds-label">{t.legs}: {roundsWon[idx] || 0} / {targetLegs}</div>
                          <div className="p-name">{name}</div>
                          {/* Büyük rakam moda göre anlamlı olan skoru gösterir:
                              puanlı modlarda toplanan puan, Cezalı'da ceza,
                              No-Score'da kazanılan leg sayısı. */}
                          <div className={`p-score ${gameMode === 'cutthroat' ? 'is-penalty' : ''}`}>
                            {gameMode === 'cutthroat'
                              ? penaltyPoints[idx] || 0
                              : CRICKET_SCORING_MODES.includes(gameMode)
                                ? cricketPoints[idx] || 0
                                : roundsWon[idx] || 0}
                          </div>
                          <div className="p-score-label">
                            {gameMode === 'cutthroat'
                              ? t.penalty
                              : CRICKET_SCORING_MODES.includes(gameMode)
                                ? t.points
                                : t.legs}
                          </div>
                          <div className="analytics-box">
                            <div><span className="analytics-label">{t.darts}:</span> {getTotalDarts(idx)}</div>
                            <div><span className="analytics-label">MPR:</span> {calculateMPR(idx)}</div>
                          </div>
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
                            disabled={isTurnFlashing || showCricketSummaryOverlay}
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

            {/* Çarpan butonları kendi satırında, ekranı ikiye bölecek şekilde.
                Önceden aksiyon çubuğunda 40x40px kalıyor ve zor basılıyordu. */}
            <div className="multiplier-row">
              <button
                className={`btn-mult ${multiplier === 'double' ? 'active-double' : ''}`}
                onClick={() => toggleMultiplier('double')}
                disabled={isTurnFlashing || showCricketSummaryOverlay}
              >
                DOUBLE (D)
              </button>
              <button
                className={`btn-mult ${multiplier === 'triple' ? 'active-triple' : ''}`}
                onClick={() => toggleMultiplier('triple')}
                disabled={isTurnFlashing || showCricketSummaryOverlay}
              >
                TRIPLE (T)
              </button>
            </div>

            <div className="action-bar cricket-action-bar">
              <button className="btn-text" onClick={handleResetGame}>{t.exit}</button>

              <button className="btn-next" onClick={handleNextTurn} disabled={isTurnFlashing || showCricketSummaryOverlay}>
                {t.endTurn} ({turnDartsCount}/3)
              </button>

              <button className="btn-text" onClick={handleUndo} style={{ opacity: gameHistory.length === 0 || isTurnFlashing || showCricketSummaryOverlay ? 0.3 : 1 }} disabled={gameHistory.length === 0 || isTurnFlashing || showCricketSummaryOverlay}>
                {t.undo}
              </button>
            </div>
          </div>
        )}

        {step === 6 && selectedGame === 'x01' && (
          <div className="darts-score-theme x01-theme">
            <div className="x01-header-grid" style={{ gridTemplateColumns: `repeat(${players.length}, 1fr)` }}>
              {players.map((name, idx) => (
                <div key={idx} className={`x01-player-card ${idx === activePlayerIndex ? 'active' : ''}`}>
                  <div className="rounds-label">
                    Legs: {roundsWon[idx] || 0} / {targetLegs}
                    {x01Rules.doubleIn && (
                      <span style={{ marginLeft: '4px', color: x01InStatus[idx] ? '#28a745' : '#ff5252' }}>
                        [{x01InStatus[idx] ? 'IN' : 'NEED D-IN'}]
                      </span>
                    )}
                  </div>
                  <div className="p-name">{name}</div>
                  <div className="x01-big-score">{x01Scores[idx]}</div>
                  <div className="analytics-box">
                    <div><span className="analytics-label">3-Dart Avg:</span> {calculateX01Avg(idx)}</div>
                    <div><span className="analytics-label">{t.darts}:</span> {getTotalDarts(idx)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`x01-turn-display ${isTurnFlashing ? 'flashing-turn' : ''}`}>
              <span className="turn-dart-item">{currentTurnDarts[0]?.label || '-'}</span>
              <span className="turn-dart-item">{currentTurnDarts[1]?.label || '-'}</span>
              <span className="turn-dart-item">{currentTurnDarts[2]?.label || '-'}</span>
              <span className="turn-total-sum">
                Total: {currentTurnDarts.reduce((a, b) => a + b.points, 0)}
              </span>
            </div>

            <div className="x01-keypad-container">
              <div className="x01-multiplier-row">
                <button 
                  className={`btn-x01-mult ${multiplier === 'double' ? 'active-double' : ''}`}
                  onClick={() => toggleMultiplier('double')}
                  disabled={isTurnFlashing || showBustOverlay}
                >
                  DOUBLE (D)
                </button>
                <button 
                  className={`btn-x01-mult ${multiplier === 'triple' ? 'active-triple' : ''}`}
                  onClick={() => toggleMultiplier('triple')}
                  disabled={isTurnFlashing || showBustOverlay}
                >
                  TRIPLE (T)
                </button>
              </div>

              <div className="x01-board-grid">
                {x01NumbersList.map((num) => (
                  <button
                    key={num}
                    className="x01-num-btn"
                    onClick={() => handleX01DartHit(num)}
                    disabled={isTurnFlashing || showBustOverlay}
                  >
                    {num}
                  </button>
                ))}
                <button className="x01-num-btn btn-bull" onClick={() => handleX01DartHit(25)} disabled={isTurnFlashing || showBustOverlay}>
                  BULL
                </button>
                <button className="x01-num-btn btn-miss" onClick={() => handleX01DartHit(0)} disabled={isTurnFlashing || showBustOverlay}>
                  MISS (0)
                </button>
              </div>

              {/* Bitiş rotası BULL/MISS'in altında ve alanı her zaman ayrılmış
                  durumda. Önceden skor kartlarının hemen altındaydı ve 170'in
                  altına inildiğinde aniden belirip tüm tuş takımını aşağı
                  kaydırıyordu; bu da yanlış tuşa basılmasına yol açıyordu. */}
              <div className={`checkout-badge-box ${checkoutSuggestion ? '' : 'is-empty'}`}>
                {checkoutSuggestion && (
                  <>
                    <span className="checkout-label">🎯 {t.checkoutRoute}:</span>
                    <span className="checkout-value">{renderCheckoutRoute(checkoutSuggestion)}</span>
                  </>
                )}
              </div>
            </div>

            <div className="action-bar">
              <button className="btn-text" onClick={handleResetGame}>{t.exit}</button>
              <button className="btn-next" onClick={handleNextTurn} disabled={isTurnFlashing || showBustOverlay}>
                {t.endTurn} ({currentTurnDarts.length}/3)
              </button>
              <button className="btn-text" onClick={handleUndo} style={{ opacity: gameHistory.length === 0 || isTurnFlashing || showBustOverlay ? 0.3 : 1 }} disabled={gameHistory.length === 0 || isTurnFlashing || showBustOverlay}>
                {t.undo}
              </button>
            </div>
          </div>
        )}

        {/* CRICKET SUMMARY OVERLAY */}
        {showCricketSummaryOverlay && (
          <div className="cricket-summary-overlay">
            <div className="cricket-summary-card">
              <div className="cricket-summary-player">🎯 {players[activePlayerIndex]}</div>
              <div className="cricket-summary-title">{t.turnCompleted}</div>
              <div className="cricket-summary-darts">
                <span className="cricket-summary-dart-item">{currentTurnDarts[0]?.label || '-'}</span>
                <span className="cricket-summary-dart-item">{currentTurnDarts[1]?.label || '-'}</span>
                <span className="cricket-summary-dart-item">{currentTurnDarts[2]?.label || '-'}</span>
              </div>
            </div>
          </div>
        )}

        {/* X01 BUST OVERLAY */}
        {showBustOverlay && (
          <div className="bust-overlay">
            <div className="bust-text">BUST!</div>
          </div>
        )}

        {/* PENALTY TOAST */}
        {penaltyToast && (
          <div className="penalty-toast-overlay">
            <div className="penalty-toast-card">
              🚨 {penaltyToast}
            </div>
          </div>
        )}

        {winner && (
          <div className="winner-overlay">
            <div className="winner-modal">
              <div className="trophy-icon">🏆</div>
              <h1>{t.congrats}</h1>
              <h2 className="winner-name">{winner}</h2>
              <p className="winner-desc">{targetLegs} {t.wonText}</p>
              
              <div className="winner-modal-actions">
                <button className="btn-setup-submit" onClick={handleResetGame}>
                  {t.newGame}
                </button>
                <button className="btn-setup-back" onClick={handleExitToGameSelect}>
                  {t.exit}
                </button>
              </div>
            </div>
          </div>
        )}

        {showHistoryModal && (
          <div className="winner-overlay">
            <div className="history-modal">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, color: 'var(--accent-color)', fontSize: '1.2rem' }}>📜 {t.historyLogs}</h2>
                <button className="btn-text" onClick={() => setShowHistoryModal(false)}>{t.close}</button>
              </div>

              {matchLogs.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', padding: '20px 0' }}>{t.noHistory}</p>
              ) : (
                <div className="history-list">
                  {matchLogs.map((log) => (
                    <div key={log.id} className="history-card">
                      <div className="history-card-header">
                        <span className="history-date">📅 {log.date}</span>
                        <span className="history-game">🎯 {log.gameType}</span>
                      </div>
                      <div className="history-winner">
                        🏆 {t.winner}: <strong>{log.winner}</strong> ({log.targetLegs} Leg)
                      </div>
                      <div className="history-players-grid">
                        {log.playerStats.map((p, idx) => (
                          <div key={idx} className={`history-p-item ${p.name === log.winner ? 'is-winner' : ''}`}>
                            <span className="hp-name">{p.name}</span>
                            <span className="hp-stat">{p.roundsWon} Leg | {p.statLabel}: {p.statValue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {matchLogs.length > 0 && (
                <button className="btn-del-logs" onClick={clearAllMatchLogs}>
                  {t.clearLogs}
                </button>
              )}
            </div>
          </div>
        )}

        {/* NASIL OYNANIR REHBERİ MODALI */}
        <HowToPlayModal
          isOpen={showGuideModal}
          onClose={() => setShowGuideModal(false)}
          lang={lang}
          gameContext={selectedGame}
          gameMode={gameMode}
          x01Rules={x01Rules}
        />

        {/* SEÇENEKLER (TEMA + DİL) MODALI */}
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          theme={theme}
          setTheme={setTheme}
          lang={lang}
          setLang={setLang}
        />

      </main>
    </div>
  );
}
import { useState, useEffect } from 'react';
import './HowToPlayModal.css';

/* ==========================================================================
   REHBER İÇERİĞİ
   - board / x01 / cricket: genel sekmeler (ana ekrandan açıldığında)
   - modes: her oyun moduna özel detaylı anlatım. Oyun içinden açıldığında
     yalnızca oynanan modun kartı gösterilir.
   ========================================================================== */

const GUIDE_CONTENT = {
  tr: {
    title: '📖 Nasıl Oynanır?',
    close: '✕ Kapat',
    tabs: [
      { id: 'board', label: '🎯 Tahtayı Tanı' },
      { id: 'x01', label: '🔢 X01' },
      { id: 'cricket', label: '🏏 Cricket' },
    ],
    sections: {
      goal: 'Amaç',
      how: 'Nasıl Oynanır',
      scoring: 'Puanlama',
      win: 'Kazanma Koşulu',
      tips: 'İpuçları',
    },
    board: {
      intro:
        'Dart tahtası 1-20 arasındaki 20 dilimden ve merkezdeki Bull bölgesinden oluşur. Her dilim; tekli, çiftli ve üçlü alanlara ayrılmıştır. Attığınız dartın hangi bölgeye girdiği puanınızı belirler.',
      items: [
        {
          title: 'Single (Tekli Alan)',
          desc: 'Dilimin geniş alanları. Sayının kendi değerini kazandırır. Örnek: 20 dilimine tekli isabet = 20 puan.',
          badge: 'x1',
        },
        {
          title: 'Double (Çiftli Halka - D)',
          desc: 'En dıştaki dar halka. Sayı değerini 2 ile çarpar. Örnek: D20 = 40 puan. X01 oyunlarında bitiş vuruşu genelde buraya yapılır.',
          badge: 'x2',
        },
        {
          title: 'Triple (Üçlü Halka - T)',
          desc: 'İçteki dar halka. Sayı değerini 3 ile çarpar. Örnek: T20 = 60 puan. Tahtadaki en yüksek tek atış değeri budur.',
          badge: 'x3',
        },
        {
          title: 'Outer Bull (Dış Merkez)',
          desc: 'Merkezi çevreleyen yeşil halka. 25 puan değerindedir. Cricket oyunlarında 1 isabet sayılır.',
          badge: '25',
        },
        {
          title: 'Inner Bull (İç Merkez / D-Bull)',
          desc: 'Tam merkezdeki kırmızı nokta. 50 puandır ve Double sayıldığı için Double Out kuralında oyunu bitirebilir. Cricket oyunlarında 2 isabet sayılır.',
          badge: '50',
        },
      ],
      notes: [
        'Bir turda 3 dart atarsınız; turun toplamı üç dartın toplamıdır.',
        'Dart tahtadan düşerse veya telin dışına saplanırsa o atış 0 sayılır.',
        'Bir turda atılabilecek teorik maksimum puan 180’dir (3 × T20).',
      ],
    },
    x01: {
      intro:
        'X01 oyunları (301, 501, 701) eksiltme mantığıyla oynanır. Belirlenen puandan başlar, attığınız her puanı düşerek tam olarak 0’a inmeye çalışırsınız.',
      steps: [
        'Her oyuncu turda 3 dart atar.',
        'Atılan toplam puan, kalan puanınızdan düşülür.',
        'Puanı tam olarak 0’a indiren oyuncu leg’i kazanır.',
        'BUST (Taşma): Kalanınızdan fazla atarsanız, kalanı 1 yaparsanız veya Double Out açıkken 0’a Double dışı bir vuruşla inerseniz tur geçersizdir; puanınız tur başındaki değere döner.',
        'Double Out açıkken kalanı 2’nin altına düşürecek atışlar da bust sayılır; çünkü Double ile bitirmek imkânsız hale gelir.',
      ],
    },
    cricket: {
      intro:
        'Cricket oyunlarında amaç, hedef sayıları 3 kez vurarak "kapatmak" ve moda göre puan toplamak ya da rakibe puan yazmaktır.',
      marks: [
        { symbol: '/', label: '1 İsabet' },
        { symbol: 'X', label: '2 İsabet' },
        { symbol: '⭕', label: '3 İsabet (Kapalı)' },
      ],
      notes: [
        'Triple (T) bölgesi 3 isabet, Double (D) bölgesi 2 isabet sayılır. Tek atışla bir sayı kapatılabilir.',
        'Outer Bull 1 isabet, Inner Bull 2 isabet değerindedir.',
        'Bir sayı tüm oyuncular tarafından kapatıldığında o sayı "ölür"; artık kimseye puan getirmez.',
      ],
    },
    modes: {
      standard: {
        label: 'Standart Cricket',
        icon: '🏏',
        goal:
          '15, 16, 17, 18, 19, 20 ve Bull hedeflerini 3 isabetle kapatmak ve rakibinizden daha fazla puan toplamak.',
        how: [
          'Sıra sizdeyken 3 dart atarsınız.',
          'Bir hedefe toplam 3 isabet yaptığınızda o hedefi kapatmış olursunuz.',
          'Triple bir atış 3 isabet, Double bir atış 2 isabet sayılır; yani T20 tek atışta 20’yi kapatır.',
        ],
        scoring: [
          'Bir hedefi kapattıysanız ve rakibiniz henüz kapatmadıysa, o hedefe yaptığınız fazladan her isabet size sayının değeri kadar puan yazar.',
          'Örnek: 20’yi kapattınız, rakip kapatmadı. T20 atarsanız 60 puan kazanırsınız.',
          'Rakip de o hedefi kapatınca hedef ölür ve artık puan getirmez.',
        ],
        win: 'Tüm hedefleri kapatan ve puanı rakibinden fazla (veya eşit değilse yüksek) olan oyuncu leg’i kazanır. Tüm hedefleri kapatsanız bile puanınız geride ise kazanamazsınız.',
        tips: [
          '20 ve 19 en değerli hedeflerdir; önce onlarla başlamak avantaj sağlar.',
          'Rakip öne geçtiyse hedefleri kapatmak yerine puan farkını kapatmaya odaklanın.',
        ],
      },
      extended: {
        label: 'Extended Cricket',
        icon: '🎯',
        goal:
          'Genişletilmiş hedef listesini (10-20 arası sayılar ile Bull, Triple, Double ve House alanları) kapatmak ve en yüksek puanı toplamak.',
        how: [
          'Standart Cricket ile aynı kapatma mantığı geçerlidir: her hedef için 3 isabet.',
          'Hedef listesi çok daha uzundur, bu yüzden maçlar daha uzun sürer.',
          'D (Double), T (Triple) ve H (House) özel hedefler olarak ayrıca kapatılır.',
        ],
        scoring: [
          'Kapattığınız ve rakibin kapatmadığı hedeflere yaptığınız fazla isabetler puan yazar.',
          'Geniş hedef yelpazesi sayesinde tahtanın her bölgesi işe yarar; ıskalanan atışlar bile sık sık başka bir hedefe denk gelir.',
        ],
        win: 'Tüm hedefleri kapatıp puan üstünlüğünü elinde tutan oyuncu kazanır.',
        tips: [
          'Hedef sayısı fazla olduğu için tek bir bölgeye takılmayın; açık kalan hedefleri kollayın.',
          'Triple ve Double alanları hem kendi hedefleri hem de çarpan olarak iki kat değerlidir.',
        ],
      },
      cutthroat: {
        label: 'Cezalı Cricket (Cut-Throat)',
        icon: '⚔️',
        goal:
          'Hedefleri kapatmak ve fazla isabetlerle rakiplere ceza puanı yazmak. Bu modda puan iyi değil, KÖTÜ bir şeydir: en düşük puanlı oyuncu kazanır.',
        how: [
          'Kapatma mantığı Standart Cricket ile aynıdır: her hedef için 3 isabet.',
          'Farkı puanın yönüdür. Kapattığınız bir hedefe fazladan isabet ettiğinizde puan SİZE değil, o hedefi henüz kapatmamış TÜM rakiplere yazılır.',
          'Örnek: 20’yi kapattınız, iki rakibiniz kapatmadı. T20 atarsanız her iki rakibe de 60’ar puan eklenir.',
        ],
        scoring: [
          'Kendi puanınız asla artmaz; yalnızca rakipler size puan yazdırabilir.',
          'Bir rakip o hedefi kapatırsa artık ona ceza yazamazsınız.',
          'Tüm oyuncular hedefi kapattığında hedef ölür.',
        ],
        win:
          'Tüm hedefleri kapatan oyuncular arasında EN DÜŞÜK puana sahip olan kazanır. Standart Cricket’in tam tersi olduğu için dikkat edin.',
        tips: [
          'Bir hedefi kapatmadan önce, kapattığınızda kaç rakibin hâlâ açık olduğunu düşünün; ne kadar çok açık rakip varsa ceza o kadar etkilidir.',
          'Kendi puanınızı düşük tutmak için rakiplerin açık bıraktığı hedefleri erken kapatın.',
          'Az rakip açıkken yüksek hedefe yüklenmek boşa gidebilir; sıralamayı takip edin.',
        ],
      },
      'no-score': {
        label: 'No-Score Cricket',
        icon: '⚡',
        goal:
          'Puan hiç tutulmaz. Tek amaç tüm hedefleri (15-20 ve Bull) rakipten önce kapatmaktır.',
        how: [
          'Her hedef için yine 3 isabet gerekir.',
          'Triple 3, Double 2 isabet sayılır.',
          'Kapattığınız hedefe fazladan atış yapmanın hiçbir faydası yoktur; puan yazılmaz.',
        ],
        scoring: [
          'Bu modda puanlama yoktur. Tablo yalnızca kimin hangi hedefi kapattığını gösterir.',
          'Fazla isabetler boşa gider, bu yüzden hız ve isabet her şeydir.',
        ],
        win: 'Tüm hedefleri ilk kapatan oyuncu leg’i kazanır. Puan farkı diye bir şey olmadığı için sonuç nettir.',
        tips: [
          'En hızlı yol Triple alanlarıdır; tek atışta bir hedefi kapatır.',
          'Rakibin kaç isabeti kaldığını takip edin ve kalan hedeflerinizi ona göre sıralayın.',
          'Puan baskısı olmadığı için tamamen isabet odaklı oynayın.',
        ],
      },
      wildcard: {
        label: 'Wild-Card Cricket',
        icon: '🎲',
        goal:
          'Her leg başında rastgele belirlenen 7 hedefi kapatmak ve puan üstünlüğü kurmak. Hedefler sabit değildir, her leg yeniden çekilir.',
        how: [
          'Leg başlarken sistem rastgele 7 hedef belirler; bunlar 15-20 dışındaki sayılar da olabilir.',
          'Kapatma mantığı Standart Cricket ile aynıdır: her hedef için 3 isabet.',
          'Hedef listesi ekranda gösterilir; her leg başında değiştiği için ezberlemeyin.',
        ],
        scoring: [
          'Kapattığınız ve rakibin kapatmadığı hedeflere yaptığınız fazla isabetler size puan yazar.',
          'Rastgele hedefler düşük sayılar da olabileceğinden puanlar Standart Cricket’e göre daha dengeli seyreder.',
        ],
        win: 'Tüm hedefleri kapatıp puan üstünlüğünü koruyan oyuncu kazanır.',
        tips: [
          'Alışık olmadığınız düşük sayılar çıkabilir; atış öncesi hedefin tahtadaki yerini bir saniye kontrol edin.',
          'Rastgelelik şansı dengelediği için deneyimli oyuncuya karşı en âdil moddur.',
        ],
      },
      '301': {
        label: 'X01 · 301',
        icon: '🔢',
        goal: '301 puandan başlayıp puanı tam olarak 0’a indirmek.',
        how: [
          'Her turda 3 dart atarsınız ve toplamı kalan puanınızdan düşülür.',
          'Kısa bir oyundur; ortalama 3-5 turda biter.',
          'Hata payı çok azdır, tek bir bust maçı çevirebilir.',
        ],
        scoring: [
          'Atılan her puan kalanınızdan düşülür.',
          'Kalanı 0’ın altına düşüren, 1’de bırakan veya Double Out açıkken uygun olmayan bitiş yapan atışlar BUST sayılır ve tur başına dönersiniz.',
        ],
        win: 'Puanı tam 0’a indiren ilk oyuncu leg’i kazanır. Belirlenen leg sayısına ilk ulaşan maçı kazanır.',
        tips: [
          'Kısa oyun olduğu için erken turlarda bile bitiş kombinasyonunu düşünmeye başlayın.',
          'Kalanı 40 (D20) veya 32 (D16) gibi bilinen bitişlere getirmeye çalışın.',
        ],
      },
      '501': {
        label: 'X01 · 501',
        icon: '🔢',
        goal:
          '501 puandan başlayıp puanı tam olarak 0’a indirmek. Profesyonel turnuvaların standart formatıdır.',
        how: [
          'Her turda 3 dart atarsınız ve toplamı kalan puanınızdan düşülür.',
          'İlk turlar yüksek puan (T20 bölgesi) toplamaya, son turlar doğru bitişe odaklanır.',
          'Teorik en hızlı bitiş 9 darttır.',
        ],
        scoring: [
          'Atılan her puan kalanınızdan düşülür.',
          'Kalanı 0’ın altına düşüren, 1’de bırakan veya Double Out açıkken uygun olmayan bitiş yapan atışlar BUST sayılır ve tur başına dönersiniz.',
        ],
        win: 'Puanı tam 0’a indiren ilk oyuncu leg’i kazanır. Belirlenen leg sayısına ilk ulaşan maçı kazanır.',
        tips: [
          'T20 (60 puan) en verimli hedeftir; tur ortalamanızı buradan yükseltin.',
          'Kalanı 170 altına indirdikten sonra bitiş kombinasyonlarını planlayın (170 = T20+T20+D-Bull, mümkün en yüksek bitiş).',
          'Kalanı tek sayı bırakmamaya çalışın; Double ile bitirmek zorlaşır.',
        ],
      },
      '701': {
        label: 'X01 · 701',
        icon: '🔢',
        goal: '701 puandan başlayıp puanı tam olarak 0’a indirmek. Uzun soluklu maraton formatı.',
        how: [
          'Her turda 3 dart atarsınız ve toplamı kalan puanınızdan düşülür.',
          'Uzun bir oyundur; istikrar tek seferlik yüksek atışlardan daha önemlidir.',
          'Erken yapılan hataları telafi etmek için bolca tur vardır.',
        ],
        scoring: [
          'Atılan her puan kalanınızdan düşülür.',
          'Kalanı 0’ın altına düşüren, 1’de bırakan veya Double Out açıkken uygun olmayan bitiş yapan atışlar BUST sayılır ve tur başına dönersiniz.',
        ],
        win: 'Puanı tam 0’a indiren ilk oyuncu leg’i kazanır. Belirlenen leg sayısına ilk ulaşan maçı kazanır.',
        tips: [
          'Uzun oyunda ritim önemlidir; her turda 60+ hedefleyin.',
          'Yorgunluk isabeti düşürür, duruşunuzu ve atış temponuzu sabit tutun.',
        ],
      },
    },
    rulesOn: 'Bu maçta açık kurallar',
    doubleIn: 'Double In (Çiftli Başlangıç)',
    doubleInDesc: 'Puan düşmeye başlamak için ilk isabetiniz bir Double alanına gelmelidir.',
    doubleOut: 'Double Out (Çiftli Bitiş)',
    doubleOutDesc: 'Leg’i bitiren son vuruş mutlaka bir Double alanına gelmelidir.',
  },

  en: {
    title: '📖 How to Play?',
    close: '✕ Close',
    tabs: [
      { id: 'board', label: '🎯 The Board' },
      { id: 'x01', label: '🔢 X01' },
      { id: 'cricket', label: '🏏 Cricket' },
    ],
    sections: {
      goal: 'Objective',
      how: 'How to Play',
      scoring: 'Scoring',
      win: 'Winning',
      tips: 'Tips',
    },
    board: {
      intro:
        'A dartboard has 20 numbered segments plus the central Bull area. Each segment is split into single, double and triple regions. Where your dart lands determines your score.',
      items: [
        { title: 'Single', desc: 'The large areas of a segment. Scores face value. Example: a single 20 = 20 points.', badge: 'x1' },
        { title: 'Double Ring (D)', desc: 'The outer narrow ring. Doubles the value. Example: D20 = 40. X01 games are usually finished here.', badge: 'x2' },
        { title: 'Triple Ring (T)', desc: 'The inner narrow ring. Triples the value. Example: T20 = 60, the highest single-dart score on the board.', badge: 'x3' },
        { title: 'Outer Bull', desc: 'The green ring around the centre. Worth 25 points. Counts as 1 mark in Cricket.', badge: '25' },
        { title: 'Inner Bull (D-Bull)', desc: 'The red centre. Worth 50 points and counts as a double, so it can finish a Double Out leg. Counts as 2 marks in Cricket.', badge: '50' },
      ],
      notes: [
        'You throw 3 darts per turn; your turn score is the sum of all three.',
        'A dart that bounces out or falls scores 0.',
        'The theoretical maximum for one turn is 180 (3 × T20).',
      ],
    },
    x01: {
      intro:
        'X01 games (301, 501, 701) are countdown games. You start from a set score and subtract everything you throw, aiming to reach exactly 0.',
      steps: [
        'Each player throws 3 darts per turn.',
        'The total thrown is subtracted from your remaining score.',
        'The first player to reach exactly 0 wins the leg.',
        'BUST: If you score more than your remaining total, leave exactly 1, or reach 0 without a double while Double Out is on, the turn is void and your score resets to what it was at the start of the turn.',
        'With Double Out on, leaving less than 2 also counts as a bust, since finishing on a double becomes impossible.',
      ],
    },
    cricket: {
      intro:
        'In Cricket the goal is to "close" target numbers by hitting them 3 times, then score points or load penalties onto opponents depending on the mode.',
      marks: [
        { symbol: '/', label: '1 Mark' },
        { symbol: 'X', label: '2 Marks' },
        { symbol: '⭕', label: '3 Marks (Closed)' },
      ],
      notes: [
        'A triple counts as 3 marks and a double as 2, so one dart can close a number.',
        'Outer Bull counts as 1 mark, Inner Bull as 2.',
        'Once every player has closed a number it is "dead" and scores for nobody.',
      ],
    },
    modes: {
      standard: {
        label: 'Standard Cricket',
        icon: '🏏',
        goal: 'Close 15, 16, 17, 18, 19, 20 and Bull with 3 marks each, and outscore your opponent.',
        how: [
          'You throw 3 darts on your turn.',
          'Three marks on a target closes it for you.',
          'A triple counts as 3 marks and a double as 2, so T20 closes 20 with a single dart.',
        ],
        scoring: [
          'If you have closed a target and your opponent has not, every extra hit scores you the face value of that number.',
          'Example: you closed 20, your opponent has not. Hitting T20 scores you 60 points.',
          'Once the opponent closes it too, the target dies and scores no more.',
        ],
        win: 'The player who closes every target while holding the higher score wins the leg. Closing everything is not enough if you are behind on points.',
        tips: [
          '20 and 19 are the most valuable targets; opening with them pays off.',
          'If you fall behind, focus on scoring rather than closing.',
        ],
      },
      extended: {
        label: 'Extended Cricket',
        icon: '🎯',
        goal: 'Close the extended target list (10 through 20 plus Bull, Triple, Double and House) and hold the highest score.',
        how: [
          'The closing rules are the same as Standard Cricket: 3 marks per target.',
          'The target list is much longer, so matches run longer.',
          'D (Double), T (Triple) and H (House) are separate targets to close.',
        ],
        scoring: [
          'Extra hits on targets you have closed and your opponent has not will score points.',
          'With such a wide target list, most of the board is useful and stray darts often still land on something.',
        ],
        win: 'Close every target while holding the higher score.',
        tips: [
          'Do not get stuck on one number; watch for targets still open.',
          'Triple and Double areas count twice over: as their own targets and as multipliers.',
        ],
      },
      cutthroat: {
        label: 'Cut-Throat Cricket',
        icon: '⚔️',
        goal:
          'Close targets and use extra hits to load penalty points onto opponents. Points are BAD here: the lowest score wins.',
        how: [
          'Closing works exactly as in Standard Cricket: 3 marks per target.',
          'The difference is where points go. Extra hits on a closed target are added to EVERY opponent who has not closed it.',
          'Example: you closed 20 and two opponents have not. Hitting T20 adds 60 points to each of them.',
        ],
        scoring: [
          'Your own score never increases by your own throws; only opponents can add to it.',
          'Once an opponent closes that target, you can no longer penalise them on it.',
          'When everyone has closed it, the target dies.',
        ],
        win: 'Among players who have closed everything, the LOWEST score wins. This is the exact opposite of Standard Cricket.',
        tips: [
          'Before closing a target, consider how many opponents are still open on it — more open opponents means a bigger payoff.',
          'Close the targets your opponents leave open early to keep your own score down.',
          'Hammering a high target when few opponents are open is wasted effort.',
        ],
      },
      'no-score': {
        label: 'No-Score Cricket',
        icon: '⚡',
        goal: 'No points are tracked at all. The only aim is to close every target (15-20 and Bull) before your opponent.',
        how: [
          'Each target still needs 3 marks.',
          'A triple counts as 3 marks, a double as 2.',
          'Extra hits on a closed target do nothing — no points are recorded.',
        ],
        scoring: [
          'There is no scoring in this mode. The board only tracks who has closed what.',
          'Extra hits are wasted, so speed and accuracy are everything.',
        ],
        win: 'The first player to close every target wins the leg. With no points involved, the result is clear-cut.',
        tips: [
          'Triples are the fastest route: one dart closes a target.',
          'Track how many marks your opponent needs and prioritise accordingly.',
          'With no scoring pressure, play purely for accuracy.',
        ],
      },
      wildcard: {
        label: 'Wild-Card Cricket',
        icon: '🎲',
        goal: 'Close 7 randomly drawn targets and hold the lead. The targets are redrawn at the start of every leg.',
        how: [
          'At the start of a leg the app draws 7 random targets, which may include numbers outside 15-20.',
          'Closing works as in Standard Cricket: 3 marks per target.',
          'The target list is shown on screen and changes each leg, so do not memorise it.',
        ],
        scoring: [
          'Extra hits on targets you closed and your opponent has not will score points.',
          'Because random targets can be low numbers, scores tend to stay closer than in Standard Cricket.',
        ],
        win: 'Close every target while holding the higher score.',
        tips: [
          'Unfamiliar low numbers can come up; take a second to locate the target before throwing.',
          'The randomness levels the field, making this the fairest mode against a stronger player.',
        ],
      },
      '301': {
        label: 'X01 · 301',
        icon: '🔢',
        goal: 'Start at 301 and reduce your score to exactly 0.',
        how: [
          'You throw 3 darts per turn and the total is subtracted from your remaining score.',
          'It is a short game, usually decided in 3-5 turns.',
          'There is very little margin for error; a single bust can swing the leg.',
        ],
        scoring: [
          'Everything you throw is subtracted from your remaining score.',
          'Going below 0, leaving exactly 1, or finishing without a double while Double Out is on counts as a BUST and resets you to your score at the start of the turn.',
        ],
        win: 'The first player to reach exactly 0 wins the leg; first to the set number of legs wins the match.',
        tips: [
          'Because the game is short, start thinking about your finish early.',
          'Aim to leave a known finish such as 40 (D20) or 32 (D16).',
        ],
      },
      '501': {
        label: 'X01 · 501',
        icon: '🔢',
        goal: 'Start at 501 and reduce your score to exactly 0. This is the standard professional tournament format.',
        how: [
          'You throw 3 darts per turn and the total is subtracted from your remaining score.',
          'Early turns are about scoring heavily (the T20 bed); late turns are about finishing accurately.',
          'The theoretical fastest finish is 9 darts.',
        ],
        scoring: [
          'Everything you throw is subtracted from your remaining score.',
          'Going below 0, leaving exactly 1, or finishing without a double while Double Out is on counts as a BUST and resets you to your score at the start of the turn.',
        ],
        win: 'The first player to reach exactly 0 wins the leg; first to the set number of legs wins the match.',
        tips: [
          'T20 (60 points) is the most efficient target; build your average there.',
          'Once under 170, plan your finish (170 = T20 + T20 + D-Bull is the highest possible checkout).',
          'Try not to leave an odd number; finishing on a double gets harder.',
        ],
      },
      '701': {
        label: 'X01 · 701',
        icon: '🔢',
        goal: 'Start at 701 and reduce your score to exactly 0. A long marathon format.',
        how: [
          'You throw 3 darts per turn and the total is subtracted from your remaining score.',
          'It is a long game where consistency matters more than one big turn.',
          'There are plenty of turns to recover from an early mistake.',
        ],
        scoring: [
          'Everything you throw is subtracted from your remaining score.',
          'Going below 0, leaving exactly 1, or finishing without a double while Double Out is on counts as a BUST and resets you to your score at the start of the turn.',
        ],
        win: 'The first player to reach exactly 0 wins the leg; first to the set number of legs wins the match.',
        tips: [
          'Rhythm matters over a long leg; target 60+ every turn.',
          'Fatigue costs accuracy — keep your stance and throwing tempo consistent.',
        ],
      },
    },
    rulesOn: 'Rules active in this match',
    doubleIn: 'Double In',
    doubleInDesc: 'Your first scoring dart must land in a double before points start counting down.',
    doubleOut: 'Double Out',
    doubleOutDesc: 'The dart that finishes the leg must land in a double.',
  },
};

/* Cricket modu kimlikleri; X01 modları sayı ("501" vb.) olarak gelir.
   Sıra, oyun seçim ekranındaki sırayla aynı tutulmalıdır. */
const CRICKET_MODES = ['no-score', 'cutthroat', 'standard', 'extended', 'wildcard'];

export default function HowToPlayModal({
  isOpen,
  onClose,
  lang = 'tr',
  gameContext = null,
  gameMode = null,
  x01Rules = null,
}) {
  const [activeTab, setActiveTab] = useState('board');

  const content = GUIDE_CONTENT[lang] || GUIDE_CONTENT.tr;

  /* Oyun içinden açıldıysa yalnızca oynanan MODUN detayını göster.
     Örn. Cezalı Cricket oynanıyorsa sadece Cut-Throat anlatımı görünür. */
  const modeKey =
    gameContext === 'cricket' && CRICKET_MODES.includes(gameMode)
      ? gameMode
      : gameContext === 'x01' && content.modes[gameMode]
        ? gameMode
        : null;

  const modeGuide = modeKey ? content.modes[modeKey] : null;
  const isModeLocked = Boolean(modeGuide);

  useEffect(() => {
    if (isOpen && !isModeLocked) {
      setActiveTab('board');
    }
  }, [isOpen, isModeLocked]);

  if (!isOpen) return null;

  const s = content.sections;

  const renderBlock = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="guide-block">
        <div className="guide-block-title">{title}</div>
        <ul className="guide-bullet-list">
          {items.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="winner-overlay">
      <div className="history-modal guide-modal">
        <div className="guide-header">
          <h2>{isModeLocked ? `${modeGuide.icon} ${modeGuide.label}` : content.title}</h2>
          <button className="btn-text" onClick={onClose}>
            {content.close}
          </button>
        </div>

        {!isModeLocked && (
          <div className="guide-tabs">
            {content.tabs.map((tab) => (
              <button
                key={tab.id}
                className={`guide-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="guide-content-body">
          {/* ---------- OYUN İÇİ: YALNIZCA OYNANAN MODUN DETAYI ---------- */}
          {isModeLocked && (
            <div className="guide-section">
              <p className="guide-intro">{modeGuide.goal}</p>

              {renderBlock(s.how, modeGuide.how)}
              {renderBlock(s.scoring, modeGuide.scoring)}

              <div className="guide-block">
                <div className="guide-block-title">{s.win}</div>
                <div className="guide-card guide-card-highlight">
                  <span>{modeGuide.win}</span>
                </div>
              </div>

              {/* X01 için maçta açık olan kuralları göster */}
              {gameContext === 'x01' && x01Rules && (x01Rules.doubleIn || x01Rules.doubleOut) && (
                <div className="guide-block">
                  <div className="guide-block-title">{content.rulesOn}</div>
                  <div className="guide-list">
                    {x01Rules.doubleIn && (
                      <div className="guide-card">
                        <div className="guide-card-header">
                          <strong>{content.doubleIn}</strong>
                          <span className="guide-badge">ON</span>
                        </div>
                        <span>{content.doubleInDesc}</span>
                      </div>
                    )}
                    {x01Rules.doubleOut && (
                      <div className="guide-card">
                        <div className="guide-card-header">
                          <strong>{content.doubleOut}</strong>
                          <span className="guide-badge">ON</span>
                        </div>
                        <span>{content.doubleOutDesc}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cricket modlarında işaret sembollerini hatırlat */}
              {gameContext === 'cricket' && (
                <div className="guide-block">
                  <div className="guide-block-title">{content.tabs[2].label}</div>
                  <div className="guide-symbols-grid">
                    {content.cricket.marks.map((m, i) => (
                      <div key={i} className="symbol-item">
                        <span className="symbol-icon">{m.symbol}</span>
                        <span className="symbol-label">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {renderBlock(s.tips, modeGuide.tips)}
            </div>
          )}

          {/* ---------- ANA EKRAN: GENEL REHBER ---------- */}
          {!isModeLocked && activeTab === 'board' && (
            <div className="guide-section">
              <p className="guide-intro">{content.board.intro}</p>

              <div className="board-visual-card">
                <svg viewBox="0 0 340 230" className="dartboard-slice-svg" preserveAspectRatio="xMidYMid meet">
                  <path d="M 120 15 A 150 150 0 0 1 220 15 L 208 32 A 130 130 0 0 0 132 32 Z" fill="#ff334b" stroke="#ffffff" strokeWidth="1" />
                  <path d="M 132 32 A 130 130 0 0 1 208 32 L 190 70 A 90 90 0 0 0 150 70 Z" fill="#2b2c3a" stroke="#ffffff" strokeWidth="1" />
                  <path d="M 150 70 A 90 90 0 0 1 190 70 L 180 88 A 72 72 0 0 0 160 88 Z" fill="#ff334b" stroke="#ffffff" strokeWidth="1" />
                  <path d="M 160 88 A 72 72 0 0 1 180 88 L 173 130 A 35 35 0 0 0 167 130 Z" fill="#2b2c3a" stroke="#ffffff" strokeWidth="1" />
                  <circle cx="170" cy="155" r="22" fill="#28a745" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="170" cy="155" r="10" fill="#dc3545" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="170" y="11" fill="#ffffff" fontSize="11" fontWeight="800" textAnchor="middle">20</text>

                  <line x1="214" y1="23" x2="265" y2="23" stroke="#ff9800" strokeWidth="1.5" strokeDasharray="3 2" />
                  <rect x="265" y="13" width="65" height="18" rx="4" fill="#ff9800" />
                  <text x="297" y="25" fill="#000" fontSize="9" fontWeight="800" textAnchor="middle">DOUBLE (x2)</text>

                  <line x1="75" y1="50" x2="140" y2="50" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 2" />
                  <rect x="10" y="41" width="65" height="18" rx="4" fill="#10b981" />
                  <text x="42" y="53" fill="#04150c" fontSize="9" fontWeight="800" textAnchor="middle">SINGLE (x1)</text>

                  <line x1="185" y1="79" x2="265" y2="79" stroke="#e91e63" strokeWidth="1.5" strokeDasharray="3 2" />
                  <rect x="265" y="70" width="65" height="18" rx="4" fill="#e91e63" />
                  <text x="297" y="82" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle">TRIPLE (x3)</text>

                  <line x1="75" y1="150" x2="150" y2="150" stroke="#28a745" strokeWidth="1.5" strokeDasharray="3 2" />
                  <rect x="10" y="141" width="65" height="18" rx="4" fill="#28a745" />
                  <text x="42" y="153" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle">BULL (25)</text>

                  <line x1="170" y1="165" x2="170" y2="202" stroke="#dc3545" strokeWidth="1.5" strokeDasharray="3 2" />
                  <rect x="125" y="202" width="90" height="18" rx="4" fill="#dc3545" />
                  <text x="170" y="214" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle">D-BULL (50)</text>
                </svg>
              </div>

              <div className="guide-list">
                {content.board.items.map((item, i) => (
                  <div key={i} className="guide-card">
                    <div className="guide-card-header">
                      <strong>{item.title}</strong>
                      <span className="guide-badge">{item.badge}</span>
                    </div>
                    <span>{item.desc}</span>
                  </div>
                ))}
              </div>

              {renderBlock(content.sections.how, content.board.notes)}
            </div>
          )}

          {!isModeLocked && activeTab === 'x01' && (
            <div className="guide-section">
              <p className="guide-intro">{content.x01.intro}</p>
              {renderBlock(content.sections.how, content.x01.steps)}

              <div className="guide-list">
                {['301', '501', '701'].map((m) => (
                  <div key={m} className="guide-card">
                    <div className="guide-card-header">
                      <strong>{content.modes[m].label}</strong>
                    </div>
                    <span>{content.modes[m].goal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isModeLocked && activeTab === 'cricket' && (
            <div className="guide-section">
              <p className="guide-intro">{content.cricket.intro}</p>

              <div className="guide-symbols-grid">
                {content.cricket.marks.map((m, i) => (
                  <div key={i} className="symbol-item">
                    <span className="symbol-icon">{m.symbol}</span>
                    <span className="symbol-label">{m.label}</span>
                  </div>
                ))}
              </div>

              {renderBlock(content.sections.scoring, content.cricket.notes)}

              <div className="guide-list">
                {CRICKET_MODES.map((m) => (
                  <div key={m} className="guide-card">
                    <div className="guide-card-header">
                      <strong>
                        {content.modes[m].icon} {content.modes[m].label}
                      </strong>
                    </div>
                    <span>{content.modes[m].goal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

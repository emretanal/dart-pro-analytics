/* Overlay: 9:16 Mobil Dikey Merkezleme */
.winner-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(2, 6, 23, 0.88);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 0;
}

/* Modal Kapsayıcısı: Sabit 9:16 Oran Limiti ve İki Yana Tam Yaslama */
.history-modal.guide-modal {
  width: 100vw;
  max-width: 480px;
  height: 100dvh;
  background-color: #0f172a;
  display: flex;
  flex-direction: column;
  padding: 16px 14px;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.6);
  animation: modalSlideUp 0.2s ease-out;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Üst Başlık Batan Alanı */
.guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #334155;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.guide-header h2 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0;
}

.btn-text {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
}

.btn-text:active {
  background-color: #1e293b;
  color: #f8fafc;
}

/* Sekmeler: Sabit Genişlik Yapısı ile Daralma/Genişlemeleri Önler */
.guide-tabs {
  display: flex;
  background-color: #1e293b;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
  width: 100%;
  flex-shrink: 0;
  margin-bottom: 12px;
  box-sizing: border-box;
}

.guide-tab-btn {
  flex: 1;
  padding: 10px 0;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.guide-tab-btn.active {
  background-color: #10b981;
  color: #020617;
}

/* İçerik Alanı: Kaydırılabilir İç Kapsayıcı */
.guide-content-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 2px;
  display: flex;
  flex-direction: column;
}

.guide-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
}

.guide-intro {
  font-size: 0.85rem;
  color: #cbd5e1;
  line-height: 1.4;
  margin: 0;
}

/* Dart Tahtası Görsel Şeması */
.board-visual-card {
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.dartboard-slice-svg {
  width: 100%;
  height: auto;
  max-height: 200px;
}

/* Kart Listeleri ve Elemanlar */
.guide-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.guide-card {
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.guide-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.guide-card strong {
  font-size: 0.88rem;
  color: #f8fafc;
}

.guide-card span {
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.35;
}

.guide-badge {
  background-color: #0f172a;
  border: 1px solid #334155;
  color: #10b981;
  font-weight: 800;
  font-size: 0.72rem;
  padding: 2px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

/* X01 Maddeler Listesi */
.guide-bullet-list {
  padding-left: 18px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.guide-bullet-list li {
  font-size: 0.85rem;
  color: #cbd5e1;
  line-height: 1.4;
}

/* Cricket Sembol Izgarası */
.guide-symbols-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
}

.symbol-item {
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 10px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.symbol-icon {
  font-size: 1.2rem;
  font-weight: 800;
  color: #10b981;
}

.symbol-label {
  font-size: 0.72rem;
  color: #94a3b8;
}
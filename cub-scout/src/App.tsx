import { useState, useCallback } from 'react';
import type { ToastMessage } from './types';
import { useTimer } from './hooks/useTimer';
import { useSolves } from './hooks/useSolves';
import { useKeyboard } from './hooks/useKeyboard';
import { ScrambleDisplay } from './components/ScrambleDisplay';
import { Timer } from './components/Timer';
import { SplitToggle } from './components/SplitToggle';
import { SaveForm } from './components/SaveForm';
import { StatsBar } from './components/StatsBar';
import { PhaseStats } from './components/PhaseStats';
import { RecentSolves } from './components/RecentSolves';
import { DrillPlan } from './components/DrillPlan';
import { DataActions } from './components/DataActions';
import { Toast } from './components/Toast';
import './App.css';

function App() {
  const [splitMode, setSplitMode] = useState(false);
  const [scramble, setScramble] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const { solves, stats, addSolve, updateSolve, deleteSolve, clearAll } = useSolves();
  const { timerState, elapsedMs, splitProgress, finalResult, onAction, reset } = useTimer(splitMode);

  const showToast = useCallback((text: string, type: 'warning' | 'info' = 'warning') => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
    setToasts(prev => [...prev, { id, text, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useKeyboard(onAction, showToast);

  const handleSave = useCallback((notes: string, tags: string[]) => {
    if (!finalResult) return;
    addSolve({
      timestamp: new Date().toISOString(),
      scramble,
      total_ms: finalResult.total_ms,
      splits_ms: finalResult.splits_ms,
      notes,
      tags,
    });
    reset();
    // Trigger new scramble via key change
    setScramble('');
  }, [finalResult, scramble, addSolve, reset]);

  const handleDiscard = useCallback(() => {
    reset();
  }, [reset]);

  const isRunning = timerState === 'running' || timerState === 'holding' || timerState === 'ready';

  return (
    <div className="app">
      <nav>
        <a className="nav-logo" href="#">Cub <span>Scout</span></a>
      </nav>

      <main>
        <ScrambleDisplay scramble={scramble} onScrambleChange={setScramble} />
        <SplitToggle splitMode={splitMode} onChange={setSplitMode} disabled={isRunning} />
        <Timer
          timerState={timerState}
          elapsedMs={elapsedMs}
          splitMode={splitMode}
          splitProgress={splitProgress}
          onAction={onAction}
        />
        {finalResult && timerState === 'stopped' && (
          <SaveForm
            totalMs={finalResult.total_ms}
            splitsMs={finalResult.splits_ms}
            onSave={handleSave}
            onDiscard={handleDiscard}
          />
        )}
        <StatsBar stats={stats} />
        <PhaseStats solves={solves} />
        <RecentSolves solves={solves} onUpdate={updateSolve} onDelete={deleteSolve} />
        <DrillPlan solves={solves} />
        <DataActions solves={solves} onClearAll={clearAll} />
      </main>

      <footer>
        Cub Scout &middot; CFOP Training Timer
      </footer>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;

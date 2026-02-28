import { useState, useMemo, useCallback } from 'react';
import type { Solve, SessionStats } from '../types';
import { loadSolves, saveSolves } from '../utils/storage';
import { computeStats } from '../utils/stats';

interface UseSolvesReturn {
  solves: Solve[];
  stats: SessionStats;
  addSolve: (solve: Omit<Solve, 'id'>) => void;
  updateSolve: (id: string, patch: Partial<Solve>) => void;
  deleteSolve: (id: string) => void;
  clearAll: () => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function useSolves(): UseSolvesReturn {
  const [solves, setSolves] = useState<Solve[]>(() => loadSolves());

  const stats = useMemo(() => computeStats(solves), [solves]);

  const persist = useCallback((next: Solve[]) => {
    setSolves(next);
    saveSolves(next);
  }, []);

  const addSolve = useCallback((solve: Omit<Solve, 'id'>) => {
    setSolves(prev => {
      const next = [...prev, { ...solve, id: generateId() }];
      saveSolves(next);
      return next;
    });
  }, []);

  const updateSolve = useCallback((id: string, patch: Partial<Solve>) => {
    setSolves(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...patch } : s);
      saveSolves(next);
      return next;
    });
  }, []);

  const deleteSolve = useCallback((id: string) => {
    setSolves(prev => {
      const next = prev.filter(s => s.id !== id);
      saveSolves(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    persist([]);
  }, [persist]);

  return { solves, stats, addSolve, updateSolve, deleteSolve, clearAll };
}

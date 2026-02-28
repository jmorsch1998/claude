import { useState, useEffect, useCallback } from 'react';
import { generateScramble } from '../utils/scramble';

interface Props {
  onScrambleChange: (scramble: string) => void;
  scramble: string;
}

export function ScrambleDisplay({ onScrambleChange, scramble }: Props) {
  const [loading, setLoading] = useState(!scramble);

  const newScramble = useCallback(async () => {
    setLoading(true);
    const s = await generateScramble();
    onScrambleChange(s);
    setLoading(false);
  }, [onScrambleChange]);

  useEffect(() => {
    if (!scramble) {
      newScramble();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="scramble-section">
      <div className="section-tag">scramble</div>
      <div className={`scramble-text ${loading ? 'loading' : ''}`}>
        {loading ? 'Generating...' : scramble}
      </div>
      <button className="btn" onClick={newScramble}>New Scramble</button>
    </section>
  );
}

let _randomScrambleForEvent: ((event: string) => Promise<{ toString(): string }>) | null = null;

async function loadCubingScramble(): Promise<boolean> {
  if (_randomScrambleForEvent) return true;
  try {
    const mod = await import(/* @vite-ignore */ 'https://esm.sh/cubing/scramble');
    _randomScrambleForEvent = mod.randomScrambleForEvent;
    return true;
  } catch {
    return false;
  }
}

function fallbackScramble(): string {
  const faces = ['R', 'L', 'U', 'D', 'F', 'B'];
  const mods = ['', "'", '2'];
  const axis: Record<string, string> = { R: 'x', L: 'x', U: 'y', D: 'y', F: 'z', B: 'z' };
  const moves: string[] = [];
  let last = '', lastAxis = '';
  for (let i = 0; i < 20; i++) {
    let f: string;
    do {
      f = faces[Math.floor(Math.random() * faces.length)];
    } while (f === last || (axis[f] === lastAxis && i > 0));
    lastAxis = axis[f];
    last = f;
    moves.push(f + mods[Math.floor(Math.random() * mods.length)]);
  }
  return moves.join(' ');
}

export async function generateScramble(): Promise<string> {
  const loaded = await loadCubingScramble();
  if (loaded && _randomScrambleForEvent) {
    try {
      const scramble = await _randomScrambleForEvent('333');
      return scramble.toString();
    } catch {
      return fallbackScramble();
    }
  }
  return fallbackScramble();
}

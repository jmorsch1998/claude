interface Props {
  splitMode: boolean;
  onChange: (enabled: boolean) => void;
  disabled: boolean;
}

export function SplitToggle({ splitMode, onChange, disabled }: Props) {
  return (
    <div className="split-toggle-wrapper">
      <button
        className={`split-toggle ${splitMode ? 'active' : ''}`}
        onClick={() => onChange(!splitMode)}
        disabled={disabled}
        title={disabled ? 'Cannot toggle while timer is running' : ''}
      >
        <span className="split-toggle-dot" />
        <span className="split-toggle-label">
          {splitMode ? 'Splits ON' : 'Splits OFF'}
        </span>
      </button>
      {splitMode && (
        <span className="split-toggle-hint">Cross → F2L → OLL → PLL</span>
      )}
    </div>
  );
}

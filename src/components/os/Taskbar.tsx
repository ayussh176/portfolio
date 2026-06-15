import { useWindowManager } from './WindowManager';

export default function Taskbar() {
  const { windows, focusWindow } = useWindowManager();

  return (
    <footer className="os-taskbar">
      <button className="os-taskbar-launcher">⬡ AyushOS</button>
      <div className="os-taskbar-pills">
        {windows.map(w => (
          <button
            key={w.id}
            className={`os-taskbar-pill ${!w.isMinimized ? 'active' : ''}`}
            onClick={() => focusWindow(w.id)}
            style={{ borderColor: !w.isMinimized ? w.accent : undefined }}
          >
            {w.id}
          </button>
        ))}
      </div>
      <span className="os-taskbar-version">AyushOS v1.0</span>
    </footer>
  );
}

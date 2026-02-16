import { useState, useEffect } from 'react';

export default function DebugLogger({ message }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (message !== undefined) {
      setLogs(prev => [...prev, message]);
    }
  }, [message]);

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      maxHeight: '50%',
      width: '300px',
      overflowY: 'auto',
      backgroundColor: '#111',
      color: '#0f0',
      fontSize: '12px',
      padding: '10px',
      zIndex: 9999
    }}>
      {logs.map((log, i) => <div key={i}>{JSON.stringify(log)}</div>)}
    </div>
  );
}

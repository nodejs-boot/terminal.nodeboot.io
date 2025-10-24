import React, { useState, useEffect } from 'react';
import { Server, Database, Zap, CheckCircle2, XCircle } from 'lucide-react';

export const SystemStatus = () => {
  const [stats, setStats] = useState({
    uptime: '0h 0m',
    requests: 0,
    latency: 0,
  });

  useEffect(() => {
    // Simulate stats (mock data for prototype)
    const startTime = Date.now();
    const interval = setInterval(() => {
      const uptime = Math.floor((Date.now() - startTime) / 1000);
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      
      setStats({
        uptime: `${hours}h ${minutes}m`,
        requests: Math.floor(Math.random() * 1000) + 500,
        latency: Math.floor(Math.random() * 20) + 10,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const statusItems = [
    { icon: Server, label: 'API Status', value: 'Online', status: 'success' },
    { icon: Database, label: 'Database', value: 'Connected', status: 'success' },
    { icon: Zap, label: 'Uptime', value: stats.uptime, status: 'success' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statusItems.map((item, index) => (
        <div
          key={index}
          className="glow-border rounded-lg p-4 flex items-center gap-4 bg-card/50 backdrop-blur-sm"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-mono">{item.label}</p>
            <p className="text-sm font-semibold text-foreground truncate">{item.value}</p>
          </div>
          <div>
            {item.status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { MatrixRain } from '../components/MatrixRain';
import { Logo } from '../components/Logo';
import { ApiCard } from '../components/ApiCard';
import { SystemStatus } from '../components/SystemStatus';
import { TerminalPrompt } from '../components/TerminalPrompt';
import { Terminal, Github, Book, Rocket, Shield } from 'lucide-react';

export const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const apiEndpoints = [
    {
      title: 'Swagger UI',
      description: 'Interactive API documentation with built-in testing capabilities',
      href: '/api-docs',
      icon: 'swagger',
      status: 'active',
      isInternal: false,
    },
    {
      title: 'OpenAPI Specification',
      description: 'Download the complete OpenAPI/Swagger JSON specification',
      href: '/api-docs/swagger.json',
      icon: 'spec',
      status: 'active',
      isInternal: false,
    },
    {
      title: 'Actuator',
      description: 'Application health checks, metrics, and monitoring endpoints',
      href: '/actuator',
      icon: 'actuator',
      status: 'active',
      isInternal: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain density={0.1} />

      {/* Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* Scan Line Effect */}
      <div className="scan-line absolute inset-0" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <Logo size="medium" />
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2 text-sm font-mono text-muted-foreground">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span>{currentTime.toLocaleTimeString()}</span>
                </div>
                <a
                  href="https://github.com/nodeboot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary border border-border text-foreground hover:border-primary transition-all duration-300 hover:shadow-glow"
                >
                  <Github className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-mono">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Terminal Prompt */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border backdrop-blur-sm">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
              </div>
              <span className="text-sm font-mono text-muted-foreground">terminal</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-foreground">Welcome to </span>
                <span className="text-primary text-glow-strong">Nodeboot</span>
              </h1>
              <div className="text-xl sm:text-2xl text-muted-foreground font-mono">
                <TerminalPrompt text="$ Your API is running..." delay={80} />
              </div>
            </div>

            {/* Features */}
          </div>
        </section>

        {/* System Status */}
        <section className="container mx-auto px-6 py-8">
          <SystemStatus />
        </section>

        {/* API Endpoints */}
        <section className="container mx-auto px-6 py-12 pb-24">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Core <span className="text-primary text-glow">Endpoints</span>
              </h2>
              <p className="text-muted-foreground font-mono text-sm sm:text-base">
                Explore built-in features and documentation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {apiEndpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <ApiCard {...endpoint} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
                <Terminal className="w-4 h-4 text-primary" />
                <span>Powered by Nodeboot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
                <span className="text-sm font-mono text-muted-foreground">System Online</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;

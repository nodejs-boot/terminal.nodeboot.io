import React, { useState } from 'react';
import { X, Settings, Globe, Server } from 'lucide-react';

export const ConfigDialog = ({ isOpen, onClose, onSave, initialConfig }) => {
  const [config, setConfig] = useState({
    baseUrl: initialConfig?.baseUrl || 'http://localhost:8080',
    apiBasePath: initialConfig?.apiBasePath || '/api/v1',
    ...initialConfig
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(config);
    onClose();
  };

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md mx-4">
        <div className="glow-border rounded-lg bg-background p-6 shadow-elevated">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Configuration</h2>
                <p className="text-sm text-muted-foreground">Set up your API connection</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center hover:border-primary transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Base URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Globe className="w-4 h-4 text-primary" />
                Base URL
              </label>
              <input
                type="url"
                value={config.baseUrl}
                onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                placeholder="http://localhost:8080"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors font-mono text-sm"
                required
              />
              <p className="text-xs text-muted-foreground">
                The base URL of your application (e.g., http://localhost:8080)
              </p>
            </div>

            {/* API Base Path */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Server className="w-4 h-4 text-primary" />
                API Base Path
              </label>
              <input
                type="text"
                value={config.apiBasePath}
                onChange={(e) => handleInputChange('apiBasePath', e.target.value)}
                placeholder="/api/v1"
                className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors font-mono text-sm"
                required
              />
              <p className="text-xs text-muted-foreground">
                The base path for API endpoints (e.g., /api/v1, /api)
              </p>
            </div>

            {/* Preview */}
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <div className="space-y-1">
                <code className="block text-xs font-mono text-primary">
                  Swagger UI: {config.baseUrl}{config.apiBasePath}/api-docs
                </code>
                <code className="block text-xs font-mono text-primary">
                  OpenAPI Spec: {config.baseUrl}{config.apiBasePath}/api-docs/swagger.json
                </code>
                <code className="block text-xs font-mono text-primary">
                  Actuator: {config.baseUrl}/actuator
                </code>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg bg-secondary border border-border text-foreground hover:border-muted-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

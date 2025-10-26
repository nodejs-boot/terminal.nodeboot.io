import React, { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext();

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);

  // Get configuration from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const baseUrl = urlParams.get('localAppUrl');
    const apiBasePath = urlParams.get('apiBasePath');

    if (baseUrl && apiBasePath) {
      // Configuration provided via query parameters
      const urlConfig = {
        baseUrl: decodeURIComponent(baseUrl),
        apiBasePath: decodeURIComponent(apiBasePath)
      };
      setConfig(urlConfig);
      setIsConfigured(true);
      // Save to localStorage for future visits
      localStorage.setItem('nodeboot-config', JSON.stringify(urlConfig));
    } else {
      // Try to load from localStorage
      const savedConfig = localStorage.getItem('nodeboot-config');
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig(parsedConfig);
          setIsConfigured(true);
        } catch (error) {
          console.error('Error parsing saved configuration:', error);
          setShowConfigDialog(true);
        }
      } else {
        // No configuration found, show dialog
        setShowConfigDialog(true);
      }
    }
  }, []);

  const saveConfig = (newConfig) => {
    setConfig(newConfig);
    setIsConfigured(true);
    localStorage.setItem('nodeboot-config', JSON.stringify(newConfig));
  };

  const resetConfig = () => {
    setConfig(null);
    setIsConfigured(false);
    localStorage.removeItem('nodeboot-config');
    setShowConfigDialog(true);
  };

  const getFullUrl = (path) => {
    if (!config) return path;

    // Handle different types of endpoints
    if (path.startsWith('/actuator')) {
      // Actuator endpoints are typically at the root
      return `${config.baseUrl}${path}`;
    } else if (path.startsWith('/api-docs')) {
      // API docs are under the API base path
      return `${config.baseUrl}${path}`;
    } else {
      // Default to API base path
      return `${config.baseUrl}${config.apiBasePath}${path}`;
    }
  };

  const value = {
    config,
    isConfigured,
    showConfigDialog,
    setShowConfigDialog,
    saveConfig,
    resetConfig,
    getFullUrl
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

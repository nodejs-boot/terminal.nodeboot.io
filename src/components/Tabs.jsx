import React, { useState, createContext, useContext } from 'react';

export const TabsContext = createContext();

export const Tabs = ({ children, defaultValue, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`tabs-container ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 border-b border-border pb-2 mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ children, value }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 text-sm font-mono rounded-md transition-all duration-300 ${
        isActive
          ? 'bg-primary text-background border border-primary shadow-glow'
          : 'bg-secondary text-muted-foreground border border-border hover:border-primary hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ children, value }) => {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;

  return (
    <div className="tabs-content animate-fadeInUp">
      {children}
    </div>
  );
};
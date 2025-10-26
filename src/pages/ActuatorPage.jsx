import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatrixRain } from '../components/MatrixRain';
import { Logo } from '../components/Logo';
import { JsonViewer } from '../components/JsonViewer';
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsContext } from '../components/Tabs';
import { ArrowLeft, Activity, Info, GitBranch, Settings, Cpu, BarChart3, TrendingUp, Router, Layers, Workflow,RefreshCw } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import axios from 'axios';

const actuatorEndpoints = [
  { path: '/actuator/info', label: 'Info', icon: Info },
  { path: '/actuator/health', label: 'Health', icon: Activity },
  { path: '/actuator/git', label: 'Git', icon: GitBranch },
  { path: '/actuator/config', label: 'Config', icon: Settings },
  { path: '/actuator/memory', label: 'Memory', icon: Cpu },
  { path: '/actuator/metrics', label: 'Metrics', icon: BarChart3 },
  { path: '/actuator/prometheus', label: 'Prometheus', icon: TrendingUp },
  { path: '/actuator/controllers', label: 'Controllers', icon: Router },
  { path: '/actuator/interceptors', label: 'Interceptors', icon: Layers },
  { path: '/actuator/middlewares', label: 'Middlewares', icon: Workflow },
];

const ActuatorContent = () => {
  const navigate = useNavigate();
  const { activeTab } = useContext(TabsContext);
  const { getFullUrl, isConfigured } = useConfig();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  // Fetch data for a specific endpoint
  const fetchEndpoint = async (endpoint) => {
    const key = endpoint.path;
    setLoading(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: null }));

    if (!isConfigured) {
      setErrors(prev => ({ ...prev, [key]: 'Configuration required. Please set your base URL and API path.' }));
      setLoading(prev => ({ ...prev, [key]: false }));
      return;
    }

    try {
      const fullUrl = getFullUrl(endpoint.path);
      console.log(`Fetching actuator data from: ${fullUrl}`);

      const response = await axios.get(fullUrl, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      setData(prev => ({ ...prev, [key]: response.data }));
    } catch (error) {
      console.error(`Failed to fetch ${endpoint.path}:`, error);

      let errorMessage = 'Failed to load data';

      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - The server took too long to respond';
      } else if (error.response) {
        // Server responded with error status
        errorMessage = `Server error (${error.response.status}): ${error.response.statusText}`;
        if (error.response.data?.message) {
          errorMessage += ` - ${error.response.data.message}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error - Unable to connect to the local Node-Boot server. Please check if the service is running.';
      } else {
        // Something else happened
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      setErrors(prev => ({ ...prev, [key]: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  // Fetch data when tab changes
  useEffect(() => {
    const endpoint = actuatorEndpoints.find(e => e.label.toLowerCase() === activeTab);
    if (endpoint && !data[endpoint.path]) {
      fetchEndpoint(endpoint);
    }
  }, [activeTab, data, isConfigured]);

  // Fetch first endpoint on mount
  useEffect(() => {
    if (isConfigured) {
      const firstEndpoint = actuatorEndpoints[0];
      fetchEndpoint(firstEndpoint);
    }
  }, [isConfigured]);

  // Refresh current tab data
  const refreshCurrentTab = () => {
    const endpoint = actuatorEndpoints.find(e => e.label.toLowerCase() === activeTab);
    if (endpoint) {
      // Clear existing data to force refresh
      setData(prev => ({ ...prev, [endpoint.path]: undefined }));
      fetchEndpoint(endpoint);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain density={0.1} />

      {/* Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      {/* Scan Line Effect */}
      <div className="scan-line absolute inset-0" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary border border-border text-foreground hover:border-primary transition-all duration-300 hover:shadow-glow"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-mono">Back</span>
                </button>
                <Logo size="small" />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={refreshCurrentTab}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary border border-border text-foreground hover:border-primary transition-all duration-300 hover:shadow-glow text-sm font-mono"
                  disabled={!isConfigured}
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <h1 className="text-xl font-bold font-mono">
                    <span className="text-foreground">Actuator</span>
                    <span className="text-primary text-glow ml-2">Monitor</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Description */}
            <div className="mb-8 text-center">
              <p className="text-muted-foreground font-mono text-sm">
                Monitor your application's health, metrics, and configuration
              </p>
              {!isConfigured && (
                <div className="mt-4 p-4 rounded-lg bg-warning/10 border border-warning/20 text-warning text-sm font-mono">
                  ⚠ Configuration required - Please configure your base URL to access actuator endpoints
                </div>
              )}
            </div>

            {/* Tabs */}
            <TabsList className="flex-wrap justify-center">
              {actuatorEndpoints.map((endpoint) => {
                  const Icon = endpoint.icon;
                  return (
                    <TabsTrigger
                      key={endpoint.label.toLowerCase()}
                      value={endpoint.label.toLowerCase()}
                    >
                      <Icon className="w-3.5 h-3.5 mr-2 inline" />
                      {endpoint.label}
                    </TabsTrigger>
                  );
              })}
            </TabsList>

            {actuatorEndpoints.map((endpoint) => {
              const key = endpoint.path;
              const tabValue = endpoint.label.toLowerCase();

              return (
              <TabsContent key={tabValue} value={tabValue}>
                <div className="space-y-4">
                  {/* Endpoint Info */}
                  <div className="glow-border rounded-lg p-4 bg-secondary/50 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center">
                        <endpoint.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{endpoint.label}</h3>
                        <code className="text-xs font-mono text-primary">
                          {isConfigured ? getFullUrl(endpoint.path) : endpoint.path}
                        </code>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isConfigured && !errors[key] ? 'bg-primary pulse-glow' : 'bg-muted-foreground'
                      }`} />
                      <span className="text-xs font-mono text-muted-foreground">
                        {isConfigured ? (errors[key] ? 'Error' : 'Active') : 'Config needed'}
                      </span>
                    </div>
                  </div>

                  {/* JSON Viewer */}
                  <JsonViewer
                    data={data[key]}
                    isLoading={loading[key]}
                    error={errors[key]}
                  />
                </div>
              </TabsContent>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export const ActuatorPage = () => {
  return (
    <Tabs defaultValue="info">
      <ActuatorContent />
    </Tabs>
  );
};

export default ActuatorPage;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatrixRain } from '../components/MatrixRain';
import { Logo } from '../components/Logo';
import { JsonViewer } from '../components/JsonViewer';
import { Tabs, TabsList, TabsTrigger, TabsContent, TabsContext } from '../components/Tabs';
import { ArrowLeft, Activity, Info, GitBranch, Settings, Cpu, BarChart3, TrendingUp, Router, Layers, Workflow } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

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
  const [data, setData] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  // Mock data for demonstration (in production, this would fetch from actual endpoints)
  const mockData = {
    '/actuator/info': {
      app: {
        name: 'Nodeboot API',
        description: 'Production-ready FastAPI application',
        version: '1.0.0',
        encoding: 'UTF-8'
      },
      build: {
        artifact: 'nodeboot-api',
        name: 'Nodeboot',
        time: '2024-01-01T00:00:00Z',
        version: '1.0.0'
      },
      framework: {
        name: 'FastAPI',
        version: '0.109.0'
      }
    },
    '/actuator/health': {
      status: 'UP',
      components: {
        database: {
          status: 'UP',
          details: {
            database: 'MongoDB',
            validationQuery: 'ping'
          }
        },
        diskSpace: {
          status: 'UP',
          details: {
            total: 1073741824000,
            free: 536870912000,
            threshold: 10485760
          }
        },
        ping: {
          status: 'UP'
        }
      }
    },
    '/actuator/git': {
      git: {
        branch: 'main',
        commit: {
          id: 'abc123def456',
          'id.abbrev': 'abc123d',
          time: '2024-01-01T00:00:00Z'
        },
        build: {
          version: '1.0.0',
          time: '2024-01-01T00:00:00Z'
        },
        dirty: false
      }
    },
    '/actuator/config': {
      propertySources: [
        {
          name: 'environment',
          properties: {
            PYTHON_VERSION: {
              value: '3.11.0'
            },
            CORS_ORIGINS: {
              value: '*'
            },
            DB_NAME: {
              value: 'nodeboot'
            }
          }
        }
      ]
    },
    '/actuator/memory': {
      memory: {
        total: 16777216000,
        available: 8388608000,
        percent: 50.0,
        used: 8388608000,
        free: 8388608000
      },
      swap: {
        total: 4294967296,
        used: 1073741824,
        free: 3221225472,
        percent: 25.0
      }
    },
    '/actuator/metrics': {
      names: ['system.cpu.usage', 'system.memory.usage', 'process.uptime'],
      metrics: {
        'system.cpu.usage': {
          value: 23.5,
          unit: 'percent'
        },
        'system.memory.usage': {
          value: 50.0,
          unit: 'percent'
        },
        'process.uptime': {
          value: 1234567.89,
          unit: 'seconds'
        }
      }
    },
    '/actuator/prometheus': {
      data: `# HELP system_cpu_usage The CPU usage
# TYPE system_cpu_usage gauge
system_cpu_usage 23.5

# HELP system_memory_usage The memory usage
# TYPE system_memory_usage gauge
system_memory_usage 50.0

# HELP system_memory_total Total memory
# TYPE system_memory_total gauge
system_memory_total 16777216000
`,
      contentType: 'text/plain'
    },
    '/actuator/controllers': {
      controllers: [
        {
          handler: 'root',
          method: 'GET',
          path: '/api/',
          produces: ['application/json']
        },
        {
          handler: 'create_status_check',
          method: 'POST',
          path: '/api/status',
          produces: ['application/json']
        },
        {
          handler: 'get_status_checks',
          method: 'GET',
          path: '/api/status',
          produces: ['application/json']
        }
      ]
    },
    '/actuator/interceptors': {
      interceptors: [
        {
          name: 'CORSMiddleware',
          type: 'CORS',
          order: 1,
          enabled: true
        }
      ]
    },
    '/actuator/middlewares': {
      middlewares: [
        {
          name: 'CORSMiddleware',
          type: 'starlette.middleware.cors.CORSMiddleware',
          config: {
            allow_credentials: true,
            allow_origins: ['*'],
            allow_methods: ['*'],
            allow_headers: ['*']
          }
        }
      ]
    }
  };

  // Fetch data for a specific endpoint
  const fetchEndpoint = async (endpoint) => {
    const key = endpoint.path;
    setLoading(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: null }));

    try {
      // Simulate API call with mock data for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResponse = mockData[endpoint.path];
      if (mockResponse) {
        setData(prev => ({ ...prev, [key]: mockResponse }));
      } else {
        throw new Error('Endpoint not found');
      }
      
      // Uncomment below to use real API calls in production:
      // const response = await axios.get(`${BACKEND_URL}${endpoint.path}`);
      // setData(prev => ({ ...prev, [key]: response.data }));
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load data';
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
  }, [activeTab, data]);

  // Fetch first endpoint on mount
  useEffect(() => {
    const firstEndpoint = actuatorEndpoints[0];
    fetchEndpoint(firstEndpoint);
  }, []);

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
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold font-mono">
                  <span className="text-foreground">Actuator</span>
                  <span className="text-primary text-glow ml-2">Monitor</span>
                </h1>
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
                        <code className="text-xs font-mono text-primary">{endpoint.path}</code>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
                      <span className="text-xs font-mono text-muted-foreground">Active</span>
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

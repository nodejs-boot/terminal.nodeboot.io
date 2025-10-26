import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {MatrixRain} from '../components/MatrixRain';
import {Logo} from '../components/Logo';
import {JsonViewer} from '../components/JsonViewer';
import {AlertTriangle, ArrowLeft, Download, ExternalLink, FileJson, RefreshCw} from 'lucide-react';
import {useConfig} from '../contexts/ConfigContext';
import axios from 'axios';

export const OpenAPISpecPage = () => {
    const navigate = useNavigate();
    const {getFullUrl, isConfigured, config} = useConfig();
    const [specData, setSpecData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const specUrl = isConfigured ? getFullUrl('/api-docs/swagger.json') : '';

    useEffect(() => {
        if (isConfigured) {
            fetchSpecData();
        }
    }, [isConfigured, config]);

    const fetchSpecData = async () => {
        if (!isConfigured) {
            setError('Configuration required. Please set your base URL and API path.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log(`Fetching OpenAPI spec from: ${specUrl}`);

            const response = await axios.get(specUrl, {
                timeout: 10000,
                headers: {
                    'Accept': 'application/json',
                }
            });

            setSpecData(response.data);
        } catch (error) {
            console.error('Failed to fetch OpenAPI spec:', error);

            let errorMessage = 'Failed to load OpenAPI specification';

            if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout - The server took too long to respond';
            } else if (error.response) {
                errorMessage = `Server error (${error.response.status}): ${error.response.statusText}`;
                if (error.response.data?.message) {
                    errorMessage += ` - ${error.response.data.message}`;
                }
            } else if (error.request) {
                errorMessage = 'Network error - Unable to connect to the local Node-Boot server. Please check if the service is running.';
            } else {
                errorMessage = error.message || 'Unknown error occurred';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchSpecData();
    };

    const handleDownload = () => {
        if (!specData) return;

        const content = typeof specData === 'string'
            ? specData
            : JSON.stringify(specData, null, 2);

        const blob = new Blob([content], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `openapi-spec.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const openInNewTab = () => {
            window.open(specUrl, '_blank', 'noopener,noreferrer');
    };

    const getSpecInfo = () => {
        if (!specData || typeof specData !== 'object') return null;

        return {
            title: specData.info?.title || 'API Specification',
            version: specData.info?.version || '1.0.0',
            description: specData.info?.description || 'No description available',
            pathCount: Object.keys(specData.paths || {}).length,
            componentCount: Object.keys(specData.components?.schemas || {}).length,
            serverCount: (specData.servers || []).length,
        };
    };

    const specInfo = getSpecInfo();

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Matrix Rain Background */}
            <MatrixRain density={0.1}/>

            {/* Grid Background */}
            <div className="absolute inset-0 grid-bg opacity-20"/>

            {/* Scan Line Effect */}
            <div className="scan-line absolute inset-0"/>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col h-screen">
                {/* Header */}
                <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 flex-shrink-0">
                    <div className="container mx-auto px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary border border-border text-foreground hover:border-primary transition-all duration-300 hover:shadow-glow"
                                >
                                    <ArrowLeft className="w-4 h-4"/>
                                    <span className="text-sm font-mono">Back</span>
                                </button>
                                <Logo size="small"/>
                            </div>

                            <div className="flex items-center gap-4">
                                {isConfigured && (
                                    <>
                                        <button
                                            onClick={handleRefresh}
                                            disabled={loading}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary border border-border text-foreground hover:border-primary transition-all duration-300 hover:shadow-glow text-sm font-mono disabled:opacity-50"
                                        >
                                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}/>
                                            Refresh
                                        </button>

                                        {specData && (
                                            <>
                                                <button
                                                    onClick={handleDownload}
                                                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary border border-border text-foreground hover:border-primary transition-all duration-300 hover:shadow-glow text-sm font-mono"
                                                >
                                                    <Download className="w-4 h-4"/>
                                                    Download
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={openInNewTab}
                                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-secondary border border-border text-foreground hover:border-primary transition-all duration-300 hover:shadow-glow text-sm font-mono"
                                        >
                                            <ExternalLink className="w-4 h-4"/>
                                            Open Raw
                                        </button>
                                    </>
                                )}

                                <div className="flex items-center gap-2">
                                    <FileJson className="w-5 h-5 text-primary"/>
                                    <h1 className="text-xl font-bold font-mono">
                                        <span className="text-foreground">OpenAPI</span>
                                        <span className="text-primary text-glow ml-2">Specification</span>
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 container mx-auto px-6 py-6 flex flex-col overflow-hidden">
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {!isConfigured ? (
                            // Configuration Required Message
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center space-y-4">
                                    <div
                                        className="w-16 h-16 mx-auto rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center">
                                        <AlertTriangle className="w-8 h-8 text-warning"/>
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-xl font-bold text-foreground">Configuration Required</h2>
                                        <p className="text-muted-foreground font-mono text-sm max-w-md">
                                            Please configure your API base URL and path to access the OpenAPI
                                            specification.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-mono text-sm"
                                    >
                                        Go to Settings
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Spec Content
                            <div className="space-y-4 h-full flex flex-col overflow-hidden">
                                {/* Spec Info Header */}
                                {specInfo && (
                                    <div
                                        className="glow-border rounded-lg p-4 bg-secondary/50 backdrop-blur-sm flex-shrink-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center">
                                                    <FileJson className="w-5 h-5 text-primary"/>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-foreground">{specInfo.title}</h3>
                                                    <p className="text-sm text-muted-foreground mb-2">{specInfo.description}</p>
                                                    <div
                                                        className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                                                        <span>Version: <span
                                                            className="text-primary">{specInfo.version}</span></span>
                                                        <span>Paths: <span
                                                            className="text-primary">{specInfo.pathCount}</span></span>
                                                        <span>Schemas: <span
                                                            className="text-primary">{specInfo.componentCount}</span></span>
                                                        <span>Servers: <span
                                                            className="text-primary">{specInfo.serverCount}</span></span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${
                                                    !error ? 'bg-primary pulse-glow' : 'bg-destructive'
                                                }`}/>
                                                <span className="text-xs font-mono text-muted-foreground">
                          {loading ? 'Loading' : error ? 'Error' : 'Active'}
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* URL Info */}
                                <div
                                    className="glow-border rounded-lg p-3 bg-secondary/30 backdrop-blur-sm flex items-center justify-between flex-shrink-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-muted-foreground">Endpoint:</span>
                                        <code className="text-xs font-mono text-primary">
                                            {specUrl}
                                        </code>
                                    </div>
                                    <div className="text-xs font-mono text-muted-foreground">
                                        Format: <span className="text-primary uppercase">json</span>
                                    </div>
                                </div>

                                {/* Spec Viewer */}
                                <div className="flex-1 min-h-0">
                                    <JsonViewer
                                        data={specData}
                                        isLoading={loading}
                                        error={error}
                                        title={`OpenAPI Specification (json)`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OpenAPISpecPage;

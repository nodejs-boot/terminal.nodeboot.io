import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Code, Activity, FileJson, Terminal } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const iconMap = {
  swagger: Code,
  spec: FileJson,
  actuator: Activity,
};

export const ApiCard = ({ title, description, href, icon, status = 'active', isInternal = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { getFullUrl, isConfigured } = useConfig();
  const Icon = iconMap[icon] || Terminal;

  // Get the full URL using the configuration
  const fullUrl = isConfigured ? getFullUrl(href) : href;

  const handleClick = (e) => {
    if (isInternal) {
      e.preventDefault();
      navigate(href);
    } else {
      // For external links, use the full configured URL
      if (isConfigured) {
        e.preventDefault();
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <a
      href={fullUrl}
      target={isInternal ? undefined : "_blank"}
      rel={isInternal ? undefined : "noopener noreferrer"}
      className="group relative block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="glow-border rounded-lg p-6 h-full transition-all duration-300 hover:scale-105 hover:shadow-elevated">
        {/* Status Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="relative">
            <div className={`w-2 h-2 rounded-full ${
              status === 'active' && isConfigured ? 'bg-primary' : 'bg-muted-foreground'
            } pulse-glow`} />
            <div className={`absolute inset-0 w-2 h-2 rounded-full ${
              status === 'active' && isConfigured ? 'bg-primary' : 'bg-muted-foreground'
            } animate-ping`} />
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {isConfigured ? status : 'config needed'}
          </span>
        </div>

        {/* Icon */}
        <div className="mb-4 flex items-center justify-center w-14 h-14 rounded-lg bg-secondary border border-border group-hover:border-primary transition-colors">
          <Icon 
            className={`w-7 h-7 transition-all duration-300 ${
              isHovered ? 'text-primary text-glow scale-110' : 'text-primary-glow'
            }`}
          />
        </div>

        {/* Content */}
        <div className="space-y-2 mb-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
            {title}
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Path */}
        <div className="mt-4 pt-4 border-t border-border">
          <code className="text-sm font-mono text-primary bg-secondary px-3 py-1.5 rounded border border-border inline-block group-hover:border-primary transition-colors">
            {isConfigured ? fullUrl : href}
          </code>
        </div>
      </div>
    </a>
  );
};

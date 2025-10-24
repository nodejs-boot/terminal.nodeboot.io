import React from 'react';

export const Logo = ({size = 'large'}) => {
    const sizeClasses = {
        small: 'text-xl',
        medium: 'text-2xl',
        large: 'text-4xl',
    };

    return (
        <div className="flex items-center gap-3">
            <div className="relative">
                <img src="/assets/logo.png" className={`w-12 h-12 text-primary`}/>
            </div>
            <div className={`font-bold ${sizeClasses[size]} flex items-center gap-2`}>
                <span className="text-foreground">Node</span>
                <span className="text-primary text-glow">Boot</span>
            </div>
        </div>
    );
};

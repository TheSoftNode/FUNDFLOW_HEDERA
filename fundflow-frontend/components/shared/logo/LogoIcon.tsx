import React from 'react';

interface LogoIconProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    variant?: 'default' | 'minimal' | 'gradient' | 'monochrome';
}

const LogoIcon: React.FC<LogoIconProps> = ({
    size = 'md',
    className = '',
    variant = 'default'
}) => {
    const sizeClasses = {
        xs: 'w-4 h-4',
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    const iconSizes = {
        xs: 'w-2 h-2',
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-6 h-6',
        xl: 'w-8 h-8'
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'minimal':
                return {
                    container: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600',
                    icon: 'text-gray-900 dark:text-white',
                    accent: 'text-emerald-500'
                };
            case 'gradient':
                return {
                    container: 'bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-500',
                    icon: 'text-white',
                    accent: 'text-emerald-300'
                };
            case 'monochrome':
                return {
                    container: 'bg-gray-900 dark:bg-white',
                    icon: 'text-white dark:text-gray-900',
                    accent: 'text-gray-400 dark:text-gray-600'
                };
            default:
                return {
                    container: 'bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-500 shadow-lg',
                    icon: 'text-white',
                    accent: 'text-emerald-300'
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className={`${sizeClasses[size]} ${className} relative`}>
            {/* Main logo container */}
            <div className={`relative w-full h-full rounded-xl ${styles.container} flex items-center justify-center overflow-hidden`}>
                {/* Background pattern for sophisticated look */}
                {variant === 'default' && (
                    <div className="absolute inset-0 opacity-10">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <defs>
                                <pattern id="logo-grid" width="8" height="8" patternUnits="userSpaceOnUse">
                                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.3" />
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#logo-grid)" />
                        </svg>
                    </div>
                )}

                {/* Central logo symbol */}
                <div className="relative z-10 flex items-center justify-center">
                    <div className={`${iconSizes[size]} relative`}>
                        {/* FundFlow "FF" symbol */}
                        <div className="relative w-full h-full">
                            {/* Vertical line */}
                            <div className={`absolute left-0 top-0 w-0.5 h-full ${styles.icon} rounded-full`}></div>

                            {/* Top horizontal line */}
                            <div className={`absolute left-0 top-0 w-2 h-0.5 ${styles.icon} rounded-full`}></div>

                            {/* Middle horizontal line */}
                            <div className={`absolute left-0 top-1.5 w-1.5 h-0.5 ${styles.accent} rounded-full`}></div>

                            {/* Flow indicator dots */}
                            <div className={`absolute right-0 top-0.5 w-1 h-1 ${styles.accent} rounded-full`}></div>
                            <div className={`absolute right-0 top-2 w-0.5 h-0.5 ${styles.accent} rounded-full`}></div>

                            {/* Blockchain connection points */}
                            <div className={`absolute -right-1 top-1 w-0.5 h-0.5 ${styles.accent} rounded-full opacity-60`}></div>
                            <div className={`absolute -right-1 bottom-1 w-0.5 h-0.5 ${styles.accent} rounded-full opacity-60`}></div>
                        </div>
                    </div>
                </div>

                {/* Glow effect for default variant */}
                {variant === 'default' && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-emerald-400/20 blur-sm"></div>
                )}
            </div>

            {/* Floating elements for sophistication */}
            {variant === 'default' && (
                <>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-80"></div>
                    <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60"></div>
                </>
            )}
        </div>
    );
};

export default LogoIcon; 
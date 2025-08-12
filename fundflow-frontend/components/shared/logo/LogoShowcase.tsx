"use client";

import React from 'react';
import Logo from './Logo';
import LogoIcon from './LogoIcon';
import Favicon from './Favicon';

const LogoShowcase: React.FC = () => {
    return (
        <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    FundFlow Logo System
                </h1>

                {/* Main Logo Variations */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Main Logo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Small</h3>
                            <Logo size="sm" />
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Medium</h3>
                            <Logo size="md" />
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Large</h3>
                            <Logo size="lg" />
                        </div>
                    </div>
                </section>

                {/* Logo Icon Variations */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Logo Icon</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Default</h3>
                            <div className="flex justify-center">
                                <LogoIcon size="lg" variant="default" />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Minimal</h3>
                            <div className="flex justify-center">
                                <LogoIcon size="lg" variant="minimal" />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gradient</h3>
                            <div className="flex justify-center">
                                <LogoIcon size="lg" variant="gradient" />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monochrome</h3>
                            <div className="flex justify-center">
                                <LogoIcon size="lg" variant="monochrome" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Size Variations */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Size Variations</h2>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-center space-x-8">
                            <div className="text-center">
                                <div className="mb-2">
                                    <LogoIcon size="xs" />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">XS</span>
                            </div>
                            <div className="text-center">
                                <div className="mb-2">
                                    <LogoIcon size="sm" />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">SM</span>
                            </div>
                            <div className="text-center">
                                <div className="mb-2">
                                    <LogoIcon size="md" />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">MD</span>
                            </div>
                            <div className="text-center">
                                <div className="mb-2">
                                    <LogoIcon size="lg" />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">LG</span>
                            </div>
                            <div className="text-center">
                                <div className="mb-2">
                                    <LogoIcon size="xl" />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">XL</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Favicon */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Favicon</h2>
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-center space-x-8">
                            <div className="text-center">
                                <div className="mb-2">
                                    <Favicon />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">32x32</span>
                            </div>
                            <div className="text-center">
                                <div className="mb-2 scale-150">
                                    <Favicon />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">48x48</span>
                            </div>
                            <div className="text-center">
                                <div className="mb-2 scale-200">
                                    <Favicon />
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">64x64</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Logo without text */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Logo without Text</h2>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-center">
                            <Logo showText={false} size="lg" />
                        </div>
                    </div>
                </section>

                {/* Design System Info */}
                <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Design System</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Colors</h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Primary Blue</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-purple-600 rounded"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Secondary Purple</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Accent Emerald</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Typography</h3>
                            <div className="space-y-2">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Font:</strong> Geist Sans
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Weight:</strong> Bold for logo text
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <strong>Tracking:</strong> Tight for modern look
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LogoShowcase; 
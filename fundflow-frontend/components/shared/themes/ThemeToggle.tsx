"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const ThemeToggle: React.FC = () => {
    const { setTheme, theme } = useTheme();

    return (
        <motion.div
            className="relative flex items-center border border-gray-200/30 dark:border-gray-700/30 rounded-md p-0.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow duration-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            {/* Background slider */}
            <motion.div
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded shadow-sm ${
                    theme === 'light'
                        ? 'bg-[#2F80ED]'
                        : 'bg-[#7F56D9]'
                }`}
                initial={false}
                animate={{
                    x: theme === 'dark' ? 24 : 0,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
            
            <button
                onClick={() => setTheme('light')}
                className={`relative z-10 p-1.5 rounded transition-all duration-200 ${
                    theme === 'light'
                        ? 'text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label="Light mode"
            >
                <Sun className="h-3 w-3" strokeWidth={2.5} />
            </button>
            
            <button
                onClick={() => setTheme('dark')}
                className={`relative z-10 p-1.5 rounded transition-all duration-200 ${
                    theme === 'dark'
                        ? 'text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-label="Dark mode"
            >
                <Moon className="h-3 w-3" strokeWidth={2.5} />
            </button>
        </motion.div>
    );
};

export default ThemeToggle;
import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
    return (
        <motion.div
            className={`glass-panel rounded-2xl p-6 ${className}`}
            whileHover={hover ? { scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' } : {}}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
};

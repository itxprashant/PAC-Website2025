import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ButtonProps {
    children: React.ReactNode;
    to?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    to,
    onClick,
    variant = 'primary',
    className = '',
    type = 'button',
    disabled = false
}) => {
    const baseStyles = "px-6 py-2.5 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-nebula-blue hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20",
        secondary: "bg-nebula-purple hover:bg-purple-600 text-white shadow-lg shadow-purple-500/20",
        outline: "border border-white/20 hover:border-white/40 hover:bg-white/5 text-white backdrop-blur-sm",
        ghost: "hover:bg-white/5 text-gray-300 hover:text-white"
    };

    const Component = to ? Link : motion.button;
    const props = to ? { to, className: `${baseStyles} ${variants[variant]} ${className}` } : {
        onClick,
        type,
        disabled,
        whileHover: disabled ? {} : { scale: 1.05 },
        whileTap: disabled ? {} : { scale: 0.95 },
        className: `${baseStyles} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`
    };

    return (
        // @ts-ignore
        <Component {...props}>
            {children}
        </Component>
    );
};

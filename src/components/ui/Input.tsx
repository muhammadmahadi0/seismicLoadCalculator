'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  unit?: string;
  helperText?: string;
  error?: string;
}

export function Input({ label, unit, helperText, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          className={`
            w-full px-3 py-2 border rounded-md text-sm
            border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100
            transition-colors
            font-mono
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            {unit}
          </span>
        )}
      </div>
      {(helperText || error) && (
        <span className={`text-xs ${error ? 'text-red-500' : 'text-slate-500'}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  helperText?: string;
}

export function Select({ label, options, helperText, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select
        className={`
          w-full px-3 py-2 border rounded-md text-sm
          border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100
          transition-colors bg-white
          ${className}
        `}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && (
        <span className="text-xs text-slate-500">{helperText}</span>
      )}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    secondary: 'bg-white text-emerald-600 border border-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-200">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
}

export function FormGroup({ label, children }: FormGroupProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

import React from 'react';

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) => {
  const base = "px-6 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base";
  const styles = {
    primary: "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-100",
    secondary: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-100",
    outline: "border-2 border-slate-200 text-slate-700 hover:border-purple-600 hover:text-purple-600",
    ghost: "text-slate-500 hover:text-purple-600 hover:bg-purple-50"
  };

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'purple' }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold bg-${color}-50 text-${color}-600 uppercase tracking-wider`}>
    {children}
  </span>
);

export const SectionTitle: React.FC<{ title: string; subtitle?: string; align?: 'center' | 'left' }> = ({ title, subtitle, align = 'left' }) => (
  <div className={`mb-10 ${align === 'center' ? 'text-center' : ''}`}>
    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">{title}</h2>
    {subtitle && <p className="text-slate-500 text-lg max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

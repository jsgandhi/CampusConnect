import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  className,
  variant = 'info',
  title,
  ...props
}) => {
  const styles = {
    info: {
      bg: 'bg-brand-950/40 border-brand-800 text-brand-200',
      icon: <Info className="h-5 w-5 text-brand-400 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-950/40 border-emerald-800 text-emerald-200',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-950/40 border-amber-800 text-amber-200',
      icon: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
    },
    danger: {
      bg: 'bg-rose-950/40 border-rose-800 text-rose-200',
      icon: <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />,
    },
  };

  const current = styles[variant];

  return (
    <div
      className={twMerge(
        clsx('flex gap-3 p-4 rounded-xl border text-sm backdrop-blur-md', current.bg, className)
      )}
      {...props}
    >
      {current.icon}
      <div className="space-y-1">
        {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
        <div className="text-xs opacity-90">{children}</div>
      </div>
    </div>
  );
};

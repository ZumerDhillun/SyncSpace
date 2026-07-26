import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...rest }, ref) => (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-slate-300">{label}</label>}
      <input ref={ref} className={`input-field ${error ? 'border-rose' : ''} ${className}`} {...rest} />
      {error && <p className="mt-1 text-xs text-rose">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'

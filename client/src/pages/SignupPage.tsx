import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

const schema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

function strength(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { register: doRegister, loading } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const password = watch('password') || ''
  const strengthScore = strength(password)
  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'][Math.max(0, strengthScore - 1)] || 'Weak'
  const strengthColor = ['bg-rose', 'bg-amber', 'bg-signal-500', 'bg-mint'][Math.max(0, strengthScore - 1)] || 'bg-rose'

  function onSubmit(data: FormData) {
    doRegister(data.name, data.email, data.password)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-gradient">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <span className="font-display text-lg font-semibold text-white">SyncSpace</span>
        </Link>

        <div className="glass-card p-8">
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="mt-1 text-sm text-slate-400">Start practicing in under a minute.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
            <Input label="Full Name" placeholder="Ada Lovelace" {...register('name')} error={errors.name?.message} />
            <Input label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-[38px] text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i < strengthScore ? strengthColor : 'bg-base-700'}`} />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{strengthLabel}</p>
                </div>
              )}
            </div>
            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-signal-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

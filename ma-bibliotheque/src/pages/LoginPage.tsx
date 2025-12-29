import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { loginSchema, registerSchema } from '@/schemas/auth'
import type { LoginFormData, RegisterFormData } from '@/schemas/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  const onLogin = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password)
    if (error) {
      toast.error('Email ou mot de passe incorrect')
    } else {
      toast.success('Connecte')
      navigate('/')
    }
  }

  const onRegister = async (data: RegisterFormData) => {
    const { error } = await signUp(data.email, data.password)
    if (error) {
      toast.error(error.message || 'Erreur lors de la creation du compte')
    } else {
      toast.success('Compte cree')
      navigate('/')
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    loginForm.reset()
    registerForm.reset()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === 'login' ? 'Connexion' : 'Inscription'}
          </CardTitle>
          <CardDescription>
            {mode === 'login'
              ? 'Connectez-vous a votre bibliotheque'
              : 'Creez votre compte pour commencer'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="votre@email.com"
                  disabled={loginForm.formState.isSubmitting}
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Mot de passe</Label>
                <Input
                  id="login-password"
                  type="password"
                  disabled={loginForm.formState.isSubmitting}
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loginForm.formState.isSubmitting}
              >
                {loginForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="votre@email.com"
                  disabled={registerForm.formState.isSubmitting}
                  {...registerForm.register('email')}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Mot de passe</Label>
                <Input
                  id="register-password"
                  type="password"
                  disabled={registerForm.formState.isSubmitting}
                  {...registerForm.register('password')}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="register-confirmPassword"
                  type="password"
                  disabled={registerForm.formState.isSubmitting}
                  {...registerForm.register('confirmPassword')}
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={registerForm.formState.isSubmitting}
              >
                {registerForm.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creation...
                  </>
                ) : (
                  'Creer un compte'
                )}
              </Button>
            </form>
          )}

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary hover:underline"
            >
              {mode === 'login'
                ? "Pas de compte ? S'inscrire"
                : 'Deja un compte ? Se connecter'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

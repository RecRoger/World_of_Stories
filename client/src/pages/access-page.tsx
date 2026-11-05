import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginInputSchema, registerInputSchema, type LoginInput, type RegisterInput } from '@wos/shared';
import { headerLinkClass, SiteLayout } from '@/components/layout/site-layout';
import { Button } from '@/components/ui/button';
import { Paper } from '@/components/ui/paper';
import { Field } from '@/components/form/field';
import { applyServerErrors } from '@/components/form/server-errors';
import { useLogin, useRegister } from '@/features/auth/api';
import { cn } from '@/lib/utils';

type Mode = 'login' | 'register';

/**
 * 2 · Iniciar sesión / Registrarse. La pestaña activa vive en la URL (`?mode=register`) para poder enlazarla.
 * Al entrar, `GuestOnly` detecta la sesión nueva y redirige; esta página no navega por su cuenta.
 */
export function AccessPage() {
  const [params, setParams] = useSearchParams();
  const mode: Mode = params.get('mode') === 'register' ? 'register' : 'login';
  const setMode = (next: Mode) => setParams(next === 'register' ? { mode: 'register' } : {}, { replace: true });

  return (
    <SiteLayout
      action={
        <Link to="/" className={headerLinkClass}>
          Volver al inicio
        </Link>
      }
      className="items-center justify-center pt-10 pb-8"
    >
      <Paper className="flex w-[min(100%,460px)] flex-col gap-7 px-[clamp(24px,6vw,48px)] pt-10 pb-11">
        <div className="grid grid-cols-2 border-b border-ink">
          <ModeTab active={mode === 'login'} onClick={() => setMode('login')}>
            Iniciar sesión
          </ModeTab>
          <ModeTab active={mode === 'register'} onClick={() => setMode('register')}>
            Registrarse
          </ModeTab>
        </div>

        {/* `key` reinicia el formulario (valores y errores) al cambiar de pestaña */}
        {mode === 'login' ? <LoginForm key="login" /> : <RegisterForm key="register" />}
      </Paper>
    </SiteLayout>
  );
}

function ModeTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'min-h-12 cursor-pointer border-0 font-serif text-[19px] transition-colors',
        active ? 'bg-ink text-paper' : 'bg-transparent text-ink hover:bg-ink/5',
      )}
    >
      {children}
    </button>
  );
}

function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-display text-[44px] leading-none font-semibold">{title}</h1>
      <p className="text-[19px] leading-[1.45] text-ink-muted">{subtitle}</p>
    </div>
  );
}

function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="bg-danger/8px-3.5 py-2.5 text-[17px] text-danger">
      {message}
    </p>
  );
}

function LoginForm() {
  const login = useLogin();
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, setError, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await login.mutateAsync(values);
    } catch (err) {
      setFormError(applyServerErrors(err, setError, ['identifier', 'password']));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
      <Heading title="Bienvenido de vuelta" subtitle="Tus historias te esperan donde las dejaste." />
      <FormError message={formError} />
      <div className="flex flex-col gap-5">
        <Field
          label="Correo o nombre de pluma"
          autoComplete="username"
          error={formState.errors.identifier && 'Escribe tu correo o tu nombre de pluma'}
          {...register('identifier')}
        />
        <Field
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          error={formState.errors.password && 'Escribe tu contraseña'}
          {...register('password')}
        />
      </div>
      <Button type="submit" loading={formState.isSubmitting}>
        {formState.isSubmitting ? 'Entrando' : 'Entrar'}
      </Button>
    </form>
  );
}

function RegisterForm() {
  const signUp = useRegister();
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, setError, formState } = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
  });
  const { errors } = formState;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await signUp.mutateAsync(values);
    } catch (err) {
      setFormError(applyServerErrors(err, setError, ['username', 'email', 'password']));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
      <Heading title="Abre tu primer capítulo" subtitle="Crea tu cuenta para escribir y leer sin límites." />
      <FormError message={formError} />
      <div className="flex flex-col gap-5">
        <Field label="Nombre de pluma" autoComplete="nickname" error={errors.username?.message} {...register('username')} />
        <Field label="Correo electrónico" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Field
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>
      <Button type="submit" loading={formState.isSubmitting}>
        {formState.isSubmitting ? 'Creando cuenta' : 'Crear cuenta'}
      </Button>
    </form>
  );
}

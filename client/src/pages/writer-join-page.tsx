import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { becomeWriterInputSchema, type BecomeWriterInput } from '@wos/shared';
import { headerLinkClass, SiteLayout } from '@/components/layout/site-layout';
import { Button } from '@/components/ui/button';
import { Paper } from '@/components/ui/paper';
import { Field } from '@/components/form/field';
import { applyServerErrors } from '@/components/form/server-errors';
import { QuillIcon } from '@/components/icons';
import { useBecomeWriter, useMe } from '@/features/auth/api';
import { isWriter } from '@/features/auth/roles';
import { WritingGuidelines } from '@/features/writer/writing-guidelines';

/** 4 · Entrada para escritores: solicitar el rol Writer con el código de invitación. */
export function WriterJoinPage() {
  const { data: user } = useMe();
  const becomeWriter = useBecomeWriter();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, setError, formState } = useForm<BecomeWriterInput>({
    resolver: zodResolver(becomeWriterInputSchema),
  });

  // Quien ya es escritor no tiene nada que solicitar (salvo justo tras canjear, que navega por su cuenta)
  if (isWriter(user) && !becomeWriter.isSuccess) return <Navigate to="/write" replace />;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await becomeWriter.mutateAsync(values);
      navigate('/write', { replace: true });
    } catch (err) {
      setFormError(applyServerErrors(err, setError, ['code']));
    }
  });

  return (
    <SiteLayout
      brandExtra={<WritingGuidelines />}
      action={
        <Link to="/home" className={headerLinkClass}>
          Volver
        </Link>
      }
      className="items-center justify-center pt-10 pb-8"
    >
      <Paper className="w-[min(100%,500px)] px-[clamp(24px,6vw,52px)] pt-11 pb-12">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
          <QuillIcon width={44} height={44} />
          <div className="flex flex-col gap-2.5">
            <h1 className="font-display text-[44px] leading-none font-semibold text-balance">Entrada para escritores</h1>
            <p className="text-xl leading-normal text-pretty text-ink-soft">
              Para escribir en World of Stories necesitas el rol de Writer. Ingresa tu código de invitación para solicitarlo.
            </p>
          </div>
          {formError && (
            <p role="alert" className="bg-danger/8 px-3.5 py-2.5 text-[17px] text-danger">
              {formError}
            </p>
          )}
          <Field
            label="Código de invitación"
            autoComplete="off"
            spellCheck={false}
            className="min-h-14 px-4 text-[22px] tracking-[0.18em]"
            error={formState.errors.code && 'Escribe tu código de invitación'}
            {...register('code')}
          />
          <Button type="submit" loading={formState.isSubmitting}>
            {formState.isSubmitting ? 'Validando' : 'Validar código'}
          </Button>
        </form>
      </Paper>
    </SiteLayout>
  );
}

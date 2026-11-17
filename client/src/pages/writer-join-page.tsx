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
import './writer-join-page.scss';

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
      className="writer-join-page"
    >
      <Paper className="writer-join-page__card">
        <form onSubmit={onSubmit} noValidate className="writer-join-page__form">
          <QuillIcon width={44} height={44} />
          <div className="writer-join-page__heading">
            <h1 className="writer-join-page__title">Entrada para escritores</h1>
            <p className="writer-join-page__text">
              Para escribir en World of Stories necesitas el rol de Writer. Ingresa tu código de invitación para solicitarlo.
            </p>
          </div>
          {formError && (
            <p role="alert" className="writer-join-page__error">
              {formError}
            </p>
          )}
          <Field
            label="Código de invitación"
            autoComplete="off"
            spellCheck={false}
            className="writer-join-page__code"
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

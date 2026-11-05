import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { FieldErrors, FormResult } from '../types'

const UNEXPECTED_ERROR = 'Đã có lỗi xảy ra. Vui lòng thử lại.'

type Options<F extends Record<string, string>> = {
  initialValues: F
  validate: (values: F) => FieldErrors<F>
  submit: (values: F) => Promise<FormResult<F> | void>
}

/**
 * Form state for the auth screens: values, per-field errors, a form-level
 * error and the submitting flag. Errors on a field clear as soon as it changes.
 */
export function useAuthForm<F extends Record<string, string>>({ initialValues, validate, submit }: Options<F>) {
  const [values, setValues] = useState<F>(initialValues)
  const [errors, setErrors] = useState<FieldErrors<F>>({})
  const [formError, setFormError] = useState<string>()
  const [submitting, setSubmitting] = useState(false)

  function field(name: keyof F & string) {
    return {
      name,
      value: values[name],
      error: errors[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setValues((current) => ({ ...current, [name]: value }))
        setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
      },
    }
  }

  /** Runs client validation; focuses the first invalid field. */
  function validateAll(form?: HTMLFormElement | null) {
    const nextErrors = validate(values)
    const invalid = Object.keys(nextErrors).filter((key) => nextErrors[key as keyof F & string])
    setErrors(nextErrors)
    setFormError(undefined)
    if (invalid.length > 0) {
      const input = form?.elements.namedItem(invalid[0])
      if (input instanceof HTMLElement) input.focus()
      return false
    }
    return true
  }

  /** Calls the submit handler; resolves true on success. */
  async function run() {
    if (submitting) return false
    setSubmitting(true)
    setFormError(undefined)
    try {
      const result = await submit(values)
      if (result && (result.formError || hasErrors(result.fieldErrors))) {
        setErrors(result.fieldErrors ?? {})
        setFormError(result.formError)
        return false
      }
      return true
    } catch {
      setFormError(UNEXPECTED_ERROR)
      return false
    } finally {
      setSubmitting(false)
    }
  }

  /** Default submit flow: validate, then run. */
  function handleSubmit(onSuccess?: () => void) {
    return async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!validateAll(event.currentTarget)) return
      if (await run()) onSuccess?.()
    }
  }

  return { values, field, formError, submitting, validateAll, run, handleSubmit }
}

function hasErrors(errors: object | undefined) {
  return !!errors && Object.values(errors).some(Boolean)
}

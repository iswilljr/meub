import { ZodError } from 'zod'

export function zodError(error: unknown) {
  if (!(error instanceof ZodError)) return

  return error.issues.at(0)?.message
}

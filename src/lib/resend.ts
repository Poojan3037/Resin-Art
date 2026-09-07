import "server-only";

import { Resend } from "resend";

/**
 * Thrown when the Resend key is absent. Distinct from a send failure so the
 * server log says "misconfigured" rather than "the API rejected us".
 */
export class EmailNotConfiguredError extends Error {
  constructor() {
    super("RESEND_API_KEY is not set — email sending is disabled.");
    this.name = "EmailNotConfiguredError";
  }
}

let client: Resend | null = null;

/**
 * Lazily built Resend client.
 *
 * `new Resend(undefined)` THROWS. Constructing it at module scope therefore
 * broke the whole module on import when the key was missing — the server
 * action 500'd before its own try/catch could run, and the caller saw a
 * rejected promise instead of a handled `{ success: false }`. Building it
 * inside the action keeps the failure catchable.
 */
export const getResend = (): Resend => {
  if (!process.env.RESEND_API_KEY) throw new EmailNotConfiguredError();
  return (client ??= new Resend(process.env.RESEND_API_KEY));
};

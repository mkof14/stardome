"use client";

import { useState, type FormEvent } from "react";
import { usePreferences } from "@/lib/i18n/context";

const ASSET_KEYS = [
  "yacht",
  "marina",
  "port",
  "island",
  "special",
  "family",
  "other",
] as const;

type Field = "name" | "email" | "asset" | "message";

type Values = {
  name: string;
  organization: string;
  email: string;
  asset: string;
  message: string;
};

const empty: Values = {
  name: "",
  organization: "",
  email: "",
  asset: "",
  message: "",
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactForm({ initialMessage = "" }: { initialMessage?: string }) {
  const { t } = usePreferences();
  const [values, setValues] = useState<Values>({ ...empty, message: initialMessage });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function setField<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (key === "organization") return;
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function validate(next: Values) {
    const nextErrors: Partial<Record<Field, string>> = {};
    if (!next.name.trim()) nextErrors.name = t.contact.required;
    if (!next.email.trim()) nextErrors.email = t.contact.required;
    else if (!isEmail(next.email.trim())) nextErrors.email = t.contact.invalidEmail;
    if (!next.asset) nextErrors.asset = t.contact.required;
    if (!next.message.trim()) nextErrors.message = t.contact.required;
    return nextErrors;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setSubmitError(null);
    if (Object.keys(nextErrors).length) return;

    setBusy(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          organization: values.organization.trim(),
          email: values.email.trim(),
          assetType:
            t.contact.assets[ASSET_KEYS.indexOf(values.asset as (typeof ASSET_KEYS)[number])] ??
            values.asset,
          message: values.message.trim(),
        }),
      });
      if (!response.ok) {
        setSubmitError(t.contact.error);
        return;
      }
      setSent(true);
    } catch {
      setSubmitError(t.contact.error);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <p className="border-s-2 border-orange ps-4 font-body text-base leading-relaxed text-bridge-text" role="status">
        {t.contact.success}
      </p>
    );
  }

  const fieldClass =
    "w-full rounded-2xl border border-bridge-line bg-bridge-bg px-4 py-2.5 text-bridge-text outline-none focus:border-orange";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="contact-name" className="block text-sm text-bridge-text">
          {t.contact.name}
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(event) => setField("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className={`${fieldClass} ${errors.name ? "border-crit" : ""}`}
        />
        {errors.name ? (
          <p id="contact-name-error" className="text-sm text-crit">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-organization" className="block text-sm text-bridge-text">
          {t.contact.organization}{" "}
          <span className="text-bridge-dim">({t.contact.optional})</span>
        </label>
        <input
          id="contact-organization"
          name="organization"
          type="text"
          autoComplete="organization"
          value={values.organization}
          onChange={(event) => setField("organization", event.target.value)}
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-email" className="block text-sm text-bridge-text">
          {t.contact.email}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => setField("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className={`${fieldClass} ${errors.email ? "border-crit" : ""}`}
        />
        {errors.email ? (
          <p id="contact-email-error" className="text-sm text-crit">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-asset" className="block text-sm text-bridge-text">
          {t.contact.assetType}
        </label>
        <select
          id="contact-asset"
          name="asset"
          value={values.asset}
          onChange={(event) => setField("asset", event.target.value)}
          aria-invalid={Boolean(errors.asset)}
          aria-describedby={errors.asset ? "contact-asset-error" : undefined}
          className={`${fieldClass} ${errors.asset ? "border-crit" : ""}`}
        >
          <option value="">{t.contact.assetSelect}</option>
          {ASSET_KEYS.map((key, index) => (
            <option key={key} value={key}>
              {t.contact.assets[index]}
            </option>
          ))}
        </select>
        {errors.asset ? (
          <p id="contact-asset-error" className="text-sm text-crit">
            {errors.asset}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="contact-message" className="block text-sm text-bridge-text">
          {t.contact.message}
        </label>
        <textarea
          id="contact-message"
          data-testid="contact-message"
          name="message"
          rows={5}
          placeholder={t.contact.messagePlaceholder}
          value={values.message}
          onChange={(event) => setField("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`${fieldClass} ${errors.message ? "border-crit" : ""}`}
        />
        {errors.message ? (
          <p id="contact-message-error" className="text-sm text-crit">
            {errors.message}
          </p>
        ) : null}
      </div>

      {submitError ? (
        <p className="text-sm text-crit" role="alert">
          {submitError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center rounded-2xl border border-orange/40 bg-orange/10 px-4 py-2.5 font-body text-sm font-semibold text-orange hover:bg-orange/15 disabled:opacity-60"
      >
        {busy ? t.contact.sending : t.contact.send}
      </button>
    </form>
  );
}

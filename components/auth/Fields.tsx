"use client";

import { useId, useState } from "react";

const inputClass =
  "w-full rounded-lg border bg-plum px-3.5 py-3 text-paper placeholder:text-mist/50 outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/30";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

export function TextField({
  label, name, type = "text", autoComplete, placeholder, error, hint, value, onChange, inputMode,
}: FieldProps) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`${inputClass} ${error ? "border-red-400" : "border-white/15"}`}
      />
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-red-300">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-mist">{hint}</p>
      ) : null}
    </div>
  );
}

export function PasswordField(props: Omit<FieldProps, "type" | "inputMode">) {
  const id = useId();
  const [show, setShow] = useState(false);
  const { label, name, autoComplete, placeholder, error, hint, value, onChange } = props;
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${inputClass} pr-20 ${error ? "border-red-400" : "border-white/15"}`}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-pressed={show}
          className="absolute inset-y-0 right-0 rounded-r-lg px-3.5 text-sm text-mist hover:text-paper focus-visible:outline-2 focus-visible:outline-amber"
        >
          {show ? "Sembunyikan" : "Tampilkan"}
        </button>
      </div>
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-red-300">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-mist">{hint}</p>
      ) : null}
    </div>
  );
}

export function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      // TODO: sambungkan ke provider OAuth (mis. NextAuth: signIn("google"))
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/15 py-3 font-medium transition-colors hover:bg-plum focus-visible:outline-2 focus-visible:outline-amber"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.4-4.7 3.4-8z" />
        <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.2 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2.1v2.8A11 11 0 0 0 12 23z" />
        <path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.6-2.8z" />
        <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.3 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.6 2.8C6.6 7.4 9.100 5.400 12 5.400z" />
      </svg>
      {label}
    </button>
  );
}

export function Divider({ text }: { text: string }) {
  return (
    <div className="my-6 flex items-center gap-4 text-sm text-mist">
      <span className="h-px flex-1 bg-white/10" />
      {text}
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

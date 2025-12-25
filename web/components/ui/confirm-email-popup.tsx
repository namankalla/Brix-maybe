"use client";

import * as React from "react";

type ConfirmEmailPopupProps = {
  open: boolean;
  onClose: () => void;
  email?: string;
};

export function ConfirmEmailPopup({ open, onClose, email }: ConfirmEmailPopupProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg mx-auto rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl text-white p-8">
        <h3 className="text-2xl font-semibold tracking-tight">Check your inbox</h3>
        <p className="mt-2 text-white/80">
          We sent a confirmation link {email ? (<><span>to </span><span className="text-white">{email}</span></>) : null}. Please click the link in the email to verify your account.
        </p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 h-10 rounded-lg border border-white/30 text-white hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const TEMPLATE = `NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-me-with-random
GOOGLE_CLIENT_ID=replace-me
GOOGLE_CLIENT_SECRET=replace-me
DATABASE_URL=postgresql://replace-me
`;

export function CopyEnvTemplateButton() {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(TEMPLATE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
    >
      {copied ? "Copied" : "Copy .env.local template"}
    </button>
  );
}

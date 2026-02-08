export type AuthEnv = {
  ok: boolean;
  missing: string[];
  values: {
    NEXTAUTH_URL: string | undefined;
    NEXTAUTH_SECRET: string | undefined;
    GOOGLE_CLIENT_ID: string | undefined;
    GOOGLE_CLIENT_SECRET: string | undefined;
  };
};

export function getAuthEnv(): AuthEnv {
  const values = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  };

  const missing: string[] = [];
  if (!values.NEXTAUTH_URL) missing.push('NEXTAUTH_URL');
  if (!values.NEXTAUTH_SECRET) missing.push('NEXTAUTH_SECRET');
  if (!values.GOOGLE_CLIENT_ID) missing.push('GOOGLE_CLIENT_ID');
  if (!values.GOOGLE_CLIENT_SECRET) missing.push('GOOGLE_CLIENT_SECRET');

  return {
    ok: missing.length === 0,
    missing,
    values,
  };
}

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { getAuthEnv } = require('../../lib/auth-env.js') as typeof import('../../lib/auth-env.js');
  const authEnv = getAuthEnv();

  const errorParam = searchParams?.error;
  const error = Array.isArray(errorParam) ? errorParam[0] : errorParam;

  const errorDescriptionParam = searchParams?.error_description;
  const errorDescription = Array.isArray(errorDescriptionParam)
    ? errorDescriptionParam[0]
    : errorDescriptionParam;

  const callbackUrlParam = searchParams?.callbackUrl;
  const callbackUrl = Array.isArray(callbackUrlParam)
    ? callbackUrlParam[0]
    : callbackUrlParam;

  const timestamp = new Date().toISOString();

  const tryAgainHref = (() => {
    const params = new URLSearchParams();
    if (error) params.set('error', error);
    if (callbackUrl) params.set('callbackUrl', callbackUrl);
    const qs = params.toString();
    return qs ? `/auth/signin?${qs}` : '/auth/signin';
  })();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-6">
          There was an error signing you in. Please try again.
        </p>
        {error && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left">
            <p className="text-xs font-semibold text-gray-700">NextAuth error code</p>
            <p className="mt-1 font-mono text-xs text-gray-900 break-all">{error}</p>
          </div>
        )}
        {errorDescription && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left">
            <p className="text-xs font-semibold text-gray-700">error_description</p>
            <p className="mt-1 font-mono text-xs text-gray-900 break-all">{errorDescription}</p>
          </div>
        )}
        {(callbackUrl || timestamp) && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left">
            <p className="text-xs font-semibold text-gray-700">Context</p>
            {callbackUrl && (
              <p className="mt-1 text-xs text-gray-900 break-all">
                <span className="font-semibold">callbackUrl:</span> {callbackUrl}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-900 break-all">
              <span className="font-semibold">timestamp:</span> {timestamp}
            </p>
          </div>
        )}

        {!authEnv.ok && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-left">
            <p className="text-xs font-semibold text-gray-700">Fix locally</p>
            <p className="mt-1 text-xs text-gray-900">
              Missing env vars:
            </p>
            <p className="mt-1 font-mono text-xs text-gray-900 break-all">
              {authEnv.missing.join(', ')}
            </p>
            <p className="mt-2 text-xs text-gray-700">
              Set them in <span className="font-mono">.env.local</span> and restart the dev server.
            </p>
          </div>
        )}

        <div className="mb-6 flex items-center justify-center gap-3">
          {(() => {
            const { CopyEnvTemplateButton } = require('./CopyEnvTemplateButton') as typeof import('./CopyEnvTemplateButton');
            return <CopyEnvTemplateButton />;
          })()}
        </div>
        <a
          href={tryAgainHref}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </a>
      </div>
    </div>
  );
}

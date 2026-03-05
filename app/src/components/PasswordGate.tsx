import { useState, useEffect } from 'react';

// SHA-256 hash of "username:password" — credentials never stored in plain text
const CREDENTIAL_HASH = 'c16a6ac685daba3602767f2b6b5808a5c79788873c137622c15005a43776245a';
const SESSION_KEY = 'tld_auth';

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'true') setAuthed(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(false);
    const hash = await sha256(`${username.trim().toLowerCase()}:${password}`);
    if (hash === CREDENTIAL_HASH) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setAuthed(true);
    } else {
      setError(true);
      setPassword('');
    }
    setChecking(false);
  }

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#04101f] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0a84ff] mb-4">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#c8dff5]">TLD Risk Checker</h1>
          <p className="text-[#3a6888] text-sm mt-1">Internal access only</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#071830] rounded-2xl p-6 space-y-4 border border-[#0e2a4a]">
          <div>
            <label className="block text-xs font-medium text-[#3a6888] uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-[#030c18] text-[#c8dff5] rounded-lg px-3 py-2.5 text-sm border border-[#0e2a4a] focus:outline-none focus:border-[#0a84ff] focus:ring-1 focus:ring-[#0a84ff] placeholder-[#1a3a5a]"
              placeholder="Enter username"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#3a6888] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#030c18] text-[#c8dff5] rounded-lg px-3 py-2.5 text-sm border border-[#0e2a4a] focus:outline-none focus:border-[#0a84ff] focus:ring-1 focus:ring-[#0a84ff] placeholder-[#1a3a5a]"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <p className="text-[#ff453a] text-sm text-center">
              Incorrect credentials. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={checking}
            className="w-full bg-[#0a84ff] hover:bg-[#2a94ff] disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors"
          >
            {checking ? 'Verifying…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-[#0e2a4a] text-xs mt-6">
          ICANN 2026 Round · For internal use only
        </p>
      </div>
    </div>
  );
}

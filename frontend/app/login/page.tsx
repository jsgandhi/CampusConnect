'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight, UserCheck, ShieldAlert, Lock, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { PREDEFINED_PERSONAS, validatePersonaCredentials, StudentPersona } from '@/lib/personas';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('student@cstu.edu');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  // Field-level error validation state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  const validateFormInputs = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setAuthError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Campus email address is required.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Please enter a valid campus email address (e.g., student@cstu.edu).');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFormInputs()) {
      return;
    }

    setIsLoading(true);

    // Validate credentials against local array of predefined student persona objects
    const personaMatch = validatePersonaCredentials(email, password);

    setTimeout(() => {
      setIsLoading(false);

      if (personaMatch) {
        // Save active persona to localStorage for frontend state persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('campusconnect_user', JSON.stringify(personaMatch));
        }

        // Perform fake URL validation/redirect on frontend for verification routines
        // (Note: For real authentication workflows, NextAuth OAuth providers like Google/Azure AD are plugged in here)
        const destination = personaMatch.role === 'IT_DIRECTOR' ? '/observability' : '/dashboard';
        const fakeValidatedUrl = `${destination}?persona=${encodeURIComponent(personaMatch.email)}&verified=true`;
        router.push(fakeValidatedUrl);
      } else {
        setAuthError('Invalid credentials. Please verify your CSTU email and password.');
        setEmailError('Invalid email or password match.');
        setPasswordError('Invalid email or password match.');
      }
    }, 500);
  };

  const handleSelectPreset = (persona: StudentPersona) => {
    setEmail(persona.email);
    setPassword(persona.passwordHash);
    setEmailError('');
    setPasswordError('');
    setAuthError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Dynamic background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/15 blur-3xl rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-brand-600 via-accent-500 to-brand-400 text-white shadow-xl shadow-brand-900/40 mb-1">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">CSTU Campus Sign In</h1>
          <p className="text-xs text-slate-400">CampusConnect Consolidated Student Authentication</p>
        </div>

        <Card className="glass-panel border-slate-700/60 shadow-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Predefined Persona Login</CardTitle>
            <CardDescription>
              Sign in with your CSTU campus persona credentials to access your personalized dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {authError && (
              <Alert variant="danger" title="Authentication Failure" className="animate-shake">
                {authError}
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <div className="space-y-1">
                <Input
                  label="Campus Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="student@cstu.edu"
                  error={emailError}
                  className={emailError ? 'border-rose-500/80 focus:ring-rose-500 bg-rose-950/20' : ''}
                  required
                />
              </div>

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="••••••••"
                  error={passwordError}
                  className={passwordError ? 'border-rose-500/80 focus:ring-rose-500 bg-rose-950/20' : ''}
                  required
                />
              </div>

              <Button type="submit" className="w-full font-semibold gap-2 mt-2" isLoading={isLoading}>
                Sign In to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            {/* Quick Persona Preset Selector */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  Campus Persona Credentials
                </p>
                <span className="text-[10px] text-brand-400 font-mono">Password: password123</span>
              </div>

              <div className="space-y-2">
                {PREDEFINED_PERSONAS.map((persona) => {
                  const isSelected = email.toLowerCase() === persona.email.toLowerCase();

                  return (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => handleSelectPreset(persona)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-brand-600/20 border-brand-500/80 shadow-md shadow-brand-900/30'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={persona.avatarUrl} alt={persona.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                            {persona.name}
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                              {persona.role}
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{persona.email}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold font-mono ${isSelected ? 'text-brand-400' : 'text-slate-500'}`}>
                        {isSelected ? 'Selected' : 'Use'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OAuth Readiness Note */}
            <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-mono">
              <Lock className="h-3 w-3 text-slate-400" />
              NextAuth OAuth provider ready (Google / Azure AD)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

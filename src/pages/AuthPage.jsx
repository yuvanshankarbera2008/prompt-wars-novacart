import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Phone, 
  User, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  KeyRound, 
  Tag, 
  ArrowRight,
  Truck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function AuthPage() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('yuvan@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginOtp, setLoginOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Signup form state
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [referralCode, setReferralCode] = useState('');
  const [influencerCode, setInfluencerCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (loginMethod === 'otp') {
      if (!otpSent) {
        if (!loginIdentifier) {
          setErrorMsg('Please enter your mobile number or email');
          return;
        }
        setOtpSent(true);
        setSuccessMsg('Mock OTP sent: 123456');
        return;
      }
      if (loginOtp !== '123456' && loginOtp.length < 4) {
        setErrorMsg('Invalid OTP. Please enter 123456');
        return;
      }
    } else {
      if (!loginIdentifier || !loginPassword) {
        setErrorMsg('Please enter email/phone and password');
        return;
      }
    }

    const res = login(loginIdentifier, loginPassword, loginMethod);
    if (res.success) {
      navigate('/');
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!mobile || mobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    const res = signup({
      name,
      mobile,
      email,
      password: signupPassword,
      city,
      referralCode,
      influencerCode
    });

    if (res.success) {
      navigate('/');
    }
  };

  const handleMockGoogleLogin = () => {
    login('google_user@gmail.com', 'google_auth_token');
    navigate('/');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 py-8 bg-slate-50/80">
      <div className="max-w-md w-full">
        {/* Promotional Welcome Banner (Section 3 & 4) */}
        <div className="mb-4 bg-gradient-to-r from-brand-950 via-brand-800 to-indigo-800 text-white p-4 rounded-3xl shadow-xl border border-brand-700/40 relative overflow-hidden">
          <div className="flex items-start gap-3 relative z-10">
            <div className="p-2.5 bg-amber-400 text-slate-900 rounded-2xl shrink-0 font-black shadow-md">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  New Customer Guarantee
                </span>
              </div>
              <h3 className="text-base font-black tracking-tight mt-1 text-white">
                50% OFF your first order + FREE delivery on first 3 orders! 🎉
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Reliable 10–30 min delivery from 620+ local neighbourhood stores.
              </p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 m-4 rounded-2xl">
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              id="tab-login-btn"
              className={`py-2.5 text-xs font-black rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white text-brand-900 shadow-md shadow-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setErrorMsg(''); }}
              id="tab-signup-btn"
              className={`py-2.5 text-xs font-black rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white text-brand-900 shadow-md shadow-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account (50% Off)
            </button>
          </div>

          <div className="p-6 pt-2">
            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl">
                {successMsg}
              </div>
            )}

            {mode === 'login' ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Sign in using:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setLoginMethod('password'); setOtpSent(false); }}
                      className={`text-xs ${loginMethod === 'password' ? 'text-brand-600 underline' : 'text-slate-400'}`}
                    >
                      Password
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => { setLoginMethod('otp'); setOtpSent(false); }}
                      className={`text-xs ${loginMethod === 'otp' ? 'text-brand-600 underline' : 'text-slate-400'}`}
                    >
                      Mock OTP
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Mobile Number or Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="login-identifier-input"
                      placeholder="e.g. 9845012345 or user@example.com"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                {loginMethod === 'password' ? (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => alert("Password reset link sent to registered email.")}
                        className="text-xs font-semibold text-brand-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="login-password-input"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">One-Time Password (OTP)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder={otpSent ? "Enter 123456" : "Click 'Send OTP' below"}
                        value={loginOtp}
                        onChange={(e) => setLoginOtp(e.target.value)}
                        disabled={!otpSent}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:opacity-60"
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                    />
                    <span className="text-xs font-medium text-slate-600">Remember me</span>
                  </label>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    256-bit Secure
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="login-submit-btn"
                  className="w-full py-3 bg-gradient-to-r from-brand-700 to-indigo-600 hover:from-brand-800 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-lg shadow-brand-700/25 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <span>{loginMethod === 'otp' && !otpSent ? 'Send OTP' : 'Sign In to NOVA CART'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* SIGNUP FORM */
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="signup-name-input"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        id="signup-mobile-input"
                        required
                        placeholder="9845012345"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City Hub</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    >
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Delhi-NCR">Delhi-NCR</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      id="signup-email-input"
                      required
                      placeholder="priya@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="signup-password-input"
                      required
                      placeholder="At least 6 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
                      Referral Code <span className="font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NOVA-FRIEND"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
                      Influencer Code <span className="font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NOVA-RIYA"
                      value={influencerCode}
                      onChange={(e) => setInfluencerCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="signup-submit-btn"
                  className="w-full mt-3 py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-emerald-100" />
                  <span>Create Account & Claim 50% Off</span>
                </button>
              </form>
            )}

            {/* Social Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold">Or continue with</span>
              </div>
            </div>

            {/* Mock Google Login Button */}
            <button
              type="button"
              onClick={handleMockGoogleLogin}
              id="google-login-btn"
              className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-700 shadow-2xs flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Your personal data is encrypted & protected by NOVA Safeguard</span>
          </p>
        </div>
      </div>
    </div>
  );
}

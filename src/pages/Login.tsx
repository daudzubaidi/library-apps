import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { setCredentials } from '../store/authSlice';
import { useLoginMutation } from '../hooks/useAuth';
import { toast } from 'sonner';
import Logo from '../components/Logo';

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 10C2.5 10 5 5 10 5C15 5 17.5 10 17.5 10C17.5 10 15 15 10 15C5 15 2.5 10 2.5 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({ email, password });

      dispatch(setCredentials({
        token: result.token,
        user: result.user
      }));

      toast.success('Login successful!');
      navigate('/');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      setErrors({ email: errorMessage });
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background */}
      <div className="absolute inset-0 bg-white" />

      {/* Content Container - Centered */}
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="flex w-[400px] flex-col gap-[20px]">

          {/* Logo & Brand */}
          <div className="flex items-center gap-[11.786px]">
            <Logo />
            <p
              className="text-[25.143px] font-bold leading-[33px] text-display"
              style={{
                fontFamily: 'var(--font-family-quicksand)',
                color: 'var(--color-neutral-950)'
              }}
            >
              Booky
            </p>
          </div>

          {/* Title & Subtitle */}
          <div className="flex w-[290px] flex-col gap-[8px] whitespace-pre-wrap">
            <p
              className="text-display-sm font-bold"
              style={{
                fontFamily: 'var(--font-family-quicksand)',
                fontSize: 'var(--font-size-display-sm)',
                lineHeight: 'var(--line-height-display-sm)',
                color: 'var(--color-neutral-950)',
                letterSpacing: '-0.56px'
              }}
            >
              Login
            </p>
            <p
              className="text-md font-semibold"
              style={{
                fontFamily: 'var(--font-family-quicksand)',
                fontSize: 'var(--font-size-text-md)',
                lineHeight: 'var(--line-height-text-md)',
                color: 'var(--color-neutral-700)',
                letterSpacing: '-0.32px'
              }}
            >
              Sign in to manage your library account.
            </p>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[16px]">

            {/* Email Input Field */}
            <div className="flex w-full flex-col gap-[2px] bg-white">
              <label
                htmlFor="email"
                className="text-sm font-bold"
                style={{
                  fontFamily: 'var(--font-family-quicksand)',
                  fontSize: 'var(--font-size-text-sm)',
                  lineHeight: 'var(--line-height-text-sm)',
                  color: 'var(--color-neutral-950)',
                  letterSpacing: '-0.28px'
                }}
              >
                Email
              </label>
              <div
                className={`flex h-[48px] w-full items-center gap-[8px] rounded-[var(--radius-xl)] border border-solid px-[16px] py-[8px] ${
                  errors.email ? 'border-[var(--color-accent-red)]' : 'border-[var(--color-neutral-300)]'
                }`}
              >
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="Enter your email"
                  className="flex-1 border-none bg-transparent outline-none"
                  style={{
                    fontFamily: 'var(--font-family-quicksand)',
                    fontSize: 'var(--font-size-text-sm)',
                    lineHeight: 'var(--line-height-text-sm)',
                    color: 'var(--color-neutral-950)'
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-xs" style={{ color: 'var(--color-accent-red)' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input Field */}
            <div className="flex w-full flex-col gap-[2px] bg-white">
              <label
                htmlFor="password"
                className="text-sm font-bold"
                style={{
                  fontFamily: 'var(--font-family-quicksand)',
                  fontSize: 'var(--font-size-text-sm)',
                  lineHeight: 'var(--line-height-text-sm)',
                  color: 'var(--color-neutral-950)',
                  letterSpacing: '-0.28px'
                }}
              >
                Password
              </label>
              <div
                className={`flex h-[48px] w-full items-center gap-[8px] rounded-[var(--radius-xl)] border border-solid px-[16px] py-[8px] ${
                  errors.password ? 'border-[var(--color-accent-red)]' : 'border-[var(--color-neutral-300)]'
                }`}
              >
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="Enter your password"
                  className="flex-1 border-none bg-transparent outline-none"
                  style={{
                    fontFamily: 'var(--font-family-quicksand)',
                    fontSize: 'var(--font-size-text-sm)',
                    lineHeight: 'var(--line-height-text-sm)',
                    color: 'var(--color-neutral-950)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="h-[20px] w-[20px] shrink-0 text-neutral-600 hover:text-neutral-900"
                >
                  <EyeIcon />
                </button>
              </div>
              {errors.password && (
                <p className="text-xs" style={{ color: 'var(--color-accent-red)' }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex h-[48px] w-full items-center justify-center rounded-[100px] p-[8px] transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: 'var(--color-primary-300)'
              }}
            >
              <p
                className="font-bold"
                style={{
                  fontFamily: 'var(--font-family-quicksand)',
                  fontSize: 'var(--font-size-text-md)',
                  lineHeight: 'var(--line-height-text-md)',
                  color: 'var(--color-neutral-25)',
                  letterSpacing: '-0.32px'
                }}
              >
                {loginMutation.isPending ? 'Logging in...' : 'Login'}
              </p>
            </button>

            {/* Register Link */}
            <div
              className="flex w-[352px] items-center justify-center gap-[4px]"
              style={{
                fontSize: 'var(--font-size-text-md)',
                lineHeight: 'var(--line-height-text-md)',
                letterSpacing: '-0.32px'
              }}
            >
              <p
                className="font-semibold"
                style={{
                  fontFamily: 'var(--font-family-quicksand)',
                  color: 'var(--color-neutral-950)'
                }}
              >
                Don't have an account?
              </p>
              <Link
                to="/register"
                className="font-bold transition-opacity hover:opacity-80"
                style={{
                  fontFamily: 'var(--font-family-quicksand)',
                  color: '#1c65da'
                }}
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

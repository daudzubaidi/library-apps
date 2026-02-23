import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store';
import { setCredentials } from '../store/authSlice';
import { useRegisterMutation } from '../hooks/useAuth';
import { toast } from 'sonner';
import Logo from '../components/Logo';

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2.5 10C2.5 10 5 5 10 5C15 5 17.5 10 17.5 10C17.5 10 15 15 10 15C5 15 2.5 10 2.5 10Z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ password: false, confirm: false });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name) errs.name = 'Name required';
    if (!formData.email) errs.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email';
    if (!formData.phone) errs.phone = 'Phone required';
    if (!formData.password) errs.password = 'Password required';
    else if (formData.password.length < 6) errs.password = 'Min 6 chars';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords must match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const result = await registerMutation.mutateAsync(formData);
      dispatch(setCredentials({ token: result.token, user: result.user }));
      toast.success('Registration successful!');
      navigate('/');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Registration failed');
    }
  };

  const inputClass = (field: string) =>
    `flex h-[48px] w-full items-center gap-[8px] rounded-[var(--radius-xl)] border border-solid px-[16px] py-[8px] ${
      errors[field] ? 'border-[var(--color-accent-red)]' : 'border-[var(--color-neutral-300)]'
    }`;

  return (
    <div className="relative min-h-screen w-full bg-white flex items-center justify-center">
      <div className="flex w-[400px] flex-col gap-[20px]">
        <div className="flex items-center gap-[11.786px]">
          <Logo />
          <p className="text-[25.143px] font-bold leading-[33px]" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>Booky</p>
        </div>

        <div className="flex flex-col gap-[8px]">
          <p className="text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', fontSize: 'var(--font-size-display-sm)', lineHeight: 'var(--line-height-display-sm)', color: 'var(--color-neutral-950)', letterSpacing: '-0.56px' }}>Register</p>
          <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', fontSize: 'var(--font-size-text-md)', lineHeight: 'var(--line-height-text-md)', color: 'var(--color-neutral-700)', letterSpacing: '-0.32px' }}>Create your account to start borrowing books.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-[16px]">
          {[
            { label: 'Name', field: 'name', type: 'text', placeholder: 'Enter your name' },
            { label: 'Email', field: 'email', type: 'email', placeholder: 'Enter your email' },
            { label: 'Nomor Handphone', field: 'phone', type: 'tel', placeholder: 'Enter your phone' },
            { label: 'Password', field: 'password', type: showPassword.password ? 'text' : 'password', placeholder: 'Enter password', hasEye: true },
            { label: 'Confirm Password', field: 'confirmPassword', type: showPassword.confirm ? 'text' : 'password', placeholder: 'Confirm password', hasEye: true }
          ].map(({ label, field, type, placeholder, hasEye }) => (
            <div key={field} className="flex w-full flex-col gap-[2px]">
              <label className="text-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', fontSize: 'var(--font-size-text-sm)', lineHeight: 'var(--line-height-text-sm)', color: 'var(--color-neutral-950)', letterSpacing: '-0.28px' }}>{label}</label>
              <div className={inputClass(field)}>
                <input type={type} value={formData[field as keyof typeof formData]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} placeholder={placeholder} className="flex-1 border-none bg-transparent outline-none" style={{ fontFamily: 'var(--font-family-quicksand)', fontSize: 'var(--font-size-text-sm)', lineHeight: 'var(--line-height-text-sm)', color: 'var(--color-neutral-950)' }} />
                {hasEye && <button type="button" onClick={() => setShowPassword({ ...showPassword, [field === 'password' ? 'password' : 'confirm']: !showPassword[field === 'password' ? 'password' : 'confirm'] })} className="h-[20px] w-[20px]"><EyeIcon /></button>}
              </div>
              {errors[field] && <p className="text-xs" style={{ color: 'var(--color-accent-red)' }}>{errors[field]}</p>}
            </div>
          ))}

          <button type="submit" disabled={registerMutation.isPending} className="flex h-[48px] w-full items-center justify-center rounded-[100px] p-[8px]" style={{ backgroundColor: 'var(--color-primary-300)' }}>
            <p className="font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', fontSize: 'var(--font-size-text-md)', lineHeight: 'var(--line-height-text-md)', color: 'var(--color-neutral-25)', letterSpacing: '-0.32px' }}>{registerMutation.isPending ? 'Submitting...' : 'Submit'}</p>
          </button>

          <div className="flex items-center justify-center gap-[4px]" style={{ fontSize: 'var(--font-size-text-md)', lineHeight: 'var(--line-height-text-md)', letterSpacing: '-0.32px' }}>
            <p className="font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>Already have an account?</p>
            <Link to="/login" className="font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: '#1c65da' }}>Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

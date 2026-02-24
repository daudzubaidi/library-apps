import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { setUser } from '@/store/authSlice';
import { getProfile, updateProfile } from '@/api/me';
import { Camera } from 'lucide-react';
import { toast } from 'sonner';

const TABS = [
  { label: 'Profile', path: '/my-profile' },
  { label: 'Borrowed List', path: '/my-loans' },
  { label: 'Reviews', path: '/my-reviews' },
];

export default function MyProfile() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['myProfile'],
    queryFn: getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('phone', phone);
      if (photoFile) fd.append('profilePhoto', photoFile);
      return updateProfile(fd);
    },
    onSuccess: (data: any) => {
      dispatch(setUser(data));
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
      toast.success('Profile updated!');
      setIsEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-[64px]">
      <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>Loading...</p>
    </div>
  );

  const avatarSrc = photoPreview || user?.profilePhoto;

  return (
    <div className="flex w-full flex-col gap-[32px]">
      {/* Tab Navigation */}
      <div className="flex h-[56px] items-center gap-[8px] rounded-[16px] p-[8px]" style={{ backgroundColor: 'var(--color-neutral-100)', width: 'fit-content' }}>
        {TABS.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex h-[40px] w-[175px] items-center justify-center rounded-[12px] px-[12px] py-[8px] transition-all"
              style={{
                backgroundColor: isActive ? 'white' : 'transparent',
                boxShadow: isActive ? '0px 0px 20px 0px rgba(203,202,202,0.25)' : 'none',
                fontFamily: 'var(--font-family-quicksand)',
                fontSize: 'var(--font-size-text-md)',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-neutral-950)' : 'var(--color-neutral-600)',
                letterSpacing: isActive ? '-0.32px' : '-0.48px',
                textDecoration: 'none',
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Profile Title */}
      <p className="text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
        Profile
      </p>

      {/* Profile Card */}
      <div className="flex w-full max-w-[557px] flex-col gap-[24px] rounded-[16px] bg-white p-[20px]" style={{ boxShadow: '0px 0px 20px 0px rgba(203,202,202,0.25)' }}>
        <div className="flex flex-col gap-[12px]">
          {/* Avatar */}
          <div className="relative h-[64px] w-[64px]">
            {avatarSrc ? (
              <img src={avatarSrc} alt="avatar" className="h-[64px] w-[64px] rounded-full object-cover" />
            ) : (
              <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full" style={{ background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-700))' }}>
                <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-family-quicksand)' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {isEditing && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40"
                >
                  <Camera className="h-5 w-5 text-white" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </>
            )}
          </div>

          {/* Info Rows */}
          {isEditing ? (
            <>
              <div className="flex w-full flex-col gap-[4px]">
                <label className="text-md font-medium" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)', letterSpacing: '-0.48px' }}>Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-[44px] w-full rounded-[12px] border border-solid border-[var(--color-neutral-300)] px-[16px] outline-none text-md font-bold"
                  style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
                />
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-md font-medium" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)', letterSpacing: '-0.48px' }}>Email</p>
                <p className="text-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)', letterSpacing: '-0.32px' }}>{user?.email}</p>
              </div>
              <div className="flex w-full flex-col gap-[4px]">
                <label className="text-md font-medium" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)', letterSpacing: '-0.48px' }}>Nomor Handphone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-[44px] w-full rounded-[12px] border border-solid border-[var(--color-neutral-300)] px-[16px] outline-none text-md font-bold"
                  style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
                />
              </div>
            </>
          ) : (
            <>
              {[
                { label: 'Name', value: user?.name },
                { label: 'Email', value: user?.email },
                { label: 'Nomor Handphone', value: user?.phone || '-' },
              ].map(({ label, value }) => (
                <div key={label} className="flex w-full items-center justify-between">
                  <p className="text-md font-medium" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)', letterSpacing: '-0.48px' }}>{label}</p>
                  <p className="text-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)', letterSpacing: '-0.32px' }}>{value}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing ? (
          <div className="flex gap-[12px]">
            <button
              onClick={handleCancel}
              className="flex h-[44px] flex-1 items-center justify-center rounded-[100px] border border-solid border-[var(--color-neutral-300)] font-bold"
              style={{ fontFamily: 'var(--font-family-quicksand)', fontSize: 'var(--font-size-text-md)', color: 'var(--color-neutral-950)' }}
            >
              Cancel
            </button>
            <button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="flex h-[44px] flex-1 items-center justify-center rounded-[100px] font-bold disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary-300)', color: 'var(--color-neutral-25)', fontFamily: 'var(--font-family-quicksand)', fontSize: 'var(--font-size-text-md)' }}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="flex h-[44px] w-full items-center justify-center rounded-[100px] font-bold"
            style={{ backgroundColor: 'var(--color-primary-300)', color: 'var(--color-neutral-25)', fontFamily: 'var(--font-family-quicksand)', fontSize: 'var(--font-size-text-md)', letterSpacing: '-0.32px' }}
          >
            Update Profile
          </button>
        )}
      </div>

      {/* Loan Statistics */}
      {profile && (
        <div className="grid grid-cols-2 gap-[16px] md:grid-cols-4" style={{ maxWidth: '557px' }}>
          {[
            { label: 'Total Loans', value: profile.loanStats.total, color: 'var(--color-primary-300)' },
            { label: 'Active', value: profile.loanStats.active, color: 'var(--color-primary-300)' },
            { label: 'Returned', value: profile.loanStats.returned, color: 'var(--color-accent-green)' },
            { label: 'Overdue', value: profile.loanStats.overdue, color: 'var(--color-accent-red)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col gap-[4px] rounded-[12px] border border-solid border-[var(--color-neutral-200)] bg-white p-[16px]">
              <p className="text-display-xs font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color }}>{value}</p>
              <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

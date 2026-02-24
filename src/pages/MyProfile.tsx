import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { setUser } from '@/store/authSlice';
import { getProfile, updateProfile } from '@/api/me';
import { toast } from 'sonner';
import ProfileForm from '@/components/ProfileForm';
import LoanStatsCard from '@/components/LoanStatsCard';

const TABS = [
  { label: 'Profile', path: '/my-profile' },
  { label: 'Borrowed List', path: '/my-loans' },
  { label: 'Reviews', path: '/my-reviews' },
];

const STATS = [
  { key: 'total', label: 'Total Loans', color: 'var(--color-primary-300)' },
  { key: 'active', label: 'Active', color: 'var(--color-primary-300)' },
  { key: 'returned', label: 'Returned', color: 'var(--color-accent-green)' },
  { key: 'overdue', label: 'Overdue', color: 'var(--color-accent-red)' },
] as const;

export default function MyProfile() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

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

  const handlePhotoChange = (file: File) => {
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-[64px]">
        <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
          Loading...
        </p>
      </div>
    );
  }

  const avatarSrc = photoPreview || user?.profilePhoto;

  return (
    <div className="flex w-full flex-col gap-[32px]">
      {/* Tab Navigation */}
      <div
        className="flex h-[56px] items-center gap-[8px] rounded-[16px] p-[8px]"
        style={{ backgroundColor: 'var(--color-neutral-100)', width: 'fit-content' }}
      >
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

      {/* Title */}
      <p
        className="text-display-sm font-bold"
        style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
      >
        Profile
      </p>

      {/* Profile Card */}
      <ProfileForm
        isEditing={isEditing}
        name={name}
        phone={phone}
        email={user?.email || ''}
        avatarSrc={avatarSrc}
        isSaving={updateMutation.isPending}
        onNameChange={setName}
        onPhoneChange={setPhone}
        onPhotoChange={handlePhotoChange}
        onEdit={handleEdit}
        onSave={() => updateMutation.mutate()}
        onCancel={handleCancel}
      />

      {/* Loan Statistics */}
      {profile && (
        <div className="grid grid-cols-2 gap-[16px] md:grid-cols-4" style={{ maxWidth: '557px' }}>
          {STATS.map(({ key, label, color }) => (
            <LoanStatsCard
              key={key}
              label={label}
              value={profile.loanStats[key]}
              color={color}
            />
          ))}
        </div>
      )}
    </div>
  );
}

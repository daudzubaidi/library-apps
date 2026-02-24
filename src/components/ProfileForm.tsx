import { useRef } from 'react';
import { Camera } from 'lucide-react';

interface ProfileFormProps {
  isEditing: boolean;
  name: string;
  phone: string;
  email: string;
  avatarSrc?: string;
  isSaving: boolean;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onPhotoChange: (file: File) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileForm({
  isEditing,
  name,
  phone,
  email,
  avatarSrc,
  isSaving,
  onNameChange,
  onPhoneChange,
  onPhotoChange,
  onEdit,
  onSave,
  onCancel,
}: ProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onPhotoChange(file);
  };

  return (
    <div
      className="flex w-full max-w-[557px] flex-col gap-[24px] rounded-[16px] bg-white p-[20px]"
      style={{ boxShadow: '0px 0px 20px 0px rgba(203,202,202,0.25)' }}
    >
      <div className="flex flex-col gap-[12px]">
        {/* Avatar */}
        <div className="relative h-[64px] w-[64px]">
          {avatarSrc ? (
            <img src={avatarSrc} alt="avatar" className="h-[64px] w-[64px] rounded-full object-cover" />
          ) : (
            <div
              className="flex h-[64px] w-[64px] items-center justify-center rounded-full"
              style={{ background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-700))' }}
            >
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-family-quicksand)' }}>
                {name?.charAt(0).toUpperCase()}
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
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </>
          )}
        </div>

        {/* Fields */}
        {isEditing ? (
          <>
            <div className="flex w-full flex-col gap-[4px]">
              <label
                className="text-md font-medium"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)', letterSpacing: '-0.48px' }}
              >
                Name
              </label>
              <input
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="h-[44px] w-full rounded-[12px] border border-solid border-[var(--color-neutral-300)] px-[16px] text-md font-bold outline-none"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
              />
            </div>
            <div className="flex w-full items-center justify-between">
              <p
                className="text-md font-medium"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)', letterSpacing: '-0.48px' }}
              >
                Email
              </p>
              <p
                className="text-md font-bold"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)', letterSpacing: '-0.32px' }}
              >
                {email}
              </p>
            </div>
            <div className="flex w-full flex-col gap-[4px]">
              <label
                className="text-md font-medium"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)', letterSpacing: '-0.48px' }}
              >
                Nomor Handphone
              </label>
              <input
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                className="h-[44px] w-full rounded-[12px] border border-solid border-[var(--color-neutral-300)] px-[16px] text-md font-bold outline-none"
                style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
              />
            </div>
          </>
        ) : (
          <>
            {[
              { label: 'Name', value: name },
              { label: 'Email', value: email },
              { label: 'Nomor Handphone', value: phone || '-' },
            ].map(({ label, value }) => (
              <div key={label} className="flex w-full items-center justify-between">
                <p
                  className="text-md font-medium"
                  style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)', letterSpacing: '-0.48px' }}
                >
                  {label}
                </p>
                <p
                  className="text-md font-bold"
                  style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)', letterSpacing: '-0.32px' }}
                >
                  {value}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Actions */}
      {isEditing ? (
        <div className="flex gap-[12px]">
          <button
            onClick={onCancel}
            className="flex h-[44px] flex-1 items-center justify-center rounded-[100px] border border-solid border-[var(--color-neutral-300)] font-bold"
            style={{ fontFamily: 'var(--font-family-quicksand)', fontSize: 'var(--font-size-text-md)', color: 'var(--color-neutral-950)' }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex h-[44px] flex-1 items-center justify-center rounded-[100px] font-bold disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary-300)', color: 'var(--color-neutral-25)', fontFamily: 'var(--font-family-quicksand)', fontSize: 'var(--font-size-text-md)' }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ) : (
        <button
          onClick={onEdit}
          className="flex h-[44px] w-full items-center justify-center rounded-[100px] font-bold"
          style={{ backgroundColor: 'var(--color-primary-300)', color: 'var(--color-neutral-25)', fontFamily: 'var(--font-family-quicksand)', fontSize: 'var(--font-size-text-md)', letterSpacing: '-0.32px' }}
        >
          Update Profile
        </button>
      )}
    </div>
  );
}

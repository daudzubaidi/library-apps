import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { setCartCount } from '@/store/cartSlice';
import { getCart } from '@/api/cart';
import { checkoutFromCart } from '@/api/loans';
import { toast } from 'sonner';
import dayjs from 'dayjs';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [borrowPurpose, setBorrowPurpose] = useState('');
  const [duration, setDuration] = useState<3 | 5 | 10>(3);
  const [agreeReturn, setAgreeReturn] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);

  // Selected items passed from Cart page
  const selectedItems: number[] = location.state?.selectedItems ?? [];

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  // Only show selected items in checkout
  const selectedCartItems = (cart?.items ?? []).filter((item) =>
    selectedItems.includes(item.id)
  );

  const checkoutMutation = useMutation({
    mutationFn: () =>
      checkoutFromCart({ itemIds: selectedItems, days: duration }),
    onSuccess: () => {
      toast.success('Books borrowed successfully!');
      // Clear cart count badge
      dispatch(setCartCount(0));
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['myLoans'] });
      navigate('/my-loans');
    },
    onError: () => toast.error('Failed to borrow books. Please try again.'),
  });

  const handleCheckout = () => {
    if (!borrowPurpose.trim()) {
      toast.error('Please enter borrow purpose');
      return;
    }
    if (!agreeReturn || !agreePolicy) {
      toast.error('Please agree to all terms');
      return;
    }
    if (selectedItems.length === 0) {
      toast.error('No items selected');
      navigate('/cart');
      return;
    }
    checkoutMutation.mutate();
  };

  const returnDate = dayjs().add(duration, 'day');

  return (
    <div className="mx-auto flex w-full max-w-[1002px] flex-col gap-[32px]">
      <h1 className="text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
        Checkout
      </h1>

      <div className="flex flex-col gap-[32px] lg:flex-row lg:gap-[58px]">
        {/* Left: User Info + Book List */}
        <div className="flex-1">
          {/* User Information */}
          <div className="mb-[32px]">
            <h3 className="mb-[20px] text-xl font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
              User Information
            </h3>
            <div className="flex flex-col gap-[16px]">
              {[
                { label: 'Name', value: user?.name },
                { label: 'Email', value: user?.email },
                { label: 'Nomor Handphone', value: user?.phone || '-' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>{label}</span>
                  <span className="text-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-[32px] h-px bg-[var(--color-neutral-200)]" />

          {/* Book List */}
          <div>
            <h3 className="mb-[20px] text-xl font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
              Book List
            </h3>
            <div className="flex flex-col gap-[16px]">
              {selectedCartItems.length === 0 ? (
                <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
                  No items selected
                </p>
              ) : (
                selectedCartItems.map((item) => (
                  <div key={item.id} className="flex gap-[16px]">
                    <div className="h-[138px] w-[92px] shrink-0 overflow-hidden rounded-[8px] bg-[var(--color-neutral-100)]">
                      {item.book.coverImage ? (
                        <img src={item.book.coverImage} alt={item.book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-neutral-400)]">No Image</div>
                      )}
                    </div>
                    <div>
                      <span className="mb-[4px] inline-block rounded-[100px] border border-[var(--color-neutral-300)] px-[12px] py-[2px] text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>
                        {item.book.category.name}
                      </span>
                      <h4 className="text-lg font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                        {item.book.title}
                      </h4>
                      <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>
                        {item.book.author.name}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Borrow Form */}
        <div className="w-full rounded-[12px] border border-solid border-[var(--color-neutral-200)] bg-white p-[20px] lg:w-[478px]"
          style={{ boxShadow: '0px 0px 20px 0px rgba(203,202,202,0.25)' }}>
          <h3 className="mb-[24px] text-lg font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
            Complete Your Borrow Request
          </h3>

          {/* Borrow Purpose */}
          <div className="mb-[24px]">
            <label className="mb-[8px] block text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
              Borrow Purpose
            </label>
            <input
              type="text"
              value={borrowPurpose}
              onChange={(e) => setBorrowPurpose(e.target.value)}
              placeholder="e.g., Research, Study, Personal Reading"
              className="w-full rounded-[12px] border border-solid border-[var(--color-neutral-300)] px-[16px] py-[12px] text-sm font-semibold outline-none focus:border-[var(--color-primary-300)]"
              style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}
            />
          </div>

          {/* Borrow Duration */}
          <div className="mb-[24px]">
            <label className="mb-[12px] block text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
              Borrow Duration
            </label>
            <div className="flex flex-col gap-[12px]">
              {([3, 5, 10] as const).map((days) => (
                <label key={days} className="flex cursor-pointer items-center gap-[12px]">
                  <input
                    type="radio"
                    name="duration"
                    checked={duration === days}
                    onChange={() => setDuration(days)}
                    className="h-[20px] w-[20px] cursor-pointer"
                  />
                  <span className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                    {days} Days
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Return Date Info */}
          <div className="mb-[24px] rounded-[8px] bg-[var(--color-neutral-50)] p-[16px]">
            <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
              Return Date
            </p>
            <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>
              Please return the book no later than {returnDate.format('D MMMM YYYY')}
            </p>
          </div>

          {/* Agreements */}
          <div className="mb-[24px] flex flex-col gap-[12px]">
            <label className="flex cursor-pointer items-start gap-[12px]">
              <input
                type="checkbox"
                checked={agreeReturn}
                onChange={(e) => setAgreeReturn(e.target.checked)}
                className="mt-[4px] h-[20px] w-[20px] cursor-pointer"
              />
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                I agree to return the book(s) before the due date.
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-[12px]">
              <input
                type="checkbox"
                checked={agreePolicy}
                onChange={(e) => setAgreePolicy(e.target.checked)}
                className="mt-[4px] h-[20px] w-[20px] cursor-pointer"
              />
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                I accept the library borrowing policy.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleCheckout}
            disabled={checkoutMutation.isPending || !agreeReturn || !agreePolicy || selectedItems.length === 0}
            className="flex h-[48px] w-full items-center justify-center rounded-[100px] px-[32px] py-[12px] font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary-300)', color: 'var(--color-neutral-25)', fontFamily: 'var(--font-family-quicksand)' }}
          >
            {checkoutMutation.isPending ? 'Processing...' : 'Confirm Borrow'}
          </button>
        </div>
      </div>
    </div>
  );
}

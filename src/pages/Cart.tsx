import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart } from '@/api/cart';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  const removeFromCartMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      toast.success('Removed from cart');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const handleSelectAll = () => {
    if (selectedItems.length === cart?.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart?.items.map((item) => item.id) || []);
    }
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-[64px]">
        <div className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-[32px]">
      <h1 className="text-display-sm font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
        My Cart
      </h1>

      <div className="flex gap-[40px]">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="mb-[24px] flex items-center gap-[12px]">
            <input
              type="checkbox"
              checked={selectedItems.length === cart?.items.length && cart?.items.length > 0}
              onChange={handleSelectAll}
              className="h-[20px] w-[20px] cursor-pointer rounded border-[var(--color-neutral-300)]"
            />
            <span className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
              Select All
            </span>
          </div>

          {cart?.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[64px]">
              <p className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
                Your cart is empty
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-[24px]">
              {cart?.items.map((item) => (
                <div key={item.id}>
                  <div className="flex gap-[16px]">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="h-[20px] w-[20px] cursor-pointer rounded border-[var(--color-neutral-300)]"
                    />
                    <div className="h-[138px] w-[92px] overflow-hidden rounded-[8px] bg-[var(--color-neutral-100)]">
                      {item.book.coverImage ? (
                        <img src={item.book.coverImage} alt={item.book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-neutral-400)]">No Image</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                          {item.book.title}
                        </h3>
                        <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-600)' }}>
                          {item.book.author.name}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: item.book.availableStock > 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)' }}>
                          {item.book.availableStock > 0 ? 'Available' : 'Out of Stock'}
                        </span>
                        <button
                          onClick={() => removeFromCartMutation.mutate(item.id)}
                          className="flex items-center gap-[8px] text-sm font-bold transition-opacity hover:opacity-70"
                          style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-accent-red)' }}
                        >
                          <Trash2 className="h-[16px] w-[16px]" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-[24px] h-px bg-[var(--color-neutral-200)]" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="w-[318px]">
          <div className="rounded-[12px] border border-solid border-[var(--color-neutral-200)] bg-white p-[20px]">
            <h3 className="mb-[24px] text-xl font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
              Loan Summary
            </h3>
            <div className="mb-[24px] flex items-center justify-between">
              <span className="text-md font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-700)' }}>
                Total Book
              </span>
              <span className="text-md font-bold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
                {selectedItems.length} Items
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              className="flex h-[48px] w-full items-center justify-center rounded-[100px] px-[32px] py-[12px] font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary-300)', color: 'var(--color-neutral-25)', fontFamily: 'var(--font-family-quicksand)' }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

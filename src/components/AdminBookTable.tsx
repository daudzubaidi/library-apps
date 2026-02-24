import { Pencil, Trash2 } from 'lucide-react';
import type { Book } from '@/types';

interface AdminBookTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

const th = 'px-[16px] py-[12px] text-left text-xs font-bold uppercase tracking-wide';
const td = 'px-[16px] py-[14px] text-sm font-semibold align-middle';
const thStyle = { fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' };
const tdStyle = { fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' };

export default function AdminBookTable({ books, onEdit, onDelete, isDeleting }: AdminBookTableProps) {
  return (
    <div className="overflow-x-auto rounded-[12px] border border-solid border-[var(--color-neutral-200)]">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
            <th className={th} style={thStyle}>Book</th>
            <th className={th} style={thStyle}>Author</th>
            <th className={th} style={thStyle}>Category</th>
            <th className={th} style={thStyle}>Stock</th>
            <th className={th} style={thStyle}>Available</th>
            <th className={th} style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b border-[var(--color-neutral-100)] transition-colors hover:bg-[var(--color-neutral-50)]">
              <td className={td} style={tdStyle}>
                <div className="flex items-center gap-[12px]">
                  <div className="h-[48px] w-[32px] shrink-0 overflow-hidden rounded-[4px] bg-[var(--color-neutral-100)]">
                    {book.coverImage
                      ? <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                      : <div className="flex h-full w-full items-center justify-center text-[9px]" style={{ color: 'var(--color-neutral-400)' }}>N/A</div>
                    }
                  </div>
                  <span className="line-clamp-2 max-w-[200px]">{book.title}</span>
                </div>
              </td>
              <td className={td} style={{ ...tdStyle, color: 'var(--color-neutral-600)' }}>{book.author.name}</td>
              <td className={td}>
                <span className="rounded-[100px] px-[10px] py-[2px] text-xs font-bold"
                  style={{ backgroundColor: 'var(--color-primary-200)', color: 'var(--color-primary-300)', fontFamily: 'var(--font-family-quicksand)' }}>
                  {book.category.name}
                </span>
              </td>
              <td className={td} style={tdStyle}>{book.stock}</td>
              <td className={td}>
                <span style={{ fontFamily: 'var(--font-family-quicksand)', color: book.availableStock > 0 ? 'var(--color-accent-green)' : 'var(--color-accent-red)', fontWeight: 700, fontSize: '14px' }}>
                  {book.availableStock}
                </span>
              </td>
              <td className={td}>
                <div className="flex items-center gap-[8px]">
                  <button onClick={() => onEdit(book)}
                    className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] transition-colors hover:bg-[var(--color-primary-100)]"
                    style={{ color: 'var(--color-primary-300)' }}>
                    <Pencil className="h-[14px] w-[14px]" />
                  </button>
                  <button onClick={() => onDelete(book.id)} disabled={isDeleting}
                    className="flex h-[32px] w-[32px] items-center justify-center rounded-[8px] transition-colors hover:bg-red-50 disabled:opacity-50"
                    style={{ color: 'var(--color-accent-red)' }}>
                    <Trash2 className="h-[14px] w-[14px]" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

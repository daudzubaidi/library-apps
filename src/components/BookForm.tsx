import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/api/categories';
import { getAuthors } from '@/api/authors';
import { Camera } from 'lucide-react';
import type { Book } from '@/types';

export interface BookFormData {
  title: string;
  isbn: string;
  description: string;
  stock: number;
  authorId: number | '';
  categoryId: number | '';
  coverImage?: File | null;
}

interface BookFormProps {
  initial?: Book;
  isSaving: boolean;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const inputClass = 'h-[44px] w-full rounded-[12px] border border-solid border-[var(--color-neutral-300)] px-[16px] text-sm font-semibold outline-none focus:border-[var(--color-primary-300)]';
const labelClass = 'text-sm font-bold';
const style = { fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' };

export default function BookForm({ initial, isSaving, onSubmit, onCancel }: BookFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(initial?.coverImage ?? null);
  const [form, setForm] = useState<BookFormData>({
    title: initial?.title ?? '',
    isbn: initial?.isbn ?? '',
    description: initial?.description ?? '',
    stock: initial?.stock ?? 1,
    authorId: initial?.author.id ?? '',
    categoryId: initial?.category.id ?? '',
    coverImage: null,
  });

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        isbn: initial.isbn,
        description: initial.description ?? '',
        stock: initial.stock,
        authorId: initial.author.id,
        categoryId: initial.category.id,
        coverImage: null,
      });
      setPreview(initial.coverImage ?? null);
    }
  }, [initial]);

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const { data: authors } = useQuery({ queryKey: ['authors'], queryFn: () => getAuthors() });

  const set = (k: keyof BookFormData, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    set('coverImage', file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('isbn', form.isbn);
    fd.append('description', form.description);
    fd.append('stock', String(form.stock));
    if (form.authorId) fd.append('authorId', String(form.authorId));
    if (form.categoryId) fd.append('categoryId', String(form.categoryId));
    if (form.coverImage) fd.append('coverImage', form.coverImage);
    onSubmit(fd);
  };

  const selectClass = 'h-[44px] w-full rounded-[12px] border border-solid border-[var(--color-neutral-300)] px-[16px] text-sm font-semibold outline-none focus:border-[var(--color-primary-300)] bg-white';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
      {/* Cover image */}
      <div className="flex items-center gap-[16px]">
        <div className="relative h-[80px] w-[54px] overflow-hidden rounded-[8px] bg-[var(--color-neutral-100)]">
          {preview
            ? <img src={preview} alt="cover" className="h-full w-full object-cover" />
            : <div className="flex h-full w-full items-center justify-center text-xs" style={{ color: 'var(--color-neutral-400)' }}>No img</div>
          }
          <button type="button" onClick={() => fileRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Camera className="h-4 w-4 text-white" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
        <p className="text-xs font-semibold" style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-500)' }}>
          Click to upload cover image
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
        <div className="flex flex-col gap-[4px]">
          <label className={labelClass} style={style}>Title</label>
          <input className={inputClass} style={style} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Book title" required />
        </div>
        <div className="flex flex-col gap-[4px]">
          <label className={labelClass} style={style}>ISBN</label>
          <input className={inputClass} style={style} value={form.isbn} onChange={e => set('isbn', e.target.value)} placeholder="ISBN" required />
        </div>
        <div className="flex flex-col gap-[4px]">
          <label className={labelClass} style={style}>Author</label>
          <select className={selectClass} style={style} value={form.authorId} onChange={e => set('authorId', Number(e.target.value))} required>
            <option value="">Select author</option>
            {authors?.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-[4px]">
          <label className={labelClass} style={style}>Category</label>
          <select className={selectClass} style={style} value={form.categoryId} onChange={e => set('categoryId', Number(e.target.value))} required>
            <option value="">Select category</option>
            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-[4px]">
          <label className={labelClass} style={style}>Stock</label>
          <input type="number" min={0} className={inputClass} style={style} value={form.stock} onChange={e => set('stock', Number(e.target.value))} required />
        </div>
      </div>

      <div className="flex flex-col gap-[4px]">
        <label className={labelClass} style={style}>Description</label>
        <textarea rows={3} className="w-full rounded-[12px] border border-solid border-[var(--color-neutral-300)] px-[16px] py-[12px] text-sm font-semibold outline-none focus:border-[var(--color-primary-300)]"
          style={style} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Book description" />
      </div>

      <div className="flex gap-[12px]">
        <button type="button" onClick={onCancel}
          className="flex h-[44px] flex-1 items-center justify-center rounded-[100px] border border-solid border-[var(--color-neutral-300)] font-bold"
          style={{ fontFamily: 'var(--font-family-quicksand)', color: 'var(--color-neutral-950)' }}>
          Cancel
        </button>
        <button type="submit" disabled={isSaving}
          className="flex h-[44px] flex-1 items-center justify-center rounded-[100px] font-bold disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary-300)', color: 'var(--color-neutral-25)', fontFamily: 'var(--font-family-quicksand)' }}>
          {isSaving ? 'Saving...' : initial ? 'Update Book' : 'Add Book'}
        </button>
      </div>
    </form>
  );
}

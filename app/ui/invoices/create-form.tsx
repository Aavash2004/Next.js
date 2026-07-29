import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import InvoiceFormFields from '@/app/ui/invoices/invoice-form-fields';

export default function Form({ customers }: { customers: CustomerField[] }) {
  return (
    <form>
      <InvoiceFormFields customers={customers} />
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
}

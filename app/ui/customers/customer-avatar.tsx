import Image from 'next/image';
import clsx from 'clsx';

// Renders a customer's avatar next to their name. Shared by the invoices and
// customers tables, which each repeated this Image + name markup.
export default function CustomerAvatar({
  name,
  imageUrl,
  size = 28,
  wrapperClassName = 'flex items-center gap-3',
  imageClassName,
}: {
  name: string;
  imageUrl: string;
  size?: number;
  wrapperClassName?: string;
  imageClassName?: string;
}) {
  return (
    <div className={wrapperClassName}>
      <Image
        src={imageUrl}
        className={clsx('rounded-full', imageClassName)}
        width={size}
        height={size}
        alt={`${name}'s profile picture`}
      />
      <p>{name}</p>
    </div>
  );
}

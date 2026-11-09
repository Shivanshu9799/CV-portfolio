import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-16">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted">This page does not exist.</p>
      <p className="mt-6">
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
      </p>
    </div>
  );
}

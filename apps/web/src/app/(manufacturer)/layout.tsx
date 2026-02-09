'use client';

import { ManufacturerShell } from '@/components/layout/ManufacturerShell';

export default function ManufacturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ManufacturerShell>{children}</ManufacturerShell>;
}

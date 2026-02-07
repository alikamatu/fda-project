import { Container } from '@/components/ui/Container';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      <main className="flex-grow flex items-center justify-center py-8 sm:py-12">
        <Container className="w-full">
          {children}
        </Container>
      </main>
    </div>
  );
}
import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthCard
      title="Portal Sign In"
      subtitle="Access the FDA Product Verification System"
      maxWidth="md"
      headerBadge="Authorized Access"
      noCard={true}
    >
      <LoginForm />
    </AuthCard>
  );
}
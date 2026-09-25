import { AuthCard } from '@/components/auth/AuthCard';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <AuthCard
      title="Sign In"
      subtitle="Access the FDA Product Verification System"
    >
      <LoginForm />
    </AuthCard>
  );
}
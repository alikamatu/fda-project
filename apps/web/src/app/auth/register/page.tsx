import { AuthCard } from '@/components/auth/AuthCard';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create an Account"
      subtitle="Register to verify products or manage manufacturer records"
    >
      <RegisterForm />
    </AuthCard>
  );
}
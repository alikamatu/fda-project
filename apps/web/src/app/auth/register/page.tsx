import { AuthCard } from '@/components/auth/AuthCard';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthCard
      title="Manufacturer Registration"
      subtitle="Register your pharmaceutical or manufacturing facility for official FDA batch verification"
      maxWidth="lg"
      headerBadge="FDA Manufacturer Portal"
      noCard={true}
    >
      <RegisterForm />
    </AuthCard>
  );
}
import AuthPageTitle from "@/components/customComponents/auth/common/auth-page-title";
import SignUpForm from "@/components/customComponents/auth/signup/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
			<AuthPageTitle>회원가입</AuthPageTitle>
      <SignUpForm />
    </div>
  );
}

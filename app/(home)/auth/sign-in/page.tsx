import AuthPageTitle from "../auth-page-title";
import LoginForm from "@/components/customComponents/auth/signin/LoginForm";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <AuthPageTitle>로그인</AuthPageTitle>
      <LoginForm />
    </div>
  );
}
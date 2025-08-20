import LoginForm from "@/components/customComponents/auth/signin/LoginForm";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>
      <LoginForm />
    </div>
  );
}

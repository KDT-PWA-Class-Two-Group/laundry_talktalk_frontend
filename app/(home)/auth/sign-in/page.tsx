import LoginForm from "@/components/customComponents/auth/signin/LoginForm";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <h1 className="text-3xl font-bold text-sky mb-6">로그인</h1>
      <LoginForm />
    </div>
  );
}
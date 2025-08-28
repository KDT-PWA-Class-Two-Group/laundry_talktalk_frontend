import AuthPageTitle from "../auth-page-title";
import ResetPwForm from "@/components/customComponents/auth/resetpw/ResetPwForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams?.token || "";

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <AuthPageTitle>비밀번호 재설정</AuthPageTitle>
      <ResetPwForm token={token} />
    </div>
  );
}

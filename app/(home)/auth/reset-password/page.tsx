import AuthPageTitle from "@/components/customComponents/auth/common/auth-page-title";
import ResetPwForm from "@/components/customComponents/auth/resetpw/ResetPwForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params?.token || "";

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <AuthPageTitle>비밀번호 재설정</AuthPageTitle>
      <ResetPwForm token={token} />
    </div>
  );
}

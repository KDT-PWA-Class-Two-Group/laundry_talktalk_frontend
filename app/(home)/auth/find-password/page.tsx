import AuthPageTitle from "@/components/customComponents/auth/common/auth-page-title";
import FindPwForm from "@/components/customComponents/auth/findpw/FindPwForm";

export default function FindPwPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <AuthPageTitle>비밀번호 찾기</AuthPageTitle>
      <FindPwForm />
    </div>
  );
}

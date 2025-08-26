import AuthPageTitle from "../auth-page-title";
import FindIdForm from "@/components/customComponents/auth/findid/FindIdForm";

export default function FindIdPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <AuthPageTitle>아이디 찾기</AuthPageTitle>
      <FindIdForm />
    </div>
  );
}

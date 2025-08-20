import MyPageEditProfile from "@/components/customComponents/mypage/MypageEditProfile";

export default function EditProfilePage() {
  return (
    // 최상위 div의 스타일을 제거하여 화면 전체를 차지하도록 변경
    <div className="w-full">
      <MyPageEditProfile />
    </div>
  );
}

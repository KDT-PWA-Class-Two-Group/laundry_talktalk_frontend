import { NextResponse } from "next/server";

/**
 * @method DELETE
 * @description 특정 예약 취소
 * @url /api/reservations/{reservationId}
 * @returns 200 OK { "message": "예약이 취소되었습니다." }
 * @returns 403 Forbidden { "message": "취소할 수 없는 예약입니다." }
 */
export async function DELETE(
  request: Request,
  { params }: { params: { reservationId: string } }
) {
  try {
    const { reservationId } = params;

    // TODO:
    // 1. 사용자 인증 정보를 확인하여 현재 로그인된 사용자 ID를 가져오세요.
    // const userId = 'current-authenticated-user-id';
    // if (!userId) {
    //   return NextResponse.json({ message: "인증되지 않은 사용자입니다." }, { status: 401 });
    // }

    // 2. 데이터베이스에서 `reservationId`에 해당하는 예약 정보를 조회합니다.
    //    - 예: const reservation = await prisma.reservation.findUnique({
    //            where: { id: parseInt(reservationId) },
    //            select: { userId: true, status: true } // 권한 및 상태 확인에 필요한 필드만
    //          });

    // 3. 예약 정보가 없거나, 현재 사용자의 소유가 아니면 403 Forbidden 에러를 반환합니다.
    //    - if (!reservation || reservation.userId !== userId) {
    //        return NextResponse.json({ message: "취소할 수 없는 예약입니다." }, { status: 403 });
    //      }

    // 4. 예약 상태가 '취소 가능'한 상태인지 확인합니다. (예: 이미 완료된 예약은 취소 불가)
    //    - if (reservation.status === 'COMPLETED' || reservation.status === 'CANCELLED') {
    //        return NextResponse.json({ message: "이미 완료되었거나 취소된 예약입니다." }, { status: 403 });
    //      }

    // 5. 모든 조건이 충족되면 데이터베이스에서 해당 예약을 'CANCELLED' 상태로 업데이트하거나 삭제합니다.
    //    - 예: await prisma.reservation.update({
    //            where: { id: parseInt(reservationId) },
    //            data: { status: 'CANCELLED' }
    //          });

    console.log(`예약 ID ${reservationId} 취소 요청 처리 완료`);

    return NextResponse.json(
      { message: "예약이 취소되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      `예약 취소 중 서버 오류 발생 (ID: ${params.reservationId}):`,
      error
    );
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

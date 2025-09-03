// Ensure the file exists at the specified path or update the import path accordingly.
// Example: If the correct path is "@/components/laundry-reservation/LaundryReservationDetail", update as below.
import LaundryReservationDetail from "@/components/customComponents/laundry-reservation/LaundryReservationDetail";

// export default function LaundryReservationDetailPage({ params }: { params: { storeId: string } }) {
//   return <LaundryReservationDetail storeId={params.storeId} />;
// }

export default async function LaundryReservationDetailPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const { storeId } = await params;
  return <LaundryReservationDetail storeId={storeId} />;
}

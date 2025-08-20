// Update the import path below to the correct relative path if necessary
import LaundryReservationTabs from "@/components/customComponents/laundry-reservation/LaundryReservationTabs";
import { Suspense } from "react";

export default function LaundryReservationPage() {
    return (
        <div className="w-full max-w-3xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">세탁소 예약</h1>
            <Suspense>
                <LaundryReservationTabs />
            </Suspense>
        </div>
    );
}
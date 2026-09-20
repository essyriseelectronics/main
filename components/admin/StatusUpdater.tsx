"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/actions/orders";

interface StatusUpdaterProps {
  orderId: string;
  currentStatus: string;
  badgeClass: string;
}

export default function StatusUpdater({ orderId, currentStatus, badgeClass }: StatusUpdaterProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      <select 
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`appearance-none px-3 py-1.5 text-xs font-bold rounded-full cursor-pointer outline-none border-none ring-0 ${badgeClass} ${isUpdating ? 'opacity-50' : ''}`}
      >
        <option value="NEW">NEW</option>
        <option value="CONFIRMED">CONFIRMED</option>
        <option value="PROCESSING">PROCESSING</option>
        <option value="READY_FOR_DELIVERY">READY FOR DELIVERY</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
    </div>
  );
}

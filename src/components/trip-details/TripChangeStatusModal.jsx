import { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, PauseCircle, Ban } from "lucide-react";
import { useToast } from "../../lib/toast";
import AppModal, { ModalField, ModalActions, modalInputClass } from "../ui/AppModal";
import { TRIP_STATUS_OPTIONS, updateTripStatus } from "../../services/tripService.js";

const STATUS_ICONS = {
  "قيد التنفيذ": { icon: Clock, color: "text-blue-600" },
  تم: { icon: CheckCircle2, color: "text-emerald-500" },
  ملغية: { icon: XCircle, color: "text-red-500" },
  معلقة: { icon: PauseCircle, color: "text-amber-600" },
  موقوفة: { icon: Ban, color: "text-gray-500" },
};

/**
 * TripChangeStatusModal
 * Props:
 *   isOpen       {boolean}
 *   onClose      {() => void}
 *   trip         {Object}
 *   onSuccess    {(updatedTrip) => void}
 */
export default function TripChangeStatusModal({ isOpen, onClose, trip, onSuccess }) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selected, setSelected] = useState("قيد التنفيذ");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!isOpen || !trip) return;
    const current = trip.trip_status ?? trip.status ?? "قيد التنفيذ";
    const known = TRIP_STATUS_OPTIONS.some((o) => o.value === current);
    setSelected(known ? current : "قيد التنفيذ");
    setReason("");
  }, [isOpen, trip]);

  const handleSubmit = async () => {
    if (!trip?.id) return;
    setIsSubmitting(true);
    try {
      const updated = await updateTripStatus(trip, selected, reason);
      toast.success("تم تغيير حالة الرحلة بنجاح");
      onSuccess?.(updated);
      onClose();
    } catch (err) {
      toast.error(err.message || "فشل تغيير الحالة");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!trip) return null;

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="تغيير حالة الرحلة"
      subtitle="اختر الحالة الجديدة وأدخل سبب التغيير"
      isSubmitting={isSubmitting}
      size="md"
    >
      <div className="space-y-2 mb-4">
        {TRIP_STATUS_OPTIONS.map(({ value, label }) => {
          const meta = STATUS_ICONS[value] ?? STATUS_ICONS["قيد التنفيذ"];
          const Icon = meta.icon;
          const isActive = selected === value;
          return (
            <button
              key={value}
              type="button"
              disabled={isSubmitting}
              onClick={() => setSelected(value)}
              className={`w-full flex items-center gap-3 border rounded-xl p-3 text-right transition-colors disabled:opacity-50 ${
                isActive ? "border-[#c9a84c] bg-[#fffcf5]" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  isActive ? "border-[#4a4746]" : "border-gray-300"
                }`}
              >
                {isActive && <span className="w-2 h-2 bg-[#4a4746] rounded-full" />}
              </span>
              <Icon className={`w-5 h-5 ${meta.color}`} />
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </button>
          );
        })}
      </div>
      <ModalField label="سبب التغيير">
        <textarea
          rows={3}
          placeholder="سبب التغيير (اختياري)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`${modalInputClass} resize-none`}
          disabled={isSubmitting}
        />
      </ModalField>
      <div className="mt-5">
        <ModalActions
          primaryLabel="تأكيد التغيير"
          onPrimary={handleSubmit}
          onSecondary={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </AppModal>
  );
}

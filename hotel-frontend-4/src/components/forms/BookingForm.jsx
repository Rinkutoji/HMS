import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { formatCurrency } from "../../utils/formatCurrency";

export default function BookingForm({ room, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");

  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    const diff =
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  }, [checkInDate, checkOutDate]);

  const total = nights * (room?.basePrice ?? 0);
  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit({ ...values, roomId: room.id }),
      )}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="checkInDate">
            Check-in
          </label>
          <input
            id="checkInDate"
            type="date"
            min={today}
            className="input"
            {...register("checkInDate", { required: "Required" })}
          />
          {errors.checkInDate && (
            <p className="error-text">{errors.checkInDate.message}</p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="checkOutDate">
            Check-out
          </label>
          <input
            id="checkOutDate"
            type="date"
            min={checkInDate || today}
            className="input"
            {...register("checkOutDate", { required: "Required" })}
          />
          {errors.checkOutDate && (
            <p className="error-text">{errors.checkOutDate.message}</p>
          )}
        </div>
      </div>

      {nights > 0 && (
        <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>
              {formatCurrency(room?.basePrice)} &times; {nights} night
              {nights > 1 ? "s" : ""}
            </span>
            <span className="font-medium text-slate-800">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={loading || nights <= 0}
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </form>
  );
}

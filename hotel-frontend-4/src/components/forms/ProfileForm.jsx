import { useForm } from "react-hook-form";

export default function ProfileForm({ defaultValues, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="firstName">
            First name
          </label>
          <input
            id="firstName"
            className="input"
            {...register("firstName", { required: "Required" })}
          />
          {errors.firstName && (
            <p className="error-text">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="lastName">
            Last name
          </label>
          <input
            id="lastName"
            className="input"
            {...register("lastName", { required: "Required" })}
          />
          {errors.lastName && (
            <p className="error-text">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="phone">
          Phone
        </label>
        <input id="phone" className="input" {...register("phone")} />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}

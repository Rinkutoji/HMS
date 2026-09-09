import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { roomTypeApi } from "../../api/roomTypeApi";
import { formatCurrency } from "../../utils/formatCurrency";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

function RoomTypeFormFields({ register, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Name</label>
        <input
          className="input"
          {...register("name", { required: "Required" })}
        />
        {errors.name && <p className="error-text">{errors.name.message}</p>}
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input" rows={3} {...register("description")} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Base price / night</label>
          <input
            type="number"
            step="0.01"
            className="input"
            {...register("basePrice", {
              required: "Required",
              valueAsNumber: true,
            })}
          />
          {errors.basePrice && (
            <p className="error-text">{errors.basePrice.message}</p>
          )}
        </div>
        <div>
          <label className="label">Capacity</label>
          <input
            type="number"
            className="input"
            {...register("capacity", {
              required: "Required",
              valueAsNumber: true,
            })}
          />
          {errors.capacity && (
            <p className="error-text">{errors.capacity.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RoomTypePage() {
  const [roomTypes, setRoomTypes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const load = () => {
    setLoading(true);
    roomTypeApi
      .listAdmin()
      .then((res) => setRoomTypes(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", description: "", basePrice: "", capacity: "" });
    setModalOpen(true);
  };

  const openEdit = (rt) => {
    setEditing(rt);
    reset(rt);
    setModalOpen(true);
  };

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      if (editing) {
        await roomTypeApi.update(editing.id, values);
      } else {
        await roomTypeApi.create(values);
      }
      setModalOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await roomTypeApi.remove(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Room Types</h1>
        <button className="btn-primary" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Room Type
        </button>
      </div>

      <div className="mt-5">
        {loading ? (
          <Loader />
        ) : roomTypes?.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {roomTypes.map((rt) => (
              <div key={rt.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-800">{rt.name}</h3>
                  <div className="flex gap-1">
                    <button
                      className="btn-ghost h-8 w-8 p-0"
                      onClick={() => openEdit(rt)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      className="btn-ghost h-8 w-8 p-0 text-red-600"
                      onClick={() => setDeleteTarget(rt)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {rt.description && (
                  <p className="mt-1 text-sm text-slate-500">
                    {rt.description}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Up to {rt.capacity} guests
                  </span>
                  <span className="font-semibold text-brand-800">
                    {formatCurrency(rt.basePrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No room types yet"
            description="Create your first room type to get started."
          />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Room Type" : "New Room Type"}
        footer={
          <>
            <button
              className="btn-secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit(onSubmit)}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </>
        }
      >
        <RoomTypeFormFields register={register} errors={errors} />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete room type?"
        message={`This will permanently delete "${deleteTarget?.name}". Rooms using this type must be removed first.`}
        confirmLabel="Delete"
        danger
        loading={saving}
      />
    </div>
  );
}

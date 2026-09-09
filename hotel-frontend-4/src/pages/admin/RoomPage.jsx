import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Images } from "lucide-react";
import { useForm } from "react-hook-form";
import { roomApi } from "../../api/roomApi";
import { roomTypeApi } from "../../api/roomTypeApi";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import { formatCurrency } from "../../utils/formatCurrency";

function RoomFormFields({ register, errors, roomTypes }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="label">Room number</label>
        <input
          className="input"
          {...register("roomNumber", { required: "Required" })}
        />
        {errors.roomNumber && (
          <p className="error-text">{errors.roomNumber.message}</p>
        )}
      </div>
      <div>
        <label className="label">Room type</label>
        <select
          className="input"
          {...register("roomTypeId", {
            required: "Required",
            valueAsNumber: true,
          })}
        >
          <option value="">Select a room type</option>
          {roomTypes.map((rt) => (
            <option key={rt.id} value={rt.id}>
              {rt.name}
            </option>
          ))}
        </select>
        {errors.roomTypeId && (
          <p className="error-text">{errors.roomTypeId.message}</p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Floor</label>
          <input
            type="number"
            className="input"
            {...register("floor", { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" {...register("status")}>
            <option value="AVAILABLE">Available</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input" rows={3} {...register("description")} />
      </div>
    </div>
  );
}

export default function RoomPage() {
  const [rooms, setRooms] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [page, setPage] = useState(0);
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
    roomApi
      .search({ page, size: 10 })
      .then((res) => setRooms(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    roomTypeApi.listAdmin().then((res) => setRoomTypes(res.data));
  }, []);

  useEffect(load, [page]);

  const openCreate = () => {
    setEditing(null);
    reset({
      roomNumber: "",
      roomTypeId: "",
      floor: "",
      status: "AVAILABLE",
      description: "",
    });
    setModalOpen(true);
  };

  const openEdit = (room) => {
    setEditing(room);
    reset({
      roomNumber: room.roomNumber,
      roomTypeId: room.roomTypeId,
      floor: room.floor,
      status: room.status,
      description: room.description,
    });
    setModalOpen(true);
  };

  const onSubmit = async (values) => {
    setSaving(true);
    try {
      if (editing) {
        await roomApi.update(editing.id, values);
      } else {
        await roomApi.create(values);
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
      await roomApi.remove(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Rooms</h1>
        <button className="btn-primary" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Room
        </button>
      </div>

      <div className="mt-5">
        {loading ? (
          <Loader />
        ) : rooms?.content?.length ? (
          <>
            <div className="card overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Room #</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Floor</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rooms.content.map((room) => (
                    <tr key={room.id}>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {room.roomNumber}
                      </td>
                      <td className="px-4 py-3">{room.roomTypeName}</td>
                      <td className="px-4 py-3">{room.floor ?? "-"}</td>
                      <td className="px-4 py-3">
                        {formatCurrency(room.basePrice)}
                      </td>
                      <td className="px-4 py-3">{room.status}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Link
                            to={`/admin/rooms/${room.id}/images`}
                            className="btn-ghost h-8 w-8 p-0"
                          >
                            <Images className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            className="btn-ghost h-8 w-8 p-0"
                            onClick={() => openEdit(room)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            className="btn-ghost h-8 w-8 p-0 text-red-600"
                            onClick={() => setDeleteTarget(room)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              pageNumber={rooms.pageNumber}
              totalPages={rooms.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : (
          <EmptyState
            title="No rooms yet"
            description="Add rooms once you have room types set up."
          />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Room" : "New Room"}
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
        <RoomFormFields
          register={register}
          errors={errors}
          roomTypes={roomTypes}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete room?"
        message={`This will permanently delete room "${deleteTarget?.roomNumber}".`}
        confirmLabel="Delete"
        danger
        loading={saving}
      />
    </div>
  );
}

import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function EditProfileModal({ onClose }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    photo: user.photo || "",
    oldPassword: "",
    newPassword: "",
    role: user.role || "user",
  });

  const defaultAvatar =
    "https://www.svgrepo.com/show/384674/account-avatar-profile-user-13.svg";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({ ...prev, photo: reader.result }));
    if (file) reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          photo: form.photo,
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            name: form.name,
            phone: form.phone,
            photo: form.photo,
          })
        );

        Swal.fire("Berhasil", "Profil berhasil diperbarui", "success");
        onClose();
      } else {
        Swal.fire("Gagal", data.message, "error");
      }
    } catch (err) {
      console.error("Update profile failed:", err);
      Swal.fire("Error", "Terjadi kesalahan server", "error");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, logout",
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem("user");
        navigate("/");
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-96 space-y-4">
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">
          Edit Profil
        </h2>

        <p
          className={`text-sm text-center font-semibold mt-1 ${
            form.role === "admin"
              ? "text-red-600"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {form.role === "admin" ? "👑 Role: Admin" : "🙋 Role: User"}
        </p>

        <div className="flex justify-center">
          <img
            src={form.photo || defaultAvatar}
            alt="Foto Profil"
            className="w-24 h-24 rounded-full object-cover border shadow"
          />
        </div>

        <input type="file" onChange={handlePhoto} className="w-full" />

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama Lengkap"
          className="w-full border p-2 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        />

        <input
          type="password"
          name="oldPassword"
          value={form.oldPassword}
          onChange={handleChange}
          placeholder="Password Lama (jika ingin ubah)"
          className="w-full border p-2 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        />

        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="Password Baru"
          className="w-full border p-2 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Simpan
          </button>
        </div>

        <hr className="my-2" />

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default EditProfileModal;

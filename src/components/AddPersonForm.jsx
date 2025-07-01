import React, { useState } from "react";
import { showSuccess, showError } from "../utils/alert";

function AddPersonForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    address: "",
    occupation: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/people", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      showSuccess("Data berhasil ditambahkan!");
      onSuccess();
      onClose();
    } else {
      showError("Gagal menambahkan data.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-700">Tambah Data Orang</h2>

        {["name", "age", "phone", "address", "occupation"].map((field) => (
          <div key={field}>
            <label className="block text-sm capitalize text-gray-600 mb-1">
              {field === "phone" ? "Nomor HP" : field}
            </label>
            <input
              type={field === "age" ? "number" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPersonForm;

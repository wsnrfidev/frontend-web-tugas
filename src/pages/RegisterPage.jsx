import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../utils/alert";

function RegisterPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, password }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      showSuccess("Akun berhasil dibuat! Silakan login.");
      navigate("/"); // redirect ke login
    } else {
      showError(data.message || "Registrasi gagal.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Register Akun
        </h2>
        <div>
          <label className="block text-gray-700 mb-1">Nomor Handphone</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Buat password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>

         <p className="text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <a
            href="/"
            className="text-blue-600 hover:underline font-semibold"
          >
            Login sekarang
          </a>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;

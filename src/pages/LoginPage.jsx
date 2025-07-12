import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../utils/alert";

function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (data.success) {
        const user = {
          phone: data.user.phone,
          name: data.user.name || "Pengguna",
          photo: data.user.photo || "",
          role: data.user.role || "user",
        };

        localStorage.setItem("user", JSON.stringify(user));
        showSuccess("Login berhasil!");
        navigate("/dashboard");
      } else {
        showError("Login gagal: " + data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      showError("Terjadi kesalahan saat login.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Login Kelompok 666
        </h2>

        <div>
          <label className="block text-gray-700 mb-1">Nomor Handphone</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:underline font-semibold"
          >
            Daftar sekarang
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;

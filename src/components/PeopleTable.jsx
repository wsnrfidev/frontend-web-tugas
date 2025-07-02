import React, { useEffect, useState } from "react";
import AddPersonForm from "./AddPersonForm";
import EditPersonForm from "./EditPersonForm";
import { showSuccess, showError, showConfirmDelete } from "../utils/alert";
import * as XLSX from "xlsx";

function PeopleTable() {
  const [people, setPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const role = JSON.parse(localStorage.getItem("user"))?.role || "user";
  const isAdmin = role === "admin";

  const fetchPeople = () => {
    fetch("http://localhost:5000/api/people")
      .then((res) => res.json())
      .then((data) => setPeople(data))
      .catch((err) => console.error("Gagal mengambil data orang:", err));
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = await showConfirmDelete();
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/people/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showSuccess("Data berhasil dihapus!");
        fetchPeople();
      } else {
        showError("Gagal menghapus data.");
      }
    } catch (error) {
      console.error("Error saat menghapus:", error);
      showError("Terjadi kesalahan saat menghapus data.");
    }
  };

  const handleMultiDelete = async () => {
    const confirm = await showConfirmDelete(
      "Kamu yakin ingin menghapus data terpilih?"
    );
    if (!confirm) return;

    for (const id of selectedIds) {
      await fetch(`http://localhost:5000/api/people/${id}`, {
        method: "DELETE",
      });
    }

    setSelectedIds([]);
    fetchPeople();
    showSuccess("Data terpilih berhasil dihapus!");
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPeople.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPeople.map((p) => p.id));
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(people);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DataOrang");
    XLSX.writeFile(workbook, "data_orang.xlsx");
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(people);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data_orang.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPeople = people.filter((person) => {
    const term = searchTerm.toLowerCase();
    return (
      person.name.toLowerCase().includes(term) ||
      person.address.toLowerCase().includes(term) ||
      person.occupation.toLowerCase().includes(term)
    );
  });

  const totalPeople = people.length;

  const countByOccupation = () => {
    const result = {};
    people.forEach((person) => {
      const job = person.occupation || "Tidak Diketahui";
      result[job] = (result[job] || 0) + 1;
    });
    return result;
  };

  const occupationStats = countByOccupation();

  return (
    <div className="relative">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">📊 Statistik Data</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Total Orang
            </p>
            <p className="text-2xl font-bold">{totalPeople}</p>
          </div>
          {Object.entries(occupationStats).map(([job, count]) => (
            <div
              key={job}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <p className="text-sm text-gray-500 dark:text-gray-300">{job}</p>
              <p className="text-xl font-bold">{count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="w-full md:w-auto">
          <input
            type="text"
            placeholder="Cari nama, alamat, atau pekerjaan..."
            className="border p-2 rounded-lg w-full md:w-72 focus:ring focus:ring-blue-400 outline-none dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isAdmin && (
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Export Excel
            </button>

            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Export CSV
            </button>

            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              + Tambah Data
            </button>
          </div>
        )}
      </div>

      {isAdmin && selectedIds.length > 0 && (
        <div className="mb-4">
          <button
            onClick={handleMultiDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Hapus Terpilih ({selectedIds.length})
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse shadow-sm rounded-xl bg-white dark:bg-gray-800 dark:text-white">
          <thead className="bg-blue-600 text-white">
            <tr>
              {isAdmin && (
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === filteredPeople.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
              )}
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Age</th>
              <th className="px-4 py-2">Phone Number</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Occupation</th>
              {isAdmin && <th className="px-4 py-2">Action</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPeople.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 7 : 6}
                  className="text-center p-4 text-gray-500 dark:text-gray-400"
                >
                  Tidak ada data yang cocok.
                </td>
              </tr>
            ) : (
              filteredPeople.map((person) => (
                <tr
                  key={person.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {isAdmin && (
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(person.id)}
                        onChange={() => toggleSelect(person.id)}
                      />
                    </td>
                  )}
                  <td className="px-4 py-2">{person.name}</td>
                  <td className="px-4 py-2">{person.age}</td>
                  <td className="px-4 py-2">{person.phone}</td>
                  <td className="px-4 py-2">{person.address}</td>
                  <td className="px-4 py-2">{person.occupation}</td>
                  {isAdmin && (
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => setEditData(person)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isAdmin && showForm && (
        <AddPersonForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchPeople}
        />
      )}
      {isAdmin && editData && (
        <EditPersonForm
          person={editData}
          onClose={() => setEditData(null)}
          onSuccess={fetchPeople}
        />
      )}
    </div>
  );
}

export default PeopleTable;

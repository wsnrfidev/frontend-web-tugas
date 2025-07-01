import Swal from "sweetalert2";

export const showSuccess = (message) => {
  Swal.fire({
    icon: "success",
    title: "Berhasil",
    text: message,
    confirmButtonColor: "#3b82f6",
  });
};

export const showError = (message) => {
  Swal.fire({
    icon: "error",
    title: "Oops!",
    text: message,
    confirmButtonColor: "#ef4444",
  });
};

export const showConfirmDelete = async () => {
  const result = await Swal.fire({
    title: "Yakin hapus data ini?",
    text: "Data yang dihapus tidak bisa dikembalikan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
    confirmButtonColor: "#ef4444", 
    cancelButtonColor: "#6b7280", 
    customClass: {
      confirmButton: "text-red", 
      cancelButton: "text-grey",
    },
  });

  return result.isConfirmed;
};

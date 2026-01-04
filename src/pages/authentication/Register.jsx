import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../utils/api";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    cabang: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Nama wajib diisi";
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    if (!formData.role) newErrors.role = "Role wajib dipilih";
    if (!formData.cabang) newErrors.cabang = "Cabang wajib dipilih";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await registerApi(formData);
      alert("Registrasi berhasil, silakan login!");
      setFormData({ name: "", email: "", password: "", role: "", cabang: "" });
      setErrors({});
      navigate("/login-customer");
    } catch (err) {
      alert(err.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f4e9ff] px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-[#3e146d]/10">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#3e146d]">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#3e146d] transition-colors bg-transparent p-0 border-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            >
              <option value="">-- Pilih Role --</option>
              <option value="Manager Main Warehouse">Manager Main Warehouse</option>
              <option value="Manager Destination Warehouse">Manager Destination Warehouse</option>
              <option value="Staff Main Warehouse">Staff Main Warehouse</option>
              <option value="Staff Destination Warehouse">Staff Destination Warehouse</option>
              <option value="Courier">Courier</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>

          {/* Cabang */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Cabang</label>
            <select
              name="cabang"
              value={formData.cabang}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            >
              <option value="">-- Pilih Cabang --</option>
              <option value="main">Main</option>
              <option value="remu">Remu</option>
              <option value="aimas">Aimas</option>
            </select>
            {errors.cabang && <p className="text-red-500 text-sm mt-1">{errors.cabang}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#3e146d] text-white rounded-lg font-semibold shadow-md hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-700">
          Sudah punya akun? {" "}
          <Link to="/login-customer" className="text-[#3e146d] font-semibold hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
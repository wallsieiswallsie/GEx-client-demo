import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../../utils/api";
import { getRedirectPathByRole } from "../../utils/routes";
import { useAuth } from "../../context/AuthContext";

export default function LoginPageCustomer() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Ambil function login dari context

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Format email tidak valid";

    if (!formData.password) newErrors.password = "Password wajib diisi";
    else if (formData.password.length < 6)
      newErrors.password = "Password minimal 6 karakter";

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

    try {
      const data = await loginApi(formData);

      // ✅ Simpan user ke AuthContext & localStorage
      login({
        userData: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      const redirectPath = getRedirectPathByRole(data.user.role);
      navigate(redirectPath);
    } catch (err) {
      console.error(err);
      alert(err.message || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f4e9ff] px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-[#3e146d]/10">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#3e146d]">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e146d]"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
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
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#3e146d] bg-transparent p-0"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#3e146d] text-white rounded-lg font-semibold shadow-md hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-700">
          Belum punya akun?{" "}
          <Link
            to="/register-customer"
            className="text-[#3e146d] font-semibold hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
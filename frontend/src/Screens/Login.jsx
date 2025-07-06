import React, { useState, useEffect } from "react";
import { FiLogIn, FiMoon, FiSun } from "react-icons/fi";
import axiosWrapper from "../utils/AxiosWrapper";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserToken } from "../redux/actions";
import toast, { Toaster } from "react-hot-toast";
import CustomButton from "../components/CustomButton";

const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
};

const ThemeToggle = ({ darkMode, setDarkMode }) => (
  <button
    onClick={() => setDarkMode(!darkMode)}
    className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-105 transition"
    aria-label="Toggle theme"
  >
    {darkMode ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-800" />}
  </button>
);

const UserTypeSelector = ({ onSelect }) => (
  <div className="flex flex-col items-center justify-center space-y-4">
  <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Welcome to CMS</h1>
  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Please select your role to continue</p>
  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Login As</h2>
  {Object.values(USER_TYPES).map((type) => (
    <button
      key={type}
      onClick={() => onSelect(type)}
      className="px-6 py-3 w-60 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition duration-200"
    >
      {type}
    </button>
  ))}
</div>

);

const LoginForm = ({ selected, onSubmit, formData, setFormData, goBack }) => (
  <form
    className="w-full p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
    onSubmit={onSubmit}
  >
    <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
      {selected} Login
    </h2>
    <div className="mb-6">
      <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
        {selected} Email
      </label>
      <input
        type="email"
        required
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </div>
    <div className="mb-6">
      <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
        Password
      </label>
      <input
        type="password"
        required
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
    </div>
    <div className="flex items-center justify-between mb-6">
      <Link to="/forget-password" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
        Forgot Password?
      </Link>
    </div>
    <div className="flex gap-4">
      <button
        type="button"
        onClick={goBack}
        className="w-1/2 border border-gray-400 text-gray-700 dark:text-white dark:border-gray-500 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Back
      </button>
      <CustomButton
        type="submit"
        className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg flex justify-center items-center gap-2"
      >
        Login
        <FiLogIn className="text-lg" />
      </CustomButton>
    </div>
  </form>
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [darkMode, setDarkMode] = useState(false);

  const typeFromQuery = searchParams.get("type");
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate(`/${localStorage.getItem("userType").toLowerCase()}`);
    }
  }, [navigate]);

  useEffect(() => {
    if (typeFromQuery) {
      const formatted = typeFromQuery.charAt(0).toUpperCase() + typeFromQuery.slice(1);
      setSelected(formatted);
    }
  }, [typeFromQuery]);

  const handleUserTypeSelect = (type) => {
    setSelected(type);
    setSearchParams({ type: type.toLowerCase() });
  };

  const handleGoBack = () => {
    setSelected(null);
    setFormData({ email: "", password: "" });
    setSearchParams({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axiosWrapper.post(
        `/${selected.toLowerCase()}/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token } = response.data.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userType", selected);
      dispatch(setUserToken(token));
      navigate(`/${selected.toLowerCase()}`);
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="w-full max-w-md py-12">
        {selected ? (
          <LoginForm
            selected={selected}
            onSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            goBack={handleGoBack}
          />
        ) : (
          <UserTypeSelector onSelect={handleUserTypeSelect} />
        )}
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Login;

import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext.jsx";
import { api } from "../api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function login(ev) {
    ev.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { username, password });
      setUserInfo(response.data);
      setIsLoading(false);
      setSuccessMessage("SignIn Successful, Redirecting to the Home page");
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setRedirect(true);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Wrong credentials! Please try again.");
      setShowErrorModal(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-medium mb-8 text-center">Sign in</h1>
      <form onSubmit={login} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
  <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center">
    <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-gray-100 text-gray-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
      >
        <path
          fillRule="evenodd"
          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <h2 className="mt-3 text-base font-semibold text-gray-800">
      SignIn Failed
    </h2>
    <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
    <button
      onClick={() => setShowErrorModal(false)}
      className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900"
    >
      Try Again
    </button>
  </div>
</div>

      )}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-green-100 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h2 className="mt-3 text-base font-semibold text-gray-800">
              SignIn Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">{successMessage}</p>
            <div className="mt-4 flex items-center justify-center">
              <div className="relative">
                <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin border-t-black"></div>
              </div>
              <span className="ml-3 text-sm text-gray-600 font-medium">Redirecting to home page...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

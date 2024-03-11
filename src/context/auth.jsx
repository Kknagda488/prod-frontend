import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    const storedData = localStorage.getItem("userDetails");
    return storedData ? JSON.parse(storedData) : null;
  });

  const storeUserDataInLs = (data) => {
    const jsonData = JSON.stringify(data);
    localStorage.setItem("userDetails", jsonData);
    setUserData(data);
  };
  const logoutUser = async () => {
    try {
      // Make a request to the logout API endpoint
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_URL}/api/Users/logout`,
        {
          method: "POST",
          body: JSON.stringify({ token: userData?.accessToken }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUserData(null);
        localStorage.removeItem("userDetails");
        toast.success(data.message);
        navigate("/login");
      } else {
        console.error("Logout failed:", response.statusText);
        toast.error(data.message);
        // Handle logout failure
      }
    } catch (error) {
      console.error("Logout failed:", error.message);
      toast.error(error.message);

      // Handle logout failure
    }
  };

  const signOut = () => {
    logoutUser();
  };
  // const logoutUser = async () => {
  //     setUserData(null);
  //     localStorage.removeItem("userDetails");
  // };

  // const signOut = () => {
  //     logoutUser();
  //     console.log("user logout ")
  //     navigate("/login");
  // };

  // useEffect(() => {
  //     // Check if the user is logged in
  //     if (!userData) {
  //         // Redirect to login if not logged in
  //         navigate("/login");
  //     }
  // }, [userData, navigate]);

  return (
    <AuthContext.Provider
      value={{ userData, storeUserDataInLs, logoutUser, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the provider");
  }
  return authContextValue;
};

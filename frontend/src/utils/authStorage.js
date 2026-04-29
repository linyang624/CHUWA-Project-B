// Get all saved auth data from localStorage
export const getAuthFromStorage = () => {
  const user = getUserFromStorage();
  const token = getTokenFromStorage();

  if (!user || !token) {
    return null;
  }

  return {
    user,
    token,
    isAuthenticated: true,
  };
};

// Get only the saved JWT token
export const getTokenFromStorage = () => {
  return localStorage.getItem("token") || "";
};

// Get only the saved user object
export const getUserFromStorage = () => {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Failed to read user from localStorage:", error);
    return null;
  }
};

// Save auth data after login
export const saveAuthToStorage = (authData) => {
  localStorage.setItem("user", JSON.stringify(authData.user));
  localStorage.setItem("token", authData.token);
};

// Remove auth data after logout
export const clearAuthFromStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
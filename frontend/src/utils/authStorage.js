// The localStorage key used to save login information
const AUTH_STORAGE_KEY = "employee_management_auth";

// Read all saved auth data from localStorage
export const getAuthFromStorage = () => {
    try {
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

        if (!savedAuth) {
            return null;
        }

        return JSON.parse(savedAuth);
    } catch (error) {
        console.error("Failed to read auth from localStorage:", error);
        return null;
    }
};

// Get only the saved JWT token
export const getTokenFromStorage = () => {
    const auth = getAuthFromStorage();
    return auth?.token || "";
};

// Get only the saved user object
export const getUserFromStorage = () => {
    const auth = getAuthFromStorage();
    return auth?.user || null;
};

// Save auth data after login
export const saveAuthToStorage = (authData) => {
    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    } catch (error) {
        console.error("Failed to save auth to localStorage:", error);
    }
};

// Remove auth data after logout
export const clearAuthFromStorage = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
};
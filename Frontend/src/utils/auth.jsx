export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");
export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

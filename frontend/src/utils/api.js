import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
    
export const postData = async (url, formData) => {
    try {
        const response = await fetch(apiUrl + url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        // If token is expired or invalid
        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/"; // 👈 redirect to home
            return { error: true, message: "Session expired. Please login again." };
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

// export const getData = async (url) => {
//     try {
//         const response = await fetch(apiUrl + url, {
//             headers: {
//             "Authorization": `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "application/json",
//             },
//         });
//         // If token is expired or invalid
//         if (response.status === 401 || response.status === 403) {
//             localStorage.removeItem("token");
//             localStorage.removeItem("user");
//             window.location.href = "/"; // 👈 redirect to home
//         }
//         return data;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

api.interceptors.request.use(
    (config) => {
        const csrftoken = getCookie('csrftoken');
        if (csrftoken) config.headers['X-CSRFToken'] = csrftoken;
        return config;
    },
    (error) => Promise.reject(error)
);

export const login = (username, password) => api.post('/auth/login/', { username, password });
export const googleAuth = (data) => api.post('/auth/google_auth/', data); // { googleId, email, name, photo }
export const signup = (data) => api.post('/auth/signup/', data);
export const getMe = () => api.get('/auth/me/');
export const updateMe = (data) => api.post('/profiles/update_me/', data); // New
export const getProfiles = (learn) => api.get(`/profiles/${learn ? `?learn=${learn}` : ''}`);
export const swipe = (userId, action) => api.post('/interactions/', { to_user: userId, action }); // action: 'like' | 'pass'
export const getMatches = () => api.get('/interactions/matches/');
export const uploadGalleryImage = (profileId, formData) => api.post(`/profiles/${profileId}/upload_gallery/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getRooms = () => api.get('/rooms/');

// Supports Private OR Public rooms
export const getMessages = (roomId, isPublic = false) => {
    const param = isPublic ? `public_room=${roomId}` : `room=${roomId}`;
    return api.get(`/messages/?${param}`);
}

export const sendMessage = (roomId, content, isPublic = false) => {
    const idKey = isPublic ? 'public_room' : 'room';

    if (content instanceof FormData) {
        content.append(idKey, roomId); // ensure room id is attached if not already
        return api.post('/messages/', content, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
        return api.post('/messages/', { [idKey]: roomId, text: content });
    }
};

export const getPublicRooms = () => api.get('/public-rooms/');
export const joinPublicRoom = (roomId) => api.post(`/public-rooms/${roomId}/join/`);
export const deleteRoom = (roomId, isPublic) => {
    // Only private rooms can be deleted by user generally
    if (isPublic) return Promise.reject("Cannot delete public room");
    return api.delete(`/rooms/${roomId}/`);
};

export const blockUser = (userId) => api.post('/blocks/', { blocked: userId });
export const reportUser = (userId, reason) => api.post('/reports/', { reported: userId, reason });

export default api;

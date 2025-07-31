// src/components/Toast.jsx
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showSuccess = (msg) => toast.success(msg);
export const showError = (msg) => toast.error(msg);

const Toast = () => (
  <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
);

export default Toast;

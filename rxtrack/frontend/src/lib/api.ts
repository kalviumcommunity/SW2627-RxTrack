import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export type UserRole = "DOCTOR" | "PHARMACY" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Medicine {
  id: string;
  name: string;
  strength: string | null;
  form: string | null;
}

export interface Prescription {
  id: string;
  patientName: string;
  status: string;
  createdAt: string;
  medicines: Array<{ id: string; quantity: number; medicine: Medicine }>;
}

export interface Fulfillment {
  id: string;
  status: string;
  prescription: Prescription;
}

export const authApi = {
  async login(email: string, password: string) {
    const { data } = await api.post<{ token: string; user: User }>("/api/auth/login", { email, password });
    return data;
  },
};

export const prescriptionApi = {
  async list() {
    const { data } = await api.get<Prescription[]>("/api/prescriptions");
    return data;
  },
  async upload(payload: { patientName: string; imageUrl?: string; medicines: Array<{ medicineId: string; quantity: number }> }) {
    const { data } = await api.post<Prescription>("/api/prescriptions/upload", payload);
    return data;
  },
};

export const medicineApi = {
  async list() {
    const { data } = await api.get<Medicine[]>("/api/medicines");
    return data;
  },
};

export const pharmacyApi = {
  async queue() {
    const { data } = await api.get<Fulfillment[]>("/api/prescriptions/pharmacy-queue");
    return data;
  },
  async markFilled(fulfillmentId: string) {
    const { data } = await api.post(`/api/fulfillments/mark-filled`, { fulfillmentId });
    return data;
  },
};

export default api;
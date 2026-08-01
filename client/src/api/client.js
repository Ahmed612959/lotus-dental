const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const error = new Error((data && data.message) || `Request failed: ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ---------- Public: Services ----------
export const apiGetServices = () => request('/services');
export const apiGetServiceById = (id) => request(`/services/${id}`);

// ---------- Public: Doctors ----------
export const apiGetDoctors = () => request('/doctors');
export const apiGetDoctorById = (id) => request(`/doctors/${id}`);

// ---------- Public: Settings & Testimonials ----------
export const apiGetSettings = () => request('/settings');
export const apiGetTestimonials = () => request('/testimonials');

// ---------- Public: Booking ----------
export const apiGetAvailableSlots = (doctorId, serviceId, date) =>
  request(`/appointments/available-slots?doctorId=${doctorId}&serviceId=${serviceId}&date=${date}`);

export const apiCreateAppointment = (payload) =>
  request('/appointments', { method: 'POST', body: payload });

export const apiLookupBooking = (bookingCode) =>
  request(`/appointments/lookup/${bookingCode}`);

export const apiCancelBooking = (bookingCode) =>
  request(`/appointments/lookup/${bookingCode}/cancel`, { method: 'PUT' });

// ---------- Auth ----------
export const apiLogin = (email, password) =>
  request('/auth/login', { method: 'POST', body: { email, password } });

export const apiGetMe = (token) => request('/auth/me', { token });

// ---------- Admin: Appointments ----------
export const apiGetAppointments = (token, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/appointments${qs ? `?${qs}` : ''}`, { token });
};
export const apiGetStats = (token) => request('/appointments/stats', { token });
export const apiCreateManualAppointment = (token, payload) =>
  request('/appointments/manual', { method: 'POST', body: payload, token });
export const apiUpdateAppointment = (token, id, payload) =>
  request(`/appointments/${id}`, { method: 'PUT', body: payload, token });
export const apiDeleteAppointment = (token, id) =>
  request(`/appointments/${id}`, { method: 'DELETE', token });

// ---------- Admin: Doctors ----------
export const apiGetAllDoctors = (token) => request('/doctors?all=true', { token });
export const apiCreateDoctor = (token, payload) =>
  request('/doctors', { method: 'POST', body: payload, token });
export const apiUpdateDoctor = (token, id, payload) =>
  request(`/doctors/${id}`, { method: 'PUT', body: payload, token });
export const apiDeleteDoctor = (token, id) =>
  request(`/doctors/${id}`, { method: 'DELETE', token });

// ---------- Admin: Services ----------
export const apiGetAllServices = (token) => request('/services?all=true', { token });
export const apiCreateService = (token, payload) =>
  request('/services', { method: 'POST', body: payload, token });
export const apiUpdateService = (token, id, payload) =>
  request(`/services/${id}`, { method: 'PUT', body: payload, token });
export const apiDeleteService = (token, id) =>
  request(`/services/${id}`, { method: 'DELETE', token });

// ---------- Admin: Patients ----------
export const apiGetPatients = (token, search = '') =>
  request(`/patients${search ? `?search=${encodeURIComponent(search)}` : ''}`, { token });
export const apiGetPatientById = (token, id) => request(`/patients/${id}`, { token });

// ---------- Admin: Settings ----------
export const apiUpdateSettings = (token, payload) =>
  request('/settings', { method: 'PUT', body: payload, token });

// ---------- Admin: Testimonials ----------
export const apiGetAllTestimonials = (token) => request('/testimonials?all=true', { token });
export const apiCreateTestimonial = (token, payload) =>
  request('/testimonials', { method: 'POST', body: payload, token });
export const apiUpdateTestimonial = (token, id, payload) =>
  request(`/testimonials/${id}`, { method: 'PUT', body: payload, token });
export const apiDeleteTestimonial = (token, id) =>
  request(`/testimonials/${id}`, { method: 'DELETE', token });

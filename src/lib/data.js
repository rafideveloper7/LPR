// Central data file for LPR Agency website
// All data comes from the API. No dummy data fallback.

import { API_URL } from './apiConfig';

// Generic API fetch — throws on failure so components can decide how to handle it
export async function fetchAPI(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status} for ${endpoint}`);
  return res.json();
}

// Per-resource fetch functions — each returns the full response { success, data }
export const getServices    = () => fetchAPI('/services');
export const getService    = (id) => fetchAPI(`/services/${id}`);
export const getServiceBySlug = (slug) => fetchAPI(`/services/slug/${slug}`);
export const getProjects    = () => fetchAPI('/projects');
export const getProject     = (id) => fetchAPI(`/projects/${id}`);
export const getBlogs       = () => fetchAPI('/blogs');
export const getClients     = () => fetchAPI('/clients');
export const getSkills      = () => fetchAPI('/skills');
export const getStats       = () => fetchAPI('/stats');
export const getTestimonials= () => fetchAPI('/testimonials');
export const getHero        = () => fetchAPI('/hero');
export const getSiteSettings= () => fetchAPI('/site-settings');
export const getAbout       = () => fetchAPI('/about');
export const getBlog        = (id) => fetchAPI(`/blogs/${id}`);
export const getGallery     = () => fetchAPI('/gallery');
export const getFAQs        = () => fetchAPI('/faq');

// Contact form submission
export async function submitContact(data) {
  const res = await fetch(`${API_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Upload image or video to Cloudinary via backend
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Upload failed');
  }
  return data.url;
}

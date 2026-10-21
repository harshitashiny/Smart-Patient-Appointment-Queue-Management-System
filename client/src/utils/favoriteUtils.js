const FAVORITES_KEY = 'smartcare_favorite_doctors';

export const getFavorites = () => {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading favorites from localStorage:', e);
    return [];
  }
};

export const isFavorite = (doctorId) => {
  if (!doctorId) return false;
  const favs = getFavorites();
  return favs.some((item) => (typeof item === 'string' ? item === doctorId : item._id === doctorId));
};

export const toggleFavorite = (doctor) => {
  if (!doctor) return false;
  const doctorId = doctor._id || doctor;
  const favs = getFavorites();
  const index = favs.findIndex((item) => (typeof item === 'string' ? item === doctorId : item._id === doctorId));

  let updated;
  let added = false;
  if (index >= 0) {
    updated = favs.filter((_, i) => i !== index);
    added = false;
  } else {
    updated = [...favs, doctor];
    added = true;
  }

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving favorites to localStorage:', e);
  }

  // Dispatch custom window event so all components react immediately
  window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { doctorId, added } }));
  return added;
};

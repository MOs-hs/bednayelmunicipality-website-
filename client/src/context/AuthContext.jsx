import { createContext, useContext, useState} from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('baladiye_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const loginCitizen = async (phone, password) => {
    const res = await api.post('/auth/login', { phone, password });
    localStorage.setItem('baladiye_token', res.data.token);
    localStorage.setItem('baladiye_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const loginAdmin = async (username, password) => {
    const res = await api.post('/auth/admin-login', { username, password });
    localStorage.setItem('baladiye_token', res.data.token);
    localStorage.setItem('baladiye_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('baladiye_token');
    localStorage.removeItem('baladiye_user');
    setUser(null);
  };

  const isAdmin = user?.type === 'admin';
  const isCitizen = user?.type === 'citizen';

  return (
    <AuthContext.Provider value={{ user, loading, loginCitizen, loginAdmin, register, logout, isAdmin, isCitizen }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

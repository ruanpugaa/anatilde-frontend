import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Login } from '../modules/admin/auth/Login';
import { AdminShell } from '../modules/admin/components/AdminShell';

export const Admin = () => {
    const [user, setUser] = useState<any>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('anatilde_admin_user');
        if (saved) setUser(JSON.parse(saved));
        setChecking(false);
    }, []);

    if (checking) return null;

    if (!user) {
        return <Login onLogin={(u) => {
            setUser(u);
            localStorage.setItem('anatilde_admin_user', JSON.stringify(u));
        }} />;
    }

    return (
        <AdminShell user={user} onLogout={() => {
            setUser(null);
            localStorage.removeItem('anatilde_admin_user');
        }}>
            {/* O React Router vai colocar a View correta aqui dentro baseada na URL */}
            <Outlet />
        </AdminShell>
    );
};
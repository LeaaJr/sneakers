import { useState, useEffect } from 'react'
import { User, Lock, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { fetchCurrentUser, type UserProfile } from '@/services/sneakerService'

export default function UserConfigPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para el cambio de contraseña
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error al cargar perfil", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Configuración de Cuenta</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-2">
          <button className="flex items-center w-full p-2.5 text-sm font-medium bg-accent text-accent-foreground rounded-lg">
            <User className="h-4 w-4 mr-2" /> Perfil
          </button>
          <button className="flex items-center w-full p-2.5 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
            <Lock className="h-4 w-4 mr-2" /> Seguridad
          </button>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3 space-y-6">
          <div className="border rounded-xl p-6 bg-card shadow-sm">
            <section className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold">Información Personal</h2>
                <p className="text-sm text-muted-foreground">Gestiona tu identidad en la plataforma.</p>
              </div>
              
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Nombre Completo</label>
                  <input 
                    type="text" 
                    defaultValue={user?.full_name}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Email (No editable)</label>
                  <input 
                    type="email" 
                    disabled 
                    value={user?.email}
                    className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm cursor-not-allowed opacity-70"
                  />
                </div>

                {/* Sección Cambiar Contraseña */}
                <div className="pt-2">
                  <button 
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                  >
                    {showPasswordChange ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    Cambiar contraseña
                  </button>

                  {/* Dropdown de Contraseña */}
                  <div className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${showPasswordChange ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-4 border rounded-lg bg-slate-50 space-y-4">
                      <div className="grid gap-2">
                        <label className="text-xs font-bold uppercase text-slate-500">Contraseña Actual</label>
                        <input 
                          type="password"
                          value={passwords.current}
                          onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label className="text-xs font-bold uppercase text-slate-500">Nueva Contraseña</label>
                          <input 
                            type="password"
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="Mín. 8 caracteres"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-xs font-bold uppercase text-slate-500">Confirmar</label>
                          <input 
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="Repite la contraseña"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <button className="bg-primary text-white font-medium px-6 py-2 rounded-lg hover:bg-primary/90 transition-all shadow-sm">
                  Guardar Cambios
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
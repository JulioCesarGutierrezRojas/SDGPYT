import { Outlet } from "react-router-dom";
import {UserRound, FolderKanban, Settings, LogOut} from "lucide-react";

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen">
           
            <div className="w-64 bg-[var(--color-azul-200)] flex flex-col">
                
                <div className="p-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">SGPYT</h1>
                    <div className="w-16 h-16 bg-cyan-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                        
                        <div className="w-12 h-12 bg-cyan-300 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>

                    </div>
                    <div className="text-gray-800">
                        <div className="font-semibold">Administrador</div>
                        <div className="text-sm text-gray-600">User7598</div>
                    </div>
                </div>

                
                <div className="flex-1 px-4">
                    <div className="mb-6">
                        <h3 className="text-gray-700 font-medium mb-3">Menú</h3>
                        <hr className="border-t border-[var(--color-gris-700)] mb-4"/>
                        <nav className="space-y-2">
                            <a href="/admin/usuarios" className="flex items-center gap-3 px-3 py-2 text-gray-800 hover:bg-cyan-300 rounded-md font-medium">
                                <UserRound className="w-4 h-4" />
                                Usuarios
                            </a>
                            <a href="/admin/proyectos" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-cyan-300 rounded-md transition-colors">
                                <FolderKanban className="w-4 h-4" />
                                Proyectos
                            </a>
                            <a href="/admin/perfil" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-cyan-300 rounded-md transition-colors">
                                <Settings className="w-4 h-4" />
                                Perfil
                            </a>
                        </nav>
                    </div>
                </div>

                
                <div className="p-4">
                    <h3 className="text-gray-700 font-medium mb-3">Sesión</h3>
                    <hr className="border-t border-[var(--color-gris-700)] mb-4"/>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-azul-400)] border border-[var(--color-azul-400)] text-[var(--color-gris-950)] rounded-md hover:bg-cyan-300 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            
            <div className="flex-1 p-6 bg-white overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}

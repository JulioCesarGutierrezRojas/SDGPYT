import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, UserPlus, ArrowRight, Home, LogIn } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '../../../kernel/alerts';
import { acceptProjectInvitation } from '../adapters/joinProject.controller';
import { getProjectById } from '../adapters/project.controller';

const JoinProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [project, setProject] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthAndLoadProject();
  }, [id]);

  const checkAuthAndLoadProject = async () => {
    try {
      setLoading(true);
      
      // Verificar si el usuario está autenticado
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!token && !!user);
      
      // Cargar información del proyecto
      if (id) {
        const response = await getProjectById(parseInt(id));
        if (response.result) {
          setProject(response.result);
        } else {
          setError('El proyecto no existe o no está disponible.');
        }
      } else {
        setError('Enlace de invitación inválido.');
      }
    } catch (err) {
      console.error('Error al cargar proyecto:', err);
      setError('Error al cargar la información del proyecto.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async () => {
    if (!isAuthenticated) {
      showErrorToast({
        title: 'Inicia sesión requerida',
        text: 'Debes iniciar sesión para unirte al proyecto'
      });
      return;
    }

    try {
      setJoining(true);
      await acceptProjectInvitation(parseInt(id));
      
      setSuccess(true);
      showSuccessToast({
        title: '¡Bienvenido al proyecto!',
        text: `Te has unido exitosamente a "${project?.name}"`
      });
      
      // Redirigir al proyecto después de 3 segundos
      setTimeout(() => {
        navigate(`/user/categories/${id}`);
      }, 3000);
      
    } catch (err) {
      console.error('Error al unirse al proyecto:', err);
      showErrorToast({
        title: 'Error al unirse',
        text: err.message || 'No se pudo unir al proyecto'
      });
    } finally {
      setJoining(false);
    }
  };

  const handleLogin = () => {
    navigate('/auth/signin');
  };

  const handleGoHome = () => {
    navigate('/user/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enlace no válido</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Te has unido al proyecto!</h1>
          <p className="text-gray-600 mb-4">
            Ahora eres colaborador del proyecto <strong>"{project?.name}"</strong>
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-700">
              Serás redirigido automáticamente al proyecto en unos segundos...
            </p>
          </div>
          <button
            onClick={() => navigate(`/user/categories/${id}`)}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Ir al proyecto ahora
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center text-white">
          <UserPlus className="w-12 h-12 mx-auto mb-3" />
          <h1 className="text-2xl font-bold mb-2">Invitación al Proyecto</h1>
          <p className="text-blue-100">Te han invitado a colaborar</p>
        </div>

        {/* Project Info */}
        {project && (
          <div className="p-6 bg-gray-50 border-b">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h2>
              {project.description && (
                <p className="text-gray-600 text-sm mb-3">{project.description}</p>
              )}
              {project.adminName && (
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <span>Administrador: {project.adminName}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {!isAuthenticated ? (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inicia sesión requerida</h3>
              <p className="text-gray-600 text-sm mb-6">
                Debes tener una cuenta e iniciar sesión para unirte al proyecto.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleLogin}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate('/auth/signup')}
                  className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  ¿No tienes cuenta? Regístrate aquí
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Todo listo!</h3>
              <p className="text-gray-600 text-sm mb-6">
                Haz clic en el botón para unirte al proyecto como colaborador.
              </p>
              <button
                onClick={handleJoinProject}
                disabled={joining}
                className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {joining ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uniéndose...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Unirme al proyecto
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t text-center">
          <p className="text-xs text-gray-500">
            Sistema de Gestión de Proyectos y Tareas
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinProject;

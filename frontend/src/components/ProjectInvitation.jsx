import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, Phone, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '../kernel/alerts';
import { acceptProjectInvitationAsGuest } from '../modules/user/adapters/guestInvitation.controller';
import { acceptProjectInvitation } from '../modules/user/adapters/joinProject.controller';
import { register } from '../modules/auth/adapters/auth.controller';
import { getProjectById } from '../modules/user/adapters/project.controller';

const ProjectInvitation = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const invitationEmail = searchParams.get('email');

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('invitation'); // 'invitation', 'register', 'success'
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Estados del formulario de registro
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: invitationEmail || '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProjectInfo();
  }, [projectId]);

  const loadProjectInfo = async () => {
    try {
      setLoading(true);
      const response = await getProjectById(parseInt(projectId));
      if (response.result) {
        setProject(response.result);
      } else {
        showErrorToast({
          title: 'Error',
          text: 'No se pudo cargar la información del proyecto'
        });
      }
    } catch (error) {
      console.error('Error al cargar proyecto:', error);
      showErrorToast({
        title: 'Error',
        text: 'El proyecto no existe o no está disponible'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitationEmail) {
      showErrorToast({
        title: 'Email requerido',
        text: 'Necesitamos tu correo electrónico para procesar la invitación'
      });
      return;
    }

    try {
      setSubmitting(true);

      // Primero intentar aceptar la invitación como invitado
      await acceptProjectInvitationAsGuest(parseInt(projectId), invitationEmail);
      
      showSuccessToast({
        title: 'Invitación aceptada',
        text: 'Ahora necesitas registrarte para unirte al proyecto'
      });
      
      setStep('register');
      
    } catch (error) {
      console.error('Error al aceptar invitación:', error);
      
      // Si el error indica que ya está registrado, ir directamente a unirse al proyecto
      if (error.message.includes('Ya eres') || error.message.includes('Inicia sesión')) {
        setIsRegistered(true);
        showSuccessToast({
          title: 'Ya estás registrado',
          text: 'Inicia sesión para acceder al proyecto'
        });
        navigate('/login', { 
          state: { 
            message: 'Inicia sesión para acceder al proyecto',
            redirect: `/user/categorias/${projectId}`
          }
        });
      } else {
        showErrorToast({
          title: 'Error',
          text: error.message || 'No se pudo procesar la invitación'
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.lastname.trim()) newErrors.lastname = 'El apellido es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'El teléfono es requerido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      // Registrar usuario
      await register(
        formData.name,
        formData.lastname,
        formData.email,
        formData.phoneNumber,
        formData.password
      );
      
      showSuccessToast({
        title: 'Registro exitoso',
        text: '¡Te has unido exitosamente al proyecto!'
      });
      
      setStep('success');
      
      // Redirigir al login después de unos segundos
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Inicia sesión para acceder a tu proyecto',
            redirect: `/user/categorias/${projectId}`
          }
        });
      }, 3000);
      
    } catch (error) {
      console.error('Error al registrar:', error);
      showErrorToast({
        title: 'Error en el registro',
        text: error.message || 'No se pudo completar el registro'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invitación no válida</h1>
          <p className="text-gray-600 mb-6">Esta invitación no existe o ha expirado.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Ir a inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-blue-600 mx-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Invitación al Proyecto
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {step === 'invitation' && (
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Has sido invitado a unirte a:
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="text-xl font-bold text-blue-900">{project.name}</h4>
                {project.description && (
                  <p className="text-blue-700 mt-2">{project.description}</p>
                )}
              </div>
              
              {invitationEmail && (
                <p className="text-sm text-gray-600 mb-6">
                  Correo de invitación: <strong>{invitationEmail}</strong>
                </p>
              )}
              
              <button
                onClick={handleAcceptInvitation}
                disabled={submitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? 'Procesando...' : 'Aceptar Invitación'}
              </button>
              
              <p className="mt-4 text-xs text-gray-500">
                Al aceptar, serás redirigido al formulario de registro
              </p>
            </div>
          )}

          {step === 'register' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                Completa tu registro
              </h3>
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nombre *
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`appearance-none relative block w-full px-3 py-2 border ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                      />
                      <User className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                      Apellido *
                    </label>
                    <div className="mt-1 relative">
                      <input
                        id="lastname"
                        name="lastname"
                        type="text"
                        required
                        value={formData.lastname}
                        onChange={handleInputChange}
                        className={`appearance-none relative block w-full px-3 py-2 border ${
                          errors.lastname ? 'border-red-300' : 'border-gray-300'
                        } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                      />
                      <User className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    {errors.lastname && <p className="mt-1 text-xs text-red-600">{errors.lastname}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo Electrónico *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    />
                    <Mail className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Teléfono *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    />
                    <Phone className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    />
                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar Contraseña *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`appearance-none relative block w-full px-3 py-2 border ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    />
                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {submitting ? 'Registrando...' : 'Registrarme y Unirme al Proyecto'}
                </button>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ¡Registro Exitoso!
              </h3>
              <p className="text-gray-600 mb-6">
                Te has unido exitosamente al proyecto <strong>{project.name}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Serás redirigido al inicio de sesión en unos segundos...
              </p>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ProjectInvitation;

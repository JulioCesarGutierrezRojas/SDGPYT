import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import RequestEmailComponent from '../components/RequestEmailComponent';
import VerifyTokenComponent from '../components/VerifyTokenComponent';
import ChangePasswordComponent from '../components/ChangePasswordComponent';

const PasswordRecoveryForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Ingresa tu correo para comenzar';
      case 2: return 'Verifica tu identidad';
      case 3: return 'Crea una nueva contraseña';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo con medio círculo */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute bottom-0 left-1/2 w-full h-[200%] bg-[var(--color-azul-300)] rounded-full transform -translate-x-1/2 translate-y-[90%]"></div>
      </div>

      {/* Contenedor principal centrado */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-gray-100 min-h-[600px] flex flex-col justify-center">
          
          {/* Título */}
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Restablecer Contraseña
          </h1>
          <p className="text-gray-600 text-center mb-8">
            {getStepTitle()}
          </p>

          {/* Indicador de pasos */}
          <div className="flex justify-center items-center mb-8 gap-2">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                    step >= stepNumber
                      ? 'bg-[var(--color-azul-900)] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-8 h-0.5 transition-all duration-200 ${
                      step > stepNumber 
                        ? 'bg-[var(--color-azul-900)]' 
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Componentes de cada paso */}
          {step === 1 && (
            <RequestEmailComponent 
              email={email} 
              setEmail={setEmail} 
              setStep={setStep} 
            />
          )}
          {step === 2 && (
            <VerifyTokenComponent 
              email={email} 
              token={token} 
              setToken={setToken} 
              setStep={setStep} 
              setUser={setUser}
            />
          )}
          {step === 3 && (
            <ChangePasswordComponent 
              email={email} 
              token={token} 
              setStep={setStep} 
              user={user}
            />
          )}

          {/* Enlace para volver al login */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-[var(--color-azul-900)] hover:text-[var(--color-azul-700)] font-medium text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecoveryForm;

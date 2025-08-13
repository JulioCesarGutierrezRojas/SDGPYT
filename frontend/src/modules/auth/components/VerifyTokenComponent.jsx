import { useState } from 'react';
import { Shield, RotateCcw } from 'lucide-react';
import { validateRecoveryToken } from '../adapters/auth.controller';
import { showErrorToast, showSuccessToast } from '../../../kernel/alerts';

const VerifyTokenComponent = ({ email, token, setToken, setStep, setUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('El token es requerido');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await validateRecoveryToken(token);
      if (response.type !== 'SUCCESS') throw new Error(response.text);
      
      setUser(response.result);
      showSuccessToast({
        title: 'Token verificado', 
        text: response.text, 
        timer: 3000
      });
      setStep(3);
    } catch (e) {
      showErrorToast({
        title: 'Error al verificar el token', 
        text: e.message, 
        timer: 3000
      });
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Loading spinner simple - puedes crear un componente Loader si quieres */}
      {isLoading && (
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-azul-900)]"></div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Hemos enviado un código de 5 dígitos a <span className="font-bold text-[var(--color-azul-900)]">{email}</span>
          </p>
        </div>

        <div className="relative">
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
            Código de verificación
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-8">
            <Shield className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              if (error) setError('');
            }}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-center font-bold text-xl tracking-widest ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="_ _ _ _ _"
            maxLength="5"
            required
            style={{letterSpacing: '5px', fontSize: '1.2rem'}}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <button 
          type="submit" 
          className="w-full bg-[var(--color-azul-900)] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[var(--color-azul-950)] focus:ring-2 focus:ring-[var(--color-azul-900)] focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading}
        >
          {isLoading ? 'Verificando...' : 'Verificar código'}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-[var(--color-azul-900)] hover:text-[var(--color-azul-700)] text-sm font-medium transition-colors"
            onClick={() => setStep(1)}
          >
            <RotateCcw className="w-4 h-4" />
            Reenviar código
          </button>
        </div>
      </form>
    </>
  );
};

export default VerifyTokenComponent;

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { validateEmail } from '../../../kernel/validations';
import { sendPasswordRecoveryEmail } from '../adapters/auth.controller';
import { showErrorToast, showSuccessToast } from '../../../kernel/alerts';

const RequestEmailComponent = ({ email, setEmail, setStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationMessage = validateEmail(email);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await sendPasswordRecoveryEmail(email);
      if (response.type !== 'SUCCESS') throw new Error(response.text);
      showSuccessToast({
        title: 'Envío exitoso', 
        text: response.text, 
        timer: 3000
      });
      setStep(2);
    } catch (e) {
      showErrorToast({
        title: 'Error al enviar el correo', 
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-8">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[var(--color-azul-900)] focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="tucorreo@ejemplo.com"
            required
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <button 
          type="submit" 
          className="w-full bg-[var(--color-azul-900)] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[var(--color-azul-950)] focus:ring-2 focus:ring-[var(--color-azul-900)] focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar código de verificación'}
        </button>
      </form>
    </>
  );
};

export default RequestEmailComponent;

/**
 * Funciones de validación para formularios
 */

// Validar email
export const validateEmail = (email) => {
    if (!email) {
        return 'El correo electrónico es requerido';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'El formato del correo electrónico es inválido';
    }
    
    return null; // Sin errores
};

// Validar contraseña
export const validatePassword = (password) => {
    if (!password) {
        return 'La contraseña es requerida';
    }
    
    if (password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (password.length > 50) {
        return 'La contraseña no puede tener más de 50 caracteres';
    }
    
    return null; // Sin errores
};

// Validar confirmación de contraseña
export const validatePasswordConfirmation = (password, confirmPassword) => {
    if (!confirmPassword) {
        return 'La confirmación de contraseña es requerida';
    }
    
    if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden';
    }
    
    return null; // Sin errores
};

// Validar nombre
export const validateName = (name, fieldName = 'El nombre') => {
    if (!name) {
        return `${fieldName} es requerido`;
    }
    
    if (name.trim().length < 2) {
        return `${fieldName} debe tener al menos 2 caracteres`;
    }
    
    if (name.trim().length > 50) {
        return `${fieldName} no puede tener más de 50 caracteres`;
    }
    
    const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/;
    if (!nameRegex.test(name)) {
        return `${fieldName} solo puede contener letras y espacios`;
    }
    
    return null; // Sin errores
};

// Validar teléfono
export const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
        return 'El número de teléfono es requerido';
    }
    
    // Eliminar espacios, guiones y paréntesis para validar
    const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    if (cleanPhone.length < 8) {
        return 'El número de teléfono debe tener al menos 8 dígitos';
    }
    
    if (cleanPhone.length > 15) {
        return 'El número de teléfono no puede tener más de 15 dígitos';
    }
    
    const phoneRegex = /^[+]?[0-9]+$/;
    if (!phoneRegex.test(cleanPhone)) {
        return 'El número de teléfono solo puede contener números y el símbolo +';
    }
    
    return null; // Sin errores
};

// Validar token de recuperación
export const validateRecoveryToken = (token) => {
    if (!token) {
        return 'El código de verificación es requerido';
    }
    
    if (token.length !== 5) {
        return 'El código de verificación debe tener exactamente 5 caracteres';
    }
    
    const tokenRegex = /^[A-Za-z0-9]{5}$/;
    if (!tokenRegex.test(token)) {
        return 'El código de verificación solo puede contener letras y números';
    }
    
    return null; // Sin errores
};

// Validar contraseña para login (menos restrictivo)
export const validateLoginPassword = (password) => {
    if (!password) {
        return 'La contraseña es requerida';
    }
    
    if (password.length > 50) {
        return 'La contraseña no puede tener más de 50 caracteres';
    }
    
    return null; // Sin errores
};

// Validar formulario de login completo
export const validateLoginForm = (email, password) => {
    const errors = {};
    
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validateLoginPassword(password);
    if (passwordError) errors.password = passwordError;
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validar formulario de registro completo
export const validateRegisterForm = (nombre, apellido, email, phoneNumber, password, confirmPassword) => {
    const errors = {};
    
    const nameError = validateName(nombre, 'El nombre');
    if (nameError) errors.name = nameError;
    
    const lastnameError = validateName(apellido, 'El apellido');
    if (lastnameError) errors.lastname = lastnameError;
    
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    
    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;
    
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
    
    const confirmPasswordError = validatePasswordConfirmation(password, confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validar formulario de recuperación de contraseña
export const validatePasswordRecoveryForm = (email) => {
    const errors = {};
    
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validar formulario de nueva contraseña
export const validateNewPasswordForm = (newPassword, confirmPassword) => {
    const errors = {};
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) errors.newPassword = passwordError;
    
    const confirmPasswordError = validatePasswordConfirmation(newPassword, confirmPassword);
    if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

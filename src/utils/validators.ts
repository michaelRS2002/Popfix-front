// Validar edad
export const validateAge = (age: string | number) => {
  if (age === undefined || age === null || age === '') return 'La edad es requerida';
  const num = typeof age === 'number' ? age : Number(age);
  if (isNaN(num)) return 'La edad debe ser un número válido';
  if (num < 13) return 'Debes tener al menos 13 años';
  if (num > 120) return 'La edad no puede ser mayor a 120';
  return null;
}
// Funciones de validación para formularios

// Validar email
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email) {
    return 'El email es requerido'
  }
  
  if (!emailRegex.test(email)) {
    return 'El formato del email no es válido'
  }
  
  return null // Sin errores
}

// Validar contraseña
export const validatePassword = (password: string) => {
  if (!password) {
    return 'La contraseña es requerida';
  }
  if (/^\s+$/.test(password)) {
    return 'La contraseña no puede ser solo espacios en blanco';
  }
  if (password.length < 8) {
    return 'La contraseña debe tener al menos 8 caracteres';
  }
  if (!/[0-9]/.test(password)) {
    return 'La contraseña debe contener al menos un número';
  }
  // Caracteres especiales permitidos (sin ' " ; \ /)
  const specialCharRegex = /[!@#$%^&*(),.?\:{}|<>\[\]\-_+=~`]/;
  if (!specialCharRegex.test(password)) {
    return 'La contraseña debe contener al menos un caracter especial';
  }
  if (/[\/'"`;\\]/g.test(password)) {
    return 'La contraseña no puede contener comillas, punto y coma, barra o contrabarra';
  }
  return null; // Sin errores
}

// Validar confirmación de contraseña
export const validatePasswordConfirmation = (password: string, confirmPassword: string) => {
  if (!confirmPassword) {
    return 'Debes confirmar la contraseña'
  }
  
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden'
  }
  
  return null // Sin errores
}


// Validar nombre
export const validateName = (name: string) => {
  if (!name) return 'El nombre es requerido';
  if (name.length < 2) return 'El nombre debe tener al menos 2 caracteres';
  if (name.length > 30) return 'El nombre no puede tener más de 30 caracteres';
  return null;
}

// Validar formulario de login completo
type LoginFormData = {
  email: string;
  password: string;
};

export const validateLoginForm = (formData: LoginFormData) => {
  const errors: { [key: string]: string } = {};
  
  const emailError = validateEmail(formData.email)
  if (emailError) errors.email = emailError
  
  const passwordError = validatePassword(formData.password)
  if (passwordError) errors.password = passwordError
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validar formulario de registro completo
type RegisterFormData = {
  name: string;
  email: string;
  age: string;
  password: string;
  confirmPassword: string;
};

export const validateRegisterForm = (formData: RegisterFormData) => {
  const errors: { [key: string]: string } = {};

  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;

  const ageError = validateAge(formData.age);
  if (ageError) errors.age = ageError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validatePasswordConfirmation(formData.password, formData.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
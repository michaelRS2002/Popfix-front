// Funciones de validación para formularios

// Validar email
export const validateEmail = (email) => {
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
export const validatePassword = (password) => {
  if (!password) {
    return 'La contraseña es requerida'
  }
  
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres'
  }
  
  return null // Sin errores
}

// Validar confirmación de contraseña
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Debes confirmar la contraseña'
  }
  
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden'
  }
  
  return null // Sin errores
}

// Validar nombre de usuario
export const validateUsername = (username) => {
  if (!username) {
    return 'El nombre de usuario es requerido'
  }
  
  if (username.length < 3) {
    return 'El nombre de usuario debe tener al menos 3 caracteres'
  }
  
  if (username.length > 20) {
    return 'El nombre de usuario no puede tener más de 20 caracteres'
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (!usernameRegex.test(username)) {
    return 'El nombre de usuario solo puede contener letras, números y guiones bajos'
  }
  
  return null // Sin errores
}

// Validar formulario de login completo
export const validateLoginForm = (formData) => {
  const errors = {}
  
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
export const validateRegisterForm = (formData) => {
  const errors = {}
  
  const usernameError = validateUsername(formData.username)
  if (usernameError) errors.username = usernameError
  
  const emailError = validateEmail(formData.email)
  if (emailError) errors.email = emailError
  
  const passwordError = validatePassword(formData.password)
  if (passwordError) errors.password = passwordError
  
  const confirmPasswordError = validatePasswordConfirmation(formData.password, formData.confirmPassword)
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
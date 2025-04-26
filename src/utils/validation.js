export const validateName = (name) => {
    if (!name.trim()) {
        return "O campo de nome é obrigatório.";
    }
    return null;
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
        return "O campo de email é obrigatório.";
    }
    if (!emailRegex.test(email)) {
        return "Por favor, insira um email válido.";
    }
    return null;
};

export const validatePassword = (password) => {
    if (!password.trim()) {
        return "O campo de senha é obrigatório.";
    }
    if (password.length < 6) {
        return "A senha deve ter pelo menos 6 caracteres.";
    }
    return null;
};
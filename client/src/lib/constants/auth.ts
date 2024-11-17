export const EMAIL_REGEX = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
export const PASSWORD_REGEX = /(?=.*\d)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const DEBOUNCE_SEND_RESET_PASSWORD_EMAIL = 30; // seconds

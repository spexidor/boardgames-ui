export const EnvHost = ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development')) ? 'http://localhost:8083' : 'http://kdm-backend:8083';
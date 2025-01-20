import winston from "winston";

const logger = winston.createLogger({
  level: "error", // Define o nível mínimo de log
  format: winston.format.combine(
    winston.format.timestamp(), // Adiciona um timestamp ao log
    winston.format.json() // Formata o log como JSON
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }), // Log de erros em arquivo
    new winston.transports.Console(), // Log no console
  ],
});

export default logger;

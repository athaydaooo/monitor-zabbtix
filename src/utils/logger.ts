import winston from "winston";

const logger = winston.createLogger({
  level: "info", // Define o nível mínimo de log como "info"
  format: winston.format.combine(
    winston.format.timestamp(), // Adiciona um timestamp ao log
    winston.format.json() // Formata o log como JSON
  ),
  transports: [
    // Logs de erro em um arquivo separado
    new winston.transports.File({ filename: "error.log", level: "error" }),

    // Logs informativos em outro arquivo
    new winston.transports.File({ filename: "info.log", level: "info" }),

    // Logs no console (opcional)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Adiciona cores ao console
        winston.format.simple() // Formato simples para o console
      ),
    }),
  ],
});

export default logger;

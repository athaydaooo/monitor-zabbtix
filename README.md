# Monitor ZabbTix - Sistema de Gerenciamento de Rede

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue)
![License](https://img.shields.io/badge/License-ISC-yellow)

Sistema backend para integração entre Zabbix e Mikrotik, proporcionando administração e monitoramento centralizado de redes.

## 📋 Visão Geral

Solução desenvolvida em Express.js que automatiza:
- Monitoramento de redes via Zabbix
- Integração com dispositivos Mikrotik
- Atualização automática de LANs
- Gerenciamento de servidores L2TP

## 🚀 Começando

### Pré-requisitos

- Node.js v18+
- pnpm
- Zabbix Server configurado
- Acesso a dispositivos Mikrotik

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/athaydaooo/monitor-zabbtix.git
   cd monitor-zabbtix
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Configure o ambiente:
   ```bash
   cp .env.example .env
   ```
   Edite o arquivo `.env` com suas credenciais e configurações

## 🛠️ Uso

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor principal |
| `npm run updateLans` | Executa a atualização das LANs |
| `npm run updateL2TPServers` | Atualiza servidores L2TP |
| `npm run build` | Compila o projeto TypeScript |

### Configuração

Configure as variáveis de ambiente no arquivo `.env`:

```ini
ZABBIX_SERVER=seu.zabbix.server
ZABBIX_USER=usuario
ZABBIX_PASSWORD=senha
MIKROTIK_API_URL=https://seu.mikrotik.com
MIKROTIK_API_USER=admin
MIKROTIK_API_PASSWORD=senha
```

## 📦 Dependências Principais

### Core
- `express`: Framework web
- `axios`: Cliente HTTP
- `node-zabbix-sender`: Integração com Zabbix
- `winston`: Sistema de logging

### Agendamento
- `node-cron`: Para tarefas agendadas

### Processamento de Dados
- `csvtojson`: Conversão de CSV para JSON

## 🔧 Desenvolvimento

### Estrutura de Arquivos
```
/src
  ├── index.ts          # Ponto de entrada principal
  ├── run-update-lans.ts # Script de atualização de LANs
  ├── run-update-l2tp-servers.ts # Script L2TP
  └── lib/             # Módulos compartilhados
```

### Ferramentas de Desenvolvimento
- TypeScript
- ESLint (com configuração Airbnb)
- Prettier
- TSUP (para builds)

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add some feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença ISC. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✉️ Contato

Equipe de Desenvolvimento - athaydaooo@gmail.com
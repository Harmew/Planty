# 🌱 Planty

**Planty** é um aplicativo mobile para gerenciamento inteligente de plantas, que ajuda você a cuidar melhor do seu jardim com lembretes automáticos, histórico de cuidados e recursos avançados como importação de dados e assistência com IA.

---

## Visão geral

Cuidar de plantas pode ser desafiador — cada espécie possui necessidades diferentes, e esquecer um cuidado pode comprometer sua saúde.

O Planty resolve isso de forma simples e intuitiva:

- 📅 Organiza seus cuidados (regar, podar, adubar, replantar)
- 🔔 Envia notificações automáticas no momento certo
- 📊 Mantém histórico completo de cuidados
- 🔄 Permite importar/exportar dados entre dispositivos
- 🤖 Integra inteligência artificial para auxiliar o usuário

---

## Funcionalidades

### Gestão de Plantas

- Cadastro de plantas com:
  - Nome
  - Localização
  - Imagem
  - Condições ideais (luz, temperatura, umidade)

- Listagem com animações e feedback visual
- Estado vazio com onboarding amigável

---

### Sistema de Cuidados

- Criação de rotinas personalizadas:
  - Regar
  - Adubar
  - Podar
  - Replantar

- Intervalos configuráveis (em dias)
- Cálculo automático de próximas tarefas
- Identificação de tarefas:
  - 🟢 Concluídas
  - 🟡 Pendentes (hoje)
  - 🔴 Atrasadas

---

### Histórico de Cuidados

- Registro automático ao concluir tarefas
- Armazenamento de:
  - Data de execução
  - Tipo de cuidado
  - Intervalo utilizado

- Base para análises futuras e consistência

---

### Notificações Inteligentes

- Agendamento automático baseado nos cuidados
- Integração com sistema nativo (Expo Notifications)
- Cancelamento automático ao atualizar tarefas
- Controle de leitura (lida / não lida)
- Debug completo para desenvolvimento

---

### Importação e Exportação de Dados

- Exportação completa do estado do app:
  - Plantas
  - Cuidados
  - Histórico
  - Notificações

- Importação para:
  - Restaurar backup
  - Migrar entre dispositivos

- Ideal para testes, demos e continuidade de uso

---

### Integração com IA

- Assistência inteligente para o usuário
- Possibilidades:
  - Sugestão de cuidados ideais
  - Geração de dados de exemplo (seed)

---

### Experiência do Usuário

- Onboarding com animações
- Interface moderna e responsiva
- Tema claro/escuro
- Componentização reutilizável
- Feedback visual em todas as ações

---

## Arquitetura

O projeto foi estruturado com foco em escalabilidade e separação de responsabilidades:

### Services Layer

Responsável pela lógica de negócio:

- `PlantService`
- `CareService`
- `NotificationService`
- `DatabaseService`
- `StorageService`
- `AiService`

---

### State Management

Gerenciamento de estado com stores independentes:

- Plantas
- Cuidados
- Histórico
- Notificações

---

### Banco de Dados

- SQLite local
- Estrutura normalizada
- Validação com Zod (schemas)

---

### Notificações

- Integração com sistema nativo via Expo
- Sincronização entre banco e sistema operacional

---

### Navegação

- Separação entre:
  - Onboarding
  - Telas de cuidados
  - Telas de histórico
  - Telas de configurações

- Uso de rotas modulares (Expo Router)

---

## Fluxo do Usuário

1. Onboarding inicial
2. Cadastro da primeira planta
3. Definição dos cuidados
4. Recebimento de notificações
5. Marcação de tarefas como concluídas
6. Acompanhamento do histórico
7. Importação/exportação de dados (opcional)

---

## Casos de Uso

- Usuários iniciantes que esquecem de cuidar das plantas
- Pessoas com múltiplas plantas e rotinas diferentes
- Usuários que trocam de dispositivo e precisam manter dados
- Demonstração de arquitetura mobile moderna

---

## Tecnologias

- React Native (Expo)
- TypeScript
- SQLite
- Zod (validação de schemas)
- Day.js (manipulação de datas)
- Expo Notifications
- Reanimated (animações)
- Expo Router

---

## Demonstração

> Em breve: vídeo demonstrando o fluxo completo do app

---

## Autor

Desenvolvido por Daniel de Oliveira (Harmew)

---

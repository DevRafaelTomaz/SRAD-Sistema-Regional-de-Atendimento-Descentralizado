# SRAD – Sistema Regional de Atendimento Descentralizado

**Plataforma 24×7 de gestão de segurança patrimonial, escalas 12×36, regionalização de equipes, cobertura automática de faltas, compliance, dashboards e geolocalização.**

---

## 🚀 Visão Geral
O **SRAD** organiza vigilantes em **Regiões Fixas (CAR – Cobertura de Atendimento Regional)**, reduzindo deslocamentos, aumentando a eficiência operacional e garantindo operação preditiva e segura.  
Transforma a gestão de segurança de reativa para **proativa**, com monitoramento em tempo real e indicadores estratégicos.

---

## 🏆 Objetivos do Sistema
- Reduzir desgaste físico e mental dos vigilantes  
- Garantir atendimento eficiente em todas as regiões  
- Cobertura automática de faltas e trocas de plantão  
- Controle rigoroso de compliance e auditoria  
- Monitoramento e gestão de escalas 24×7  

---

## 🛠 Tecnologias Utilizadas
- **Frontend:** React 19 + TypeScript  
- **Estilização:** Tailwind CSS  
- **Ícones:** Font Awesome 6  
- **Gráficos e Dashboards:** Recharts  
- **Gerenciamento de Estado:** React Hooks (useState, useCallback, useMemo)  
- **Segurança:** RBAC (Administrador, Supervisor, RH, Auditor, Vigilante)  

---

## 🔑 Funcionalidades Principais

### Gestão Regionalizada (CAR)
- Plano Piloto + 3 regiões adicionais por vigilante  
- Limite de deslocamento: 1h20, validado por matriz em tempo real  
- Alertas visuais de violação geográfica  

### Cobertura de Faltas Inteligente
- Sugestão de substitutos baseada em:  
  - Equipe oposta em folga  
  - Proximidade regional  
  - Horas extras acumuladas  
  - Índice de fadiga  

### Escalas e Turnos
- Escalas 12×36 (Par/Ímpar), diurna e noturna  
- Cobertura automática de faltas  
- Trocas de plantão com workflow de aprovação  
- Banco de disponibilidade voluntária para horas extras  

### Geolocalização e Postos
- Check-in GPS dos vigilantes nos postos  
- Controle de presença em tempo real  
- Possibilidade de realocação de vigilantes em postos  

### Dashboards e Telemetria
- Monitoramento operacional 24×7 (COC Live)  
- Mapas operacionais com geofencing  
- Painel de risco e score percentual da operação  
- Alertas visuais (verde, amarelo, vermelho)  

### Compliance e Auditoria
- Logs imutáveis de todas as ações críticas  
- Bloqueio automático de vigilantes com documentos vencidos  
- Registro de exceções aprovadas pela gestão  
- Exportação de relatórios para auditoria  

### Portal do Vigilante
- Interface mobile-first para check-in e consulta de escala  
- Declaração de disponibilidade voluntária  
- Consulta de documentos e regiões atribuídas  

---

## 👤 Perfis e Permissões
- **Vigilante:** Escala, check-in, disponibilidade, trocas  
- **Supervisor:** Aprovação de trocas, monitoramento de postos, gestão de ocorrências  
- **RH:** Cadastro de colaboradores, documentos, relatórios trabalhistas  
- **Administrador:** Configuração global, perfis, integrações e parâmetros do sistema  
- **Auditor:** Visualização de logs e relatórios sem alterar dados  

---

## 📈 Roadmap Futuro
1. Biometria facial para check-in  
2. App mobile nativo (iOS/Android) com notificações push  
3. IA preditiva para antecipação de faltas e otimização de escalas  
4. Integração com folha de pagamento e fechamento automático de horas extras  
5. Simulador operacional de ausência de colaboradores e novos contratos  

---

## ⚡ Status do Sistema
- Homologado para operação 24×7  
- Totalmente responsivo: desktop, tablet e mobile  
- Dashboard e alertas funcionando em tempo real  
- Logs auditáveis e exportáveis  
- Cenários fictícios implementados para teste operacional  

---

---

## 🔐 Acessos de Homologação (Dados Fictícios)

⚠️ **Atenção:** As credenciais abaixo são **exclusivamente para ambiente de testes, homologação e demonstração**.  
**Nunca utilizar em ambiente de produção.**

| Perfil         | CPF | Senha     |
|---------------|-----|-----------|
| Administrador | 000 | admin123  |
| Supervisor    | 111 | sup123    |
| Vigilante     | 222 | vig123    |
| RH            | 333 | rh12311   |
| Auditor       | 444 | aud123    |

### 📌 Observações
- Cada perfil possui **permissões limitadas conforme RBAC**.
- Vigilantes não têm acesso a módulos administrativos.
- Auditor possui acesso somente leitura (logs e relatórios).
- Administrador possui controle total do sistema.

---

## 💻 Executar Localmente

**Pré-requisitos:** Node.js  

```bash
# Instalar dependências
npm install

# Configurar chave de API Gemini
# GEMINI_API_KEY em .env.local

# Executar aplicação
npm run dev

Visualizar no AI Studio:
Ver aplicação
https://aistudio.google.com/apps/drive/1SZzTjjBO68z3A7M7Lm6CcflhnbjnTxDE?showPreview=true&showAssistant=true&fullscreenApplet=true

📌 Créditos

Desenvolvimento: Engenharia de Sistemas – World-Class Senior Frontend AI

Ideia Original: Rafael Tomaz



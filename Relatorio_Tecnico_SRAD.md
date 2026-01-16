
# SRAD – Sistema Regional de Atendimento Descentralizado
## Relatório Técnico de Desenvolvimento e Homologação

---

### 1. Concepção e Créditos
O sistema **SRAD** foi idealizado por **Rafael Tomaz**, que, ao identificar gargalos operacionais e logísticos na gestão de vigilância patrimonial, vislumbrou uma solução tecnológica para otimizar o deslocamento de pessoal e a cobertura de postos. A ideia nasceu da necessidade de resolver problemas reais de absenteísmo e fadiga, transformando a gestão reativa em uma operação preditiva e regionalizada.

---

### 2. Objetivo Principal
O objetivo central do SRAD é organizar a força de trabalho em **Regiões Fixas (CAR - Cobertura de Atendimento Regional)**, garantindo que o vigilante atue preferencialmente próximo à sua moradia. Isso resulta em:
- Redução drástica do tempo de deslocamento.
- Aumento do bem-estar e redução da fadiga do colaborador.
- Resposta imediata e automatizada para cobertura de faltas.
- Controle rigoroso de conformidade (compliance) documental e geográfico.

---

### 3. Arquitetura e Tecnologias Utilizadas
O sistema foi construído com uma stack moderna e de alto desempenho, focada em segurança e responsividade:

- **Frontend:** React 19 com TypeScript (Garantindo tipagem forte e menos erros em tempo de execução).
- **Estilização:** Tailwind CSS (Arquitetura Utilitária para design responsivo e moderno).
- **Ícones:** Font Awesome 6 (Interface intuitiva e universal).
- **Visualização de Dados:** Recharts (Dashboards táticos e indicadores de performance).
- **Gerenciamento de Estado:** React Hooks (UseState, UseCallback, UseMemo para performance otimizada).
- **Segurança de Acesso:** RBAC (Role-Based Access Control) com perfis distintos: Admin, Supervisor, RH, Auditor e Vigilante.

---

### 4. Funcionalidades Implementadas

#### **A. Gestão Regionalizada (Regra CAR)**
- Vinculação obrigatória ao Plano Piloto + 3 regiões adicionais.
- Trava de deslocamento: Limite de 1h20 (80 min) validado por matriz de tempo real.
- Alertas visuais de violação geográfica.

#### **B. Motor de Cobertura de Faltas (IA Tática)**
- Algoritmo que sugere substitutos com base em:
  - Equipe oposta (folguista do dia).
  - Proximidade regional.
  - Horas extras acumuladas (Equilíbrio de remuneração).
  - Índice de fadiga.

#### **C. Dashboards e Telemetria e Alertas**
- Monitoramento em tempo real (COC Live).
- Mapa operacional com status de geofencing (Check-in GPS).
- Painel de risco com score percentual da operação.

#### **D. Compliance e Auditoria**
- Logs imutáveis de todas as ações sensíveis.
- Bloqueio automático de vigilantes com documentos vencidos (Reciclagem, Porte, etc).
- Fila de decisão para exceções aprovadas pela gestão.

#### **E. Portal do Vigilante**
- Interface mobile-first para check-in.
- Declaração de disponibilidade voluntária para horas extras.
- Consulta de escala e documentos.

---

### 5. Roadmap e Futuro do Sistema
O SRAD está preparado para evoluções que elevarão ainda mais o nível tecnológico da empresa:
1.  **Integração com Biometria Facial:** Validação de identidade no check-in via câmera do smartphone.
2.  **App Mobile Nativo (iOS/Android):** Para notificações push em tempo real de convocações de emergência.
3.  **Módulo de Inteligência Artificial Preditiva:** Antecipar tendências de faltas com base em dados históricos e feriados.
4.  **Integração Direta com Folha de Pagamento:** Automação total do fechamento de horas extras e adicionais noturnos.

---

**Status Final:** Sistema Homologado para Operação 24x7.
**Desenvolvido por:** Engenharia de Sistemas (World-Class Senior Frontend AI).
**Ideia Original:** Rafael Tomaz.

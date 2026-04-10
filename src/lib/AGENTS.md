# AGENTS - src/lib

## Objetivo da pasta
- Camada de integracao com backend/auth e utilitarios de dominio compartilhados.

## Arquivos relevantes
- opportunities-api.ts: chamadas de API de oportunidades e favoritos.
- auth-client.ts: cliente Better Auth e helpers de sessao.
- api.ts: wrapper de fetch/http.
- backend-config.ts: configuracao de endpoint base.
- date-utils.ts: calculos e formatacao de prazo.
- utils.ts: utilitarios genericos (incluindo helpers de classe).

## Regras para agentes
- Nao incluir JSX/componentes nesta pasta.
- Preserve tipagem dos objetos retornados pela API.
- Toda mudanca em contratos de API deve refletir nos tipos consumidores.
- Erros devem ser tratados com mensagens claras para UI.

# ServeRest — Automated Test Suite

Projeto de automação de testes para o frontend e API do [ServeRest](https://serverest.dev), desenvolvido com **Cypress 14** e **JavaScript**.

---

## Tecnologias

- [Cypress 14](https://docs.cypress.io) — framework de testes E2E e API
- JavaScript (CommonJS)
- Node.js 18

---

## Aplicação testada

| Camada   | URL                                          |
|----------|----------------------------------------------|
| Frontend | https://front.serverest.dev                  |
| API REST | https://serverest.dev                        |

---

## Arquitetura do projeto

```
cypress/
├── support/
│   ├── e2e.js             # Entry point — carregado antes de cada spec
│   └── commands.js        # Comandos customizados cy.* (cy.apiRequest)
│
├── helpers/
│   ├── dataFactory.js     # Geração de dados de teste (JS puro, sem dependência do Cypress)
│   └── userApi.js         # Ações de API reutilizáveis entre specs
│
└── e2e/
    ├── api/               # Testes de contrato da API (sem browser)
    │   ├── login.cy.js
    │   ├── produtos.cy.js
    │   └── usuarios.cy.js
    │
    └── frontend/          # Testes E2E com browser real
        ├── login.cy.js
        ├── cadastro.cy.js
        └── catalogo.cy.js
```

### Decisões de arquitetura

**`dataFactory.js`** — módulo de JS puro responsável exclusivamente por gerar dados de teste. Por não ter dependência do Cypress, pode ser reutilizado fora do contexto de testes e é mais simples de manter.

**`userApi.js`** — encapsula ações de API repetidas entre specs (criar usuário, realizar login). Aplica o padrão **App Actions**: preparar estado via API antes de interagir com o frontend, tornando os testes mais rápidos e estáveis.

**`commands.js`** — contém apenas `cy.apiRequest`, o único helper que realmente precisa do contexto do Cypress. Centraliza a URL base da API e o comportamento padrão de `failOnStatusCode`, evitando repetição em cada spec.

---

## Cenários de teste

Cada spec cobre dois cenários complementares: o **caminho feliz** (fluxo esperado) e o **caminho negativo** (validação de erro), garantindo que a aplicação se comporta corretamente tanto no sucesso quanto na falha.

### API

| Spec       | Caminho feliz                                               | Caminho negativo                                        |
|------------|-------------------------------------------------------------|---------------------------------------------------------|
| `login`    | Credenciais válidas retornam token Bearer e status 200      | Credenciais inválidas retornam status 401               |
| `produtos` | Listagem retorna array com estrutura e campos esperados     | Busca por ID retorna dados consistentes com a listagem  |
| `usuarios` | Cadastro com email único retorna 201 e `_id` consistente   | Cadastro com email duplicado retorna 400                |

### Frontend (E2E)

| Spec       | Caminho feliz                                               | Caminho negativo                                        |
|------------|-------------------------------------------------------------|---------------------------------------------------------|
| `login`    | Admin autenticado redireciona para `/admin/home`            | Credenciais inválidas exibem mensagem de erro na tela   |
| `cadastro` | Novo usuário cadastrado redireciona para `/home`            | Email já existente exibe mensagem de erro na tela       |
| `catalogo` | Catálogo exibe campo de busca e cards de produtos           | Filtro de busca retorna produtos correspondentes        |

---

## Como executar

### Pré-requisitos

- Node.js 18+
- npm 9+

### Instalação

```bash
npm install
```

O `postinstall` baixa automaticamente o binário do Cypress após a instalação dos pacotes.

### Modo interativo (GUI)

```bash
npm run open
```

Abre o Cypress Test Runner. Navegue até `e2e/api/` ou `e2e/frontend/` e selecione qual spec executar.

### Modo headless (terminal)

```bash
# Apenas testes de API
npm run run:api

# Apenas testes de frontend
npm run run:frontend

# Todos os testes
npm run run:all
```

---

## Boas práticas adotadas

- **Isolamento de testes** — cada `it` é autossuficiente e não depende do estado gerado por outro teste.
- **Dados dinâmicos** — emails gerados com timestamp (`jefambev.20260327.142315@serverest.dev`) garantem unicidade por execução e eliminam colisões em ambiente compartilhado.
- **Seletores estáveis** — uso exclusivo de `data-testid`, atributos criados para fins de teste, resistentes a mudanças de layout e CSS.
- **App Actions pattern** — setup de estado (criação de usuários) feito via API, não pela UI, reduzindo tempo de execução e fonte de falsos negativos.
- **Separação de responsabilidades** — `dataFactory`, `userApi`, `commands` e specs têm responsabilidades bem definidas e não se sobrepõem.
- **Cenários positivos e negativos** — cada domínio cobre tanto o caminho feliz quanto as validações de erro.

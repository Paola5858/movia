# movia

[![status](https://img.shields.io/badge/status-active-brightgreen)](#)
[![version](https://img.shields.io/badge/version-1.0.0-blue)](#)
[![bootstrap](https://img.shields.io/badge/bootstrap-5.3-563d7c?logo=bootstrap)](https://getbootstrap.com)
[![tailwind](https://img.shields.io/badge/tailwind-css-06b6d4?logo=tailwindcss)](https://tailwindcss.com)

um painel web limpo e seguro para gerenciamento de frota de veículos. sem ruído, sem complicação desnecessária.

---

## o que é isso

você controla frotas. sabe quanto é chato coordenar marcas, modelos e informações de veículos em planilha ou banco de dados desorganizado? este sistema oferece um ponto central, intuitivo e bem pensado pra isso.

movia resolve:
- centralizar dados de frota em um lugar só
- navegar e editar marcas, modelos e veículos com facilidade
- manter integridade de dados sem deixar tudo frágil
- oferecer uma experiência sem fricção e com feedback claro ao usuário

não é complexo. não pede mais do que você precisa. é só funcional com estilo.

---

## o que está aqui

- **interface modular** — separação clara entre marcas, modelos e veículos (cada um sua página)
- **gerenciamento em tempo real** — cria, edita, deleta registros sem recarregar a página
- **feedback amigável** — cada ação tem uma resposta clara (erro, sucesso, confirmação)
- **design responsivo** — funciona em desktop, tablet e mobile
- **segurança pensada** — escape de html, validação de dados, proteção contra ssrf, timeout nas requisições
- **arquitetura limpa** — controllers, services e utils bem separados; fácil de estender

---

## stack

- **frontend:** html5 + tailwind css + bootstrap 5.3
- **javascript:** es6 modules nativos (sem bundler, sem npm hell)
- **tipografia:** plus jakarta sans (customizável)
- **api:** integração rest com xano
- **servidor local:** node (serve) ou python (http.server)

---

## como rodar

### pré-requisitos

- navegador moderno (chrome 90+, firefox 90+, edge 90+)
- node.js 14+ **ou** python 3.6+
- um servidor http local (es modules não funcionam via `file://`)

### instalação e execução

**opção 1 — node.js (recomendado)**

```bash
npm install
npm start
```

o servidor sobe em `http://localhost:3000`

**opção 2 — python (se não tiver node)**

```bash
python -m http.server 3000
```

depois acesse `http://localhost:3000`

### configurar para outro ambiente

a url da api está em `js/services/config.js`. ali você muda `API_BASE` e `ALLOWED_HOST` de acordo com o seu backend.

**atenção:** nunca coloque tokens ou chaves secretas no código cliente. se a api precisa de autenticação, use um proxy backend ou implemente oauth. consulte a documentação do xano sobre autenticação segura.

---

## estrutura do projeto

```
movia/
├─ index.html              # página inicial (navegação)
├─ marcas.html             # gerenciamento de marcas
├─ modelos.html            # gerenciamento de modelos
├─ veiculos.html           # gerenciamento de veículos
└─ js/
   ├─ controllers/         # lógica de ui (um controller por página)
   │  ├─ marcaController.js
   │  ├─ modeloController.js
   │  └─ veiculoController.js
   ├─ services/            # abstração de requisições e regra de negócio
   │  ├─ apiClient.js      # base para todas as chamadas http
   │  ├─ config.js         # único lugar pra configurar urls
   │  ├─ marcaService.js
   │  ├─ modeloService.js
   │  └─ veiculoService.js
   └─ utils/               # helpers reutilizáveis
      ├─ dom.js            # escape html, feedbacks, modals
      └─ validation.js     # validação de payload antes do envio
```

### por dentro

**controllers:** cada página tem seu controller. lida com interação do usuário, renderização dinâmica e chamadas aos services.

**services:** abstraem a api. cada entidade (marca, modelo, veículo) tem seu service. facilitam mudança de backend depois.

**apiClient:** camada de abstração com:
- validação de url (previne ssrf acidental)
- timeout automático de 15 segundos
- mapeamento inteligente de erros http pra mensagens legíveis
- suporte a get, post, patch e delete

**utils:** dom.js cuida de escape html (xss prevention) e ux (modals, feedbacks). validation.js valida payloads antes de enviar.

---

## fluxo de funcionamento

1. usuário abre a página inicial (index.html)
2. vê três cards: marcas, modelos, veículos
3. clica em um dos cards e vai pra página específica
4. a página carrega a lista via api (via respectivo service)
5. usuário pode:
   - **listar:** ve todos os registros
   - **criar:** clica "novo", preenche form, envia
   - **editar:** clica no registro, modifica, salva
   - **deletar:** clica, confirma, remove
6. cada ação retorna feedback visual ao usuário
7. dados sempre são validados antes de ir pro servidor

tudo é síncrono do ponto de vista da api (sem websocket, polling ou real-time) — simples, previsível, fácil de debugar.

---

## design e experiência

a interface foi construída com:

- **tailwind css:** utility-first, rápido, sem css customizado demais
- **bootstrap 5.3:** componentes robustos (modals, alerts, forms)
- **plus jakarta sans:** tipografia moderna e legível
- **paleta suave:** gradientes leves (rosa, bege, branco), sombras softas, radius generosos (2.5rem)
- **lowercase:** toda a ui é em minúsculas (coerência visual deliberada)
- **responsividade:** sidebar fixa em desktop, colapsada em mobile

resultado: interface que não tenta ser criativa demais, mas é funcional e bonita. pessoas percebem que houve cuidado e intenção no design.

---

## segurança e qualidade

mesmo sendo um painel administrativo "simples", o código implementa camadas de proteção:

- **xss prevention:** todos os dados do servidor passam por `esc()` antes de entrar no dom
- **ssrf mitigation:** url da api é validada contra allowlist de host
- **validação de dados:** payloads são validados no cliente antes do envio
- **timeout:** toda requisição tem limite de 15 segundos
- **erro legível:** status codes http são mapeados pra mensagens claras
- **modal não-bloqueante:** confirmações usam bootstrap modal, não `confirm()` nativo que trava a thread

isso tudo sem overthinking. é essencial, não paranoia.

---

## endpoints consumidos

| entidade | base path  | operações      |
|----------|------------|----------------|
| marca    | `/marca`   | get, post, patch, delete |
| modelo   | `/modelo`  | get, post, patch, delete |
| veículo  | `/veiculo` | get, post, patch, delete |

padrão rest puro: `GET /` (listar), `POST /` (criar), `PATCH /:id` (editar), `DELETE /:id` (deletar).

---

## próximos passos

- [ ] testes automatizados (unit e e2e)
- [ ] ci/cd (build, lint, test automático)
- [ ] deploy em production (vercel, netlify ou seu próprio servidor)
- [ ] integração com mais entidades (combustível, manutenção, motoristas)
- [ ] relatórios e analytics
- [ ] autenticação e controle de acesso
- [ ] offline mode (service workers)
- [ ] dark mode

a base está sólida. cada próximo step é addição, não refactor.

---

## licença

proprietary — uso interno. consulte a organização pra permissões de uso ou distribuição.

---

feito com atenção pra detalhe por **paola soares machado**

encontre-me no [linkedin](https://www.linkedin.com/in/paolasoaresmachado) pra conversar sobre arquitetura, segurança, ux ou qualquer outra coisa tech que interessar.

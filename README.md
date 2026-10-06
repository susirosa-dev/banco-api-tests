# Banco API Tests

Automação de testes de API REST em **JavaScript** para validar autenticação e transferências entre contas do projeto [Banco API](https://github.com/susirosa-dev/banco-api), uma aplicação de banco fictício.

Os testes utilizam **Mocha**, **Supertest** e **Chai**, com configuração por variáveis de ambiente e relatórios HTML gerados pelo **Mochawesome**.

## Objetivo

Praticar e demonstrar conhecimentos de Quality Assurance (QA) e automação de testes de API REST, verificando respostas HTTP e regras de negócio em cenários positivos e negativos.

A suíte de transferências contém verificações para:

- Criação de transferência no valor mínimo de R$ 10,00, com resposta esperada `201`.
- Rejeição de transferência abaixo do valor mínimo, com resposta esperada `422`.
- Requisições com token inválido, com resposta esperada `401`.
- Listagem e consulta de transferências, com resposta esperada `200`.
- Recurso não encontrado, com resposta esperada `404`.
- Métodos HTTP não permitidos, com resposta esperada `405`.
- Erro interno da aplicação, com resposta esperada `500`, em ambiente preparado para esse cenário.

A autenticação é realizada por uma função auxiliar que obtém um token em `POST /login` e o disponibiliza para as requisições protegidas.

## Tecnologias utilizadas

As bibliotecas abaixo estão declaradas no [package.json](https://github.com/susirosa-dev/banco-api-tests/blob/main/package.json). As versões são os intervalos definidos nesse arquivo; o `package-lock.json` registra as versões resolvidas.

| Tecnologia | Versão declarada | Utilização |
| --- | --- | --- |
| JavaScript | — | Implementação dos testes, com módulos CommonJS. |
| Node.js | Não especificada no `package.json` | Ambiente de execução JavaScript. |
| npm | Não especificada no `package.json` | Instalação das dependências e execução dos scripts. |
| Mocha | `^12.0.3` | Organização e execução dos testes e hooks. Dependência de desenvolvimento. |
| Supertest | `^7.3.0` | Requisições HTTP aos endpoints da API. |
| Chai | `^6.2.2` | Asserções para validar os resultados. |
| Dotenv | `^18.0.5` | Carregamento das variáveis do arquivo `.env`. |
| Mochawesome | `^8.1.1` | Geração de relatórios da execução em HTML e JSON. |

## Estrutura do projeto

```text
banco-api-tests/
├── fixture/
│   └── postTransferencias.json
├── helpers/
│   └── autenticacao.js
├── test/
│   ├── banco.test.js
│   └── transferencias.test.js
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── .env                       # Criado localmente; não versionado
├── node_modules/              # Gerado pela instalação; não versionado
└── mochawesome-report/        # Gerado pela execução; não versionado
```

- **`fixture/`**: dados JSON utilizados na criação das transferências.
- **`helpers/autenticacao.js`**: função reutilizável para realizar login e obter o token.
- **`test/transferencias.test.js`**: cenários positivos e negativos de transferências.
- **`test/banco.test.js`**: cenários de criação e listagem com login autorizado.
- **`package.json`**: dependências e script de execução.
- **`package-lock.json`**: registro das versões resolvidas das dependências.
- **`.gitignore`**: exclui `.env`, `node_modules/` e `mochawesome-report/` do versionamento.

> **Nome da pasta:** este README adota `fixture/`, no singular, conforme a revisão do projeto e o caminho importado em `transferencias.test.js`. Se a cópia clonada ainda trouxer a pasta `fixtures/`, renomeie-a para `fixture/` antes de executar os testes, mantendo o arquivo `postTransferencias.json` dentro dela.

## Pré-requisitos

- Git instalado para clonar o repositório.
- Node.js em uma versão compatível com as dependências declaradas, acompanhado do npm.
- [Banco API](https://github.com/susirosa-dev/banco-api) configurado e com a API REST em execução.
- Banco de dados MySQL da API configurado e acessível, conforme as instruções do projeto Banco API.
- Usuário e senha válidos para autenticação.
- Contas e transferências compatíveis com os dados utilizados pelos testes.

Os testes utilizam contas de origem e destino e consultam a transferência de ID `1`. Prepare os dados no ambiente de testes, com contas ativas e saldo suficiente. As execuções criam transferências e podem alterar saldos, portanto os dados precisam ser adequados também para execuções repetidas.

Para configurar o serviço e o banco de dados, siga o [README do Banco API](https://github.com/susirosa-dev/banco-api#readme). No projeto da API, o comando para iniciar o serviço REST é:

```bash
npm run rest-api
```

Mantenha a API em execução durante os testes. Na configuração local padrão, ela atende em `http://localhost:3000`, com documentação interativa em [Swagger](http://localhost:3000/api-docs).

## Instalação

Clone o repositório e acesse sua pasta:

```bash
git clone https://github.com/susirosa-dev/banco-api-tests.git
cd banco-api-tests
```

Instale as dependências:

```bash
npm install
```

Para uma instalação reproduzível a partir do `package-lock.json`, também é possível utilizar:

```bash
npm ci
```

As dependências serão instaladas em `node_modules/`. Inclua as dependências de desenvolvimento, pois o Mocha é necessário para executar os testes.

## Configuração do arquivo `.env`

Crie um arquivo chamado **`.env` na raiz do projeto de testes**, no mesmo nível do `package.json`:

```dotenv
BASE_URL=http://localhost:3000
BANCO_USUARIO=seu_usuario
BANCO_SENHA=sua_senha
```

| Variável | Descrição |
| --- | --- |
| `BASE_URL` | Endereço base da API REST, incluindo protocolo e porta quando necessária. |
| `BANCO_USUARIO` | Usuário válido enviado no campo `username` da requisição de login. |
| `BANCO_SENHA` | Senha correspondente, enviada no campo `senha` da requisição de login. |

Substitua os exemplos pelas configurações do seu ambiente. O Dotenv carrega esses valores e os disponibiliza por meio de `process.env`; a função auxiliar usa as credenciais para obter o token de autenticação.

O `.env` **não é versionado** e não acompanha o clone, pois está incluído no `.gitignore`. Mantenha as credenciais fora do repositório. Esse arquivo configura os testes; as variáveis de configuração da própria API devem ser definidas separadamente no projeto Banco API.

## Execução dos testes

Execute os comandos na raiz de `banco-api-tests`, com a API disponível e o `.env` preenchido.

### Suíte configurada no projeto

```bash
npm test
```

O script atual do `package.json` é:

```text
mocha ./test/**/transferencias.test.js --timeout 200000 --reporter mochawesome
```

Esse comando seleciona a suíte `transferencias.test.js`, define um timeout de 200.000 ms (200 segundos) e utiliza o Mochawesome como reporter. O arquivo `banco.test.js` não é incluído por esse script.

### Todos os arquivos de teste

Para executar ambos os arquivos sem alterar o `package.json`:

```bash
npx mocha "./test/**/*.test.js" --timeout 200000 --reporter mochawesome
```

### Um cenário específico

É possível filtrar os testes pelo título com `--grep`. Por exemplo:

```bash
npm test -- --grep "Lista as transferências realizadas"
```

### Cenário de erro interno

O teste `Erro interno - 500.` espera uma falha interna ao consultar `/transferencias/1`. O código indica a indisponibilidade do banco de dados como forma de simular essa condição. Em um ambiente saudável, a mesma consulta é utilizada por outro teste que espera `200`.

Por isso, o cenário de erro interno exige preparação específica e execução isolada em um ambiente de testes. Não é esperado que os cenários de sucesso e de indisponibilidade passem juntos sob a mesma condição do serviço. Para selecionar esse cenário após preparar o ambiente:

```bash
npm test -- --grep "Erro interno - 500"
```

As respostas esperadas documentam as asserções da suíte; o resultado efetivo depende do comportamento da API e dos dados disponíveis.

## Relatório HTML

O relatório é gerado automaticamente pelo Mochawesome ao executar `npm test` ou o comando com `--reporter mochawesome`. Não é necessário um comando separado para gerar o HTML após uma execução normal.

Os resultados são gravados em:

```text
mochawesome-report/
├── mochawesome.html
├── mochawesome.json
└── assets/
```

Abra **`mochawesome-report/mochawesome.html`** no navegador. Você pode localizar o arquivo pelo explorador de arquivos e abri-lo com um duplo clique. Mantenha a pasta `assets/` junto do HTML para preservar a apresentação do relatório.

O relatório permite consultar as suítes e os cenários executados, os testes aprovados e reprovados, a duração da execução e os detalhes das falhas.

Se a execução for interrompida antes de carregar os testes, por exemplo por um caminho de fixture incorreto, resolva o problema e execute novamente para gerar o relatório. A pasta `mochawesome-report/` é local e está excluída do versionamento pelo `.gitignore`.

## Documentação oficial

- [JavaScript — MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [Node.js](https://nodejs.org/en/docs)
- [npm](https://docs.npmjs.com/)
- [Mocha](https://mochajs.org/)
- [Supertest](https://github.com/ladjs/supertest#readme)
- [Chai](https://www.chaijs.com/)
- [Dotenv](https://github.com/motdotla/dotenv#readme)
- [Mochawesome](https://github.com/adamgruber/mochawesome#readme)

## Projeto relacionado

**[Banco API](https://github.com/susirosa-dev/banco-api)** — aplicação de banco fictício que disponibiliza os endpoints REST utilizados por esta automação. Seu repositório contém as instruções de configuração, banco de dados e inicialização do serviço.

## Autora

**Susi da Rosa**

Projeto desenvolvido para fins de estudo e prática em Quality Assurance (QA), com foco em testes de API REST e automação de testes, como parte das atividades e aprendizados realizados na Mentoria Testes de Software 2.0, de Júlio de Lima.

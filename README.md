# Planne Live Movies

Aplicação de busca de filmes em tempo real utilizando a API do TMDB (The Movie Database). Permite pesquisar filmes, visualizar detalhes e gerenciar uma lista pessoal de favoritos.

## Como rodar o projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Chave da API do TMDB

### 1. Configuração das variáveis de ambiente

Primeiro, você precisa obter uma chave da API do TMDB:

1. Acesse [https://www.themoviedb.org/settings/api]
2. Crie uma conta se necessário
3. Gere sua API Key e API Token

Depois, configure as variáveis de ambiente:

```bash
# Copie o arquivo de exemplo
.env.example

# Crie o arquivo original e cole o conteudo copiado de .env.example
.env 

# Edite o arquivo .env e adicione suas credenciais
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_API_KEY=sua_api_key_aqui
VITE_TMDB_API_TOKEN=seu_api_token_aqui
VITE_TMDB_API_LANGUAGE=pt-BR
VITE_TMDB_API_REGION=BR
```

### 2. Instalação das dependências

```bash
npm install
```

### 3. Executar o projeto

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Executar os testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm run preview` - Visualiza o build de produção
- `npm test` - Executa os testes
- `npm run lint` - Executa o linter

## Funcionalidades implementadas

- [x] Live search com atualização em tempo real
- [x] Busca case-insensitive e ignorando acentos
- [x] Redirecionamento para IMDB ao clicar nos filmes
- [x] Lista de resultados paginada com scroll infinito
- [x] Sistema de favoritos (tecla Espaço)
- [x] Persistência de favoritos no localStorage
- [x] Tabela de favoritos responsiva
- [x] Tratamento de erro com links alternativos
- [x] Navegação por teclado (setas, Enter, Escape)
- [x] Autocompletar com setas direita/esquerda
- [x] Interface responsiva e moderna
- [x] Destaque visual do primeiro resultado
- [x] Sinopse dos filmes
- [x] Gêneros dos filmes
- [x] Loading states e feedback visual
- [x] Otimizações de performance (useMemo, useCallback)

## Tecnologias utilizadas

- **React** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **TanStack Query** - Gerenciamento de estado servidor
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP
- **Jest & Testing Library** - Testes

## Como usar

1. **Pesquisar filmes**: Digite o nome do filme no campo de busca
2. **Navegar resultados**: Use as setas ↑ ↓ para navegar
3. **Autocompletar**: Use → para aceitar sugestão, ← para reverter
4. **Favoritar**: Pressione Espaço no filme selecionado ou clique na estrela
5. **Abrir no IMDB**: Clique no filme
6. **Ver favoritos**: Role para baixo para ver sua lista de favoritos

## Design

A interface foi desenvolvida com foco na usabilidade e experiência do usuário, implementando:

- Design responsivo para desktop e mobile
- Feedback visual claro para todas as interações
- Estados de loading e erro bem definidos
- Hierarquia visual com destaque para o resultado mais relevante
- Cores e tipografia consistentes

Para mais detalhes sobre as decisões técnicas e arquitetura, consulte o arquivo `COMMENTS.md`.

# Decisões Técnicas e Arquitetura

## Introdução

Antes de mais nada, quero deixar claro que acabei implementando algumas coisas além do que foi solicitado no teste técnico e também fiz algumas diferenças em relação ao design do Figma. Senti liberdade para implementar funcionalidades que achei que melhorariam significativamente a experiência do usuário.

Por exemplo, ao invés de apenas mostrar uma lista simples de títulos com foco no primeiro resultado, criei uma interface mais rica com:
- **Imagens dos pôsteres** para identificação visual rápida
- **Gêneros dos filmes** para contexto imediato
- **Destaque especial para o primeiro resultado** com sinopse curta
- **Navegação completa por teclado** para acessibilidade
- **Sistema de favoritos mais robusto** com persistência e atualização em tempo real

## Stack Tecnológica

### React + TypeScript
Escolhi React porque é o que mais uso no dia a dia e me sinto confortável para entregar algo bem estruturado. TypeScript foi fundamental para garantir type safety, especialmente ao lidar com as tipagens da API do TMDB.

### Vite
Optei pelo Vite porque:
- **Build** - velocidade e performance tanto desenvolvimento quanto produção, especialmente projetos menores
- **HMR instantâneo** - mudanças aparecem na tela imediatamente
- **Configuração mais limpa** - sem eject necessário
- **Melhor integração com TypeScript** - out of the box

### TanStack Query (React Query)
Esses foram alguns dos motivos que me fizeram utilizar o React Query:
- **Cache inteligente** - evita requisições desnecessárias
- **Estados de loading/error** automáticos
- **Infinite scroll** nativo com `useInfiniteQuery`
- **Revalidação em background** - dados sempre atualizados

### Tailwind CSS
Preferi Tailwind ao CSS modules ou styled-components por alguns motivos:
- **Desenvolvimento mais rápido** - sem ficar indo e voltando entre arquivos
- **Consistência visual** - sistema de design integrado
- **Bundle menor** - só inclui classes que uso
- **Responsividade fácil** - modificadores md:, lg: etc.

### Axios
Escolhi axios ao invés do fetch nativo para:
- **Interceptors** - configuração de headers automática
- **Transformação de dados** mais limpa
- **Timeout** e tratamento de erro mais robusto
- **Cancelamento de requisições** automático

## Arquitetura e Padrões

### Estrutura de Pastas
Organizei o projeto seguindo o padrão de **separação por domínio**:

```
src/
├── components/              # Componentes UI reutilizáveis
├── components/_tests_       # Testes dos componentes
├── hooks/                   # Custom hooks para lógica compartilhada
├── hooks/_tests_            # Testes dos hooks
├── service/                 # Camada de API e integração externa
├── types/                   # Tipagens TypeScript centralizadas
├── ui/icons                 # Icones
├── utils/                   # Funções utilitárias puras
```
### Custom Hooks
Criei alguns hooks específicos para encapsular lógica complexa:

**`useDebounce`** - Evita requisições excessivas durante digitação
**`useFavorites`** - Gerencia estado dos favoritos com localStorage
**`useInfiniteScroll`** - Implementa scroll infinito com Intersection Observer

### Otimizações de Performance
Apliquei várias técnicas para garantir boa performance:

- **`React.memo`** - Evita re-renders desnecessários dos componentes
- **`useMemo`** - Memoriza cálculos custosos (flatMap, filtros)
- **`useCallback`** - Estabiliza referências de funções
- **Debounce** - 300ms para evitar spam de requisições
- **Lazy loading** - Imagens carregam apenas quando visíveis
- **Cache agressivo** - React Query com staleTime otimizado


### Navegação por Teclado Completa
Implementei navegação 100% acessível:
- **↑ ↓** - Navegar entre resultados
- **→** - Autocompletar com primeiro resultado
- **←** - Reverter autocompletamento
- **Enter** - Setar no input o filme selecionado
- **Espaço** - Favoritar/desfavoritar
- **Escape** - Fechar dropdown


## Testes
Implementei testes unitários para os componentes e hooks principais:
- **Components** - Renderização, interações, props
- **Hooks** - Lógica de estado, efeitos colaterais
- **Utils** - Funções puras, transformações

## O que faria com mais tempo

### 1. Página de Detalhes do Filme
Ao invés de redirecionar para o IMDB, criaria uma página interna com:
- **Trailer embed** - YouTube/Vimeo integration
- **Cast e crew** - Atores e equipe técnica
- **Filmes similares** - Recomendações baseadas em gênero
- **Reviews e ratings** - Avaliações dos usuários
- **Disponibilidade streaming** - Onde assistir

### 2. Home com Filmes em Destaque
Uma landing page mais interessante:
- **Filmes populares** - Carousel com os top do momento
- **Em cartaz** - Lançamentos recentes nos cinemas
- **Por gênero** - Seções categorizadas
- **Trending** - O que está bombando hoje

### 3. Virtualização da Lista
Para listas muito grandes, implementaria:
- **React Virtualized** - Renderizar apenas itens visíveis

### 4. Melhorias de Teste
- **Coverage 100%** - Todos os edge cases
- **Integration tests** - Fluxos completos

### 6. Funcionalidades Avançadas
- **Filtros complexos** - Por ano, gênero, nota
- **Ordenação** - Popularidade, nota, data
- **Listas personalizadas** - "Para assistir", "Já vi"

## Conclusão

O projeto ficou além do solicitado, mas acredito que demonstra capacidade de pensar na experiência completa do usuário, não apenas nos requisitos mínimos. Escolhi tecnologias que conheço bem e que permitiriam entregar algo robusto e escalável.

A arquitetura está preparada para crescer - seja adicionando novas features, melhorando performance ou expandindo para PWA. Cada decisão técnica foi pensada considerando manutenibilidade, testabilidade e experiência.

Espero que gostem do resultado!

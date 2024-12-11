export const translations = {
  en: {
    title: "Is it on Hydra?",
    subtitle: "Your ultimate game search engine. Fast, reliable, and always up to date.",
    searchPlaceholder: "Search for any game...",
    features: {
      fast: {
        title: "Lightning Fast",
        description: "Instant search results"
      },
      smart: {
        title: "Smart Search",
        description: "Filter by your favorite sources"
      },
      reliable: {
        title: "Reliable",
        description: "Always up to date"
      }
    },
    credits: "Created by Moyase",
    search: {
      loading: "Searching games",
      loadingSubtext: "This might take a moment",
      resultsFound: "Found {count} results for",
      noResults: "No results found for",
      date: "Date",
      sources: "Sources"
    },
    sources: "Sources",
    filter: {
      selectAll: "Select All",
      clearAll: "Clear All"
    }
  },
  pt: {
    title: "Está no Hydra?",
    subtitle: "Seu mecanismo de busca definitivo para jogos. Rápido, confiável e sempre atualizado.",
    searchPlaceholder: "Pesquisar qualquer jogo...",
    features: {
      fast: {
        title: "Super Rápido",
        description: "Resultados instantâneos"
      },
      smart: {
        title: "Busca Inteligente",
        description: "Filtre por suas fontes favoritas"
      },
      reliable: {
        title: "Confiável",
        description: "Sempre atualizado"
      }
    },
    credits: "Criado por Moyase",
    search: {
      loading: "Procurando jogos",
      loadingSubtext: "Isso pode levar um momento",
      resultsFound: "Encontrados {count} resultados para",
      noResults: "Nenhum resultado encontrado para",
      date: "Data",
      sources: "Fontes"
    },
    sources: "Fontes",
    filter: {
      selectAll: "Selecionar Tudo",
      clearAll: "Limpar Tudo"
    }
  }
}

export type Language = keyof typeof translations 
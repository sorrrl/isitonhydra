import steamGames from '@/data/steam-games.json'
import { jsonSources } from '../config/sources'

export interface GameData {
  name: string
  image?: string
  sources: { 
    name: string
    url: string
    uploadDate: string
  }[]
}

interface Download {
  title: string
  uris: string[]
  uploadDate: string
  fileSize: string
}

interface SourceData {
  name: string
  downloads: Download[]
}

interface ConsolidatedGame {
  name: string
  cleanName: string
  image?: string
  sources: {
    name: string
    url: string
    fileSize: string
    uploadDate: string
  }[]
  largestSize: string
  mostRecentDate: string
}

interface SteamGame {
  id: number;
  name: string;
  clientIcon?: string | null;
}

interface PreparedGame extends SteamGame {
  cleanName: string;
}

// Function to prepare steam games for searching
function prepareGames(games: any[]): PreparedGame[] {
  return games.map(game => ({
    ...game,
    cleanName: game.name.toLowerCase().replace(/[^\w\s]/g, ' ').trim()
  }));
}

// Prepare steam games once for faster searching
const preparedSteamGames = prepareGames(steamGames as any[]);

// Cache for source data to prevent repeated fetches
const sourceCache = new Map<string, {
  data: SourceData;
  timestamp: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
const MIN_QUERY_LENGTH = 3;
const MAX_RESULTS = 20; // Limit total results

// First, find matching Steam games
function findMatchingSteamGames(searchQuery: string): SteamGame[] {
  const cleanedQuery = searchQuery.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
  const queryWords = cleanedQuery.split(' ').filter(word => word.length > 2);

  return preparedSteamGames
    .filter(game => {
      // Check if game name contains all search query words
      return queryWords.every(word => game.cleanName.includes(word));
    })
    .map(game => ({
      name: game.name,
      id: game.id
    }));
}

// Then, find matching downloads for each Steam game
async function findMatchingDownloads(
  steamGame: SteamGame,
  source: { name: string; url: string }
): Promise<ProcessedDownload[]> {
  const data = await fetchSourceData(source);
  if (!data?.downloads) return [];

  const cleanGameName = steamGame.name.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
  const gameWords = cleanGameName.split(' ').filter(word => word.length > 2);

  // Find downloads that match this game
  const matches = data.downloads.filter(download => {
    const cleanTitle = download.title.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
    // Must contain all words from the Steam game name
    return gameWords.every(word => cleanTitle.includes(word));
  });

  // Sort by date and take the most recent
  const sortedMatches = matches.sort((a, b) => 
    new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  );

  // Return only the most recent match
  if (sortedMatches.length > 0) {
    const match = sortedMatches[0];
    return [{
      sourceName: source.name,
      url: match.uris[0] || '',
      uploadDate: match.uploadDate
    }];
  }

  return [];
}

async function fetchSourceData(source: { name: string; url: string }): Promise<SourceData | null> {
  // Check cache first
  const cached = sourceCache.get(source.name);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(`/api/sources?source=${encodeURIComponent(source.name)}`, {
      cache: 'no-store'
    });

    if (!response.ok) return null;

    const data: SourceData = await response.json();
    
    // Update cache
    sourceCache.set(source.name, {
      data,
      timestamp: Date.now()
    });

    return data;
  } catch (error) {
    console.error(`Error fetching from ${source.name}:`, error);
    return null;
  }
}

interface ProcessedDownload {
  sourceName: string;
  url: string;
  uploadDate: string;
}

export async function searchGames(query: string, selectedSources: string[] = []): Promise<GameData[]> {
  if (!query || query.length < MIN_QUERY_LENGTH) {
    return [];
  }

  // 1. First find all matching Steam games
  const matchingSteamGames = findMatchingSteamGames(query);
  if (matchingSteamGames.length === 0) return [];

  // 2. For each Steam game, search through selected sources (or all if none selected)
  const results = new Map<string, GameData>();
  const sourcesToSearch = selectedSources.length > 0 
    ? jsonSources.filter(source => selectedSources.includes(source.name))
    : jsonSources;

  for (const steamGame of matchingSteamGames) {
    const sources: ProcessedDownload[] = [];

    // Search through selected sources
    for (const source of sourcesToSearch) {
      try {
        const downloads = await findMatchingDownloads(steamGame, source);
        if (downloads.length > 0) {
          sources.push({
            name: source.name,
            url: downloads[0].url,
            uploadDate: downloads[0].uploadDate
          });
        }
      } catch (error) {
        console.error(`Error processing source ${source.name}:`, error);
      }
    }

    // Only add games that have sources
    if (sources.length > 0) {
      results.set(steamGame.name, {
        name: steamGame.name,
        image: `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamGame.id}/header.jpg`,
        sources: sources
      });
    }
  }

  // Return sorted results
  return Array.from(results.values())
    .sort((a, b) => {
      const latestA = Math.max(...a.sources.map(s => new Date(s.uploadDate).getTime()));
      const latestB = Math.max(...b.sources.map(s => new Date(s.uploadDate).getTime()));
      return latestB - latestA;
    });
}

export function parseFileSize(size: string): number {
  const match = size.match(/^([\d.]+)\s*(MB|GB)$/i);
  if (!match) return 0;
  
  const [, value, unit] = match;
  const numValue = parseFloat(value);
  
  // Convert everything to MB for comparison
  if (unit.toUpperCase() === 'GB') {
    return numValue * 1024; // Convert GB to MB
  }
  return numValue; // Already in MB
}


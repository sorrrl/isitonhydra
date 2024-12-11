import { NextResponse } from 'next/server';
import steamGames from '@/data/steam-games.json';

interface SteamGame {
  id: number;
  name: string;
  clientIcon?: string | null;
}

interface Download {
  title: string;
  uris: string[];
  uploadDate: string;
  fileSize?: string;
}

export async function GET() {
  try {
    // Convert steam games format to match the expected downloads format
    const data = {
      downloads: (steamGames as any[]).map(game => ({
        title: game.name,
        uris: [`https://store.steampowered.com/app/${game.id}`],
        uploadDate: new Date().toISOString(), // Current date as placeholder
        fileSize: '0 MB' // Placeholder size
      })) as Download[]
    };
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing steam games:', error);
    return NextResponse.json({ downloads: [] });
  }
} 
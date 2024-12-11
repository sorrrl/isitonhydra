import steamGames from '@/data/steam-games.json'

interface SteamGame {
  name: string;
  id: string;
}

export async function getGameImage(gameName: string): Promise<string | undefined> {
  try {
    // First try exact match
    let steamGame = (steamGames as SteamGame[]).find(game => 
      game.name.toLowerCase() === gameName.toLowerCase()
    );

    // If no exact match, try partial match
    if (!steamGame) {
      steamGame = (steamGames as SteamGame[]).find(game => {
        // Try matching with the original names first
        if (gameName.toLowerCase().includes(game.name.toLowerCase()) || 
            game.name.toLowerCase().includes(gameName.toLowerCase())) {
          return true;
        }
        
        // Then try with cleaned names
        const cleanedGameName = gameName.replace(/[^\w\s-]/g, '').toLowerCase().trim();
        const cleanedSteamName = game.name.replace(/[^\w\s-]/g, '').toLowerCase().trim();
        return cleanedGameName.includes(cleanedSteamName) || 
               cleanedSteamName.includes(cleanedGameName);
      });
    }

    if (steamGame?.id) {
      const imageUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${steamGame.id}/header.jpg`;
      // Verify if the image exists
      const exists = await verifyImageUrl(imageUrl);
      return exists ? imageUrl : undefined;
    }

    return undefined;
  } catch (error) {
    console.error('Error finding game image:', error);
    return undefined;
  }
}

// Function to verify if an image URL exists
export async function verifyImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
} 
// lib/youtube.ts
// Optional: YouTube API integration for getting video duration
export async function getYouTubeDuration(
  videoId: string
): Promise<number | null> {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY) {
      console.warn("YouTube API key not found");
      return null;
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch YouTube video data");
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const duration = data.items[0].contentDetails.duration;
      return parseDuration(duration);
    }

    return null;
  } catch (error) {
    console.error("Error fetching YouTube duration:", error);
    return null;
  }
}

// Convert YouTube duration format (PT4M13S) to seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  if (!match) return 0;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  return hours * 3600 + minutes * 60 + seconds;
}

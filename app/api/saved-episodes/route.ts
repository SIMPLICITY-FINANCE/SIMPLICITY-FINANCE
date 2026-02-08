import { NextResponse } from 'next/server';
import { getSavedEpisodesForUser } from '../../lib/actions.js';

export async function GET() {
  try {
    const savedEpisodes = await getSavedEpisodesForUser();
    return NextResponse.json(savedEpisodes);
  } catch (error) {
    console.error('Error fetching saved episodes:', error);
    return NextResponse.json([], { status: 500 });
  }
}

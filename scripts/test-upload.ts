import { ingestEpisode } from '../app/lib/actions/ingest.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testUpload() {
  const testUrl = 'https://www.youtube.com/watch?v=qeTjwd69Nxw';
  
  console.log('Testing upload with URL:', testUrl);
  console.log('INNGEST_EVENT_KEY:', process.env.INNGEST_EVENT_KEY || 'NOT SET');
  console.log('---');
  
  try {
    const result = await ingestEpisode(testUrl);
    
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('\n✅ Upload successful!');
      if (result.isExisting) {
        console.log('   Episode already exists:', result.episodeId);
      } else {
        console.log('   Run ID:', result.runId);
        console.log('   Episode ID:', result.episodeId);
        console.log('\n   Check Inngest dev server at: http://localhost:8288');
      }
    } else {
      console.log('\n❌ Upload failed:', result.error);
    }
  } catch (error) {
    console.error('\n❌ Error during upload:', error);
  }
}

testUpload();

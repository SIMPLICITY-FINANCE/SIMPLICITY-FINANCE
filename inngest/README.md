# Inngest Setup

Inngest is used for workflow orchestration in Simplicity Finance.

## Quick Start

### 1. Start Next.js Dev Server
```bash
npm run dev
```

This starts the Next.js app on http://localhost:3000 with the `/api/inngest` endpoint.

### 2. Start Inngest Dev Server
In a separate terminal:
```bash
npm run inngest:dev
```

This starts the Inngest dev server and opens the UI at http://localhost:8288

### 3. Test the Setup

The Inngest dev server will automatically discover your functions from the `/api/inngest` endpoint.

You should see:
- ✅ "Hello World" function in the Inngest UI
- ✅ Connection to http://localhost:3000/api/inngest

### 4. Trigger a Test Event

In the Inngest UI, you can manually trigger the hello-world function:
- Event name: `test/hello.world`
- Payload: `{ "message": "test" }`

## File Structure

```
inngest/
├── client.ts       # Inngest client configuration
├── functions.ts    # All Inngest functions
└── README.md       # This file

app/api/inngest/
└── route.ts        # Next.js API route for Inngest
```

## Creating New Functions

Add new functions to `inngest/functions.ts`:

```typescript
export const myFunction = inngest.createFunction(
  { id: "my-function", name: "My Function" },
  { event: "my/event.name" },
  async ({ event, step }) => {
    await step.run("step-name", async () => {
      // Your logic here
      return { success: true };
    });
  }
);

// Don't forget to add to exports
export const functions = [helloWorld, myFunction];
```

## Troubleshooting

### Inngest UI not showing functions
- Make sure Next.js dev server is running (`npm run dev`)
- Check that `/api/inngest` endpoint is accessible at http://localhost:3000/api/inngest
- Restart the Inngest dev server

### Functions not executing
- Check the Inngest UI for error messages
- Check your Next.js terminal for console logs
- Verify event names match exactly

## processEpisode Workflow (Checkpoint 3.2)

The `processEpisode` workflow orchestrates the full pipeline:
1. **Ingest** - Fetch metadata (YouTube API or audio metadata)
2. **Transcription** - Deepgram for audio URLs
3. **Summary** - OpenAI summary generation with evidence spans
4. **QC** - OpenAI quality control verification
5. **Database** - Write all artifacts to database

### Testing processEpisode

**Prerequisites:**
- Next.js dev server running (`npm run dev`)
- Inngest dev server running (`npm run inngest:dev`)
- Postgres running (`docker-compose up -d`)
- Environment variables set in `.env.local`:
  - `YOUTUBE_API_KEY` (for YouTube URLs)
  - `DEEPGRAM_API_KEY` (for transcription)
  - `OPENAI_API_KEY` (for summary/QC)
  - `DATABASE_URL`

**Trigger the workflow:**

1. Open Inngest UI at http://localhost:8288
2. Find the "Process Episode" function
3. Click "Trigger" or "Test"
4. Use event name: `episode/submitted`
5. Payload (audio URL example):
   ```json
   {
     "url": "https://example.com/audio.mp3"
   }
   ```

**Note:** YouTube URLs require captions or audio extraction, which is not fully supported in the workflow yet. Use audio URLs (.mp3, .m4a, .wav) for testing.

**Verify results:**
- Check Inngest UI for step-by-step execution
- Check `output/<id>/` directory for artifacts
- Verify database tables:
  ```bash
  docker compose exec postgres psql -U postgres -d simplicity_finance_dev -c "SELECT COUNT(*) FROM episodes;"
  docker compose exec postgres psql -U postgres -d simplicity_finance_dev -c "SELECT COUNT(*) FROM transcript_segments_raw;"
  docker compose exec postgres psql -U postgres -d simplicity_finance_dev -c "SELECT COUNT(*) FROM summary_bullets;"
  ```

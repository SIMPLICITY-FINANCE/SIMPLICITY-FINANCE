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

## Next Steps

For checkpoint 3.2, we'll create the `processEpisode` workflow that orchestrates:
1. Ingest (fetch metadata)
2. Transcription (Deepgram)
3. Summary generation (OpenAI)
4. QC verification (OpenAI)
5. Approval workflow

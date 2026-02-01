import { getIngestRequests } from "../../lib/actions/getIngestRequests.js";
import { UploadForm } from "./UploadForm.js";
import { IngestStatusList } from "./IngestStatusList.js";
import { Card } from "../../components/ui/Card.js";

export default async function UploadPage() {
  // Fetch initial ingest requests (will auto-refresh on client)
  const initialRequests = await getIngestRequests();

  return (
    <div className="max-w-2xl mx-auto">
      <UploadForm />

      {/* Recent Uploads Queue - Auto-refreshing */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground">
            Recent Uploads
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live updates</span>
          </div>
        </div>
        
        <IngestStatusList initialRequests={initialRequests} />
      </div>

      {/* Help Section */}
      <Card className="mt-8 p-6 bg-accent/30">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Supported Formats
        </h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• https://www.youtube.com/watch?v=VIDEO_ID</li>
          <li>• https://youtu.be/VIDEO_ID</li>
          <li>• Direct audio URLs (.mp3, .m4a, .wav, etc.)</li>
        </ul>
      </Card>
    </div>
  );
}

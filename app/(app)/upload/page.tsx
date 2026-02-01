import postgres from "postgres";
import { UploadForm } from "./UploadForm.js";
import { Card } from "../../components/ui/Card.js";
import { Chip } from "../../components/ui/Chip.js";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "../../components/ui/Button.js";

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

// Mock user ID for demo (in production, get from auth session)
const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

interface IngestRequest {
  id: string;
  url: string;
  status: string;
  created_at: Date;
  error_message: string | null;
  episode_id: string | null;
}

export default async function UploadPage() {
  // Fetch recent ingest requests
  const requests = await sql<IngestRequest[]>`
    SELECT 
      id,
      url,
      status,
      created_at,
      error_message,
      episode_id
    FROM ingest_requests
    WHERE user_id = ${DEMO_USER_ID}
    ORDER BY created_at DESC
    LIMIT 10
  `;

  return (
    <div className="max-w-2xl mx-auto">
      <UploadForm />

      {/* Recent Uploads Queue */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Recent Uploads
        </h3>
        
        {requests.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-2">No recent uploads</p>
            <p className="text-muted-foreground/70 text-sm">
              Your upload history will appear here
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-muted-foreground truncate mb-1">
                          {request.url}
                        </p>
                      </div>
                      
                      {request.status === "queued" && (
                        <div className="flex items-center gap-2 text-muted-foreground flex-shrink-0">
                          <Clock size={16} />
                          <Chip>Queued</Chip>
                        </div>
                      )}
                      {request.status === "running" && (
                        <div className="flex items-center gap-2 text-primary flex-shrink-0">
                          <Loader2 size={16} className="animate-spin" />
                          <Chip>Running</Chip>
                        </div>
                      )}
                      {request.status === "succeeded" && (
                        <div className="flex items-center gap-2 text-green-600 flex-shrink-0">
                          <CheckCircle2 size={16} />
                          <Chip>Succeeded</Chip>
                        </div>
                      )}
                      {request.status === "failed" && (
                        <div className="flex items-center gap-2 text-destructive flex-shrink-0">
                          <XCircle size={16} />
                          <Chip>Failed</Chip>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span>
                        {new Date(request.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {request.error_message && request.status === "failed" && (
                      <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
                        {request.error_message}
                      </div>
                    )}

                    {request.episode_id && request.status === "succeeded" && (
                      <div className="mt-2">
                        <a href={`/episode/${request.episode_id}`}>
                          <Button variant="secondary" size="sm">
                            View Episode →
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
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

"use client";

import { useState } from "react";
import { Card } from "../../components/ui/Card.js";
import { Button } from "../../components/ui/Button.js";
import { Input } from "../../components/ui/Input.js";
import { CheckCircle2, Lightbulb } from "lucide-react";

type SuggestionType = "show" | "person";
type Status = "idle" | "submitting" | "success";

export default function SuggestPage() {
  const [type, setType] = useState<SuggestionType>("show");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Please enter a name");
      return;
    }

    setStatus("submitting");
    setError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus("success");
  };

  const reset = () => {
    setName("");
    setUrl("");
    setReason("");
    setStatus("idle");
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              Suggest a Show or Person
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Help us expand our coverage by suggesting finance podcasts or experts
            you'd like to see covered.
          </p>
        </div>

        {status === "success" ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
              <div>
                <p className="font-semibold text-lg">Thank you for your suggestion!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll review your submission and consider adding it to our coverage.
                </p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 mb-2">
                <strong>Submitted:</strong> {type === "show" ? "Show" : "Person"}
              </p>
              <p className="text-sm text-green-800">
                <strong>Name:</strong> {name}
              </p>
              {url && (
                <p className="text-sm text-green-800 mt-1">
                  <strong>URL:</strong> {url}
                </p>
              )}
            </div>

            <Button onClick={reset} variant="primary" size="lg" className="w-full">
              Submit Another Suggestion
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                What would you like to suggest?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setType("show")}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                    type === "show"
                      ? "border-primary bg-primary/5 text-foreground font-semibold"
                      : "border-gray-200 bg-white text-muted-foreground hover:border-gray-300"
                  }`}
                >
                  📻 Podcast Show
                </button>
                <button
                  type="button"
                  onClick={() => setType("person")}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                    type === "person"
                      ? "border-primary bg-primary/5 text-foreground font-semibold"
                      : "border-gray-200 bg-white text-muted-foreground hover:border-gray-300"
                  }`}
                >
                  👤 Person/Expert
                </button>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                {type === "show" ? "Show Name" : "Person Name"} *
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  type === "show"
                    ? "e.g., The Compound and Friends"
                    : "e.g., Josh Brown"
                }
                disabled={status === "submitting"}
              />
              {error && (
                <p className="mt-2 text-sm text-destructive">{error}</p>
              )}
            </div>

            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
                {type === "show" ? "YouTube Channel or Website" : "Website or Social Media"} (optional)
              </label>
              <Input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={
                  type === "show"
                    ? "https://youtube.com/@channel"
                    : "https://twitter.com/username"
                }
                disabled={status === "submitting"}
              />
            </div>

            {/* Reason Input */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-foreground mb-2">
                Why should we cover this? (optional)
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us what makes this show or person valuable for finance insights..."
                disabled={status === "submitting"}
                rows={4}
                className="w-full px-4 py-3 text-sm bg-white border border-gray-100 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={status === "submitting"}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {status === "submitting" ? "Submitting..." : "Submit Suggestion"}
            </Button>
          </form>
        )}
      </Card>

      {/* Info Section */}
      <Card className="mt-8 p-6 bg-accent/30">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          What happens next?
        </h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Our team will review your suggestion</li>
          <li>• We prioritize shows and people with strong finance content</li>
          <li>• Popular suggestions may be added to our coverage</li>
          <li>• You'll see them appear in the Discover section once added</li>
        </ul>
      </Card>
    </div>
  );
}

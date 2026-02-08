import { AppLayout } from "../components/layout/AppLayout.js";
import { RightRail } from "../components/layout/RightRail.js";
import { SavedEpisodesProvider } from "../contexts/SavedEpisodesContext.js";
import { getSavedEpisodeIds } from "../lib/actions.js";

export const dynamic = "force-dynamic";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const savedEpisodeIds = await getSavedEpisodeIds();
  
  return (
    <SavedEpisodesProvider initialSavedIds={savedEpisodeIds}>
      <AppLayout searchPlaceholder="Search episodes...">
        {children}
      </AppLayout>
      <RightRail />
    </SavedEpisodesProvider>
  );
}

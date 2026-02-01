import { AppLayout } from "../components/layout/AppLayout.js";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout showRightRail={true} searchPlaceholder="Search episodes...">
      {children}
    </AppLayout>
  );
}

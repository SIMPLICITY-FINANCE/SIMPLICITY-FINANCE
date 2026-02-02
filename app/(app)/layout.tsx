import { AppLayout } from "../components/layout/AppLayout.js";
import { RightRail } from "../components/layout/RightRail.js";

export const dynamic = "force-dynamic";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppLayout searchPlaceholder="Search episodes...">
        {children}
      </AppLayout>
      <RightRail />
    </>
  );
}

import { Suspense } from "react";

import TermsView from "@/views/signup/ui/TermsView";

export default function TermsPage() {
  return (
    <Suspense>
      <TermsView />
    </Suspense>
  );
}

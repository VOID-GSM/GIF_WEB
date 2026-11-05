import { Suspense } from "react";

import { GithubCallbackPending } from "@/views/assessment/ui/GithubCallbackLayout";
import GithubCallbackView from "@/views/assessment/ui/GithubCallbackView";

export default function GithubCallbackPage() {
  return (
    <Suspense fallback={<GithubCallbackPending />}>
      <GithubCallbackView />
    </Suspense>
  );
}

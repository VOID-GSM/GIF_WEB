import { Suspense } from "react";

import GithubCallbackView from "@/views/assessment/ui/GithubCallbackView";

export default function GithubCallbackPage() {
  return (
    <Suspense>
      <GithubCallbackView />
    </Suspense>
  );
}

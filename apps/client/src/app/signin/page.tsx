import { Suspense } from "react";

import SigninView from "@/views/signin/ui/SigninView";

export default function SigninPage() {
  // SigninView 가 복귀 경로(?redirect=)를 읽으므로 Suspense 로 감싼다.
  return (
    <Suspense>
      <SigninView />
    </Suspense>
  );
}

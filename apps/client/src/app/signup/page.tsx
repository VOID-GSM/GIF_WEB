import { Suspense } from "react";

import SignupView from "@/views/signup/ui/SignupView";

export default function SignupPage() {
  return (
    <Suspense>
      <SignupView />
    </Suspense>
  );
}

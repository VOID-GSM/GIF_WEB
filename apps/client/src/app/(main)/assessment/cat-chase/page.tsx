import { Suspense } from "react";

import CatChaseGameView from "@/views/cat-chase/ui/CatChaseGameView";

export default function CatChasePage() {
  return (
    <Suspense>
      <CatChaseGameView />
    </Suspense>
  );
}

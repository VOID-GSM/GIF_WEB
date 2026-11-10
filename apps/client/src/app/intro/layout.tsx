import { IntroLayout } from "@repo/ui";

import { PUBLIC_HOME_PATH } from "@/shared/constants";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <IntroLayout
      signinHref="/signin"
      projectsHref={PUBLIC_HOME_PATH}
      showLanguageToggle
    >
      {children}
    </IntroLayout>
  );
}

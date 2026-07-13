import { IntroLayout } from "@repo/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <IntroLayout signinHref="/signin">{children}</IntroLayout>;
}

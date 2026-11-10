// 약관 제목·본문은 번역 리소스(auth.terms.<id>)에 있다.
export interface TermsSection {
  id: string;
  required: boolean;
}

export const CLIENT_TERMS: TermsSection[] = [
  {
    id: "service",
    required: true,
  },
  {
    id: "privacy",
    required: true,
  },
];

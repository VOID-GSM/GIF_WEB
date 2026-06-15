"use client";

type SigninProvider = "datagsm" | "google";

interface SigninCardProps {
  onLogin: () => void;
  provider?: SigninProvider;
}

const GoogleLogo = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 48 48"
    aria-hidden="true"
    className="flex-shrink-0"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const PROVIDER_CONFIG: Record<
  SigninProvider,
  {
    description: string;
    buttonLabel: string;
    buttonClassName: string;
    logo: React.ReactNode;
  }
> = {
  datagsm: {
    description: "DataGSM으로 안전하게 로그인하세요!",
    buttonLabel: "DataGsm으로 로그인",
    buttonClassName:
      "bg-black text-white shadow-sm transition hover:bg-gray-800 active:scale-[0.99]",
    logo: <span className="datagsm-logo">D</span>,
  },
  google: {
    description: "Google 계정으로 안전하게 로그인하세요!",
    buttonLabel: "Google로 로그인",
    buttonClassName:
      "bg-white text-gray-700 border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition hover:bg-gray-50 hover:shadow-[0_2px_6px_rgba(0,0,0,0.16)] active:scale-[0.99]",
    logo: <GoogleLogo />,
  },
};

export default function SigninCard({
  onLogin,
  provider = "datagsm",
}: SigninCardProps) {
  const { description, buttonLabel, buttonClassName, logo } =
    PROVIDER_CONFIG[provider];

  return (
    <div className="flex flex-col md:flex-row shadow-new rounded-[20px] overflow-hidden w-full max-w-[360px] md:max-w-none md:w-auto">
      <div
        className="flex flex-col justify-center px-8 py-8 md:w-[333px] md:px-10 md:py-[50px]"
        style={{
          background:
            "radial-gradient(ellipse at 110% 50%, #fff79e 0%, #fffac7 32%, #fffef1 65%)",
        }}
      >
        <div className="flex flex-col gap-6 md:gap-10 md:w-[253px]">
          <img
            src="/gif-logo.png"
            alt="GIF"
            className="w-[60px] h-10 object-contain"
          />
          <div className="flex flex-col gap-3 md:gap-5">
            <p className="text-[12px] text-yellow-700">
              GSM IdeaFestival 관리 시스템
            </p>
            <p className="text-base font-semibold leading-normal text-black">
              GIF를 통해 아이디어 페스티벌을
              <br />
              원할하게 진행하세요!
            </p>
            <p className="hidden md:block text-[12px] text-gray-600 leading-normal">
              프로젝트 보고서 제출부터 점수 관리, AI 요약 기능까지
              <br />
              아이디어 페스티벌 모든 진행을 GIF와 함께해요.
            </p>
          </div>
          <p className="text-[10px] text-gray-500 font-medium">Team.VOID</p>
        </div>
      </div>

      <div className="bg-white flex flex-col justify-center px-8 py-8 md:w-[333px] md:px-10 md:py-[50px]">
        <div className="flex flex-col gap-4 md:h-[252px] md:w-[253px] justify-center">
          <div className="flex flex-col gap-3">
            <p className="text-base text-black">로그인</p>
            <p className="text-[12px] text-gray-800">{description}</p>
          </div>
          <button
            type="button"
            onClick={onLogin}
            className={`w-full md:w-[250px] h-7 rounded flex items-center justify-center gap-2.5 overflow-hidden cursor-pointer ${buttonClassName}`}
          >
            {logo}
            <span className="text-[12px] font-medium">{buttonLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

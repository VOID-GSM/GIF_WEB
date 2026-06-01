"use client";

interface SigninCardProps {
  onLogin: () => void;
}

export default function SigninCard({ onLogin }: SigninCardProps) {
  return (
    <div className="flex shadow-new rounded-[20px] overflow-hidden">
      <div
        className="w-[333px] flex flex-col justify-center px-10 py-[50px]"
        style={{
          background:
            "radial-gradient(ellipse at 110% 50%, #fff79e 0%, #fffac7 32%, #fffef1 65%)",
        }}
      >
        <div className="flex flex-col gap-10 w-[253px]">
          <img
            src="/gif-logo.png"
            alt="GIF"
            className="w-[60px] h-10 object-contain"
          />
          <div className="flex flex-col gap-5">
            <p className="text-[12px] text-yellow-700">
              GSM IdeaFestival 관리 시스템
            </p>
            <p className="text-base font-semibold leading-normal text-black">
              GIF를 통해 아이디어 페스티벌을
              <br />
              원할하게 진행하세요!
            </p>
            <p className="text-[12px] text-gray-600 leading-normal">
              프로젝트 보고서 제출부터 점수 관리, AI 요약 기능까지
              <br />
              아이디어 페스티벌 모든 진행을 GIF와 함께해요.
            </p>
          </div>
          <p className="text-[10px] text-gray-500 font-medium">Team.VOID</p>
        </div>
      </div>

      <div className="w-[333px] bg-white flex flex-col justify-center px-10 py-[50px]">
        <div className="flex flex-col gap-4 w-[253px] h-[252px] justify-center">
          <div className="flex flex-col gap-3">
            <p className="text-base text-black">로그인</p>
            <p className="text-[12px] text-gray-800">
              DataGsm으로 안전하게 로그인하세요!
            </p>
          </div>
          <button
            type="button"
            onClick={onLogin}
            className="w-[250px] h-7 bg-black text-white rounded flex items-center justify-center gap-2.5 overflow-hidden cursor-pointer"
          >
            <span className="datagsm-logo">D</span>
            <span className="text-[12px] font-medium">DataGsm으로 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useGetMe } from "@/entities/auth";
import {
  CLIENT_TERMS,
  TermsAgreement,
  usePostClientInfo,
  type ClientRole,
} from "@/entities/signup";
import { COOKIE_KEYS } from "@/shared/constants";
import { setCookie } from "@/shared/utils";

export default function TermsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate, isPending } = usePostClientInfo();
  const [agreed, setAgreed] = useState(false);

  const clientRole = searchParams.get("role") as ClientRole | null;

  const { data: me, isLoading: isMeLoading } = useGetMe();
  const alreadySignedUp = !!me?.clientRole;

  // 이미 가입한 사용자는 홈으로, 역할 정보 없이 직접 접근하면 회원가입으로 돌려보낸다.
  useEffect(() => {
    if (alreadySignedUp) {
      router.replace("/");
    } else if (!clientRole) {
      router.replace("/signup");
    }
  }, [alreadySignedUp, clientRole, router]);

  const handleSubmit = () => {
    if (!clientRole || !agreed) return;
    mutate(
      { clientRole },
      {
        onSuccess: ({ data }) => {
          if (data?.accessToken) {
            setCookie(COOKIE_KEYS.ACCESS_TOKEN, data.accessToken);
          }
          setCookie(COOKIE_KEYS.CLIENT_ROLE, clientRole);
          router.replace("/");
        },
        onError: () => toast.error("회원가입에 실패했습니다. 다시 시도해주세요."),
      },
    );
  };

  if (isMeLoading || alreadySignedUp || !clientRole) return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4 md:p-0">
      <div className="bg-white rounded-[20px] shadow-new px-[30px] py-[30px] w-full max-w-[560px] flex flex-col gap-[30px] items-center">
        <Image
          src="/gif-logo.png"
          alt="GIF"
          width={83}
          height={55}
          className="object-contain"
        />

        <div className="flex flex-col gap-5 w-full">
          <TermsAgreement
            terms={CLIENT_TERMS}
            onRequiredAgreedChange={setAgreed}
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!agreed || isPending}
            className={`w-full h-7 rounded text-[12px] text-white transition-colors ${
              agreed && !isPending
                ? "bg-[#ffee30] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            완료
          </button>
        </div>
      </div>
    </main>
  );
}

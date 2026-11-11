"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations("notFound");

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="font-righteous mb-4 text-6xl leading-none tracking-tight text-gray-900 sm:text-8xl">
        404 ERROR
      </span>
      <p className="text-lg font-medium text-gray-700 sm:text-2xl">
        {t("message")}
      </p>
      <div className="flex items-center">
        <button
          onClick={() => router.back()}
          className="cursor-pointer border-none bg-transparent text-orange-600 underline"
          type="button"
        >
          {t("back")}
        </button>
      </div>
    </div>
  );
}

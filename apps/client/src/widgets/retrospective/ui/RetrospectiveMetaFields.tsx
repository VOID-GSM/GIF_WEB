import {
  CATEGORY_OPTIONS,
  type RetrospectiveCategory,
  type RetrospectiveVisibility,
} from "@/entities/retrospective";
import CustomSelect from "@/shared/ui/CustomSelect";

interface RetrospectiveMetaFieldsProps {
  category: RetrospectiveCategory;
  onCategoryChange: (category: RetrospectiveCategory) => void;
  visibility: RetrospectiveVisibility;
  onVisibilityChange: (visibility: RetrospectiveVisibility) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

export default function RetrospectiveMetaFields({
  category,
  onCategoryChange,
  visibility,
  onVisibilityChange,
  title,
  onTitleChange,
}: RetrospectiveMetaFieldsProps) {
  const isPublic = visibility === "PUBLIC";

  return (
    <>
      <div className="flex items-end gap-3">
        <div className="min-w-0 flex-1">
          <label
            htmlFor="retrospective-category"
            className="mb-1 block text-[12px] font-medium text-gray-500"
          >
            기록 유형
          </label>
          <CustomSelect
            id="retrospective-category"
            value={category}
            options={CATEGORY_OPTIONS}
            onChange={onCategoryChange}
            ariaLabel="기록 유형"
          />
        </div>

        {/* 공개 범위 */}
        <div className="w-[132px] shrink-0">
          <span className="mb-1 block text-[12px] font-medium text-gray-500">
            공개 범위
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isPublic}
            aria-label="공개 여부"
            onClick={() => onVisibilityChange(isPublic ? "PRIVATE" : "PUBLIC")}
            className="flex w-full cursor-pointer items-center gap-2 rounded-[10px] border border-gray-200 bg-white px-3 py-2 text-[13px] font-medium text-gray-700 transition-all duration-150 hover:border-gray-300 active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          >
            <span
              aria-hidden="true"
              className={`relative h-[18px] w-[32px] rounded-full transition-colors duration-200 ${
                isPublic ? "bg-yellow-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white transition-all duration-200 ease-out ${
                  isPublic ? "left-[16px]" : "left-[2px]"
                }`}
              />
            </span>
            {isPublic ? "공개" : "비공개"}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="retrospective-title" className="sr-only">
          제목
        </label>
        <input
          id="retrospective-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full rounded-[10px] border border-gray-200 bg-white px-4 py-3 text-[15px] font-semibold text-black outline-none transition-colors placeholder:font-medium placeholder:text-gray-400 focus:border-yellow-600"
        />
      </div>
    </>
  );
}

interface SubmitButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function SubmitButton({ children, onClick, disabled }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-yellow-600 px-8 py-2.5 font-semibold text-gray-900 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      {children}
    </button>
  );
}
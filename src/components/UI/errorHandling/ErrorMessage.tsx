import { useEffect } from "react";

type Props = {
  message: string;
  onClose: () => void;
};

function ErrorMessage({ message, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="mb-4 rounded bg-red-50 p-4 text-sm text-red-800">
      {message}
    </div>
  );
}

export default ErrorMessage;

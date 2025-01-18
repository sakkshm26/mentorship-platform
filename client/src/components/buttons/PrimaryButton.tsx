import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
    text: string;
    onClick?: (_: any) => any;
    class_names?: string;
    loading?: boolean;
    extra_props?: any;
}

export default function PrimaryButton({
    text,
    onClick,
    loading,
    class_names,
    extra_props,
}: PrimaryButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`text-white bg-gray-700 hover:bg-black focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 h-10 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 ${class_names}`}
            disabled={loading}
            {...extra_props}
        >
            {loading ? (
                <div role="status" className="flex justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn("animate-spin")}
                    >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                </div>
            ) : (
                text
            )}
        </button>
    );
}

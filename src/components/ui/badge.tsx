import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-white hover:bg-primary/80",
                secondary:
                    "bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-100",
                success:
                    "bg-green-500 text-white hover:bg-green-500/80",
                warning:
                    "bg-yellow-500 text-white hover:bg-yellow-500/80",
                error:
                    "bg-red-500 text-white hover:bg-red-500/80",
                info:
                    "bg-blue-500 text-white hover:bg-blue-500/80",
                outline:
                    "border border-gray-300 bg-transparent text-gray-700 dark:border-gray-600 dark:text-gray-300",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };

"use client";

import { cn } from "@/lib/utils";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="md:auto-rows-[34rem] grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto px-4 md:px-0"
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "row-span-1 rounded-3xl group/bento hover:shadow-2xl transition duration-300 shadow-lg shadow-slate-200/50 border border-slate-100 bg-white justify-between flex flex-col space-y-4 overflow-hidden",
                className
            )}
        >
            <div className="h-full flex flex-col">
                {header}
                <div className="p-6 group-hover/bento:translate-x-2 transition duration-200 bg-white relative z-10">
                    <div className="mb-2">
                        {icon}
                    </div>
                    <div className="font-sans font-bold text-slate-900 text-lg mb-2">
                        {title}
                    </div>
                    <div className="font-sans font-normal text-slate-500 text-sm leading-relaxed">
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
};

import React from "react";

export function LoadingSpinner({
    size = "md",
    className = "",
}) {
    const sizes = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-4",
        lg: "w-10 h-10 border-4",
    };

    return (
        <div
            className={`${sizes[size]} rounded-full border-gray-200 border-t-violet-600 animate-spin ${className}`}
            aria-label="Loading"
        />
    );
}

export function LoadingState({
    variant = "page",
    text = "Loading...",
    rows = 4,
}) {
    if (variant === "list") {
        return (
            <div className="col-span-full w-full space-y-3">
                {Array.from({ length: rows }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-sm p-3 animate-pulse"
                    >
                        <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-3" />
                        <div className="h-3 bg-gray-200 rounded-md w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (variant === "card") {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-3" />
                <div className="h-3 bg-gray-200 rounded-md w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded-md w-3/4" />
            </div>
        );
    }

    if (variant === "section") {
        return (
            <div className="flex items-center justify-center py-10">
                <div className="flex flex-col items-center gap-3">
                    <LoadingSpinner />
                    {text && (
                        <span className="text-gray-500 font-medium text-sm">
                            {text}
                        </span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <LoadingSpinner />
                {text && (
                    <span className="text-gray-500 font-medium text-sm">
                        {text}
                    </span>
                )}
            </div>
        </div>
    );
}

export function SkeletonCard({
    className = "",
    height = "5rem",
    rounded = "rounded-xl",
}) {
    return (
        <div
            className={`bg-gray-200 animate-pulse ${rounded} ${className}`}
            style={{ height }}
            aria-hidden="true"
        />
    );
}

export function SkeletonText({
    width = "100%",
    className = "",
}) {
    return (
        <div
            className={`bg-gray-200 animate-pulse rounded-md h-4 ${className}`}
            style={{ width }}
            aria-hidden="true"
        />
    );
}

export function ButtonLoading({
    text = "Memproses...",
}) {
    return (
        <span className="inline-flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" className="border-white/40 border-t-white" />
            {text && text}
        </span>
    );
}

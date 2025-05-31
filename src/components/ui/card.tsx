import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * @param props The props.
 * @param props.className Additional class names to be applied to the card container.
 * @returns The rendered card container.
 */
function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
        className,
      )}
      data-slot="card"
      {...props}
    />
  );
}

/**
 * The card header.
 *
 * @param props The props.
 * @param props.className Additional class names to be applied to the card header.
 * @returns The rendered card header.
 */
function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      data-slot="card-header"
      {...props}
    />
  );
}

/**
 * The card title.
 *
 * @param props The props.
 * @param props.className Additional class names to be applied to the card title.
 * @returns The rendered card title.
 */
function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("leading-none font-semibold", className)}
      data-slot="card-title"
      {...props}
    />
  );
}

/**
 * The card description.
 *
 * @param props The props.
 * @param props.className Additional class names to be applied to the card description.
 * @returns The rendered card description.
 */
function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("text-sm text-muted-foreground", className)}
      data-slot="card-description"
      {...props}
    />
  );
}

/**
 * The card action.
 *
 * @param props The props.
 * @param props.className Additional class names to be applied to the card action.
 * @returns The rendered card action.
 */
function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      data-slot="card-action"
      {...props}
    />
  );
}

/**
 * The card content.
 *
 * @param props The props.
 * @param props.className Additional class names to be applied to the card content.
 * @returns The rendered card content.
 */
function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-6", className)} data-slot="card-content" {...props} />;
}

/**
 * The card footer.
 *
 * @param props The props.
 * @param props.className Additional class names to be applied to the card footer.
 * @returns The rendered card footer.
 */
function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      data-slot="card-footer"
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };

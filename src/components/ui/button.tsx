"use client";

import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./button-variants";

/**
 * @param props The props to apply to the button.
 * @param props.className Additional class names to apply to the button.
 * @param props.variant The variant of the button.
 * @param props.size The size of the button.
 * @param props.asChild Whether the button is a child of another component. Defaults to `false`.
 * @returns A button component.
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(buttonVariants({ variant, size, className }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button };

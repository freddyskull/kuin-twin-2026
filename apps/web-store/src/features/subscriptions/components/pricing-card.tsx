"use client";

import React from "react";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Badge
} from "@/components/ui";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
  onSelect?: () => void;
  loading?: boolean;
}

export function PricingCard({
  title,
  price,
  description,
  features,
  isPopular,
  buttonText = "Seleccionar Plan",
  onSelect,
  loading
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col h-full transition-all duration-300 hover:shadow-2xl border-2",
        isPopular ? "border-primary scale-105 shadow-xl z-10" : "border-border hover:border-primary/50"
      )}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Badge className="px-4 py-1 text-sm font-bold shadow-md">
            MÁS POPULAR
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pt-8">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground min-h-[40px]">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="grow flex flex-col items-center">
        <div className="flex items-baseline gap-1 mb-8">
          <span className="text-4xl font-extrabold">{price}</span>
          <span className="text-muted-foreground font-medium">/mes</span>
        </div>

        <ul className="w-full space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-sm">
              <div className="rounded-full bg-primary/10 p-1">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pb-8 pt-4">
        <Button
          className={cn(
            "w-full rounded-xl h-12 text-md font-bold transition-all",
            isPopular ? "shadow-lg" : "hover:bg-primary/90"
          )}
          variant={isPopular ? "default" : "outline"}
          onClick={onSelect}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Procesando...
            </span>
          ) : (
            buttonText
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

import Link from "next/link";
import type { ProductCategory } from "@/types/product";

type Props = {
  categories: ProductCategory[];
  activeSlug?: string;
  basePath: string;
  description?: string | null;
};

export function CategoryFilter({ categories, activeSlug, basePath, description }: Props) {
  if (categories.length === 0 && !description) return null;

  return (
    <div className="space-y-5">
      {description && (
        <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">{description}</p>
      )}

      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href={basePath}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              !activeSlug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${basePath}?categoria=${cat.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                activeSlug === cat.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
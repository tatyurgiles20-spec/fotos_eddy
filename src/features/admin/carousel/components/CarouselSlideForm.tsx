"use client";

import { useEffect, useState } from "react";
import type { ButtonStyle, CarouselSlide, FontFamily, TextPosition } from "@/types/carousel";
import type { CarouselSlideInput } from "../hooks/useCarouselSlides";
import { ImagePicker } from "./ImagePicker";
import { CarouselSlidePreview } from "./CarouselSlidePreview";

const BUTTON_STYLE_OPTIONS: { value: ButtonStyle; label: string }[] = [
  { value: "primary", label: "Primario (relleno)" },
  { value: "secondary", label: "Secundario" },
  { value: "outline", label: "Outline" },
  { value: "ghost", label: "Ghost (solo texto)" },
];

const FONT_OPTIONS: { value: FontFamily; label: string }[] = [
  { value: "auto", label: "Automática (según el tema)" },
  { value: "display", label: "Sora (títulos, moderna)" },
  { value: "body", label: "Inter (texto normal)" },
  { value: "accent", label: "Caveat (manuscrita)" },
];

const POSITION_OPTIONS: { value: TextPosition; label: string }[] = [
  { value: "left", label: "Izquierda" },
  { value: "center", label: "Centro" },
  { value: "right", label: "Derecha" },
];

type Props = {
  editingSlide: CarouselSlide | null;
  onCreate: (input: CarouselSlideInput) => Promise<void>;
  onUpdate: (id: string, input: Partial<CarouselSlideInput>) => Promise<void>;
  onCancelEdit: () => void;
};

const EMPTY_FORM = {
  imageId: "" as string,
  imageUrl: "" as string,
  altText: "",
  title: "",
  subtitle: "",
  buttonText: "",
  buttonHref: "",
  buttonStyle: "primary" as ButtonStyle,
  fontFamily: "auto" as FontFamily,
  titleColor: null as string | null,
  subtitleColor: null as string | null,
  textPosition: "left" as TextPosition,
};

// Un color por defecto para cuando el admin activa el picker (no se guarda
// hasta que realmente elija "color manual"; el estado sigue siendo null
// mientras esté en automático).
const DEFAULT_PICKED_COLOR = "#ffffff";

export function CarouselSlideForm({ editingSlide, onCreate, onUpdate, onCancelEdit }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingSlide) {
      setForm({
        imageId: editingSlide.imageId,
        imageUrl: editingSlide.imageUrl,
        altText: editingSlide.altText,
        title: editingSlide.title ?? "",
        subtitle: editingSlide.subtitle ?? "",
        buttonText: editingSlide.buttonText ?? "",
        buttonHref: editingSlide.buttonHref ?? "",
        buttonStyle: editingSlide.buttonStyle,
        fontFamily: editingSlide.fontFamily,
        titleColor: editingSlide.titleColor,
        subtitleColor: editingSlide.subtitleColor,
        textPosition: editingSlide.textPosition,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editingSlide]);

  const handleSubmit = async () => {
    if (!form.imageId || !form.altText) return;
    setSaving(true);
    try {
      const input: CarouselSlideInput = {
        image_id: form.imageId,
        alt_text: form.altText,
        title: form.title || null,
        subtitle: form.subtitle || null,
        button_text: form.buttonText || null,
        button_href: form.buttonHref || null,
        button_style: form.buttonStyle,
        font_family: form.fontFamily === "auto" ? null : form.fontFamily,
        title_color: form.titleColor,
        subtitle_color: form.subtitleColor,
        text_position: form.textPosition,
      };

      if (editingSlide) {
        await onUpdate(editingSlide.id, input);
      } else {
        await onCreate(input);
      }
      setForm(EMPTY_FORM);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 font-display text-lg font-bold">
        {editingSlide ? "Editar slide" : "Agregar slide al carrusel"}
      </p>

      <div className="mb-4">
        <CarouselSlidePreview
          imageUrl={form.imageUrl}
          altText={form.altText}
          title={form.title}
          subtitle={form.subtitle}
          buttonText={form.buttonText}
          buttonStyle={form.buttonStyle}
          fontFamily={form.fontFamily}
          titleColor={form.titleColor}
          subtitleColor={form.subtitleColor}
          textPosition={form.textPosition}
        />
      </div>

      <div className="mb-4">
        <ImagePicker
          selectedImageId={form.imageId || null}
          onSelect={(imageId, directUrl) =>
            setForm((f) => ({ ...f, imageId, imageUrl: directUrl }))
          }
        />
      </div>

      <input
        type="text"
        placeholder="Texto alternativo (alt, obligatorio para SEO)"
        value={form.altText}
        onChange={(e) => setForm((f) => ({ ...f, altText: e.target.value }))}
        className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="Título (opcional)"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      {/* Color del título: automático (según el tema) o manual */}
      <div className="mb-3 flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
        <span className="text-sm text-muted-foreground">Color del título</span>
        <label className="flex items-center gap-1.5 text-xs">
          <input
            type="checkbox"
            checked={form.titleColor === null}
            onChange={(e) =>
              setForm((f) => ({ ...f, titleColor: e.target.checked ? null : DEFAULT_PICKED_COLOR }))
            }
          />
          Automático
        </label>
        {form.titleColor !== null && (
          <input
            type="color"
            value={form.titleColor}
            onChange={(e) => setForm((f) => ({ ...f, titleColor: e.target.value }))}
            className="ml-auto h-6 w-10 cursor-pointer rounded border border-border bg-transparent"
          />
        )}
      </div>

      <input
        type="text"
        placeholder="Subtítulo (opcional)"
        value={form.subtitle}
        onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
        className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />

      {/* Color del subtítulo: automático (según el tema) o manual */}
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
        <span className="text-sm text-muted-foreground">Color del subtítulo</span>
        <label className="flex items-center gap-1.5 text-xs">
          <input
            type="checkbox"
            checked={form.subtitleColor === null}
            onChange={(e) =>
              setForm((f) => ({ ...f, subtitleColor: e.target.checked ? null : DEFAULT_PICKED_COLOR }))
            }
          />
          Automático
        </label>
        {form.subtitleColor !== null && (
          <input
            type="color"
            value={form.subtitleColor}
            onChange={(e) => setForm((f) => ({ ...f, subtitleColor: e.target.value }))}
            className="ml-auto h-6 w-10 cursor-pointer rounded border border-border bg-transparent"
          />
        )}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <select
          value={form.fontFamily}
          onChange={(e) => setForm((f) => ({ ...f, fontFamily: e.target.value as FontFamily }))}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {FONT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={form.textPosition}
          onChange={(e) => setForm((f) => ({ ...f, textPosition: e.target.value as TextPosition }))}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          {POSITION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Texto del botón (opcional)"
          value={form.buttonText}
          onChange={(e) => setForm((f) => ({ ...f, buttonText: e.target.value }))}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Link del botón (ej. /galeria o https://...)"
          value={form.buttonHref}
          onChange={(e) => setForm((f) => ({ ...f, buttonHref: e.target.value }))}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <select
          value={form.buttonStyle}
          onChange={(e) => setForm((f) => ({ ...f, buttonStyle: e.target.value as ButtonStyle }))}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm sm:col-span-2"
        >
          {BUTTON_STYLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!form.imageId || !form.altText || saving}
          className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? "Guardando..." : editingSlide ? "Guardar cambios" : "Agregar slide"}
        </button>
        {editingSlide && (
          <button
            onClick={onCancelEdit}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import type { ButtonStyle, CarouselSlide, FontFamily, TextPosition } from "@/types/carousel";
import type { CarouselSlideInput } from "../hooks/useCarouselSlides";
import { ImagePicker } from "./ImagePicker";
import { CarouselSlidePreview } from "./CarouselSlidePreview";

/* Componente de ayuda/tooltip para formularios */
function InfoTooltip({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        aria-label="Más información"
        className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 w-52 p-2.5 bg-popover text-popover-foreground border border-border text-xs rounded-lg shadow-xl pointer-events-none transition-all">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-popover" />
        </div>
      )}
    </div>
  );
}

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
  { value: "bottom-left", label: "Abajo · Izquierda" },
  { value: "bottom-center", label: "Abajo · Centro" },
  { value: "bottom-right", label: "Abajo · Derecha" },
  { value: "middle-left", label: "Medio · Izquierda" },
  { value: "middle-center", label: "Medio · Centro" },
  { value: "middle-right", label: "Medio · Derecha" },
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
  textPosition: "bottom-left" as TextPosition,
  showUnderline: true,
};

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
        showUnderline: editingSlide.showUnderline,
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
        show_underline: form.showUnderline,
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

  const buttonPartiallyFilled =
    Boolean(form.buttonText.trim()) !== Boolean(form.buttonHref.trim());

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
          showUnderline={form.showUnderline}
        />
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-1">
          <span className="text-xs font-medium text-muted-foreground">Imagen del Slide</span>
          <InfoTooltip text="Selecciona la imagen de fondo que se mostrará en esta diapositiva del carrusel principal." />
        </div>
        <ImagePicker
          selectedImageId={form.imageId || null}
          onSelect={(imageId, directUrl) =>
            setForm((f) => ({ ...f, imageId, imageUrl: directUrl }))
          }
        />
      </div>

      {/* Texto Alternativo (Alt) */}
      <div className="mb-3">
        <div className="flex items-center mb-1">
          <label className="text-xs font-medium text-muted-foreground">Texto alternativo (alt)</label>
          <InfoTooltip text="Descripción breve de la imagen necesaria para accesibilidad y posicionamiento en buscadores (SEO)." />
        </div>
        <input
          type="text"
          placeholder="Texto alternativo (alt, obligatorio para SEO)"
          value={form.altText}
          onChange={(e) => setForm((f) => ({ ...f, altText: e.target.value }))}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Título */}
      <div className="mb-3">
        <div className="flex items-center mb-1">
          <label className="text-xs font-medium text-muted-foreground">Título</label>
          <InfoTooltip text="El encabezado principal que se superpondrá sobre la imagen." />
        </div>
        <input
          type="text"
          placeholder="Título (opcional)"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Color del título + subrayado decorativo */}
      <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">Color del título</span>
          <InfoTooltip text="Elige 'Automático' para usar los colores del tema o selecciona un color personalizado." />
        </div>
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
            className="h-6 w-10 cursor-pointer rounded border border-border bg-transparent"
          />
        )}
        <label className="ml-auto flex items-center gap-1.5 text-xs">
          <input
            type="checkbox"
            checked={form.showUnderline}
            onChange={(e) => setForm((f) => ({ ...f, showUnderline: e.target.checked }))}
          />
          Subrayado decorativo
          <InfoTooltip text="Añade una línea estética debajo del título con su mismo color." />
        </label>
      </div>

      {/* Subtítulo */}
      <div className="mb-3">
        <div className="flex items-center mb-1">
          <label className="text-xs font-medium text-muted-foreground">Subtítulo</label>
          <InfoTooltip text="Un texto secundario descriptivo debajo del título principal." />
        </div>
        <input
          type="text"
          placeholder="Subtítulo (opcional)"
          value={form.subtitle}
          onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Color del subtítulo */}
      <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">Color del subtítulo</span>
          <InfoTooltip text="Ajusta el color del subtítulo o déjalo en automático." />
        </div>
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

      {/* Fuente y Posición */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <div className="flex items-center mb-1">
            <label className="text-xs font-medium text-muted-foreground">Tipografía</label>
            <InfoTooltip text="Define la familia de fuente aplicada a los textos de este slide." />
          </div>
          <select
            value={form.fontFamily}
            onChange={(e) => setForm((f) => ({ ...f, fontFamily: e.target.value as FontFamily }))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {FONT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center mb-1">
            <label className="text-xs font-medium text-muted-foreground">Alineación del texto</label>
            <InfoTooltip text="Ubica la caja de texto dentro de la imagen del carrusel." />
          </div>
          <select
            value={form.textPosition}
            onChange={(e) => setForm((f) => ({ ...f, textPosition: e.target.value as TextPosition }))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {POSITION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Configuración del Botón */}
      <div className="mb-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <div className="flex items-center mb-1">
            <label className="text-xs font-medium text-muted-foreground">Texto del botón</label>
            <InfoTooltip text="El texto que llamará a la acción (ej: 'Ver Galería')." />
          </div>
          <input
            type="text"
            placeholder="Texto del botón (opcional)"
            value={form.buttonText}
            onChange={(e) => setForm((f) => ({ ...f, buttonText: e.target.value }))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <div className="flex items-center mb-1">
            <label className="text-xs font-medium text-muted-foreground">Enlace de destino</label>
            <InfoTooltip text="Dirección a la que redirige al hacer clic (ej: /galeria o https://...)." />
          </div>
          <input
            type="text"
            placeholder="Link del botón (ej. /galeria o https://...)"
            value={form.buttonHref}
            onChange={(e) => setForm((f) => ({ ...f, buttonHref: e.target.value }))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <div className="flex items-center mb-1">
            <label className="text-xs font-medium text-muted-foreground">Estilo visual del botón</label>
            <InfoTooltip text="Cambia la apariencia gráfica del botón entre relleno, contorno o plano." />
          </div>
          <select
            value={form.buttonStyle}
            onChange={(e) => setForm((f) => ({ ...f, buttonStyle: e.target.value as ButtonStyle }))}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {BUTTON_STYLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {buttonPartiallyFilled && (
        <p className="mb-3 text-xs text-warning">
          Completa tanto el texto como el link del botón — si falta uno de los dos, el botón no se muestra en la landing.
        </p>
      )}
      {!buttonPartiallyFilled && <div className="mb-4" />}

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
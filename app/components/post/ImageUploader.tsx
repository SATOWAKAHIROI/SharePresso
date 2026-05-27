"use client";

import { useRef } from "react";
import Image from "next/image";

interface Props {
  images: File[];
  onChange: (images: File[]) => void;
}

export function ImageUploader({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    onChange([...images, ...files].slice(0, 4));
    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {images.map((file, i) => (
          <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
            <Image
              src={URL.createObjectURL(file)}
              alt=""
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
        {images.length < 4 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-[#1e3932] hover:text-[#1e3932] transition-colors"
          >
            <span className="text-3xl leading-none">+</span>
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400">{images.length} / 4 枚</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleAdd}
      />
    </div>
  );
}

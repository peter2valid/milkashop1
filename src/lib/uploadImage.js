import { supabase, PRODUCT_BUCKET } from "./supabaseClient";

function getSafeExt(name, fallback = "jpg") {
  const parts = String(name || "").split(".");
  const ext = parts.length > 1 ? parts.pop() : fallback;
  return (ext || fallback).toLowerCase();
}

export async function uploadImage(file) {
  if (!file) return null;

  const ext = getSafeExt(file.name, "jpg");
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const path = `public/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg",
    });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    return null;
  }

  const { data: pub, error: urlError } = supabase.storage
    .from(PRODUCT_BUCKET)
    .getPublicUrl(path);

  if (urlError) {
    console.error("Error getting public URL:", urlError);
    return null;
  }

  return pub?.publicUrl || null;
}



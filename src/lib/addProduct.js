import { supabase, PRODUCTS_TABLE } from "./supabaseClient";
import { uploadImage } from "./uploadImage";

export async function addProduct(name, price, description, file) {
  const imageUrl = file ? await uploadImage(file) : null;

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .insert([
      { name, price, description, image_url: imageUrl },
    ])
    .select("*")
    .single();

  if (error) {
    console.error("Error inserting product:", error);
    return null;
  }
  return data;
}



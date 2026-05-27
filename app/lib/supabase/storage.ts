import { supabaseAdmin } from "./admin";

export async function uploadAvatarImage(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `avatars/${userId}/avatar.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabaseAdmin.storage
    .from("post-images")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) throw error;

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("post-images")
    .getPublicUrl(data.path);

  return publicUrl;
}

export async function uploadPostImage(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `posts/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabaseAdmin.storage
    .from("post-images")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) throw error;

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("post-images")
    .getPublicUrl(data.path);

  return publicUrl;
}

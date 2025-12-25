import { supabase } from '@/lib/supabase';

export async function upsertProfileFromSession() {
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes?.user;
  if (!user) return;
  const name = (user.user_metadata as any)?.name || '';
  const email = user.email || '';
  await supabase.from('profiles').upsert({ id: user.id, name, email });
}

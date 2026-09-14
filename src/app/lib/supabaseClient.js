import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Sem as variáveis, o createClient lança ("supabaseUrl is required") na
// importação — e como o TopHeaderTelevendas importa este arquivo no layout, o
// site inteiro cai numa tela de erro. Quem realmente usa Supabase (callback do
// login e link de pagamento) continua recebendo o erro ao chamar o método.
const semConfiguracao = () => {
  throw new Error("Supabase não está configurado neste ambiente (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).");
};

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : {
        auth: {
          getSession: semConfiguracao,
          signUp: semConfiguracao,
          signInWithOAuth: semConfiguracao,
          signOut: semConfiguracao,
        },
      };

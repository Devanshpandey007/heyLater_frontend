import 'react-native-url-polyfill/auto';

import { SUPABASE_API_KEY as SUPABASE_KEY } from '@env';

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oendpztwpilkwuthcaxe.supabase.co'
const supabaseKey = SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;

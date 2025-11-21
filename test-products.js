import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function testProducts() {
    console.log('Conectando a Supabase...');

    const { data, error } = await supabase
        .from('productos')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Productos encontrados:', data.length);
        console.log(JSON.stringify(data, null, 2));
    }
}

testProducts();

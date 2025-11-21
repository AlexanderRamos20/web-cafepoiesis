import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');

const envVars = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim();
    }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
    console.log('Fetching products...');

    // 1. Fetch all products to see what exists
    const { data: allProducts, error: errorAll } = await supabase
        .from('productos')
        .select('*');

    if (errorAll) {
        console.error('Error fetching all products:', errorAll);
    } else {
        console.log('Total products found:', allProducts.length);
        console.log('Sample product types:', allProducts.map(p => p.tipo_producto));
        console.log('Sample product availability:', allProducts.map(p => p.disponible));
    }

    // 2. Test the specific query used in GranoGeneral
    console.log('\nTesting GranoGeneral query...');
    const { data: filtered, error: errorFiltered } = await supabase
        .from('productos')
        .select(`
            *,
            cafes_en_grano (
                notas_cata
            )
        `)
        .eq('tipo_producto', 'café en grano')
        .eq('disponible', true);

    if (errorFiltered) {
        console.error('Error in filtered query:', errorFiltered);
    } else {
        console.log('Filtered products found:', filtered.length);
        if (filtered.length === 0) {
            console.log('WARNING: No products match the filter criteria!');
        } else {
            console.log('First match:', filtered[0]);
        }
    }
}

testFetch();

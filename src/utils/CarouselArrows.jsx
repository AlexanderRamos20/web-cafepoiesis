import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; 

// 🎨 CONSTANTES DE ESTILO (Utilizadas en toda la aplicación)
const ICON_COLOR = '#4e342e'; 
const BUBBLE_SIZE = '45px'; 

// --- WRAPPER DE LA BURBUJA ---
const ArrowWrapper = ({ children }) => (
    <div style={{
        backgroundColor: 'white',
        borderRadius: '50%',
        width: BUBBLE_SIZE,
        height: BUBBLE_SIZE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)', 
        zIndex: 100, 
    }}>
        {children}
    </div>
);

// --- COMPONENTES DE FLECHA EXPORTABLES ---
export const PrevIcon = (
    <ArrowWrapper>
        <ChevronLeft size={28} color={ICON_COLOR} />
    </ArrowWrapper>
);

export const NextIcon = (
    <ArrowWrapper>
        <ChevronRight size={28} color={ICON_COLOR} />
    </ArrowWrapper>
);
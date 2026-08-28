// Datos extraídos de "Form Asistencia y NPS .xlsx" (hojas ASISTENCIA y NPS - *).
// Wise = coach/facilitador a cargo de uno o más grupos.

export const WISES = ["Mirian Lau", "Mari Perales", "Jessica Carrión", "Carolina Lazarte"] as const;
export type Wise = (typeof WISES)[number];

// Grupo -> Wise a cargo
export const GRUPO_WISE: Record<string, Wise> = {
  G2: "Mirian Lau",
  G3: "Mirian Lau",
  G4: "Mari Perales",
  G5: "Carolina Lazarte",
  G7: "Jessica Carrión",
  G8: "Mari Perales",
  G9: "Carolina Lazarte",
};

export const GRUPOS = Object.keys(GRUPO_WISE);

// Grupos a cargo de cada Wise (para el formulario de asistencia)
export function gruposDeWise(wise: Wise): string[] {
  return GRUPOS.filter((g) => GRUPO_WISE[g] === wise);
}

// Etiqueta usada en los formularios NPS: "G2 - Mirian Lau"
export function grupoLabel(g: string): string {
  return `${g} - ${GRUPO_WISE[g]}`;
}

export const GRUPO_OPTIONS = GRUPOS.map((g) => ({ value: g, label: grupoLabel(g) }));

// Roster de miembros por grupo (para el formulario de asistencia)
export const MIEMBROS: Record<string, string[]> = {
  G2: [
    "María Perales",
    "Eduardo Herrera",
    "Enrique Prado",
    "Luisa Quiroz",
    "Eduardo Carrillo",
    "Mariale Delgado",
    "Karina Sakihara",
    "Benjamín Edwards",
  ],
  G3: [
    "Mariluz Santana",
    "Gabriela Lock",
    "Blanca Quino",
    "Aivy Schrotch",
    "Violeta Orozco",
    "Anne Bayly",
    "Ivo Bravo",
    "Jessica Carrión",
    "Patricia Kobashigawa",
  ],
  G4: [
    "Susy Tang",
    "Felipe Gamarra",
    "Martin Jimenez",
    "Gretta Caracciollo",
    "Armel Goytizolo",
    "Jano Roca",
    "Vanessa Domenack",
  ],
  G5: ["Marcy Acosta", "Claudia Bellido", "Francisco Vilca", "Paula Flecha", "Luis Miguel Prado"],
  G7: [
    "Monica Liyau",
    "Zelma Acosta-Rubio",
    "Mario Stuva",
    "Mirian Contreras Soto",
    "Carlos Enrique Muñoz",
    "Patty Araujo",
  ],
  G8: [
    "Eliana Barrantes",
    "Carlos Vereau",
    "Orlando Plaza",
    "Jose Luis Pasco",
    "Alvaro Chang-Say",
    "Carla Ossio",
    "Lourdes Cauti",
    "Mariella Lanseros L",
    "Carla Torres Osores",
    "Gino Ojeda",
    "Cesar Jorquiera",
  ],
  G9: ["Jorge Vildoso", "Luis Silva", "Carlos Escudero"],
};

export const MODULOS = [
  "1. Reinvención personal",
  "2. Reinvención laboral",
  "3. Wellness",
  "4. Co-housing",
  "5. Legado",
];

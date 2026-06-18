// Fonction obligatoire pour simuler le délai réseau exigé par le sujet
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
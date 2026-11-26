/** Estado vivo compartido (no reactivo) leído por el reloj único. */
export const live = {
  /** velocidad de scroll en px/s (con signo), decae sola */
  velocity: 0,
  /** |velocidad| normalizada y suavizada 0..1 */
  vNorm: 0,
  /** progreso total de la página 0..1 */
  progress: 0,
  soundOn: false,
  lowPower: false,
};

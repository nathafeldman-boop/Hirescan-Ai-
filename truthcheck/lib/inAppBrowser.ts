// Détecte les navigateurs intégrés (TikTok, Instagram, Snapchat...) où Google
// bloque volontairement l'OAuth ("This browser or app may not be secure") —
// utilisé pour masquer le bouton "Continuer avec Google", qui n'aboutirait
// jamais, et mettre en avant la connexion par email à la place.
export function detectInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/musical_ly|tiktok|bytedance|instagram|fbav|fban|snapchat|line|kakaotalk|wechat|micromessenger/i.test(ua)) return true;
  if (/android/i.test(ua) && / wv[);]/i.test(ua)) return true;
  if (/iphone|ipad/i.test(ua)) {
    const hasSafariVersion = /version\/[\d.]+.*safari/i.test(ua);
    const isChrome = /crios\//i.test(ua);
    const isFirefox = /fxios\//i.test(ua);
    if (!hasSafariVersion && !isChrome && !isFirefox) return true;
  }
  return false;
}

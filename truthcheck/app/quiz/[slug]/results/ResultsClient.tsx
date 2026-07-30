'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Quiz } from '@/lib/quizzes';
import { getResultTier } from '@/lib/quizzes';
import { track } from '@/lib/analytics';
import { detectInAppBrowser } from '@/lib/inAppBrowser';

interface Props {
  quiz: Quiz;
}

const CIRCUMFERENCE = 2 * Math.PI * 72;

function buildAnalysis(quiz: Quiz, score: number, tierTitle: string): string[] {
  const high = score >= 60;
  const mid = score >= 30 && score < 60;

  const baseLines: Record<string, (s: number) => string[]> = {
    'auto-sabotage': (s) => [
      `Ton score de ${s}% indique ${s >= 60 ? 'un schéma d\'auto-sabotage assez présent, qui agit sur plusieurs zones de ta vie' : s >= 30 ? 'quelques réflexes de freinage ponctuels, sans qu\'ils dominent ton quotidien' : 'une tendance globalement saine à avancer vers ce que tu veux'}.`,
      `Ce chiffre ne mesure pas ta valeur ni ta force de volonté : il mesure à quel point une partie protectrice de toi a pris l\'habitude ${s >= 60 ? 'de freiner à ta place, souvent au pire moment' : s >= 30 ? 'd\'intervenir de temps en temps, surtout quand l\'enjeu grandit' : 'de rester discrète, sans trop interférer avec tes envies'}.`,
      `D\'après la théorie du self-handicapping (Berglas & Jones), on se crée parfois des obstacles nous-mêmes pour avoir une excuse toute prête en cas d\'échec — ${s >= 60 ? 'et ce mécanisme semble assez actif chez toi en ce moment' : s >= 30 ? 'et on en retrouve quelques traces dans tes réponses' : 'et tes réponses montrent que tu y as, pour l\'instant, assez peu recours'}.`,
      `Le chercheur Piers Steel, l\'un des plus grands spécialistes de la procrastination, montre qu\'elle n\'est presque jamais un problème de gestion du temps : ${s >= 60 ? 'c\'est une gestion des émotions difficiles, et les tiennes semblent particulièrement sollicitées ces derniers temps' : s >= 30 ? 'c\'est une gestion des émotions difficiles, que tu sembles gérer avec des hauts et des bas' : 'c\'est une gestion des émotions difficiles, que tu sembles plutôt bien réguler pour l\'instant'}.`,
      `${s >= 60 ? 'Le perfectionnisme paralysant et la peur de l\'échec reviennent souvent ensemble dans ce genre de profil' : s >= 30 ? 'On voit poindre, par endroits, un peu de perfectionnisme ou de peur du jugement' : 'Le perfectionnisme et la peur du jugement ne semblent pas te freiner outre mesure'} : plus la barre est haute, plus il devient tentant de ne pas s\'y frotter du tout.`,
      `Ce qui est intéressant, c\'est que ${s >= 60 ? 'ce n\'est presque jamais la peur de l\'échec seule qui freine le plus fort : c\'est souvent la peur du succès et de ce qu\'il exigerait ensuite' : s >= 30 ? 'la peur du succès pointe parfois le bout de son nez, sans prendre toute la place' : 'la réussite ne semble pas représenter, pour toi, une menace inconsciente'}.`,
      `Vu de l\'extérieur, quelqu\'un qui obtient un score bas continue d\'agir même dans l\'incertitude, sans attendre la garantie de réussir — c\'est ${s >= 60 ? 'exactement ce qui te manque le plus en ce moment' : s >= 30 ? 'quelque chose que tu fais déjà, par intermittence' : 'une force que tu sembles déjà posséder'}.`,
      `Sur la durée, ${s >= 60 ? 'ce schéma peut coûter cher : des opportunités qu\'on ne saisit pas, des relations qu\'on tient à distance, une énergie épuisée à lutter contre soi-même' : s >= 30 ? 'ce genre de petits freins peut ralentir ta progression sans jamais l\'arrêter complètement' : 'garder cette dynamique t\'évite bien des détours inutiles'}.`,
      `La bonne nouvelle, documentée par la recherche sur le sujet, c\'est que ${s >= 60 ? 'ces schémas se sont appris, ce qui veut dire qu\'ils peuvent aussi se désapprendre, un petit pas après l\'autre' : s >= 30 ? 'ces réflexes perdent de leur pouvoir dès qu\'on commence simplement à les repérer' : 'cette dynamique se renforce encore quand on continue à la nourrir consciemment'}.`,
      `Ce quiz n\'est pas un verdict, c\'est un point de départ : ${s >= 60 ? 'tu as maintenant un nom à mettre sur ce qui te freinait dans l\'ombre, et c\'est déjà une victoire' : s >= 30 ? 'tu sais désormais où regarder en priorité pour avancer plus librement' : 'tu as la confirmation d\'une base solide sur laquelle continuer à construire'}.`,
    ],
    'role-familial': (s) => [
      `Ton score de ${s}% suggère ${s >= 60 ? 'que tu as endossé, enfant, un rôle bien plus lourd que celui d\'un simple enfant' : s >= 30 ? 'que tu as développé de solides réflexes d\'adaptation et de médiation dans ta famille' : 'que tu as globalement pu grandir sans avoir à porter un rôle d\'adulte trop tôt'}.`,
      `${s >= 60 ? 'Ce rôle ne t\'a pas été imposé par méchanceté : il s\'est construit en silence, question après question, pour combler un vide ou apaiser une tension que personne d\'autre ne gérait' : s >= 30 ? 'Ce réflexe s\'est construit doucement, à force de sentir que certaines choses passaient mieux si tu les facilitais un peu' : 'Cette liberté ne veut pas dire que tout était simple, mais que tu n\'as pas eu à sacrifier ton enfance pour maintenir un équilibre familial'}.`,
      `Dans tes relations aujourd\'hui, ${s >= 60 ? 'tu es probablement celui ou celle qui écoute, porte, rassure — parfois au point d\'oublier de demander la même chose en retour' : s >= 30 ? 'tu as tendance à veiller sur l\'ambiance et à t\'adapter, parfois plus que nécessaire' : 'tu arrives en général à donner et recevoir de façon assez équilibrée'}.`,
      `Côté travail ou ambitions, ${s >= 60 ? 'ta valeur s\'est peut-être longtemps mesurée à ce que tu accomplis ou à qui tu rends service, plutôt qu\'à qui tu es simplement' : s >= 30 ? 'tu ressens parfois le besoin de bien faire pour éviter la moindre friction ou déception' : 'tu vis assez sereinement les hauts et les bas, sans qu\'ils ne remettent en cause ta valeur personnelle'}.`,
      `Sur la question des limites, ${s >= 60 ? 'dire non reste sans doute un vrai effort, comme si refuser risquait de décevoir ou de faire retomber un équilibre fragile' : s >= 30 ? 'poser une limite demande encore un petit effort conscient, surtout avec les personnes proches' : 'tu poses tes limites assez naturellement, sans culpabilité excessive'}.`,
      `Quant au repos ou à demander de l\'aide, ${s >= 60 ? 'l\'idée de "ne rien faire" ou de te reposer sur quelqu\'un d\'autre peut réveiller une culpabilité diffuse, comme si tu devais toujours être utile pour avoir ta place' : s >= 30 ? 'tu peux ressentir une petite gêne à recevoir sans donner quelque chose en retour' : 'tu sembles capable de recevoir de l\'aide et du repos sans que cela ne te pèse'}.`,
      `Face au conflit, ${s >= 60 ? 'ton corps a probablement appris à l\'anticiper et à le désamorcer avant même qu\'il n\'éclate, un réflexe de vigilance qui a pu te protéger mais qui t\'épuise aussi' : s >= 30 ? 'tu préfères souvent l\'éviter ou l\'adoucir plutôt que de l\'affronter frontalement' : 'tu peux généralement l\'aborder sans que cela ne devienne une menace intérieure'}.`,
      `Ce qui est important à comprendre : ${s >= 60 ? 'ce rôle que tu as tenu était une adaptation intelligente à ton environnement d\'enfant, pas un trait de caractère figé — et il n\'a jamais été de ta faute' : s >= 30 ? 'ces habitudes sont des ajustements appris, pas une part fixe de ta personnalité' : 'même sans avoir eu à porter un rôle lourd, chacun garde des réflexes hérités de son enfance qui méritent d\'être observés avec douceur'}.`,
      `La bonne nouvelle, c\'est que ${s >= 60 ? 'ce que tu as appris à faire si jeune peut aussi s\'apprendre à se déposer, petit à petit, avec de la pratique et de la patience envers toi-même' : s >= 30 ? 'ce pli reste encore souple : quelques prises de conscience suffisent souvent à retrouver un bel équilibre entre prendre soin des autres et de toi-même' : 'cette base solide peut continuer à se renforcer, en restant attentif(ve) aux petits réflexes hérités malgré tout'}.`,
      `Ton rôle familial n\'est pas une sentence : c\'est une histoire que tu peux continuer à réécrire, un peu plus chaque jour, en te laissant enfin le droit d\'exister sans avoir à jouer un rôle pour ça.`,
    ],
    amoureux: (s) => [
      `Ton score de ${s}% indique ${s >= 70 ? 'des sentiments amoureux profonds et réels' : s >= 40 ? 'des sentiments forts mais peut-être encore en développement' : 'une affection sincère mais différente de l\'amour romantique'}.`,
      `${s >= 60 ? 'Les émotions que tu ressens correspondent à ce que les psychologues appellent l\'amour véritable.' : 'Ce que tu ressens pourrait être de l\'affection profonde ou une amitié forte.'}`,
      `La présence de cette personne dans tes pensées ${s >= 60 ? 'est un signe clair d\'attachement romantique.' : 'montre que tu y tiens, sans que ce soit nécessairement de l\'amour.'}`,
      `${s >= 70 ? 'Tes sentiments semblent solides et dignes d\'être exprimés.' : 'Prendre du temps pour clarifier tes émotions est une bonne idée.'}`,
      `L\'amour véritable se reconnaît souvent à la façon dont on pense à l\'autre même dans les moments ordinaires.`,
      `${s >= 60 ? 'Cette personne occupe une place très particulière dans ta vie.' : 'Cette relation compte pour toi, quel qu\'en soit le nom.'}`,
      `Exprimer ses sentiments, même avec le risque du rejet, est une preuve de courage.`,
      `${s >= 70 ? 'Le moment est peut-être venu de franchir ce pas.' : 'Être honnête avec toi-même sur ce que tu ressens est la première étape.'}`,
      `Les grandes histoires commencent souvent par une conversation sincère.`,
      `Tu mérites de vivre tes émotions pleinement, quelles qu\'elles soient.`,
    ],
    'vrais-amis': (s) => [
      `Ton score de ${s}% indique que cette relation ${s >= 60 ? 'présente des signaux préoccupants qui méritent attention' : s >= 30 ? 'a quelques imperfections normales' : 'est généralement saine et équilibrée'}.`,
      `${s >= 60 ? 'Les comportements que tu décris sont caractéristiques des relations toxiques.' : 'Toute amitié traverse des moments difficiles.'}`,
      `Un(e) vrai(e) ami(e) ${s >= 60 ? 'ne devrait pas te faire te sentir comme tu le décris.' : 'n\'est pas parfait(e), mais son intention est bonne.'}`,
      `${s >= 50 ? 'Il peut être utile de prendre du recul et d\'évaluer ce que cette relation t\'apporte vraiment.' : 'Cette relation semble t\'apporter des choses positives dans l\'ensemble.'}`,
      `Les amitiés saines sont celles où les deux parties se sentent valorisées et respectées.`,
      `${s >= 60 ? 'Tu mérites des personnes qui t\'élèvent, pas qui te tirent vers le bas.' : 'Chérir les bonnes amitiés est essentiel pour ton bien-être.'}`,
      `Parler directement à cette personne de ce que tu ressens peut transformer la relation.`,
      `${s >= 70 ? 'Prendre ses distances peut parfois être le choix le plus sain.' : 'Investir dans les amitiés qui te font du bien est toujours bénéfique.'}`,
      `La qualité des amitiés a un impact direct sur ta santé mentale et ton bonheur.`,
      `Tu mérites d\'être entouré(e) de personnes authentiques qui t\'acceptent tel(le) que tu es.`,
    ],
    'intelligence-emotionnelle': (s) => [
      `Ton score de ${s}% indique ${s >= 80 ? 'une intelligence émotionnelle déjà très affirmée, portée par une bonne connaissance de toi-même' : s >= 60 ? 'une intelligence émotionnelle solide, avec une vraie marge de perfectionnement' : s >= 40 ? 'une intelligence émotionnelle en cours d\'équilibrage, entre forces et zones encore fragiles' : s >= 20 ? 'une intelligence émotionnelle qui commence tout juste à se structurer' : 'une intelligence émotionnelle encore peu explorée, mais avec un vrai potentiel de progression'}.`,
      `${s >= 60 ? 'Ta conscience de toi-même semble être l\'un de tes points forts : tu arrives à identifier ce que tu ressens la plupart du temps' : 'Ta conscience de toi-même a probablement encore besoin d\'être affinée : les émotions te traversent parfois sans que tu aies le temps de les nommer'} — un simple carnet émotionnel tenu quelques semaines peut considérablement accélérer ce travail.`,
      `${s >= 60 ? 'Ta capacité à te réguler sous pression semble déjà bien développée, ce qui t\'évite bien des débordements inutiles' : 'Ta régulation émotionnelle est probablement ton principal levier de progression : le temps entre ce que tu ressens et ce que tu fais peut encore s\'élargir'} — la respiration consciente ou la règle des dix minutes avant de répondre à chaud sont des outils redoutablement efficaces ici.`,
      `${s >= 60 ? 'Ta motivation intrinsèque et ta résilience face à l\'échec sont probablement des atouts naturels chez toi' : 'Ta motivation a tendance à fluctuer fortement selon les résultats obtenus, ce qui peut freiner ta progression sur le long terme'} — reconnecter régulièrement à ton "pourquoi" profond t\'aidera à tenir le cap.`,
      `${s >= 60 ? 'Ton empathie semble bien développée : tu perçois généralement assez finement ce que vivent les autres' : 'Ton empathie gagnerait à être davantage entraînée : les signaux émotionnels des autres t\'échappent parfois'} — la prochaine fois qu\'un proche te parle, essaie de nommer intérieurement l\'émotion qu\'il traverse avant de répondre.`,
      `${s >= 60 ? 'Tes compétences sociales te permettent probablement de bien gérer les désaccords et d\'entraîner les autres avec toi' : 'Tes compétences sociales pourraient encore progresser, en particulier dans la gestion des conflits ou des désaccords'} — apprendre à formuler tes besoins clairement, sans agressivité ni retrait, est le levier le plus rapide ici.`,
      `Si un domaine ressort probablement comme ta plus grande force, c\'est ${s >= 70 ? 'ta conscience de toi-même, combinée à ta capacité à rester motivé face aux obstacles' : s >= 40 ? 'ta capacité à percevoir les émotions des autres, même quand la régulation de tes propres réactions reste perfectible' : 'ta capacité à ressentir intensément, même si tu manques encore d\'outils pour canaliser cette intensité'}.`,
      `À l\'inverse, ${s >= 70 ? 'le raffinement de tes compétences sociales dans les situations à très fort enjeu reste ta marge de progression la plus fine' : s >= 40 ? 'la gestion de tes réactions impulsives sous pression reste probablement ton chantier prioritaire' : 'nommer précisément tes émotions au moment où elles surviennent constitue ton chantier prioritaire'}.`,
      `Un exercice simple et puissant à pratiquer cette semaine : avant de réagir à une situation qui te contrarie, compte jusqu\'à dix secondes et nomme intérieurement l\'émotion exacte que tu ressens.`,
      `Quel que soit ton score aujourd\'hui, retiens ceci : l\'intelligence émotionnelle n\'est pas un trait figé mais une compétence qui se muscle avec la pratique — et le simple fait d\'avoir fait ce test montre déjà une vraie envie de mieux te comprendre.`,
    ],
    'tourner-la-page': (s) => [
      `Ton score de ${s}% indique ${s < 30 ? 'un deuil déjà largement apaisé, où le souvenir ne pèse presque plus sur ton présent' : s < 60 ? 'un processus de deuil encore actif, entre acceptation et rechutes émotionnelles ponctuelles' : 'un attachement encore très présent, qui continue d\'influencer ton quotidien'}.`,
      `Le deuil amoureux suit rarement une ligne droite : déni, colère, marchandage, tristesse et acceptation peuvent revenir plusieurs fois, dans le désordre, parfois le même jour.`,
      `Ce qui distingue un chagrin sain d\'un chagrin qui s\'enkyste, ce n\'est pas l\'intensité de la douleur, mais sa capacité à évoluer avec le temps.`,
      `La rumination — repasser sans cesse les mêmes scènes ou les mêmes questions sans jamais avancer — est le mécanisme qui, selon la recherche en psychologie, entretient le plus la tristesse au lieu de la résoudre.`,
      `Vérifier les réseaux sociaux d\'un(e) ex active le même circuit que la recherche compulsive : chaque coup d\'œil promet un soulagement qu\'il ne procure jamais vraiment.`,
      `Idéaliser la relation passée est une façon naturelle du cerveau d\'adoucir la perte, mais quand elle efface totalement les raisons de la rupture, elle retarde la reconstruction.`,
      `Un attachement qui perdure n\'est pas une preuve d\'amour raté : c\'est souvent le signe d\'un lien resté "en suspens", ce que les psychologues appellent une affaire non résolue.`,
      `Les actions concrètes qui aident réellement : limiter l\'exposition à ses réseaux, en parler à voix haute plutôt que de ruminer en silence, et se reconnecter à des activités qui n\'appartenaient qu\'à toi.`,
      `Se sentir mieux ne veut pas dire ne plus jamais y penser : c\'est pouvoir y penser sans que ça dirige ta journée, ton sommeil ou tes choix.`,
      `Où que tu en sois aujourd\'hui, tu gardes le pouvoir d\'orienter ce processus : chaque petit choix conscient te rapproche un peu plus de toi-même.`,
    ],
    'schema-amoureux': (s) => [
      `Ton score de ${s}% indique ${s >= 70 ? 'un schéma amoureux répétitif bien installé' : s >= 40 ? 'un schéma qui commence à se dessiner clairement' : 'un mode de choix globalement sain, avec quelques réflexes familiers'}.`,
      `${s >= 60 ? 'Ce que tu appelles "alchimie" ressemble beaucoup à un sentiment de familiarité hérité de ton histoire, pas seulement à une compatibilité réelle.' : 'Tes réponses montrent que l\'attirance immédiate ne prend pas toujours le pas sur ce qui est bon pour toi.'}`,
      `Ce schéma n\'est ni un hasard ni un défaut de caractère : c\'est une dynamique apprise, souvent très tôt, dans une relation qui comptait pour toi.`,
      `${s >= 60 ? 'Le rôle que tu joues le plus souvent — sauveur/sauveuse, celui/celle qui attend, celui/celle qui donne plus — n\'est probablement pas un hasard.' : 'Tu gardes une capacité précieuse à repérer les signaux qui comptent vraiment.'}`,
      `La psychologie appelle ça la "répétition" : le cerveau recrée inconsciemment une dynamique familière, même douloureuse, parce qu\'elle est reconnaissable.`,
      `${s >= 50 ? 'Le prix de ce schéma se paie souvent en énergie, en attente, et en relations qui demandent beaucoup pour donner peu en retour.' : 'Continuer à observer tes réactions face à la stabilité t\'aidera à consolider ce qui fonctionne déjà bien.'}`,
      `Le signal à observer en priorité : ce moment précis où une personne stable et disponible commence, sans raison claire, à t\'ennuyer.`,
      `${s >= 60 ? 'Ce schéma peut se transformer — pas en une nuit, mais avec de la conscience et parfois un accompagnement spécialisé sur l\'attachement.' : 'Ta vigilance actuelle est un vrai atout : continue à questionner ce qui t\'attire et pourquoi.'}`,
      `Reconnaître un schéma ne veut pas dire se blâmer — c\'est justement ce qui permet de lui retirer son pouvoir automatique.`,
      `Tu ne choisis pas qui t\'attire au premier regard, mais tu choisis ce que tu fais de cette attirance. C\'est là que commence le changement.`,
    ],
  };

  const lines = baseLines[quiz.slug]?.(score) ?? [
    `Ton score de ${score}% reflète honnêtement tes réponses.`,
    `Cette analyse est basée sur ${quiz.questions.length} questions soigneusement calibrées.`,
    `Le résultat "${tierTitle}" correspond à un profil précis.`,
    `${high ? 'Les signaux identifiés sont significatifs.' : mid ? 'Quelques éléments méritent attention.' : 'La situation semble saine dans l\'ensemble.'}`,
    `Prendre du recul aide toujours à mieux évaluer une situation.`,
    `La communication est souvent la clé pour résoudre les doutes.`,
    `${high ? 'N\'hésite pas à chercher du soutien autour de toi.' : 'Continue à faire confiance à ton instinct.'}`,
    `Ton ressenti compte autant que les faits objectifs.`,
    `Les relations humaines sont complexes et évoluent constamment.`,
    `Tu mérites de te sentir bien dans toutes tes relations.`,
  ];

  return lines;
}

export default function ResultsClient({ quiz }: Props) {
  const searchParams = useSearchParams();
  const rawScore = parseInt(searchParams.get('score') ?? '0', 10);
  const score = Math.max(0, Math.min(100, rawScore));

  const { data: session, status } = useSession();
  const isPremium = ['premium', 'plus'].includes((session?.user as { tier?: string } | undefined)?.tier ?? '');
  const sessionLoading = status === 'loading';
  const [isInApp] = useState(() => detectInAppBrowser());

  const tier = getResultTier(quiz, score);

  const [strokeOffset, setStrokeOffset] = useState(CIRCUMFERENCE);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [shareId, setShareId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authSent, setAuthSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authOtp, setAuthOtp] = useState('');
  const [authOtpError, setAuthOtpError] = useState('');
  const [authOtpLoading, setAuthOtpLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitCountdown, setExitCountdown] = useState(30);
  const hasSaved = useRef(false);
  const pendingCheckoutRef = useRef(false);
  const exitTriggered = useRef(false);
  const paywallRef = useRef<HTMLDivElement>(null);

  const analysis = buildAnalysis(quiz, score, tier.title);

  const partialScore = score >= 100 ? '9?%' : score >= 10 ? `${Math.floor(score / 10)}?%` : '?%';

  function trackEvent(event: 'paywall_view' | 'checkout_click' | 'payment_success') {
    track(event, { quiz: quiz.slug, content_name: quiz.title });
  }

  const PAYWALL_CONFIG: Record<string, { headline: string; subline: string; social: string }> = {
    'auto-sabotage': {
      headline: score >= 60
        ? 'Ce que ton schéma d\'auto-sabotage cache vraiment'
        : score >= 30
        ? 'Le détail qui explique pourquoi tu freines à ce moment précis'
        : 'Ce qui pourrait encore te faire trébucher, même à ce niveau',
      subline: "Ton rapport complet détaille, question par question, où et pourquoi tu te mets des bâtons dans les roues — et surtout, comment commencer à les retirer.",
      social: "1 214 personnes ont commencé à démêler leur schéma d'auto-sabotage cette semaine",
    },
    'role-familial': {
      headline: score >= 60
        ? 'Le rôle que tu as appris à jouer enfant a un nom — et il explique beaucoup de choses aujourd\'hui'
        : score >= 30
        ? 'Ton rôle familial commence à se dessiner — découvre ce qu\'il révèle vraiment de toi'
        : 'Découvre le rôle discret que tu as peut-être joué, sans même t\'en rendre compte',
      subline: "Ton résultat complet détaille le rôle précis que tu as adopté (héros, médiateur, enfant invisible, bouc émissaire, boute-en-train...), comment il s'est construit, et comment le desserrer en douceur.",
      social: "5 270 personnes ont découvert leur rôle familial caché ce mois-ci",
    },
    amoureux: {
      headline: score >= 70
        ? "Ce que tu ressens pour cette personne n'est pas de l'amitié — l'analyse identifie précisément ce que c'est."
        : score >= 40
        ? "Tes sentiments sont à mi-chemin entre l'attachement et l'amour — l'analyse fait la distinction."
        : "L'analyse te dit exactement pourquoi ce que tu ressens te semble flou.",
      subline: score >= 60
        ? "Il y a une question que tu n'oses pas te poser — tes réponses y ont déjà répondu."
        : "Nommer ce qu'on ressent, c'est 50 % du chemin vers savoir quoi faire.",
      social: "2 841 personnes ont mis un mot sur leurs sentiments cette semaine",
    },
    'vrais-amis': {
      headline: score >= 60
        ? "Au moins trois des comportements que tu décris ne font pas partie d'une amitié saine."
        : score >= 30
        ? "L'analyse identifie le point de friction principal dans cette amitié."
        : "L'analyse confirme ce que tu ressens — et nomme ce qui rend cette amitié solide.",
      subline: score >= 60
        ? "L'analyse te dit quel comportement est le plus problématique — et lequel tu minimises probablement."
        : "Savoir exactement sur qui compter, ça change la façon dont on investit dans ses relations.",
      social: "2 063 personnes ont réévalué une amitié cette semaine",
    },
    'intelligence-emotionnelle': {
      headline: score >= 60
        ? `Avec ${score}%, découvre quel pilier de ton intelligence émotionnelle est ton plus grand atout — et lequel mérite encore ton attention`
        : `Avec ${score}%, découvre quel pilier de ton intelligence émotionnelle freine le plus ta progression — et comment le renforcer`,
      subline: "Ton profil détaillé révèle, pilier par pilier, où tu excelles déjà et ce qui peut faire la plus grande différence pour toi.",
      social: "1 847 professionnels ont découvert leur profil d'intelligence émotionnelle cette semaine",
    },
    'tourner-la-page': {
      headline: score < 30
        ? 'Découvre ce que ton profil révèle sur ta façon unique de guérir'
        : score < 60
        ? 'Découvre les schémas précis qui te maintiennent encore attaché(e)'
        : 'Découvre ce que ton cœur essaie encore de te dire',
      subline: score < 30
        ? "Ton analyse complète détaille tes forces émotionnelles et les points de vigilance pour ne jamais régresser."
        : score < 60
        ? "Ton analyse complète identifie les déclencheurs exacts qui te font encore replonger, et comment les désamorcer un par un."
        : "Ton analyse complète met des mots sur ce qui te retient, et te propose un premier pas concret pour commencer à te libérer.",
      social: "2 847 personnes ont commencé à tourner la page cette semaine",
    },
    'schema-amoureux': {
      headline: score >= 70
        ? "L'analyse a isolé le schéma précis que tu répètes à chaque relation — et le rôle exact que tu y joues."
        : score >= 40
        ? "Deux réponses précises révèlent le type de personne vers lequel tu es attiré(e) sans t'en rendre compte."
        : "L'analyse confirme que ton mode de choix est globalement sain — avec un seul réflexe hérité à surveiller.",
      subline: score >= 60
        ? "Ce schéma a une origine précise dans ton histoire — l'analyse la nomme, sans jugement."
        : "Comprendre le petit réflexe qui subsiste, c'est s'assurer qu'il ne prenne jamais le dessus.",
      social: "3 482 personnes ont identifié leur schéma amoureux cette semaine",
    },
    personnalite: {
      headline: `Ton profil contient une information que la majorité des tests MBTI ne révèlent jamais : la version de toi qui émerge sous stress, en amour ou dans le conflit.`,
      subline: `Chaque type a une "face cachée" — un mode secondaire qui détermine tes vraies réactions. L'analyse nomme la tienne avec précision.`,
      social: `7 241 personnes ont découvert leur profil exact cette semaine`,
    },
  };
  const pw = PAYWALL_CONFIG[quiz.slug] ?? {
    headline: score >= 60
      ? "L'analyse a identifié le pattern principal dans tes réponses — il est plus précis que tu ne le crois."
      : "Tes réponses dessinent un profil précis — l'analyse le nomme.",
    subline: "Ce que tu as répondu pointe vers quelque chose de spécifique. L'analyse le formule clairement.",
    social: "Des milliers de personnes ont découvert leur profil cette semaine",
  };

  // ── Teaser hooks: one real insight cut before the key conclusion ──
  const TEASER_HOOKS: Record<string, (s: number) => { intro: string; cut: string; locked: string[] }> = {
    'auto-sabotage': (s) => ({
      intro: s >= 60
        ? `Une chose saute aux yeux dans tes réponses : ce n'est pas au moment de commencer que tu te freines le plus, c'est juste avant d'y arriver vraiment. Ce timing précis n'est pas un hasard.`
        : s >= 30
        ? `Tes réponses dessinent un schéma plus subtil qu'il n'y paraît : tu n'évites pas tout, mais certaines situations précises déclenchent chez toi un frein presque automatique. On a identifié laquelle.`
        : `Tes réponses montrent une base solide, mais une ou deux zones restent des angles morts, là où même les profils sains gardent une vulnérabilité discrète.`,
      cut: s >= 60
        ? `Ce frein qui s'active pile avant la ligne d'arrivée porte un nom en psychologie…`
        : s >= 30
        ? `La situation précise qui te fait basculer du côté du frein, elle…`
        : `Le seul angle mort qu'il te reste à surveiller…`,
      locked: [
        `🔒 Le moment exact (avant, pendant ou après) où ton auto-sabotage s'active le plus`,
        `🔒 Ton profil dominant parmi procrastination, perfectionnisme, peur de réussir et paralysie décisionnelle`,
        `🔒 3 leviers concrets, adaptés à ton profil, pour désamorcer le mécanisme dès cette semaine`,
        `🔒 La phrase exacte à te dire — et celle à arrêter de te dire — au moment où le frein s'active`,
      ],
    }),
    'role-familial': (s) => ({
      intro: s >= 60
        ? `Tu as probablement appris, très jeune, à porter des choses qui ne t'appartenaient pas encore…`
        : s >= 30
        ? `Une partie de toi a appris à lisser, à adoucir, à sentir venir les tempêtes avant les autres…`
        : `Tu sembles avoir grandi avec une belle liberté, mais certains détails de tes réponses racontent une autre nuance…`,
      cut: s >= 60
        ? `Ton résultat montre notamment pourquoi demander de l'aide te coûte autant…`
        : s >= 30
        ? `Ton résultat révèle comment ce réflexe de médiation influence encore tes choix relationnels aujourd'hui…`
        : `Ton résultat pointe un petit schéma hérité que tu n'avais peut-être jamais remarqué…`,
      locked: [
        `🔒 Le nom précis du rôle familial que tu as développé, et son origine probable`,
        `🔒 Comment ce rôle se rejoue aujourd'hui dans tes relations amoureuses et amicales`,
        `🔒 La croyance intérieure qui s'est installée avec ce rôle`,
        `🔒 Trois pistes concrètes pour commencer à déposer ce rôle sans culpabiliser`,
      ],
    }),
    amoureux: (s) => ({
      intro: s >= 70
        ? `Tes réponses contiennent un schéma que les psychologues associent à l'attachement romantique réel — pas à l'admiration, pas à l'habitude. La différence tient à trois types de réponses que tu as données.`
        : s >= 40
        ? `Ce que tu ressens oscille entre l'attachement profond et quelque chose de plus. L'analyse identifie exactement à quel stade tu en es — et ce que ça signifie pour la suite.`
        : `L'analyse explique pourquoi ce que tu ressens te semble difficile à nommer — et te donne le mot juste.`,
      cut: s >= 40
        ? `La réponse qui a le plus pesé dans ton score est celle où tu as dit que…`
        : `Ce que tes réponses révèlent sur la nature de tes sentiments, c'est…`,
      locked: [
        `🔒 Ton score exact : ${partialScore.replace('?', 'X')}`,
        `🔒 Si c'est vraiment de l'amour ou autre chose`,
        `🔒 Le signal émotionnel le plus fort dans tes réponses`,
        `🔒 Quoi faire — et quand`,
      ],
    }),
    'vrais-amis': (s) => ({
      intro: s >= 60
        ? `L'analyse repère trois comportements dans ce que tu décris qui ne font pas partie d'une amitié saine. Le plus problématique n'est pas forcément celui que tu penses.`
        : s >= 30
        ? `Toute amitié a ses zones d'ombre — mais l'analyse identifie si ce que tu décris est de la normale ou un pattern qui mérite attention.`
        : `Les réponses que tu as données dessinent une amitié globalement solide. L'analyse identifie son vrai point fort — et son unique point faible.`,
      cut: s >= 40
        ? `Le comportement qui a le plus impacté ton score, c'est le fait que cette personne…`
        : `Ce qui rend cette amitié résiliente selon tes réponses, c'est…`,
      locked: [
        `🔒 Ton score exact : ${partialScore.replace('?', 'X')}`,
        `🔒 Le comportement le plus révélateur de cette personne`,
        `🔒 Si tu minimises ou surestimes le problème`,
        `🔒 Ce qu'une amitié saine devrait ressembler dans ton cas`,
      ],
    }),
    'intelligence-emotionnelle': (s) => ({
      intro: s >= 60
        ? `Ton score de ${s}% révèle une vraie force du côté de ta conscience de toi-même — mais un des cinq piliers de Goleman ressort clairement comme ton point de vigilance…`
        : `Ton score de ${s}% montre que tes émotions prennent parfois le dessus avant que tu aies pu les canaliser — et un pilier précis explique une grande partie de ce phénomène…`,
      cut: `Le pilier qui explique le plus ton comportement en situation de stress est…`,
      locked: [
        `🔒 Ton profil détaillé sur les 5 piliers de Goleman (conscience de soi, maîtrise de soi, motivation, empathie, compétences sociales)`,
        `🔒 Le pilier qui est aujourd'hui ta plus grande force émotionnelle`,
        `🔒 Le pilier qui freine le plus ta progression, et pourquoi`,
        `🔒 Un plan d'action personnalisé pour progresser sur 30 jours`,
      ],
    }),
    'tourner-la-page': (s) => ({
      intro: s < 30
        ? `Ton résultat montre une chose rare : ta nostalgie ne se transforme presque jamais en rumination…`
        : s < 60
        ? `Ton résultat révèle un déclencheur précis qui réactive ta rumination plus que tout le reste…`
        : `Ton résultat montre que ton corps porte encore cette histoire bien plus que tu ne l'admets consciemment…`,
      cut: `et ça change tout sur la façon dont tu devrais aborder les prochaines semaines…`,
      locked: [
        `🔒 Le schéma exact qui active ta rumination (et comment le couper net)`,
        `🔒 Ce que ton comportement sur les réseaux sociaux révèle vraiment`,
        `🔒 Le lien entre ton sommeil actuel et ton attachement émotionnel`,
        `🔒 Une action concrète adaptée à ton stade de deuil, à commencer dès aujourd'hui`,
      ],
    }),
    'schema-amoureux': (s) => ({
      intro: s >= 70
        ? `Trois réponses que tu as données forment un schéma cohérent : un même type de partenaire revient, avec le même rôle pour toi à chaque fois.`
        : s >= 40
        ? `Une dynamique commence à se répéter dans tes réponses, en particulier autour de la disponibilité émotionnelle de tes partenaires.`
        : `Tes réponses montrent un mode de choix globalement sain — mais un réflexe précis, hérité, mérite d'être repéré avant qu'il ne prenne plus de place.`,
      cut: s >= 40
        ? `Le type de personne que tu choisis presque systématiquement, c'est…`
        : `Le seul réflexe hérité que tes réponses laissent voir, c'est…`,
      locked: [
        `🔒 Ton score exact : ${partialScore.replace('?', 'X')}`,
        `🔒 Le profil type de la personne vers laquelle tu es attiré(e)`,
        `🔒 D'où vient ce schéma dans ton histoire`,
        `🔒 Comment reconnaître (et interrompre) le pattern la prochaine fois`,
      ],
    }),
    personnalite: () => ({
      intro: `Ton profil révèle une tension entre deux fonctions cognitives que la plupart des gens ne distinguent jamais. Ce n'est pas juste 4 lettres — c'est un système entier qui explique pourquoi tu réagis comme tu le fais dans les situations qui comptent vraiment.`,
      cut: `La fonction que tu utilises réellement en premier (pas celle que tu crois) est…`,
      locked: [
        `🔒 Tes 4 lettres confirmées + ton niveau de certitude`,
        `🔒 Ta fonction cognitive dominante réelle`,
        `🔒 Ton profil "sous pression" — le toi qui émerge dans le stress ou en amour`,
        `🔒 Tes 3 compatibilités les plus inattendues`,
      ],
    }),
  };
  const teaser = TEASER_HOOKS[quiz.slug]?.(score) ?? {
    intro: score >= 60
      ? `L'analyse a identifié un pattern cohérent dans tes réponses. Ce pattern pointe vers quelque chose de précis — pas une généralité.`
      : `Tes réponses dessinent un profil spécifique. L'analyse le formule avec des mots que tu n'aurais peut-être pas utilisés toi-même.`,
    cut: `Ce que tes réponses révèlent de plus précis, c'est…`,
    locked: [
      `🔒 Ton score exact : ${partialScore.replace('?', 'X')}`,
      `🔒 Le point principal de ton profil`,
      `🔒 Ce que la plupart des gens ne voient pas dans leurs propres réponses`,
      `🔒 Les recommandations personnalisées`,
    ],
  };


  useEffect(() => {
    if (hasSaved.current) return;
    hasSaved.current = true;
    fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizSlug: quiz.slug, score }),
    })
      .then((r) => r.json())
      .then((data: { id?: string }) => { if (data.id) setShareId(data.id); })
      .catch(() => {});
  }, [quiz.slug, score]);

  useEffect(() => {
    const t = setTimeout(() => setStrokeOffset(CIRCUMFERENCE * (1 - score / 100)), 300);
    return () => clearTimeout(t);
  }, [score]);

  // Count-up the real score for the reveal moment — the dopamine they earned
  useEffect(() => {
    if (sessionLoading) return;
    let raf = 0;
    let start: number | null = null;
    const dur = 1400;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimatedScore(Math.round(eased * score));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score, sessionLoading]);

  // Track paywall impression once per session
  useEffect(() => {
    if (isPremium || sessionLoading) return;
    try {
      const key = `pw_seen_${quiz.slug}`;
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        trackEvent('paywall_view');
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPremium, sessionLoading]);

  // Exit intent — desktop (mouse leaves top) + mobile (tab switch)
  useEffect(() => {
    if (isPremium || sessionLoading) return;
    const trigger = () => {
      if (!exitTriggered.current) {
        exitTriggered.current = true;
        setShowExitModal(true);
      }
    };
    const onMouseLeave = (e: MouseEvent) => { if (e.clientY <= 0) trigger(); };
    const onVisibility = () => { if (document.visibilityState === 'hidden') trigger(); };
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isPremium, sessionLoading]);

  // Exit modal countdown
  useEffect(() => {
    if (!showExitModal) return;
    setExitCountdown(30);
    const id = setInterval(() => {
      setExitCountdown((prev) => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [showExitModal]);

  // After returning from OAuth/magic-link, auto-trigger checkout if user had clicked pay
  useEffect(() => {
    if (!session?.user || pendingCheckoutRef.current) return;
    let flag = false;
    let checkoutType = 'sub';
    try {
      flag = sessionStorage.getItem('pending_checkout') === '1';
      checkoutType = sessionStorage.getItem('pending_checkout_type') ?? 'sub';
    } catch {}
    if (!flag) return;
    try {
      sessionStorage.removeItem('pending_checkout');
      sessionStorage.removeItem('pending_checkout_type');
    } catch {}
    pendingCheckoutRef.current = true;
    if ((session.user as { tier?: string }).tier !== 'premium') {
      if (checkoutType === 'onetime') {
        void doOneTimeCheckout(session.user.email ?? undefined);
      } else {
        void doCheckout(session.user.email ?? undefined);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);

  async function doCheckout(email?: string) {
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId: shareId,
          quizSlug: quiz.slug,
          score,
          origin: window.location.origin,
          userEmail: email ?? session?.user?.email ?? undefined,
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? 'Erreur de paiement');
        setIsCheckingOut(false);
      }
    } catch {
      alert('Erreur réseau. Réessaie.');
      setIsCheckingOut(false);
    }
  }

  async function doOneTimeCheckout(email?: string) {
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId: shareId,
          quizSlug: quiz.slug,
          score,
          origin: window.location.origin,
          userEmail: email ?? session?.user?.email ?? undefined,
          oneTime: true,
        }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? 'Erreur de paiement');
        setIsCheckingOut(false);
      }
    } catch {
      alert('Erreur réseau. Réessaie.');
      setIsCheckingOut(false);
    }
  }

  function handlePayClick() {
    trackEvent('checkout_click');
    void doCheckout(session?.user?.email ?? undefined);
  }

  function handleOneTimeClick() {
    trackEvent('checkout_click');
    void doOneTimeCheckout(session?.user?.email ?? undefined);
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '/';

  return (
    <main className="min-h-screen bg-[#09090b] flex flex-col relative overflow-hidden">

      {/* ContractScreen removed — results visible immediately after test */}

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: tier.glowColor }}
        />
      </div>

      {/* Exit intent modal */}
      {showExitModal && !isPremium && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(10px)' }}
        >
          <div className="w-full max-w-sm rounded-3xl p-6 border border-white/10" style={{ background: '#111113' }}>
            <div className="text-center mb-5">
              <div className="text-4xl mb-3">⏳</div>
              <h2 className="text-white font-black text-xl mb-1">Tu pars sans voir ton résultat ?</h2>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Ton analyse disparaît dans{' '}
                <span className="font-black tabular-nums" style={{ color: tier.glowColor }}>
                  {exitCountdown}s
                </span>
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowExitModal(false);
                  void (async () => {
                    setIsCheckingOut(true);
                    trackEvent('checkout_click');
                    const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quizSlug: quiz.slug, score, origin: window.location.origin, userEmail: session?.user?.email ?? undefined, annual: true }) });
                    const data = await res.json() as { url?: string; error?: string };
                    if (data.url) window.location.href = data.url; else { alert(data.error ?? 'Erreur de paiement'); setIsCheckingOut(false); }
                  })();
                }}
                disabled={isCheckingOut}
                className="w-full py-4 rounded-xl font-black text-white text-base transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #c2611f, #d17d52)', boxShadow: '0 4px 20px rgba(194,97,31,0.4)' }}
              >
                Tout débloquer — 29,99€/an ✦
              </button>
              <button
                onClick={() => { setShowExitModal(false); handleOneTimeClick(); }}
                disabled={isCheckingOut}
                className="w-full py-2.5 rounded-xl font-medium text-xs border transition-all disabled:opacity-60"
                style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#a1a1aa' }}
              >
                ou juste ce résultat pour 1,99€
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full py-2 text-xs text-zinc-700 hover:text-zinc-500 transition-colors"
              >
                Ignorer mon résultat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth modal */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAuthModal(false); }}
        >
          <div className="relative w-full max-w-sm rounded-2xl p-6 border border-white/10" style={{ background: '#111113' }}>
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors text-lg leading-none"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔐</div>
              <h2 className="text-white font-black text-xl mb-2">Crée ton compte d&apos;abord</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Pour ne pas perdre tes résultats — même si tu reviens dans une semaine.
              </p>
            </div>

            {/* Rappel garanti ici, indépendant du bandeau global (peut avoir
                été fermé plus tôt dans la session) — c'est précisément à cette
                étape que Google échoue dans ces navigateurs. */}
            {isInApp && (
              <div className="rounded-xl px-4 py-3 mb-5 text-left" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <p className="text-zinc-200 text-[12px] leading-snug">
                  📱 Pour te connecter sans souci : appuie sur <strong>⋯</strong> en haut à droite → <strong>&quot;Ouvrir dans le navigateur&quot;</strong>.
                </p>
              </div>
            )}

            {authSent ? (
              <div>
                <div className="text-center mb-5">
                  <div className="text-4xl mb-3">📬</div>
                  <h3 className="text-white font-bold text-lg mb-1">Ton code est arrivé</h3>
                  <p className="text-zinc-400 text-sm">
                    Envoyé à <span className="text-violet-400">{authEmail}</span> — valable 10 minutes.
                  </p>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const trimmed = authOtp.trim();
                    if (!trimmed) return;
                    setAuthOtpError('');
                    setAuthOtpLoading(true);
                    try {
                      const res = await fetch('/api/auth/verify-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: authEmail, code: trimmed, callbackUrl: currentUrl }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) {
                        setAuthOtpError(data.error ?? 'Code invalide.');
                        setAuthOtpLoading(false);
                        return;
                      }
                      try { sessionStorage.setItem('pending_checkout', '1'); } catch {}
                      // Navigation complète (pas router.push) : la page revient sur
                      // elle-même, il faut un vrai rechargement pour lire le cookie
                      // de session fraîchement posé et déclencher le checkout en attente.
                      window.location.href = data.loginUrl ?? currentUrl;
                    } catch {
                      setAuthOtpError('Erreur réseau, réessaie.');
                      setAuthOtpLoading(false);
                    }
                  }}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={authOtp}
                    onChange={(e) => { setAuthOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setAuthOtpError(''); }}
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-2xl text-center tracking-[0.4em] font-mono placeholder-zinc-700 outline-none focus:border-violet-500/60 transition-all"
                  />
                  {authOtpError && <p className="text-red-400 text-xs text-center font-medium">{authOtpError}</p>}
                  <button
                    type="submit"
                    disabled={authOtpLoading || authOtp.length < 6}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #c2611f, #d17d52)' }}
                  >
                    {authOtpLoading ? 'Vérification...' : '🔓 Me connecter →'}
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => { setAuthSent(false); setAuthOtp(''); setAuthOtpError(''); }}
                  className="w-full text-center text-xs text-zinc-500 hover:text-white mt-4"
                >
                  ← Changer d&apos;email
                </button>
              </div>
            ) : (
              <>
                {/* Google */}
                {/* Google bloque l'OAuth dans les navigateurs intégrés (TikTok,
                    Instagram...) — voir lib/inAppBrowser.ts */}
                {!isInApp ? (
                  <>
                    <button
                      onClick={() => {
                        try { sessionStorage.setItem('pending_checkout', '1'); } catch {}
                        void signIn('google', { callbackUrl: currentUrl });
                      }}
                      className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-100 transition-colors mb-4"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Continuer avec Google
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-px bg-white/10" />
                      <span className="text-zinc-600 text-xs">ou par email</span>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>
                  </>
                ) : null}

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!authEmail.trim()) return;
                    setAuthLoading(true);
                    try {
                      const res = await fetch('/api/auth/send-code', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: authEmail.trim() }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) {
                        setAuthOtpError(data.error ?? 'Erreur d\'envoi, réessaie.');
                        setAuthLoading(false);
                        return;
                      }
                      setAuthSent(true);
                    } catch {
                      setAuthOtpError('Erreur réseau, réessaie.');
                    } finally {
                      setAuthLoading(false);
                    }
                  }}
                  className="space-y-3"
                >
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="ton@email.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 outline-none focus:border-violet-500/60 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #c2611f, #d17d52)' }}
                  >
                    {authLoading ? 'Envoi...' : 'Recevoir mon code de connexion →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/quiz/${quiz.slug}`} className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>
          <span className="text-sm font-medium text-zinc-300">{quiz.emoji} Résultats</span>
          {session?.user ? (
            <Link
              href="/dashboard"
              className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon profil
            </Link>
          ) : (
            <Link
              href="/quizzes"
              className="text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Accueil
            </Link>
          )}
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-md">
          <p className="text-center text-zinc-500 text-sm mb-6">{quiz.title}</p>

          {sessionLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
            </div>
          ) : isPremium ? (
            /* ── PREMIUM: full results ── */
            <>
              {/* Score circle — revealed */}
              <div className="flex justify-center mb-6">
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <defs>
                    <linearGradient id="circleGradP" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={`${tier.glowColor}88`} />
                      <stop offset="100%" stopColor={tier.glowColor} />
                    </linearGradient>
                  </defs>
                  <circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle
                    cx="90" cy="90" r="72" fill="none"
                    stroke="url(#circleGradP)" strokeWidth="10"
                    strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeOffset}
                    strokeLinecap="round" transform="rotate(-90 90 90)"
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
                  />
                  <text x="90" y="98" textAnchor="middle" fill={tier.glowColor} fontSize="42" fontWeight="900">{score}%</text>
                </svg>
              </div>

              {/* Tier badge */}
              <div className="flex justify-center mb-6">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border"
                  style={{ color: tier.glowColor, borderColor: `${tier.glowColor}40`, backgroundColor: `${tier.glowColor}15` }}
                >
                  <span>{tier.emoji}</span>
                  {tier.title}
                </span>
              </div>

              {/* Full analysis */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 mb-4">
                <p className="text-zinc-200 font-semibold text-sm mb-4">{tier.message}</p>
                <div className="space-y-3">
                  {analysis.map((line, i) => (
                    <p key={i} className="text-zinc-400 text-sm leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>

              {/* Dashboard CTA — premium users */}
              <Link
                href="/dashboard"
                className="flex items-center justify-between w-full px-5 py-4 rounded-2xl mb-6 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, rgba(194,97,31,0.18), rgba(209,125,82,0.14))', border: '1px solid rgba(194,97,31,0.3)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">👤</span>
                  <div>
                    <p className="text-white font-black text-sm leading-tight">Mon profil UrCecret</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Historique · type MBTI · compatibilités</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Portrait viral CTA — concours 1 000 € */}
              <Link
                href={`/portrait?quiz=${quiz.slug}&score=${score}${quiz.slug === 'personnalite' ? '' : ''}`}
                className="flex items-center justify-between w-full px-5 py-4 rounded-2xl mb-3 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(194,97,31,0.12))', border: '1px solid rgba(251,191,36,0.35)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🏆</span>
                  <div>
                    <p className="text-white font-black text-sm leading-tight">Génère ton portrait viral</p>
                    <p style={{ color: '#fbbf24' }} className="text-xs font-semibold mt-0.5">Concours 1 000 € · le plus de vues gagne</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </>
          ) : (
            /* ── FREE: paywall ── */
            <>
              {/* ── Real score revealed — the reward they earned (dopamine + shareable) ── */}
              <div className="flex justify-center mb-5">
                <svg width="180" height="180" viewBox="0 0 180 180">
                  <defs>
                    <linearGradient id="circleGradFree" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={`${tier.glowColor}88`} />
                      <stop offset="100%" stopColor={tier.glowColor} />
                    </linearGradient>
                  </defs>
                  <circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <circle
                    cx="90" cy="90" r="72" fill="none"
                    stroke="url(#circleGradFree)" strokeWidth="10"
                    strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeOffset}
                    strokeLinecap="round" transform="rotate(-90 90 90)"
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
                  />
                  <text x="90" y="98" textAnchor="middle" fill={tier.glowColor} fontSize="42" fontWeight="900">{animatedScore}%</text>
                </svg>
              </div>

              {/* Tier badge — fully revealed */}
              <div className="flex justify-center mb-5">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border"
                  style={{ color: tier.glowColor, borderColor: `${tier.glowColor}40`, backgroundColor: `${tier.glowColor}15` }}
                >
                  <span>{tier.emoji}</span>
                  {tier.title}
                </span>
              </div>

              {/* Verdict + free analysis preview — proves the value is real BEFORE any ask */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 mb-4">
                <p className="text-zinc-100 font-semibold text-sm mb-4 leading-relaxed">{tier.message}</p>
                <div className="space-y-3">
                  {analysis.slice(0, 3).map((line, i) => (
                    <p key={i} className="text-zinc-400 text-sm leading-relaxed">{line}</p>
                  ))}
                </div>

                {/* Une phrase personnelle et développée, gratuite — pas un résumé
                    générique du score. C'est `teaser.intro`, déjà écrit par quiz
                    (voir TEASER_HOOKS ci-dessus), qui n'était jusqu'ici jamais
                    affiché nulle part dans l'UI. Objectif produit : que même sans
                    payer, la personne reparte avec une vraie idée sur elle-même —
                    jamais juste une carotte vide avant le paywall. */}
                <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(194,97,31,0.08)', border: '1px solid rgba(194,97,31,0.25)' }}>
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: '#d17d52' }}>Ce qu&apos;Elio a vu dans tes réponses</p>
                  <p className="text-zinc-100 text-[14px] leading-relaxed italic">{teaser.intro}</p>
                  <Link href="/chat" className="inline-flex items-center gap-1.5 mt-3 text-[12.5px] font-bold transition-colors hover:opacity-80" style={{ color: '#e0a380' }}>
                    ✨ Continuer à explorer ça avec Elio, gratuitement →
                  </Link>
                </div>

                {/* The analysis continues — blurred to prove there's real depth behind the unlock.
                    Note : on n'affiche QUE un texte générique ici, jamais analysis.slice(3,6) —
                    un flou CSS n'est pas une protection, ce texte resterait lisible dans le DOM
                    (inspecteur / view-source) même flouté. Le vrai contenu n'est révélé qu'en
                    isPremium (branche ci-dessus, session serveur vérifiée). */}
                <div className="relative mt-3" aria-hidden>
                  <div className="space-y-3" style={{ filter: 'blur(5px)', opacity: 0.4, userSelect: 'none', pointerEvents: 'none' }}>
                    {['Suite de l\'analyse réservée aux membres.', 'Suite de l\'analyse réservée aux membres.', 'Suite de l\'analyse réservée aux membres.'].map((line, i) => (
                      <p key={i} className="text-zinc-400 text-sm leading-relaxed">{line}</p>
                    ))}
                  </div>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(9,9,11,0.97))' }} />
                </div>
              </div>

              {/* What the complete report unlocks */}
              <div className="mb-5 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-3">Dans ton rapport complet</p>
                <div className="space-y-2">
                  {teaser.locked.filter((item) => !/score exact/i.test(item)).map((item) => (
                    <p key={item} className="text-[13px] text-zinc-300 leading-snug flex items-start gap-2">
                      <span className="flex-shrink-0 mt-px opacity-60">🔓</span>
                      <span>{item.replace(/^🔒\s*/, '')}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Main paywall card */}
              <div
                ref={paywallRef}
                className="rounded-2xl p-6 mb-6 border border-white/10"
                style={{ background: 'linear-gradient(135deg, rgba(194,97,31,0.14), rgba(209,125,82,0.10))' }}
              >
                <div className="text-center mb-5">
                  <h2 className="text-xl font-black text-white mb-2 leading-snug">{pw.headline}</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed">{pw.subline}</p>
                </div>

                {/* Social proof */}
                <div className="flex items-center justify-center gap-2 mb-5 py-2.5 rounded-xl border border-white/8 bg-white/[0.04]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-zinc-400">{pw.social}</span>
                </div>

                {/* Annual — PRIMARY HERO */}
                <div
                  className="relative rounded-2xl p-5 mb-4"
                  style={{ background: 'linear-gradient(135deg, rgba(194,97,31,0.22), rgba(176,125,43,0.14))', border: '2px solid rgba(224,163,128,0.65)' }}
                >
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="text-[11px] font-black px-4 py-1.5 rounded-full tracking-wide whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #c2611f, #d17d52)', color: '#fff', boxShadow: '0 4px 18px rgba(194,97,31,0.6)' }}>
                      ⭐ LE MEILLEUR CHOIX · LE PLUS POPULAIRE
                    </span>
                  </div>

                  <div className="flex items-start justify-between mt-3 mb-3">
                    <div className="flex flex-col">
                      <span className="text-white font-black text-base leading-tight">Accès illimité — 1 an</span>
                      <span className="text-[11px] mt-1 font-semibold" style={{ color: '#e0a380' }}>
                        0,08€/jour · moins qu&apos;un chewing-gum
                      </span>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 ml-3">
                      <span className="text-zinc-500 text-xs line-through mb-0.5">119,88€</span>
                      <span className="font-black text-white text-3xl leading-none">29,99€</span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded mt-1" style={{ background: 'rgba(125,148,102,0.25)', color: '#aebf9c' }}>
                        −75%
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 mb-5">
                    {[
                      'Analyse complète de ce résultat — maintenant',
                      'Les 15 quiz secrets débloqués (couple, amitié…)',
                      'Profil MBTI + compatibilités duo illimitées',
                      'Suivi personnalisé sur 15 jours',
                      'Tous les futurs quiz inclus, à vie',
                      '🏆 Portrait viral IA + concours 1 000 €',
                    ].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-[13px] text-zinc-200 leading-snug">
                        <span className="flex-shrink-0 mt-px" style={{ color: '#aebf9c' }}>✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      void (async () => {
                        setIsCheckingOut(true);
                        trackEvent('checkout_click');
                        const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quizSlug: quiz.slug, score, origin: window.location.origin, userEmail: session?.user?.email ?? undefined, annual: true }) });
                        const data = await res.json() as { url?: string; error?: string };
                        if (data.url) window.location.href = data.url; else { alert(data.error ?? 'Erreur de paiement'); setIsCheckingOut(false); }
                      })();
                    }}
                    disabled={isCheckingOut}
                    className="w-full py-5 rounded-2xl font-black text-white text-lg transition-all active:scale-[0.98] disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #c2611f, #d17d52)', boxShadow: '0 8px 36px rgba(194,97,31,0.65)' }}
                  >
                    {isCheckingOut ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Redirection…
                      </span>
                    ) : (
                      <>Tout débloquer — 29,99€/an ✦</>
                    )}
                  </button>
                </div>

                {/* Secondary: monthly */}
                <button
                  onClick={handlePayClick}
                  disabled={isCheckingOut}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm border border-white/10 bg-white/[0.04] hover:bg-white/7 transition-all active:scale-[0.98] mb-4 disabled:opacity-60 px-5"
                >
                  <span className="flex items-center justify-between">
                    <span className="flex flex-col items-start gap-0.5">
                      <span className="text-zinc-200 font-semibold">🔄 Mensuel · sans engagement</span>
                      <span className="text-zinc-500 text-xs font-normal">Même accès · annule quand tu veux</span>
                    </span>
                    <span className="font-black text-zinc-200 ml-3 flex-shrink-0">9,99€<span className="font-normal text-zinc-500 text-xs">/mois</span></span>
                  </span>
                </button>

                {/* Downsell: 1,99€ one-time report only */}
                <div className="text-center mb-5">
                  <button
                    onClick={handleOneTimeClick}
                    disabled={isCheckingOut}
                    className="text-zinc-500 hover:text-zinc-300 text-xs underline underline-offset-2 transition-colors disabled:opacity-60"
                  >
                    ou juste ce résultat pour 1,99€ →
                  </button>
                </div>

                <p className="text-center text-[11px] text-zinc-600">
                  🔒 Paiement sécurisé Stripe · CB, Apple Pay, Google Pay · Annulable à tout moment
                </p>
              </div>

            </>
          )}

          {/* Viral share section */}
          <div className="mt-6 rounded-2xl overflow-hidden border border-white/8">
            {/* PRIMARY: partner challenge — this is the #1 viral mechanic */}
            <div className="p-5" style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.08), rgba(37,211,102,0.04))' }}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xl flex-shrink-0 mt-0.5">👀</span>
                <div>
                  <p className="text-sm font-black text-white leading-snug">Envoie ça à ton/ta partenaire</p>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                    Il/Elle répond sans voir tes réponses — vous comparez après
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`👀 Je viens de faire "${quiz.title}" sur UrCecret${isPremium ? ` — j'ai eu ${score}%` : ''}... Tu penses faire mieux que moi ?\n\nFais le quiz ici (sans regarder mes réponses 😏) :\nhttps://urcecret.site/quiz/${quiz.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all active:scale-[0.98]"
                style={{ background: '#25D366', color: 'white', boxShadow: '0 4px 16px rgba(37,211,102,0.35)' }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Défier sur WhatsApp 📲
              </a>
            </div>

            {/* Secondary: share your result */}
            <div className="px-5 pb-5 pt-4 border-t border-white/5">
              <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-semibold mb-3 text-center">Partager mon résultat</p>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`J'ai fait "${quiz.title}" sur UrCecret${isPremium ? ` — j'ai eu ${score}%` : ''} 😱 Essaie toi : https://urcecret.site/quiz/${quiz.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={{ background: '#25D36618', border: '1px solid #25D36635', color: '#25D366' }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WA
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Je viens de faire "${quiz.title}" sur UrCecret${isPremium ? ` — j'ai eu ${score}%` : ''} 👀 Tu penses faire mieux ?\n\nhttps://urcecret.site/quiz/${quiz.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={{ background: '#00000033', border: '1px solid rgba(255,255,255,0.12)', color: '#e4e4e7' }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  X
                </a>
                <button
                  onClick={() => {
                    const msg = `J'ai fait "${quiz.title}" sur UrCecret${isPremium ? ` — j'ai eu ${score}%` : ''} 😱 Essaie toi : https://urcecret.site/quiz/${quiz.slug}`;
                    if (navigator.share) {
                      void navigator.share({ title: quiz.title, text: msg, url: `https://urcecret.site/quiz/${quiz.slug}` });
                    } else {
                      navigator.clipboard.writeText(`https://urcecret.site/quiz/${quiz.slug}`).catch(() => {});
                      const btn = document.getElementById('copy-btn');
                      if (btn) { btn.textContent = '✓ Copié'; setTimeout(() => { if (btn) btn.textContent = 'Copier'; }, 2000); }
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all active:scale-95"
                  style={{ background: 'rgba(194,97,31,0.15)', border: '1px solid rgba(194,97,31,0.3)', color: '#d17d52' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  <span id="copy-btn">Partager</span>
                </button>
              </div>
            </div>
          </div>

          {/* MBTI cross-sell */}
          <div
            className="mt-4 rounded-2xl overflow-hidden border"
            style={{ background: 'linear-gradient(135deg, rgba(176,125,43,0.10), rgba(194,97,31,0.08))', borderColor: 'rgba(176,125,43,0.25)' }}
          >
            <div className="p-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Nouveau</span>
              </div>
              <p className="text-white font-black text-sm leading-snug mb-1">Découvre ton type MBTI</p>
              <p className="text-zinc-500 text-xs mb-3 leading-relaxed">
                70 questions — trouve ton vrai profil parmi les 16 types de personnalité.
              </p>
              <Link
                href="/quiz/personnalite"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black text-white transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #b07d2b, #c2611f)', boxShadow: '0 4px 16px rgba(176,125,43,0.35)' }}
              >
                🧠 Faire le test MBTI →
              </Link>
            </div>
          </div>

          {/* Elio cross-sell — connecte ce résultat au coach IA, pas juste au
              test MBTI. Les abonnés (isPremium) ont déjà Elio : lien direct.
              Les autres n'ont pas payé CE rapport, mais Elio reste utilisable
              gratuitement en mode découverte (voir /api/chat) — même logique
              que le paywall MBTI ("pas encore convaincu(e) ? teste Elio"). ── */}
          <div
            className="mt-4 rounded-2xl overflow-hidden border"
            style={{ background: 'linear-gradient(135deg, rgba(194,97,31,0.10), rgba(209,125,82,0.08))', borderColor: 'rgba(194,97,31,0.25)' }}
          >
            <div className="p-5">
              <p className="text-white font-black text-sm leading-snug mb-1">
                {isPremium ? '💬 Discute de ce résultat avec Elio' : 'Pas encore convaincu(e) ?'}
              </p>
              <p className="text-zinc-500 text-xs mb-3 leading-relaxed">
                {isPremium
                  ? 'Ton coach IA — pose-lui une vraie question sur ce que ce résultat dit de toi.'
                  : 'Discute d\'abord avec Elio, ton compagnon de développement personnel — gratuit, 5 messages offerts par mois.'}
              </p>
              <Link
                href="/chat"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-black text-white transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #c2611f, #d17d52)', boxShadow: '0 4px 16px rgba(194,97,31,0.35)' }}
              >
                {isPremium ? '💬 Parler à Elio →' : '✨ Tester Elio gratuitement →'}
              </Link>
            </div>
          </div>

          {/* Other quizzes */}
          <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <p className="text-xs text-zinc-500 text-center mb-3">Essaie un autre quiz</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { slug: 'narcissique', label: '🪞 Narcissique ?' },
                { slug: 'manipule', label: '🎭 Manipulé(e) ?' },
                { slug: 'schema-amoureux', label: '🧲 Mon type ?' },
                { slug: 'burnout', label: '💤 Burnout ?' },
                { slug: 'rompre', label: '💔 Rompre ?' },
              ].filter(q => q.slug !== quiz.slug).slice(0, 4).map((q) => (
                <Link
                  key={q.slug}
                  href={`/quiz/${q.slug}`}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {q.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Refaire le quiz link */}
          <div className="mt-4 text-center">
            <Link href={`/quiz/${quiz.slug}`} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Refaire le quiz
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

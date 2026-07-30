import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const BASE = 'https://urcecret.site';

interface GuideData {
  slug: string;
  emoji: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDesc: string;
  keywords: string[];
  intro: string;
  s1Title: string;
  s1: string[];
  s2Title: string;
  s2: string;
  ctaText: string;
  accentColor: string;
  faqs: { q: string; a: string }[];
}

const guides: Record<string, GuideData> = {
  'style-attachement': {
    slug: 'style-attachement',
    emoji: '🫀',
    title: 'Test du Style d\'Attachement',
    h1: 'Test du Style d\'Attachement — Résultats Instantanés',
    metaTitle: 'Test Style d\'Attachement Gratuit 2025 — Sécure, Anxieux, Évitant ?',
    metaDesc: 'Découvre ton style d\'attachement (sécure, anxieux, évitant, désorganisé) avec notre test psychologique gratuit. 12 questions, analyse instantanée basée sur la théorie de Bowlby.',
    keywords: ['test style attachement', 'style attachement', 'attachement anxieux', 'attachement évitant', 'attachement sécure', 'attachement désorganisé', 'test psychologique gratuit', 'théorie attachement Bowlby'],
    intro: 'Le style d\'attachement est l\'une des découvertes les plus révolutionnaires de la psychologie du XXe siècle. Développée par John Bowlby et enrichie par Mary Ainsworth, la théorie de l\'attachement explique pourquoi nous tombons amoureux de certains profils, pourquoi certaines relations nous épuisent et pourquoi nous réagissons si différemment à l\'abandon ou à la proximité. Connaître ton style d\'attachement, c\'est comprendre tes schémas relationnels profonds — ceux qui se répètent dans toutes tes relations depuis l\'enfance.',
    s1Title: 'Les 4 styles d\'attachement : lesquels te correspondent ?',
    s1: [
      '🟢 Attachement sécure — Tu te sens à l\'aise avec la proximité et l\'autonomie. Tu fais confiance sans anxiété excessive. Tu gères bien les séparations temporaires. Environ 50-55% de la population adulte présente ce style, souvent grâce à des parents "suffisamment bons" dans l\'enfance.',
      '🟡 Attachement anxieux (préoccupé) — Tu as tendance à t\'inquiéter de l\'amour de tes partenaires, à chercher beaucoup de réassurance, et à avoir une peur profonde de l\'abandon. La proximité te rassure mais tu te sens souvent "trop intense" ou "trop demandeur(se)". Environ 20% de la population.',
      '🔵 Attachement évitant (détaché) — Tu valorises fortement ton indépendance et gardes une distance émotionnelle. Tu te sens étouffé par trop de proximité. Ce n\'est pas un manque d\'amour — c\'est une stratégie de protection inconsciente développée dès l\'enfance. Environ 25% de la population.',
      '🔴 Attachement désorganisé (craintif-évitant) — Tu veux la proximité mais tu en as peur en même temps. Souvent lié à des expériences de traumatismes dans l\'enfance. Les relations sont vécues comme à la fois désirées et menaçantes. Ce style est plus rare mais très présent dans les histoires relationnelles douloureuses.',
    ],
    s2Title: 'Peut-on vraiment changer son style d\'attachement ?',
    s2: 'Oui — et c\'est la meilleure nouvelle. Le style d\'attachement n\'est pas une fatalité génétique. Des années de recherche en neurosciences et en psychologie montrent que des relations sécurisantes, une psychothérapie (notamment l\'EMDR, la thérapie des schémas ou la thérapie psychodynamique), et une meilleure conscience de soi permettent d\'évoluer vers un attachement plus sécure. Le premier pas incontournable est de savoir exactement où tu en es. C\'est ce que ce test te permet de faire en 5 minutes.',
    ctaText: 'Découvrir mon style d\'attachement →',
    accentColor: '#b07d2b',
    faqs: [
      { q: 'Quel est le "meilleur" style d\'attachement ?', a: 'L\'attachement sécure est associé aux relations les plus épanouissantes et à la plus grande satisfaction amoureuse à long terme. Mais aucun style n\'est une condamnation — tous peuvent évoluer avec un travail sur soi.' },
      { q: 'Comment se forme le style d\'attachement dans l\'enfance ?', a: 'Le style d\'attachement se forme principalement entre 0 et 3 ans selon la qualité des réponses des figures parentales aux besoins émotionnels de l\'enfant. Un parent "suffisamment bon" et prévisible favorise l\'attachement sécure.' },
      { q: 'Un anxieux et un évitant peuvent-ils fonctionner en couple ?', a: 'C\'est possible mais challengeant. Cette dynamique "poursuite-retrait" est très commune. Avec une bonne communication et souvent un accompagnement thérapeutique, elle peut s\'améliorer significativement. La prise de conscience du schéma est la première étape.' },
      { q: 'Combien de temps faut-il pour évoluer vers un attachement sécure ?', a: 'Le changement prend généralement plusieurs mois à plusieurs années de travail thérapeutique ou de relations sécurisantes. Des progrès notables peuvent être ressentis dès les premiers mois d\'une bonne thérapie.' },
      { q: 'Ce test remplace-t-il une consultation psychologique ?', a: 'Non. Ce test est un outil de découverte de soi basé sur des critères psychologiques établis, mais il ne constitue pas un diagnostic clinique. Pour un travail approfondi sur ton attachement, un psy spécialisé en théorie de l\'attachement est recommandé.' },
    ],
  },

  'langages-amour': {
    slug: 'langages-amour',
    emoji: '💌',
    title: 'Test des Langages de l\'Amour',
    h1: 'Test des 5 Langages de l\'Amour — Lequel es-tu ?',
    metaTitle: 'Test des 5 Langages de l\'Amour Gratuit 2025 — Découvre le tien',
    metaDesc: 'Découvre ton langage de l\'amour principal parmi les 5 de Gary Chapman. Test gratuit en 10 questions, résultats instantanés. Transforme ta relation aujourd\'hui.',
    keywords: ['test langages de l\'amour', 'les 5 langages de l\'amour', 'langage amour', 'gary chapman test', 'mots affirmation', 'actes de service', 'temps de qualité', 'toucher physique', 'cadeaux amour'],
    intro: 'En 1992, Gary Chapman publie "Les 5 langages de l\'amour" qui devient l\'un des livres de développement personnel les plus influents au monde avec plus de 20 millions d\'exemplaires vendus. Son idée centrale est aussi simple que révolutionnaire : nous n\'exprimons pas tous l\'amour de la même façon, et ne pas connaître le "langage" de son partenaire est l\'une des causes principales des conflits et des séparations. Deux personnes peuvent s\'aimer sincèrement et se sentir incomprises — simplement parce qu\'elles parlent des langages différents.',
    s1Title: 'Les 5 langages de l\'amour expliqués',
    s1: [
      '💬 1. Les mots d\'affirmation — Tu te sens aimé(e) quand l\'autre exprime verbalement ses sentiments, te complimente, t\'encourage. Les "je t\'aime", les messages affectueux, les paroles de soutien sont ce qui compte le plus pour toi.',
      '🛠️ 2. Les actes de service — Quand quelqu\'un fait quelque chose pour toi — cuisine un repas, t\'aide dans une tâche difficile, règle un problème à ta place — tu te sens profondément aimé(e). Pour toi, "les actions parlent plus fort que les mots."',
      '🎁 3. La réception de cadeaux — Pas nécessairement chers : c\'est le symbole de pensée et d\'attention qui te touche. Un petit cadeau inattendu, une fleur cueillie en passant, un objet qui te rappelle une conversation — ces attentions te remplissent.',
      '⏰ 4. Le temps de qualité — Tu te sens aimé(e) quand l\'autre est vraiment présent pour toi, sans téléphone, sans distraction. Une soirée de vraie attention, les yeux dans les yeux, vaut pour toi plus que tous les cadeaux du monde.',
      '🤗 5. Le toucher physique — Les câlins, les caresses sur le dos, la main que l\'on prend, la présence physique réconfortante — le contact physique est ta façon principale de donner et recevoir de l\'amour et de la sécurité.',
    ],
    s2Title: 'Pourquoi c\'est crucial pour ta relation ?',
    s2: 'La majorité des conflits de couple viennent d\'un "mal-amour" plutôt qu\'un "non-amour". Chaque partenaire aime sincèrement mais dans son propre langage. Si ton langage principal est le temps de qualité et que ton/ta partenaire exprime surtout son amour par des actes de service, vous pouvez vous sentir tous les deux non-aimés malgré vos efforts immenses. Connaître vos deux langages vous permet de vous aimer dans la langue de l\'autre — et de transformer une relation frustrante en relation épanouissante.',
    ctaText: 'Découvrir mon langage de l\'amour →',
    accentColor: '#d17d52',
    faqs: [
      { q: 'Peut-on avoir plusieurs langages de l\'amour principaux ?', a: 'Oui. Beaucoup de gens ont un langage dominant et un ou deux secondaires. Le test révèle ton profil exact avec la hiérarchie de tes langages pour que tu puisses l\'expliquer clairement à ton/ta partenaire.' },
      { q: 'Mon langage de l\'amour peut-il changer avec le temps ?', a: 'Oui, notamment selon les phases de vie. Pendant une période de stress intense, les mots d\'affirmation deviennent souvent plus importants. En tant que nouveau parent, les actes de service prennent beaucoup de poids.' },
      { q: 'Que faire si mon partenaire et moi avons des langages très différents ?', a: 'C\'est très commun et tout à fait gérable. La clé : communiquez vos langages ouvertement, et faites l\'effort conscient d\'exprimer de l\'amour dans le langage de l\'autre même si ça ne vient pas naturellement.' },
      { q: 'Les langages de l\'amour s\'appliquent-ils aussi aux amitiés ?', a: 'Absolument. La théorie s\'applique à toutes les relations significatives : couple, famille, amis proches, enfants. Comprendre les langages des personnes qui comptent pour toi améliore toutes tes relations.' },
      { q: 'Y a-t-il des preuves scientifiques sur les langages de l\'amour ?', a: 'Des études récentes (Chapman & White, Egbert & Polk) montrent une corrélation positive entre la connaissance et l\'application des langages de l\'amour et la satisfaction relationnelle à long terme.' },
    ],
  },

  'gaslight': {
    slug: 'gaslight',
    emoji: '🫧',
    title: 'Test Gaslighting',
    h1: 'Suis-je Victime de Gaslighting ? — Test Gratuit',
    metaTitle: 'Test Gaslighting Gratuit 2025 — Suis-je Manipulé(e) Psychologiquement ?',
    metaDesc: 'Le gaslighting te fait douter de ta réalité. Notre test de 12 questions te dit si tu en es victime et à quel degré. Résultats instantanés et anonymes.',
    keywords: ['test gaslighting', 'suis-je victime de gaslighting', 'gaslighting définition', 'manipulation psychologique', 'gaslighting relation', 'signes gaslighting', 'douter de sa réalité', 'manipulation émotionnelle'],
    intro: 'Le gaslighting est l\'une des formes de manipulation psychologique les plus insidieuses et les plus difficiles à identifier. Le terme vient du film "Gaslight" (1944), dans lequel un mari manipule sa femme pour lui faire croire qu\'elle devient folle. Dans la vie réelle, le gaslighting consiste à amener progressivement quelqu\'un à douter de sa propre mémoire, de ses perceptions et de sa réalité. La victime finit par ne plus faire confiance à son propre jugement — ce qui donne un contrôle total au manipulateur.',
    s1Title: 'Les 5 signes clés du gaslighting',
    s1: [
      '🔄 Tu doutes constamment de ta mémoire — "Je n\'ai jamais dit ça", "Tu imagines", "Tu as rêvé". Tu commences à croire que ton souvenir des événements est systématiquement faux.',
      '😔 Tu te sens "trop sensible" en permanence — L\'autre te dit régulièrement que tu exagères, que tu es trop susceptible, que tes réactions sont disproportionnées. Tu commences à étouffer tes propres émotions.',
      '🔄 Les faits "changent" selon les conversations — Ce qui s\'est passé hier semble toujours différent dans sa version. Les détails changent. Tu ne sais plus quelle version est la vraie.',
      '😰 Tu marches sur des œufs — Tu anticipes ses réactions, tu t\'autocensures, tu reformules constamment pour éviter son mécontentement. Tu ne te sens plus libre d\'être toi-même.',
      '💔 Tu t\'isoles progressivement — Soit parce que l\'autre critique systématiquement tes proches, soit parce que tu as honte de parler de ce qui se passe dans ta relation.',
    ],
    s2Title: 'Que faire si tu es victime de gaslighting ?',
    s2: 'La première étape est la plus difficile : reconnaître que ce que tu vis n\'est pas normal. Si tu passes du temps à douter de ta santé mentale et que ces doutes ont commencé avec cette relation, c\'est un signal fort. Documente les événements par écrit pour garder une trace objective. Cherche le regard d\'un proche de confiance ou d\'un thérapeute qui peut te donner une perspective extérieure. Dans les cas sérieux, prendre de la distance de la personne — même temporairement — est souvent nécessaire pour retrouver son repère intérieur.',
    ctaText: 'Faire le test gaslighting →',
    accentColor: '#a94e18',
    faqs: [
      { q: 'Tout le monde peut-il être victime de gaslighting ?', a: 'Oui. Le gaslighting ne touche pas que les personnes "faibles". Des personnes intelligentes et fortes en sont victimes car le processus est progressif et commence souvent dans une relation de confiance.' },
      { q: 'Le gaslighting est-il toujours intentionnel ?', a: 'Pas nécessairement. Certaines personnes gaslightent de façon inconsciente, souvent par mécanisme de défense narcissique ou par peur du conflit. Intentionnel ou non, les effets sur la victime sont identiques.' },
      { q: 'Le gaslighting peut-il venir d\'un parent, pas d\'un partenaire ?', a: 'Absolument. Le gaslighting parental est particulièrement destructeur car il se produit pendant l\'enfance, période de formation de l\'identité. "Tu n\'as pas mal", "tu exagères", "ça ne s\'est pas passé comme ça" — ces phrases répétées dès l\'enfance créent des doutes profonds sur sa propre perception.' },
      { q: 'Comment se remettre du gaslighting ?', a: 'La reconstruction prend du temps. Tenir un journal pour ancrer ses propres perceptions, une thérapie (notamment EMDR pour le trauma), et s\'entourer de personnes qui valident ta réalité sont les piliers de la guérison.' },
      { q: 'Ce test peut-il remplacer l\'avis d\'un professionnel ?', a: 'Non. Ce test est un outil de prise de conscience, pas un diagnostic. Si tu te reconnais dans plusieurs signes, consulter un psychologue ou appeler une ligne d\'aide est fortement recommandé.' },
    ],
  },

  'burnout': {
    slug: 'burnout',
    emoji: '💤',
    title: 'Test Burnout',
    h1: 'Test Burnout Gratuit — Suis-je en Épuisement Professionnel ?',
    metaTitle: 'Test Burnout Gratuit 2025 — Suis-je en Burnout ? Résultats Instantanés',
    metaDesc: 'Notre test burnout de 12 questions évalue tes niveaux d\'épuisement émotionnel, de cynisme et d\'efficacité réduite. Basé sur le Maslach Burnout Inventory. Gratuit et anonyme.',
    keywords: ['test burnout', 'suis-je en burnout', 'burnout professionnel', 'épuisement professionnel', 'burnout symptômes', 'test burnout gratuit', 'burn out', 'syndrome épuisement professionnel'],
    intro: 'Le burnout, ou syndrome d\'épuisement professionnel, est officiellement reconnu par l\'OMS depuis 2019 comme un "phénomène lié au travail". En France, une étude du cabinet Empreinte Humaine estime que près de 2,5 millions de salariés sont en burnout sévère. Le burnout ne touche pas seulement les personnes "fragiles" — au contraire, ce sont souvent les plus investis, les plus perfectionnistes, les plus dévoués qui sont les plus vulnérables. Le problème : on le voit rarement venir.',
    s1Title: 'Les 3 dimensions du burnout (modèle Maslach)',
    s1: [
      '🔥 1. Épuisement émotionnel — Sentiment persistant d\'être "à sec" émotionnellement. Tu te lèves fatigué(e) même après une nuit complète. Les weekends ne suffisent plus à récupérer. Tu n\'as plus d\'énergie pour les autres, même ceux que tu aimes.',
      '😶 2. Dépersonnalisation / Cynisme — Tu développes une attitude détachée, cynique ou distante envers ton travail et les personnes concernées. Ce qui t\'enthousiasmait ne te touche plus. Tu "fais le job" sans engagement.',
      '📉 3. Réduction de l\'accomplissement personnel — Tu doutes de ta compétence et de ta valeur. Les succès ne te satisfont plus. Tu as l\'impression de ne jamais en faire assez malgré tes efforts constants.',
    ],
    s2Title: 'Burnout ou dépression : quelle différence ?',
    s2: 'Le burnout et la dépression partagent de nombreux symptômes (fatigue, perte de motivation, troubles du sommeil) mais se distinguent par leur origine. Le burnout est directement lié au contexte professionnel — en vacances ou loin du travail, les symptômes s\'atténuent. La dépression touche tous les domaines de la vie indépendamment du contexte. Les deux peuvent coexister : un burnout non traité peut évoluer vers une dépression clinique. Dans tous les cas, consulter un médecin est indispensable.',
    ctaText: 'Faire le test burnout →',
    accentColor: '#f59e0b',
    faqs: [
      { q: 'Peut-on faire un burnout en aimant son travail ?', a: 'Oui, paradoxalement. Les personnes les plus passionnées et perfectionnistes sont souvent les plus à risque car elles repoussent leurs limites sans s\'en rendre compte et ont du mal à "débrancher".' },
      { q: 'Combien de temps dure un burnout ?', a: 'La récupération varie de quelques semaines pour un burnout léger à plusieurs mois ou années pour un burnout sévère. L\'intervention précoce est déterminante pour la durée de récupération.' },
      { q: 'Peut-on faire un burnout en dehors du travail ?', a: 'Oui. Le "parental burnout" (épuisement des parents) et le "caregiver burnout" (épuisement des aidants) sont des réalités documentées qui partagent les mêmes mécanismes que le burnout professionnel.' },
      { q: 'Que faire en premier si je pense être en burnout ?', a: 'Consulter un médecin généraliste en premier. Un arrêt de travail peut être médicalement nécessaire. Ne pas attendre que ça passe seul — le burnout non traité s\'aggrave.' },
      { q: 'Ce test remplace-t-il un avis médical ?', a: 'Non. Ce test est basé sur les critères du Maslach Burnout Inventory mais ne constitue pas un diagnostic. Si ton score est élevé, consulter un médecin ou un psychologue du travail est fortement recommandé.' },
    ],
  },

  'depression': {
    slug: 'depression',
    emoji: '🌧️',
    title: 'Test Dépression',
    h1: 'Ai-je des Signes de Dépression ? — Test Gratuit et Anonyme',
    metaTitle: 'Test Dépression Gratuit 2025 — Signes de Dépression ? Résultats Instantanés',
    metaDesc: 'Notre test évalue les signes de dépression en 12 questions anonymes. Basé sur les critères DSM-5. Ne remplace pas un avis médical. Gratuit, instantané, 100% confidentiel.',
    keywords: ['test dépression', 'signes dépression', 'suis-je déprimé', 'symptômes dépression', 'test dépression gratuit', 'dépression ou tristesse', 'dépression légère', 'dysthymie test'],
    intro: 'La dépression est l\'un des troubles mentaux les plus répandus au monde, touchant plus de 300 millions de personnes selon l\'OMS. En France, on estime qu\'environ 1 personne sur 5 vivra un épisode dépressif au cours de sa vie. Pourtant, la dépression reste souvent non diagnostiquée — en partie parce qu\'elle se confond facilement avec la tristesse normale, le stress chronique ou la fatigue. Comprendre la différence entre une dépression et un passage difficile est essentiel pour obtenir le bon soutien.',
    s1Title: 'Les signes de dépression selon le DSM-5',
    s1: [
      '😔 Humeur dépressive persistante — Tristesse quasi-permanente, sensation de vide, pleurs fréquents sans raison apparente, durant au moins 2 semaines.',
      '💤 Perte d\'intérêt et de plaisir — Plus rien ne t\'intéresse, même les activités que tu aimais. Ce symptôme (anhédonie) est l\'un des plus caractéristiques de la dépression.',
      '😴 Troubles du sommeil et de l\'appétit — Insomnie ou hypersomnie, prise ou perte de poids significative sans régime intentionnel.',
      '🧠 Difficultés de concentration — Trouble de la mémoire, pensée ralentie, difficulté à prendre des décisions même simples.',
      '⚡ Fatigue profonde — Épuisement persistant non soulagé par le repos. Se lever le matin demande un effort immense.',
      '💭 Pensées négatives récurrentes — Sentiment de culpabilité, de inutilité, de désespoir sur l\'avenir. Dans les cas sévères : pensées de mort ou idées suicidaires.',
    ],
    s2Title: 'Tristesse vs dépression : quelle différence ?',
    s2: 'La tristesse est une émotion normale et adaptative — elle passe avec le temps et répond aux tentatives pour se sentir mieux. La dépression est un trouble persistant (au moins 2 semaines selon le DSM-5) qui affecte tous les domaines de la vie : travail, relations, santé physique. Elle ne "passe pas" avec du repos ou des activités plaisantes. Si tu doutes, parler à un médecin est toujours la bonne décision — la dépression se traite efficacement dans la grande majorité des cas.',
    ctaText: 'Faire le test dépression →',
    accentColor: '#64748b',
    faqs: [
      { q: 'Ce test peut-il diagnostiquer une dépression ?', a: 'Non. Ce test peut identifier des signaux et t\'aider à décider de consulter, mais seul un médecin ou psychiatre peut poser un diagnostic de dépression. Si ton score est élevé, consulte un professionnel.' },
      { q: 'Quelle est la différence entre dépression et burn-out ?', a: 'Le burnout est directement lié au contexte professionnel et s\'améliore à distance du travail. La dépression touche tous les domaines de vie indépendamment du contexte. Les deux peuvent coexister.' },
      { q: 'La dépression se guérit-elle ?', a: 'Oui. La grande majorité des dépressions se traitent efficacement avec une thérapie (notamment TCC), un traitement médicamenteux si nécessaire, ou une combinaison des deux. Ne pas traiter une dépression est ce qui l\'aggrave.' },
      { q: 'Où appeler en urgence en cas de pensées suicidaires ?', a: 'En France : le 3114 (numéro national de prévention du suicide, 24h/24, 7j/7). Ne reste pas seul(e) avec ces pensées.' },
      { q: 'La dépression est-elle héréditaire ?', a: 'Il existe une composante génétique : avoir un parent avec dépression augmente le risque. Mais l\'environnement, le stress, les traumatismes et les événements de vie jouent un rôle tout aussi déterminant.' },
    ],
  },

  'narcissique': {
    slug: 'narcissique',
    emoji: '🪞',
    title: 'Test Narcissisme',
    h1: 'Suis-je Narcissique ? — Test Psychologique Gratuit',
    metaTitle: 'Test Narcissisme Gratuit 2025 — Suis-je Narcissique ? Résultats Instantanés',
    metaDesc: 'Notre test de 12 questions évalue tes traits narcissiques selon les critères du DSM-5. Distinction entre confiance en soi saine et narcissisme pathologique. Gratuit et anonyme.',
    keywords: ['test narcissique', 'suis-je narcissique', 'narcissisme test', 'trouble personnalité narcissique', 'traits narcissiques', 'pervers narcissique', 'narcissisme pathologique', 'TPN'],
    intro: 'Le narcissisme est un des termes les plus mal compris de la psychologie populaire. On l\'utilise souvent à tort pour désigner quelqu\'un de confiant ou d\'ambitieux. En réalité, le Trouble de la Personnalité Narcissique (TPN) est un trouble psychologique précis, caractérisé par un schéma envahissant de grandiosité, un besoin excessif d\'admiration et un manque d\'empathie — qui commence à l\'âge adulte et est présent dans des contextes variés. Ce test fait la distinction entre des traits narcissiques normaux et un narcissisme problématique.',
    s1Title: 'Traits narcissiques normaux vs trouble narcissique',
    s1: [
      '✅ Traits normaux — Confiance en soi, ambition, fierté de ses accomplissements, désir d\'être reconnu. Ces traits sont sains et même nécessaires pour réussir.',
      '⚠️ Narcissisme modéré — Tendance à se mettre en avant, difficulté à reconnaître ses erreurs, sensibilité à la critique, besoin marqué de validation. Gênant mais pas pathologique.',
      '🔴 Narcissisme pathologique (TPN) — Sentiment de supériorité grandiose, exploitation des autres pour ses fins, absence d\'empathie réelle, réactions de rage ou de honte intense à la moindre critique (blessure narcissique).',
    ],
    s2Title: 'Le paradoxe du narcissisme : une faible estime de soi ?',
    s2: 'Contrairement à ce qu\'on pense, le narcissisme pathologique est souvent enraciné dans une faible estime de soi profonde et une honte intense. La grandiosité est une défense contre ce sentiment insupportable de ne pas valoir grand-chose. C\'est pourquoi les personnes narcissiques réagissent si violemment à la moindre critique : elle touche exactement la blessure qu\'elles essaient de cacher. Cette compréhension ne justifie pas les comportements nocifs, mais aide à les expliquer.',
    ctaText: 'Faire le test narcissisme →',
    accentColor: '#c2611f',
    faqs: [
      { q: 'Peut-on avoir quelques traits narcissiques sans être narcissique ?', a: 'Oui, absolument. Le narcissisme est un spectre. Avoir certains traits ne signifie pas avoir un trouble de personnalité. Ce test évalue la présence ET l\'intensité des traits.' },
      { q: 'Le narcissisme se soigne-t-il ?', a: 'La thérapie peut aider, notamment la thérapie des schémas et la TCC. Le défi principal est que les personnes avec TPN cherchent rarement de l\'aide spontanément car elles ne voient généralement pas le problème en elles.' },
      { q: 'Quelle est la différence entre pervers narcissique et narcissique ?', a: '"Pervers narcissique" est un terme populaire français (non reconnu dans le DSM) désignant une personne avec des traits narcissiques et manipulateurs. Le terme DSM officiel est Trouble de la Personnalité Narcissique (TPN).' },
      { q: 'Comment se protéger d\'une personne narcissique ?', a: 'Mettre des limites claires, ne pas alimenter le besoin d\'admiration, ne pas répondre aux provocations, s\'entourer de personnes saines, et si la relation est toxique, envisager de la distancer ou la terminer.' },
      { q: 'Ce test peut-il diagnostiquer un trouble narcissique ?', a: 'Non. Seul un psychiatre ou psychologue clinicien peut poser un diagnostic de TPN après une évaluation clinique approfondie. Ce test est un outil de réflexion.' },
    ],
  },

  'manipule': {
    slug: 'manipule',
    emoji: '🎭',
    title: 'Test Manipulation',
    h1: 'Suis-je Manipulé(e) ? — Test Psychologique Gratuit',
    metaTitle: 'Test Manipulation Gratuit 2025 — Suis-je Manipulé(e) ? Résultats Instantanés',
    metaDesc: 'Notre test identifie les signes de manipulation psychologique en 12 questions. Gaslighting, chantage émotionnel, isolement... Suis-je dans une relation manipulatrice ? Gratuit.',
    keywords: ['suis-je manipulé', 'test manipulation psychologique', 'relation manipulatrice', 'manipulation émotionnelle', 'chantage émotionnel', 'emprise psychologique', 'manipulation couple'],
    intro: 'La manipulation psychologique est particulièrement difficile à identifier parce qu\'elle opère progressivement et souvent dans des relations de confiance. Contrairement à la violence physique qui est visible, la manipulation psychologique s\'installe silencieusement. Elle érode peu à peu l\'estime de soi, le sens du réel et l\'autonomie de la victime. À tel point que beaucoup de personnes manipulées n\'en prennent conscience qu\'en sortant de la relation et en prenant du recul.',
    s1Title: 'Les techniques de manipulation les plus courantes',
    s1: [
      '🎭 Gaslighting — Te faire douter de ta mémoire et de ta perception de la réalité. "Ça ne s\'est pas passé comme ça", "tu inventes", "tu exagères encore".',
      '😢 Chantage émotionnel — Utiliser ta culpabilité, ta peur ou ton obligation envers lui/elle pour te contrôler. "Si tu m\'aimais vraiment, tu ferais ça".',
      '🔄 DARVO — Deny, Attack, Reverse Victim and Offender. Nier, attaquer, et se retourner en victime quand tu lui reproches quelque chose.',
      '🚪 Isolement progressif — Critiquer systématiquement tes proches jusqu\'à ce que tu t\'éloignes d\'eux, te laissant uniquement dépendant(e) de lui/elle.',
      '🎁 Love bombing / Dévaluation — Cycles d\'idéalisation intense (où tu es parfait(e)) suivis de dévaluations soudaines (où tu es nul(le)). Cette imprévisibilité crée une dépendance.',
    ],
    s2Title: 'Pourquoi est-il si difficile de partir ?',
    s2: 'La manipulation crée des liens psychologiques très forts, notamment à travers les cycles de tension-explosion-lune de miel. La phase de réconciliation (où l\'autre est adorable et tout va bien) crée un espoir puissant que "ça va changer". La culpabilité, la honte, la peur et la dépendance économique ou émotionnelle peuvent également constituer des obstacles réels à la sortie. Si tu te reconnais dans ce tableau, sache que demander de l\'aide est la chose la plus courageuse que tu puisses faire.',
    ctaText: 'Évaluer ma situation →',
    accentColor: '#f97316',
    faqs: [
      { q: 'Comment différencier manipulation et simple maladresse ?', a: 'La manipulation est un schéma répété, pas un incident isolé. Elle provoque chez toi un sentiment chronique de culpabilité, de confusion et une remise en question de ta réalité. La maladresse ne crée pas ces effets systématiques.' },
      { q: 'Où chercher de l\'aide si je suis dans une relation manipulatrice ?', a: 'En France : la ligne nationale 3919 (Violences Femmes Info), les associations AVFT et France Victimes, et les CIDFF (Centres d\'Information sur les Droits des Femmes et des Familles). Un psy peut aussi t\'aider à clarifier ta situation.' },
      { q: 'La manipulation est-elle de la violence ?', a: 'Oui. La violence psychologique, dont la manipulation fait partie, est reconnue juridiquement en France depuis 2010 avec la loi sur les violences psychologiques au sein du couple.' },
      { q: 'Peut-on se manipuler soi-même inconsciemment ?', a: 'Les schémas répétitifs dans les relations peuvent être le signe de dynamiques inconscientes héritées de l\'enfance. Un travail thérapeutique peut aider à les identifier et les transformer.' },
      { q: 'Ce test est-il fiable pour toutes les formes de manipulation ?', a: 'Ce test couvre les formes les plus documentées de manipulation psychologique dans les relations intimes. Pour des contextes professionnels ou familiaux complexes, un professionnel peut offrir une évaluation plus complète.' },
    ],
  },

  'relation-toxique': {
    slug: 'relation-toxique',
    emoji: '⚠️',
    title: 'Test Relation Toxique',
    h1: 'Ma Relation est-elle Toxique ? — Test Gratuit 2025',
    metaTitle: 'Test Relation Toxique Gratuit 2025 — Ma Relation est-elle Saine ? Résultats Instantanés',
    metaDesc: 'Notre test évalue la santé de ta relation en 12 questions. Cycles toxiques, manque de respect, contrôle... Suis-je dans une relation toxique ? Gratuit et anonyme.',
    keywords: ['relation toxique test', 'ma relation est-elle toxique', 'relation malsaine', 'cycles toxiques', 'couple toxique', 'emprise amoureuse', 'relation saine vs toxique'],
    intro: 'Toute relation traverse des périodes difficiles. Mais une relation toxique se distingue par un schéma répété de comportements nocifs qui érode progressivement ton bien-être, ton estime de toi et ta liberté d\'être toi-même. La frontière entre "relation difficile" et "relation toxique" n\'est pas toujours évidente — surtout de l\'intérieur. Ce test t\'aide à évaluer objectivement la santé de ta relation selon des critères établis.',
    s1Title: 'Signes d\'une relation toxique',
    s1: [
      '🎢 Cycles répétitifs — Tensions, explosion (conflit, violence verbale), réconciliation intense (lune de miel), retour des tensions. Cette montagne russe émotionnelle crée une dépendance.',
      '😶 Perte de soi — Tu ne sais plus qui tu es en dehors de la relation. Tes centres d\'intérêt, tes amis, ton identité ont progressivement disparu.',
      '⚖️ Déséquilibre chronique — L\'un donne constamment, l\'autre prend. Les efforts ne sont jamais reconnus. Tu marches sur des œufs pour ne pas déclencher une crise.',
      '🚫 Manque de respect répété — Critiques devant les autres, moqueries sur tes insécurités, minimisation de tes succès, dénigrement régulier.',
      '💔 Sentiment de "mal-aimé(e)" — Malgré tout l\'amour que tu donnes, tu ne te sens pas aimé(e), valorisé(e) ou en sécurité dans cette relation.',
    ],
    s2Title: 'Peut-on transformer une relation toxique ?',
    s2: 'Oui, si les deux partenaires reconnaissent le problème et s\'engagent sincèrement dans un travail thérapeutique. Mais si une seule personne fait des efforts et que les comportements nocifs persistent, la transformation est très peu probable. Il est aussi important de distinguer une relation avec des problèmes (qui se travaillent) d\'une relation fondamentalement déséquilibrée ou abusive (où la sécurité doit primer sur tout le reste).',
    ctaText: 'Analyser ma relation →',
    accentColor: '#dc2626',
    faqs: [
      { q: 'Peut-on aimer quelqu\'un et être dans une relation toxique ?', a: 'Oui, absolument. L\'amour pour une personne et la nocivité d\'une relation peuvent coexister. Le cœur peut aimer sincèrement quelqu\'un dont les comportements nous font du mal.' },
      { q: 'Pourquoi est-il si difficile de quitter une relation toxique ?', a: 'La dépendance émotionnelle créée par les cycles tension-réconciliation, la peur de la solitude, la honte, la culpabilité, et parfois la dépendance économique rendent la sortie très difficile malgré la souffrance.' },
      { q: 'Une relation toxique peut-elle laisser des séquelles ?', a: 'Oui, notamment un SSPT (syndrome de stress post-traumatique), une faible estime de soi persistante, des difficultés à faire confiance dans les futures relations. Une thérapie permet une guérison réelle.' },
      { q: 'Quelle aide existe en France pour les victimes de violence conjugale ?', a: 'La ligne 3919 (Violences Femmes Info), les CIDFF, et les associations locales d\'aide aux victimes. En urgence immédiate : le 17 (police) ou le 15 (SAMU).' },
      { q: 'Est-ce que faire ce test peut me aider à prendre une décision ?', a: 'Ce test peut t\'apporter de la clarté et un regard objectif sur ta situation. La décision t\'appartient entièrement. Un thérapeute peut t\'accompagner dans cette réflexion.' },
    ],
  },
};

const ALL_GUIDE_SLUGS = Object.keys(guides);

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return ALL_GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = guides[params.slug];
  if (!guide) return {};

  return {
    title: guide.metaTitle,
    description: guide.metaDesc,
    keywords: guide.keywords,
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDesc,
      url: `${BASE}/tests/${guide.slug}`,
      siteName: 'UrCecret',
      locale: 'fr_FR',
      type: 'article',
      images: [{ url: `/api/og?quiz=${guide.slug}`, width: 1200, height: 630, alt: guide.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metaTitle,
      description: guide.metaDesc,
      images: [`/api/og?quiz=${guide.slug}`],
    },
    alternates: { canonical: `${BASE}/tests/${guide.slug}` },
  };
}

export default function TestGuidePage({ params }: PageProps) {
  const guide = guides[params.slug];
  if (!guide) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'UrCecret', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Tests', item: `${BASE}/tests` },
          { '@type': 'ListItem', position: 3, name: guide.title, item: `${BASE}/tests/${guide.slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
      {
        '@type': 'Article',
        headline: guide.h1,
        description: guide.metaDesc,
        url: `${BASE}/tests/${guide.slug}`,
        inLanguage: 'fr',
        publisher: { '@type': 'Organization', name: 'UrCecret', url: BASE },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-[#09090b] text-white">

        {/* Header */}
        <header className="border-b border-white/5 sticky top-0 z-20" style={{ background: 'rgba(10,7,5,0.88)', backdropFilter: 'blur(16px)' }}>
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-display text-xl font-black">
              <span style={{ color: '#e8a94d' }}>Ur</span>
              <span className="text-white">Cecret</span>
            </Link>
            <Link href="/quizzes" className="text-xs text-stone-500 hover:text-white transition-colors">
              Tous les quiz →
            </Link>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-10">

          {/* Hero */}
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">{guide.emoji}</div>
            <h1 className="font-display text-3xl font-black text-white leading-tight mb-4">{guide.h1}</h1>
            <p className="text-stone-400 text-base leading-relaxed mb-8">{guide.intro}</p>

            {/* Primary CTA */}
            <Link
              href={`/quiz/${guide.slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-lg transition-all hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${guide.accentColor}cc, ${guide.accentColor})`, boxShadow: `0 6px 32px ${guide.accentColor}50` }}
            >
              {guide.ctaText}
            </Link>
            <p className="text-stone-600 text-xs mt-3">Gratuit · Anonyme · Résultats instantanés</p>
          </div>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="font-display text-xl font-black text-white mb-5">{guide.s1Title}</h2>
            <div className="space-y-3">
              {guide.s1.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 border border-white/8 text-sm text-zinc-300 leading-relaxed"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-xl font-black text-white mb-4">{guide.s2Title}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">{guide.s2}</p>
          </section>

          {/* Mid CTA */}
          <div
            className="rounded-2xl p-6 mb-10 text-center border border-white/10"
            style={{ background: `linear-gradient(135deg, ${guide.accentColor}18, ${guide.accentColor}08)` }}
          >
            <p className="text-white font-black text-lg mb-2">{guide.emoji} Prêt(e) à découvrir ton profil ?</p>
            <p className="text-zinc-500 text-sm mb-5">12 questions · Analyse personnalisée · 100% gratuit</p>
            <Link
              href={`/quiz/${guide.slug}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-white text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${guide.accentColor}cc, ${guide.accentColor})`, boxShadow: `0 4px 24px ${guide.accentColor}45` }}
            >
              {guide.ctaText}
            </Link>
          </div>

          {/* FAQ */}
          <section className="mb-10">
            <h2 className="text-xl font-black text-white mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {guide.faqs.map(({ q, a }, i) => (
                <div key={i} className="rounded-xl border border-white/8 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="px-5 py-4 text-white font-bold text-sm leading-snug">{q}</h3>
                  <p className="px-5 pb-4 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-3">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer CTA */}
          <div className="text-center py-8 border-t border-white/5">
            <p className="text-zinc-500 text-sm mb-4">
              Découvre aussi les autres tests UrCecret
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {[
                { slug: 'style-attachement', label: '🫀 Style attachement' },
                { slug: 'langages-amour', label: '💌 Langages amour' },
                { slug: 'gaslight', label: '🫧 Gaslighting' },
                { slug: 'burnout', label: '💤 Burnout' },
                { slug: 'narcissique', label: '🪞 Narcissisme' },
                { slug: 'manipule', label: '🎭 Manipulation' },
              ].filter((q) => q.slug !== guide.slug).slice(0, 4).map((q) => (
                <Link
                  key={q.slug}
                  href={`/tests/${q.slug}`}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white transition-colors border border-white/8 bg-white/[0.03]"
                >
                  {q.label}
                </Link>
              ))}
            </div>
            <Link href="/quizzes" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              Voir tous les 18 quiz →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

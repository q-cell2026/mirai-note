import { useState, useEffect } from "react";

// ═══════════════════════════════════════════
// みらいノート ACP App v11 — 医療法人内利用版
// 永続ストレージ対応・免責事項付き
// ═══════════════════════════════════════════

// ── 医療法人設定（ご自身の法人情報に書き換えてください）──
const CLINIC = {
  name: "医療法人東浩会",
  facilityName: "医療法人東浩会",
  admin: "",
  contact: "",
  lastUpdated: "2026年2月3日",
};

const C = {
  forest: "#2D5A3F", forestLight: "#3D7A56", forestDark: "#1E3F2D", forestPale: "#E8F2EC", forestGlow: "#D0E8D8",
  warm: "#FAF8F4", warmDark: "#F0ECE4", card: "#FFFFFF",
  terra: "#C4654A", terraLight: "#E8956E", terraPale: "#FDF0EB",
  gold: "#C49A3C", goldPale: "#FDF6E3",
  indigo: "#4A5899", indigoPale: "#ECEEF8",
  plum: "#8A4F7D", plumPale: "#F4ECF2",
  text: "#1A1A1A", textSoft: "#5A5A52", textMuted: "#9A9A90",
  border: "#E8E4DC", shadow: "0 2px 20px rgba(45,90,63,0.06)",
  shadowHover: "0 4px 28px rgba(45,90,63,0.10)",
};

const sectionColors = {
  values: { bg: C.forestPale, accent: C.forest, glow: C.forestGlow },
  lifeGoals: { bg: C.goldPale, accent: C.gold, glow: "#F5E9C8" },
  medicalGeneral: { bg: C.indigoPale, accent: C.indigo, glow: "#D8DCF0" },
  lifeSupport: { bg: C.terraPale, accent: C.terra, glow: "#F5DDD4" },
  carePlace: { bg: C.plumPale, accent: C.plum, glow: "#E8D8E4" },
  proxy: { bg: "#EAF4F4", accent: "#3A8A8A", glow: "#D0EAEA" },
  spiritual: { bg: "#F0EDF8", accent: "#6A5AAC", glow: "#DDD8F0" },
  afterlife: { bg: "#F0F4EA", accent: "#5A8A3A", glow: "#D8EAC8" },
  messages: { bg: "#FDF2F4", accent: "#BA4A6A", glow: "#F4D4DC" },
};

const familyMembers = [
  { id: "hanako", name: "田中 花子", role: "長女", avatar: "🌸", color: "#D4708A" },
  { id: "taro", name: "佐藤 太郎", role: "主治医", avatar: "👨‍⚕️", color: "#4A7A9A" },
  { id: "jiro", name: "田中 次郎", role: "長男", avatar: "🌊", color: "#5A8A6A" },
];

const reactionTypes = [
  { id: "confirmed", emoji: "✅", label: "確認しました" },
  { id: "talk", emoji: "💬", label: "話し合いたい" },
  { id: "agree", emoji: "🤝", label: "同意します" },
  { id: "concern", emoji: "🤔", label: "気になる点あり" },
  { id: "heart", emoji: "❤️", label: "想いを受け止めました" },
];

const acpSections = [
  { id: "values", title: "大切にしたい価値観", icon: "💎", desc: "最も大切なことを選んでください（複数可）", summaryLabel: "大切にしていること", type: "multi",
    choices: [
      { id: "v1", label: "家族と過ごす時間", emoji: "👨‍👩‍👧‍👦", short: "家族" },
      { id: "v2", label: "痛みや苦しみがないこと", emoji: "🌿", short: "苦痛なし" },
      { id: "v3", label: "自分で判断・行動できること", emoji: "🦋", short: "自立" },
      { id: "v4", label: "意識がはっきりしていること", emoji: "💡", short: "意識明瞭" },
      { id: "v5", label: "自宅で過ごすこと", emoji: "🏠", short: "自宅" },
      { id: "v6", label: "人に迷惑をかけないこと", emoji: "🤲", short: "負担軽減" },
      { id: "v7", label: "信仰・スピリチュアルな安らぎ", emoji: "🙏", short: "信仰" },
      { id: "v8", label: "趣味や楽しみを続けること", emoji: "🎨", short: "趣味" },
      { id: "v9", label: "社会とのつながり", emoji: "🌐", short: "つながり" },
      { id: "v10", label: "尊厳を保つこと", emoji: "✨", short: "尊厳" },
    ], freeText: true, freeTextLabel: "その他に大切にしたいこと" },
  { id: "lifeGoals", title: "残りの人生でしたいこと", icon: "⭐", desc: "大切にしたい目標を選んでください", summaryLabel: "やりたいこと", type: "multi",
    choices: [
      { id: "g1", label: "孫の成長を見届けたい", emoji: "👶", short: "孫の成長" },
      { id: "g2", label: "家族旅行に行きたい", emoji: "✈️", short: "旅行" },
      { id: "g3", label: "感謝の気持ちを伝えたい", emoji: "💌", short: "感謝を伝える" },
      { id: "g4", label: "身辺整理をしておきたい", emoji: "📦", short: "身辺整理" },
      { id: "g5", label: "会いたい人に会いたい", emoji: "🤝", short: "再会" },
      { id: "g6", label: "作品や記録を残したい", emoji: "📖", short: "記録を残す" },
    ], freeText: true, freeTextLabel: "その他にしたいこと" },
  { id: "medicalGeneral", title: "医療に対する基本的な考え方", icon: "🏥", desc: "基本姿勢を選んでください", summaryLabel: "医療の基本姿勢", type: "single",
    choices: [
      { id: "m1", label: "できる限りの治療を望む", emoji: "💪", short: "積極治療", desc: "可能性があるなら積極的に" },
      { id: "m2", label: "バランスを重視したい", emoji: "⚖️", short: "バランス重視", desc: "効果と負担を考えて" },
      { id: "m3", label: "自然な経過を大切にしたい", emoji: "🍃", short: "自然な経過", desc: "穏やかさを優先" },
      { id: "m4", label: "苦痛の緩和を最優先にしたい", emoji: "🌸", short: "緩和優先", desc: "痛みを取り除くことを重視" },
      { id: "m5", label: "その時の状況で判断したい", emoji: "🔄", short: "状況次第", desc: "状況に応じて考えたい" },
    ], freeText: true, freeTextLabel: "医療に関する補足" },
  { id: "lifeSupport", title: "延命治療についての希望", icon: "💗", desc: "各処置の希望を選んでください", summaryLabel: "延命治療の希望", type: "matrix",
    items: [
      { id: "ls_cpr", label: "心肺蘇生（CPR）", short: "CPR", desc: "心臓停止時の蘇生処置" },
      { id: "ls_vent", label: "人工呼吸器", short: "人工呼吸器", desc: "機械による呼吸補助" },
      { id: "ls_tube", label: "経管栄養", short: "経管栄養", desc: "チューブ栄養補給" },
      { id: "ls_iv", label: "点滴", short: "点滴", desc: "水分補給の点滴" },
      { id: "ls_dialysis", label: "人工透析", short: "透析", desc: "血液浄化" },
    ],
    matrixOptions: [
      { id: "yes", label: "希望する", short: "○", color: C.forest },
      { id: "limited", label: "条件付き", short: "△", color: C.gold },
      { id: "no", label: "希望しない", short: "✕", color: C.terra },
      { id: "undecided", label: "未定", short: "？", color: C.textMuted },
    ], freeText: true, freeTextLabel: "延命治療に関する補足" },
  { id: "carePlace", title: "療養・最期の場所", icon: "🏡", desc: "過ごしたい場所を選んでください", summaryLabel: "過ごしたい場所", type: "single",
    choices: [
      { id: "p1", label: "自宅", emoji: "🏠", short: "自宅", desc: "住み慣れた家" },
      { id: "p2", label: "病院", emoji: "🏥", short: "病院", desc: "医療体制が整った環境" },
      { id: "p3", label: "ホスピス", emoji: "🌷", short: "ホスピス", desc: "緩和ケア" },
      { id: "p4", label: "介護施設", emoji: "🏢", short: "介護施設", desc: "介護充実" },
      { id: "p5", label: "家族に任せたい", emoji: "👪", short: "家族判断", desc: "家族に委ねたい" },
    ], freeText: true, freeTextLabel: "場所に関する補足" },
  { id: "proxy", title: "代理意思決定者", icon: "🤝", desc: "代わりに決めてくれる人", summaryLabel: "代理意思決定者", type: "form",
    fields: [
      { id: "proxy_name", label: "氏名", placeholder: "例：田中 花子" },
      { id: "proxy_relation", label: "続柄", placeholder: "例：長女" },
      { id: "proxy_phone", label: "連絡先", placeholder: "例：090-1234-5678" },
    ],
    subChoices: { title: "委任範囲", type: "single", choices: [
      { id: "pr1", label: "すべて任せる", emoji: "🔓", short: "全権委任" },
      { id: "pr2", label: "希望に沿って判断", emoji: "📋", short: "希望に沿って" },
      { id: "pr3", label: "主治医と相談", emoji: "👨‍⚕️", short: "主治医相談" },
      { id: "pr4", label: "家族で話し合い", emoji: "👨‍👩‍👧‍👦", short: "家族会議" },
    ]}, freeText: true, freeTextLabel: "代理人への伝言" },
  { id: "spiritual", title: "精神的な希望", icon: "🕊️", desc: "心の安らぎの希望", summaryLabel: "心の安らぎ", type: "multi",
    choices: [
      { id: "s1", label: "宗教者に来てほしい", emoji: "🙏", short: "宗教者" },
      { id: "s2", label: "静かな音楽", emoji: "🎵", short: "音楽" },
      { id: "s3", label: "家族にそばに", emoji: "👨‍👩‍👧", short: "家族と" },
      { id: "s4", label: "一人で静かに", emoji: "🌙", short: "静寂" },
      { id: "s5", label: "思い出の品", emoji: "📷", short: "思い出" },
      { id: "s6", label: "自然が見える", emoji: "🌳", short: "自然" },
    ], freeText: true, freeTextLabel: "その他" },
  { id: "afterlife", title: "亡くなった後のこと", icon: "🌅", desc: "葬儀など", summaryLabel: "その後のこと", type: "multi",
    choices: [
      { id: "a1", label: "家族葬", emoji: "🕯️", short: "家族葬" },
      { id: "a2", label: "一般葬", emoji: "🌹", short: "一般葬" },
      { id: "a3", label: "直葬", emoji: "✋", short: "直葬" },
      { id: "a4", label: "臓器提供", emoji: "💝", short: "臓器提供" },
      { id: "a6", label: "お墓", emoji: "🪦", short: "お墓" },
      { id: "a7", label: "自然葬", emoji: "🌊", short: "自然葬" },
      { id: "a8", label: "家族に任せる", emoji: "👪", short: "家族判断" },
    ], freeText: true, freeTextLabel: "その他" },
  { id: "messages", title: "大切な人へのメッセージ", icon: "💌", desc: "伝えたい気持ち", summaryLabel: "伝えたいこと", type: "multi",
    choices: [
      { id: "msg1", label: "感謝しています", emoji: "🙏", short: "感謝" },
      { id: "msg2", label: "揉めないでほしい", emoji: "🤝", short: "平和に" },
      { id: "msg3", label: "笑って送ってほしい", emoji: "😊", short: "笑顔で" },
      { id: "msg4", label: "仲良く暮らして", emoji: "👨‍👩‍👧‍👦", short: "仲良く" },
      { id: "msg5", label: "自分の人生を大切に", emoji: "🌟", short: "自分らしく" },
      { id: "msg6", label: "幸せな人生でした", emoji: "🌈", short: "幸せでした" },
    ], freeText: true, freeTextLabel: "自由にメッセージを書く", freeTextLarge: true },
];

const learnCategories = [
  { id: "basics", title: "ACPの基本", icon: "📋", color: C.forest },
  { id: "medical", title: "医療知識", icon: "🏥", color: C.indigo },
  { id: "family", title: "家族との対話", icon: "👨‍👩‍👧‍👦", color: C.terra },
  { id: "mental", title: "こころの準備", icon: "🕊️", color: "#6A5AAC" },
  { id: "legal", title: "制度・法律", icon: "⚖️", color: C.gold },
];

const eduItems = [
  { id: 1, cat: "basics", title: "ACPとは何か？", emoji: "📋", summary: "将来の医療やケアについて話し合うプロセス", readTime: "3分",
    content: "アドバンス・ケア・プランニング（ACP）とは、将来の医療やケアについて、あなたの価値観や希望を前もって考え、信頼する人たちと共有するプロセスです。\n\n■ ACPのポイント\n\n・一度決めたら終わりではなく、繰り返し見直すプロセス\n・健康なうちから始めることが理想的\n・病状が変わったり、人生の節目に見直す\n・本人の意思を最も大切にする\n・家族や医療者と一緒に考える\n\n■ なぜACPが大切なのか\n\n突然の病気や事故で自分の意思を伝えられなくなることがあります。そうした時に、あなたの価値観や希望を知っている人がいれば、あなたらしい最期を迎えるための判断ができます。\n\n■ ACPを始めるタイミング\n\n・定年退職した時\n・大きな病気をした時\n・身近な人を亡くした時\n・70歳を迎えた時\n・入院が必要になった時\n\nいつ始めても早すぎることはありません。" },
  { id: 2, cat: "basics", title: "ACPの進め方", emoji: "🗺️", summary: "ステップバイステップで考える", readTime: "4分",
    content: "■ ステップ1：自分の価値観を考える\n\n「何を大切にしたいか」「どう過ごしたいか」を自分自身に問いかけます。日常生活で大切にしていること、人生で譲れないことを書き出してみましょう。\n\n■ ステップ2：医療について学ぶ\n\n延命治療の種類や緩和ケアなど、医療の選択肢を理解します。分からないことは主治医に聞くことが大切です。\n\n■ ステップ3：信頼できる人を選ぶ\n\n自分が判断できなくなった時に代わりに決めてくれる人（代理意思決定者）を選びます。\n\n■ ステップ4：家族や医療者と話し合う\n\nあなたの考えを家族、主治医、看護師などに伝えます。一度に全部でなくても、少しずつ伝えましょう。\n\n■ ステップ5：記録して見直す\n\nこのアプリのように記録しておくことで、いつでも確認でき、状況が変わった時に更新できます。\n\n大切なのは「決めること」よりも「話し合うこと」そのものです。" },
  { id: 3, cat: "basics", title: "ACPと事前指示書の違い", emoji: "📝", summary: "似ているけれど違うもの", readTime: "2分",
    content: "■ 事前指示書（アドバンス・ディレクティブ）\n\n特定の医療処置について「する・しない」を文書で残すもの。法的な効力を持つ場合がありますが、想定外の状況には対応しにくいです。\n\n■ ACP（アドバンス・ケア・プランニング）\n\nより広い概念で、価値観や希望を話し合うプロセス全体を指します。文書だけでなく、対話を重視します。\n\n■ 主な違い\n\n・事前指示書：結果（文書）に重点\n・ACP：プロセス（対話）に重点\n\n・事前指示書：一度作成\n・ACP：繰り返し見直す\n\n・事前指示書：医療処置が中心\n・ACP：人生の価値観全体\n\nACPの中で事前指示書を作ることもありますが、ACPはそれだけにとどまりません。" },
  { id: 4, cat: "medical", title: "心肺蘇生（CPR）とは", emoji: "❤️‍🩹", summary: "心臓が止まった時の蘇生処置", readTime: "3分",
    content: "■ 心肺蘇生とは\n\n心臓や呼吸が止まった時に、胸骨圧迫（心臓マッサージ）や人工呼吸、電気ショック（AED）を行って心臓を再び動かそうとする処置です。\n\n■ 知っておきたいこと\n\n・高齢者や重い病気の方の場合、蘇生が成功しても元の状態に回復できないことがある\n・肋骨が折れるなどの身体的負担がある\n・蘇生後に意識が戻らない場合もある\n・病院外で心停止した高齢者の社会復帰率は約3%\n\n■ DNARとは\n\n「Do Not Attempt Resuscitation」の略で、心肺停止時に蘇生を行わないという意思表示です。治療の放棄ではなく、自然な最期を選ぶことです。" },
  { id: 5, cat: "medical", title: "人工呼吸器について", emoji: "🫁", summary: "機械で呼吸を助ける治療", readTime: "3分",
    content: "■ 人工呼吸器とは\n\n自分で十分に呼吸ができなくなった時に、機械の力で肺に空気を送り込む装置です。口や鼻からチューブを入れる方法と、首に穴を開ける（気管切開）方法があります。\n\n■ メリット\n\n・呼吸不全から命を救うことができる\n・回復までの「つなぎ」として使える\n・肺炎などの一時的な病気では外せることも多い\n\n■ デメリット\n\n・チューブが入っている間は話せない\n・長期使用では感染症のリスクが高まる\n・一度つけると外す判断が難しいことがある\n\n■ 考えるポイント\n\n「一時的に使って回復を目指す」のか「ずっとつけ続ける」のかで意味が大きく変わります。条件付き（一時的なら希望する等）で考えることもできます。" },
  { id: 6, cat: "medical", title: "経管栄養と点滴", emoji: "💧", summary: "口から食べられなくなった時", readTime: "3分",
    content: "■ 経管栄養とは\n\n口から食事ができなくなった時に、チューブを通して栄養を補給する方法です。鼻から胃に管を入れる方法（経鼻）と、お腹から直接胃に穴を開ける方法（胃ろう）があります。\n\n■ 胃ろう（PEG）\n\n・手術で造設、長期栄養に向いている\n・管理が比較的楽で在宅でも可能\n・口から少し食べることと併用できる場合も\n\n■ 終末期の栄養\n\n病気の終末期では、身体が栄養を受け付けなくなることが自然な過程です。無理な栄養補給はかえって苦痛を増すことがあります。「食べたいものを食べたい分だけ」という考え方もあります。" },
  { id: 7, cat: "medical", title: "緩和ケアとは", emoji: "🌸", summary: "苦痛を和らげるケア", readTime: "4分",
    content: "■ 緩和ケアとは\n\n痛みや苦しみを和らげ、その人らしい生活の質を保つためのケアです。「治療をあきらめる」ことではなく、治療と並行して受けられます。\n\n■ 緩和ケアが対応する苦痛\n\n・身体的苦痛：痛み、息苦しさ、吐き気、だるさ\n・精神的苦痛：不安、恐怖、抑うつ\n・社会的苦痛：仕事、経済、家族関係\n・スピリチュアルペイン：生きる意味、死への恐れ\n\n■ 受けられる場所\n\n・病院の緩和ケアチーム\n・緩和ケア病棟（ホスピス）\n・在宅緩和ケア（訪問診療・訪問看護）\n\n■ よくある誤解\n\n✕「最期の手段」→ ○ 早期から受けられる\n✕「痛みを我慢すべき」→ ○ 我慢する必要はない\n✕「治療をやめること」→ ○ 治療と併用できる\n\n緩和ケアを受けた方が、受けなかった方より長く生きたという研究もあります。" },
  { id: 8, cat: "medical", title: "人工透析について", emoji: "🔬", summary: "腎臓の機能を代替する治療", readTime: "3分",
    content: "■ 人工透析とは\n\n腎臓が十分に働けなくなった時に、機械で血液中の老廃物や余分な水分を除去する治療です。\n\n■ 血液透析\n\n・週3回、1回4〜5時間の通院が必要\n・生活の制約が大きい\n\n■ 腹膜透析\n\n・自宅で毎日行える\n・通院は月1〜2回\n\n■ 透析を始めない・やめるという選択\n\n高齢の方や他の重い病気がある方は、透析をしないという選択も尊重されます。透析をしない場合、緩和ケアで苦痛を和らげながら過ごすことができます。" },
  { id: 9, cat: "family", title: "家族と話し合いを始めるコツ", emoji: "💬", summary: "自然に会話を始める方法", readTime: "3分",
    content: "■ 切り出し方のヒント\n\n・「テレビでACPの番組を見たんだけど…」\n・「友達の親御さんが入院して考えさせられた」\n・「このアプリで少し考えてみたんだけど」\n・「自分がもしもの時のことを話しておきたくて」\n\n■ 話しやすい環境をつくる\n\n・お茶を飲みながらリラックスした場で\n・全員揃わなくても、まず一番話しやすい人と\n・一度にすべてを決めようとしない\n・「正解はない」ということをお互い確認する\n\n■ うまくいかない時は\n\n・時間を置いて再トライ\n・手紙やこのアプリを見せる\n・主治医や看護師に同席してもらう" },
  { id: 10, cat: "family", title: "家族が反対する時の対処法", emoji: "🤝", summary: "意見が合わない時", readTime: "3分",
    content: "■ なぜ反対するのか\n\n家族が反対する理由の多くは「愛情」から来ています。\n・少しでも長く一緒にいたい\n・死を考えることが怖い\n・自分が決めることへの重圧\n\n■ 対処のヒント\n\n・反対の裏にある感情に寄り添う\n・「あなたのことが心配だから話したい」と伝える\n・専門家を交えて話す\n・小さなことから合意する\n・書面で残す安心感を伝える\n\n最終的に決めるのはあなた自身。ただし家族にも準備の時間が必要です。" },
  { id: 11, cat: "family", title: "代理意思決定者の選び方", emoji: "🤲", summary: "誰に託すか、どう伝えるか", readTime: "3分",
    content: "■ 選ぶポイント\n\n・あなたの価値観をよく理解している人\n・冷静に判断できる人\n・あなたの希望を優先できる人\n・医療者とコミュニケーションが取れる人\n\n■ 配偶者がベストとは限らない\n\n配偶者は感情的になりやすい場合も。冷静な子供や兄弟が適任なこともあります。\n\n■ 代理人に伝えておくこと\n\n・あなたの価値観\n・具体的な医療の希望\n・「迷った時はこう判断して」という基準\n・「罪悪感を感じないで」という言葉" },
  { id: 12, cat: "mental", title: "死への恐れと向き合う", emoji: "🌅", summary: "不安を和らげるヒント", readTime: "4分",
    content: "■ 死を恐れるのは自然なこと\n\n死への恐れは人間として自然な感情です。\n\n■ 恐れの種類\n\n・痛みや苦しみへの恐れ → 緩和ケアで対応できる\n・意識がなくなることへの恐れ\n・家族を残していく不安\n・人生をやり残した後悔\n\n■ 恐れを和らげる方法\n\n・信頼できる人に話す\n・このアプリでACPを進める（コントロール感）\n・緩和ケアについて学ぶ\n・今日をしっかり生きる\n\n■ 「良い最期」とは\n\n多くの人が望む「良い最期」：\n・痛みがないこと\n・大切な人がそばにいること\n・自分らしさが保たれていること\n・感謝を伝えられていること\n・準備ができていること\n\nACPはこの「準備」そのものです。" },
  { id: 13, cat: "mental", title: "グリーフケア", emoji: "🫂", summary: "家族の悲しみに備える", readTime: "3分",
    content: "■ グリーフ（悲嘆）とは\n\n大切な人を失った時の深い悲しみや喪失感です。\n\n■ あなたが今できること\n\n・感謝の気持ちを伝えておく\n・「悲しんでいい」と伝えておく\n・思い出を一緒に振り返る\n・実務的な準備で家族の負担を減らす\n・「十分してくれた」と伝えておく\n\n■ ACPとグリーフケア\n\n本人の意思が明確だと、家族の罪悪感が軽減されます。「本人が望んだことをしてあげられた」という安心感は、回復を助けます。" },
  { id: 14, cat: "mental", title: "人生の振り返りワーク", emoji: "📖", summary: "ライフレビューで自分を見つめる", readTime: "3分",
    content: "■ ライフレビューとは\n\n自分の人生を振り返り、意味づけするプロセスです。\n\n■ 振り返りの問いかけ\n\n【幼少期〜青年期】\n・一番楽しかった思い出は？\n・影響を受けた人は誰？\n\n【成人期】\n・一番誇りに思う達成は？\n・人生の転機は何だった？\n\n【現在】\n・今、一番大切にしていることは？\n・次の世代に伝えたいことは？\n\n■ 振り返りの効果\n\n・自分の価値観が明確になる\n・人生への感謝が深まる\n・「良い人生だった」と思える" },
  { id: 15, cat: "legal", title: "日本の終末期医療と法律", emoji: "⚖️", summary: "知っておきたい法的な枠組み", readTime: "3分",
    content: "■ 日本の現状\n\n日本には終末期医療の包括的な法律はまだありません。厚生労働省のガイドラインが実務の指針です。\n\n■ 厚労省ガイドライン（2018年改訂）\n\n・本人の意思が最も重要\n・確認できない場合は家族等と医療チームで判断\n・ACPの重要性を明記\n\n■ 事前指示書の法的効力\n\n・法的拘束力はない\n・しかし本人の意思の「証拠」として尊重される\n\n■ 尊厳死と安楽死\n\n・尊厳死：延命治療を行わず自然な死 → 合法\n・安楽死：薬物等で積極的に死 → 日本では違法" },
  { id: 16, cat: "legal", title: "介護保険と在宅サービス", emoji: "🏠", summary: "在宅で過ごすための支援制度", readTime: "3分",
    content: "■ 介護保険制度\n\n65歳以上が利用できる公的保険制度。要介護認定を受けるとサービスを1〜3割負担で利用できます。\n\n■ 在宅で利用できるサービス\n\n・訪問介護：食事、入浴、排泄の介助\n・訪問看護：医療的なケア\n・訪問診療：医師が自宅で診察\n・デイサービス：日帰り通所\n・福祉用具レンタル：ベッド、車椅子など\n\n■ 自宅で最期を迎えるには\n\n・在宅医を見つける\n・訪問看護と契約\n・ケアマネにプランを作ってもらう\n・家族の理解と協力\n・緊急時の対応を決めておく" },
];

const quizItems = [
  { id: "q1", question: "ACPは一度決めたら変更できない？", options: ["はい", "いいえ"], correct: 1, explanation: "ACPは何度でも見直せます。状況や気持ちが変われば、いつでも更新しましょう。" },
  { id: "q2", question: "日本で事前指示書に法的拘束力はある？", options: ["ある", "ない（ただし尊重される）"], correct: 1, explanation: "法的拘束力はありませんが、本人の意思を示す重要な証拠として医療現場で尊重されます。" },
  { id: "q3", question: "緩和ケアは治療と同時に受けられる？", options: ["受けられる", "治療を終えてから"], correct: 0, explanation: "緩和ケアは早い段階から治療と並行して受けられます。" },
  { id: "q4", question: "CPRを行わない選択はできる？", options: ["できる", "法律で義務"], correct: 0, explanation: "DNAR（蘇生不要）の意思表示は認められています。主治医と相談して決めましょう。" },
  { id: "q5", question: "代理意思決定者は必ず配偶者？", options: ["はい", "いいえ、誰でも指名できる"], correct: 1, explanation: "信頼でき、あなたの価値観を理解している人なら誰でも指名できます。" },
  { id: "q6", question: "胃ろうがあると口から食べられない？", options: ["食べられない", "食べられる場合もある"], correct: 1, explanation: "胃ろうは口からの食事と併用できる場合があります。" },
];

const glossaryItems = [
  { term: "ACP", reading: "エーシーピー", desc: "将来の医療・ケアについて話し合うプロセス" },
  { term: "DNAR", reading: "ディーエヌエーアール", desc: "心肺停止時に蘇生を行わない意思表示" },
  { term: "緩和ケア", reading: "かんわケア", desc: "痛みや苦しみを和らげ、生活の質を保つケア" },
  { term: "ホスピス", reading: "ホスピス", desc: "終末期の患者に緩和ケアを提供する専門施設" },
  { term: "胃ろう（PEG）", reading: "いろう", desc: "お腹に穴を開けて胃に直接栄養を入れる方法" },
  { term: "代理意思決定者", reading: "だいりいしけっていしゃ", desc: "本人に代わって医療の判断をする人" },
  { term: "事前指示書", reading: "じぜんしじしょ", desc: "将来の医療処置の希望を文書にしたもの" },
  { term: "尊厳死", reading: "そんげんし", desc: "延命治療を行わず自然な死を迎えること" },
  { term: "グリーフケア", reading: "グリーフケア", desc: "大切な人を失った悲しみへのケア" },
  { term: "リビングウィル", reading: "リビングウィル", desc: "終末期医療に関する意思を記した文書" },
  { term: "QOL", reading: "キューオーエル", desc: "Quality of Life。生活の質" },
  { term: "看取り", reading: "みとり", desc: "死を間近にした人の最期に寄り添うこと" },
  { term: "在宅医療", reading: "ざいたくいりょう", desc: "医師が自宅を訪問して行う医療" },
  { term: "スピリチュアルペイン", reading: "", desc: "生きる意味や死への恐怖に関わる苦痛" },
];

const initialFeedback = {
  values: [
    { memberId: "hanako", type: "reaction", reactionId: "confirmed", timestamp: "2026-01-28 14:30" },
    { memberId: "hanako", type: "comment", text: "家族との時間を大切にしてくれて嬉しいです。", timestamp: "2026-01-28 14:32" },
  ],
  lifeSupport: [
    { memberId: "taro", type: "reaction", reactionId: "talk", timestamp: "2026-01-29 10:20" },
    { memberId: "taro", type: "comment", text: "次回外来で具体的にお話ししましょう。", timestamp: "2026-01-29 10:22" },
  ],
  messages: [
    { memberId: "hanako", type: "reaction", reactionId: "heart", timestamp: "2026-01-28 15:00" },
    { memberId: "jiro", type: "reaction", reactionId: "heart", timestamp: "2026-01-30 20:15" },
  ],
};

// ═══════════════════════════════════════════
// 免責事項・利用規約
// ═══════════════════════════════════════════
const DISCLAIMER = {
  purpose: "本アプリ「みらいノート」は、アドバンス・ケア・プランニング（ACP）の対話支援ツールです。患者様ご自身の価値観や希望を整理し、ご家族や医療者との話し合いの「きっかけ」として活用いただくことを目的としています。",
  notMedical: [
    "本アプリは医療機器ではなく、医学的な診断・治療・助言を行うものではありません。",
    "本アプリに入力された内容は、法的拘束力のある「事前指示書」ではありません。",
    "本アプリの情報は一般的なACPに関する知識であり、個別の医療判断に代わるものではありません。",
    "医療上の判断は、必ず担当医師および医療チームとご相談ください。",
  ],
  dataHandling: [
    "入力データはお使いの端末内に自動保存されます。外部サーバーへの送信は行いません。",
    "データは端末・ブラウザに紐づくため、別の端末からはアクセスできません。",
    "大切な記録はPDF等にエクスポートし、バックアップを保管することを推奨します。",
    "「データをリセット」を実行するとすべての入力内容が完全に削除されます。",
    "エクスポートしたデータの管理は利用者ご自身の責任となります。",
  ],
  liability: [
    `本アプリの利用は、${CLINIC.name}${CLINIC.facilityName !== CLINIC.name ? `（${CLINIC.facilityName}）` : ""}の患者様およびそのご家族を対象としています。`,
    "本アプリの利用により生じたいかなる損害についても、開発者および当医療法人は責任を負いかねます。",
    "本アプリの内容は医療の進歩や法制度の変更に伴い、最新の情報と異なる場合があります。",
    "本アプリに記録した内容の最終的な確認・活用は、必ず担当医師との対話を通じて行ってください。",
  ],
  consent: "上記の免責事項を理解し、本アプリが医療行為の代替ではなく対話支援ツールであることに同意の上、利用を開始します。",
  usage: [
    "本アプリの記入内容は、ご本人の意思表示の参考資料として、担当医師・看護師・ケアマネジャー等の医療・介護チームに共有される場合があります。",
    "内容の共有範囲はご本人の同意に基づきます。",
    "ACPの内容はいつでも変更・撤回できます。「一度決めたら変えられない」ものではありません。",
    "定期的な見直し（年1回、または健康状態の変化時）を推奨します。",
  ],
};

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function ACPApp() {
  const [page, setPage] = useState("home");
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [answers, setAnswers] = useState({});
  const [freeTexts, setFreeTexts] = useState({});
  const [matrixAnswers, setMatrixAnswers] = useState({});
  const [formData, setFormData] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEdu, setSelectedEdu] = useState(null);
  const [learnTab, setLearnTab] = useState("articles");
  const [learnCat, setLearnCat] = useState(null);
  const [readArticles, setReadArticles] = useState([]);
  const [quizState, setQuizState] = useState({});
  const [glossarySearch, setGlossarySearch] = useState("");
  const [feedback, setFeedback] = useState(initialFeedback);
  const [feedbackOpen, setFeedbackOpen] = useState({});
  const [newComment, setNewComment] = useState({});
  const [demoMember, setDemoMember] = useState("hanako");
  const [showExportDone, setShowExportDone] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "", "saving", "saved", "error"
  const [loaded, setLoaded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // ── Persistent Storage ──────────────────
  const STORAGE_KEY = "mirai-note-acp-data";

  // Load on mount
  useEffect(() => {
    const load = async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (result?.value) {
          const d = JSON.parse(result.value);
          if (d.answers) setAnswers(d.answers);
          if (d.freeTexts) setFreeTexts(d.freeTexts);
          if (d.matrixAnswers) setMatrixAnswers(d.matrixAnswers);
          if (d.formData) setFormData(d.formData);
          if (d.feedback) setFeedback(d.feedback);
          if (d.readArticles) setReadArticles(d.readArticles);
          if (d.quizState) setQuizState(d.quizState);
          if (d.agreed !== undefined) setAgreed(d.agreed);
        }
      } catch (e) {
        // First time or no data yet — start fresh
      }
      setLoaded(true);
    };
    load();
  }, []);

  // Save on data change (debounced)
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      const save = async () => {
        setSaveStatus("saving");
        try {
          await window.storage.set(STORAGE_KEY, JSON.stringify({
            answers, freeTexts, matrixAnswers, formData,
            feedback, readArticles, quizState, agreed,
            lastSaved: new Date().toISOString(),
          }));
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus(""), 2000);
        } catch (e) {
          setSaveStatus("error");
          setTimeout(() => setSaveStatus(""), 3000);
        }
      };
      save();
    }, 800);
    return () => clearTimeout(timer);
  }, [answers, freeTexts, matrixAnswers, formData, feedback, readArticles, quizState, agreed, loaded]);

  // Reset all data
  const resetAllData = async () => {
    try { await window.storage.delete(STORAGE_KEY); } catch (e) {}
    setAnswers({}); setFreeTexts({}); setMatrixAnswers({}); setFormData({});
    setFeedback(initialFeedback); setReadArticles([]); setQuizState({});
    setAgreed(false); setShowResetConfirm(false); setPage("home");
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  // Helpers
  const toggleMulti = (sid, cid) => setAnswers(p => { const cur = p[sid] || []; return { ...p, [sid]: cur.includes(cid) ? cur.filter(c => c !== cid) : [...cur, cid] }; });
  const setSingleAns = (sid, cid) => setAnswers(p => ({ ...p, [sid]: cid }));
  const setMatrixAns = (iid, oid) => setMatrixAnswers(p => ({ ...p, [iid]: oid }));
  const setFT = (sid, v) => setFreeTexts(p => ({ ...p, [sid]: v }));
  const setFF = (fid, v) => setFormData(p => ({ ...p, [fid]: v }));
  const getSC = (s) => {
    if (s.type === "multi") return (answers[s.id]?.length > 0 || freeTexts[s.id]?.trim()) ? 1 : 0;
    if (s.type === "single") return answers[s.id] ? 1 : 0;
    if (s.type === "matrix") return s.items.filter(i => matrixAnswers[i.id]).length / s.items.length;
    if (s.type === "form") return s.fields.filter(f => formData[f.id]?.trim()).length / s.fields.length;
    return 0;
  };
  const totalPct = Math.round((acpSections.reduce((s, sec) => s + getSC(sec), 0) / acpSections.length) * 100);
  const completedCount = acpSections.filter(s => getSC(s) > 0).length;
  const getFB = (sid) => feedback[sid] || [];
  const getFBCount = (sid) => getFB(sid).length;
  const totalFB = Object.values(feedback).reduce((s, a) => s + a.length, 0);
  const addReaction = (sid, rid) => setFeedback(p => ({ ...p, [sid]: [...(p[sid] || []), { memberId: demoMember, type: "reaction", reactionId: rid, timestamp: new Date().toLocaleString("ja-JP") }] }));
  const addFBComment = (sid) => { const t = newComment[sid]?.trim(); if (!t) return; setFeedback(p => ({ ...p, [sid]: [...(p[sid] || []), { memberId: demoMember, type: "comment", text: t, timestamp: new Date().toLocaleString("ja-JP") }] })); setNewComment(p => ({ ...p, [sid]: "" })); };
  const getReactionSummary = (sid) => { const items = getFB(sid).filter(f => f.type === "reaction"); const g = {}; items.forEach(r => { if (!g[r.reactionId]) g[r.reactionId] = []; const m = familyMembers.find(x => x.id === r.memberId); if (m && !g[r.reactionId].includes(m.name)) g[r.reactionId].push(m.name); }); return g; };
  const getSectionSummary = (section) => {
    const sc = sectionColors[section.id] || { bg: C.forestPale, accent: C.forest };
    let tags = [], detail = null, hasContent = false;
    if (section.type === "multi") { tags = (answers[section.id] || []).map(id => { const ch = section.choices.find(c => c.id === id); return ch ? { emoji: ch.emoji, label: ch.short } : null; }).filter(Boolean); hasContent = tags.length > 0; }
    else if (section.type === "single") { const ch = section.choices.find(c => c.id === answers[section.id]); if (ch) { tags = [{ emoji: ch.emoji, label: ch.short }]; hasContent = true; } }
    else if (section.type === "matrix") { section.items.forEach(i => { const a = matrixAnswers[i.id]; if (a) { const o = section.matrixOptions.find(x => x.id === a); tags.push({ label: i.short, badge: o?.short, badgeColor: o?.color }); hasContent = true; } }); }
    else if (section.type === "form") { if (formData.proxy_name?.trim()) { detail = `${formData.proxy_name}${formData.proxy_relation ? `（${formData.proxy_relation}）` : ""}`; hasContent = true; } const sa = answers[section.id + "_sub"]; if (sa && section.subChoices) { const ch = section.subChoices.choices.find(c => c.id === sa); if (ch) tags.push({ emoji: ch.emoji, label: ch.short }); } }
    if (freeTexts[section.id]?.trim()) hasContent = true;
    return { tags, detail, freeNote: freeTexts[section.id]?.trim(), hasContent, color: sc };
  };
  const nav = (p, opts) => { setPage(p); if (opts?.section) setActiveSection(opts.section); else setActiveSection(null); setSelectedEdu(null); };

  // ═══════════════════════════════════════════
  // COMPONENTS
  // ═══════════════════════════════════════════
  const Chip = ({ selected, children, onClick, color }) => (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: 14,
      border: `2px solid ${selected ? (color || C.forest) : C.border}`,
      background: selected ? (color ? color + "12" : C.forestPale) : "#FAFAF6",
      color: selected ? (color || C.forest) : C.textSoft,
      fontWeight: selected ? 700 : 500, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
      fontFamily: "inherit", textAlign: "left", lineHeight: 1.4, width: "100%",
    }}>{children}{selected && <span style={{ marginLeft: "auto", fontSize: 16, opacity: 0.7 }}>✓</span>}</button>
  );

  const Card = ({ children, style, onClick }) => (
    <div onClick={onClick} style={{
      background: C.card, borderRadius: 18, padding: "16px 18px",
      border: `1px solid ${C.border}`, boxShadow: C.shadow,
      cursor: onClick ? "pointer" : "default",
      transition: "box-shadow 0.2s, transform 0.15s",
      ...style,
    }}>{children}</div>
  );

  // ═══════════════════════════════════════════
  // CONSENT / DISCLAIMER SCREENS
  // ═══════════════════════════════════════════
  const DisclaimerSection = ({ title, items, icon }) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: C.forest, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <span>{icon}</span>{title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.8, padding: "8px 12px", background: "#FAFAF6", borderRadius: 10, borderLeft: `3px solid ${C.forestGlow}` }}>{item}</div>
        ))}
      </div>
    </div>
  );

  const renderConsent = () => (
    <div style={{ padding: "0 16px 40px", maxWidth: 600, margin: "0 auto" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "40px 0 24px" }}>
        <div style={{ fontSize: 52, marginBottom: 8 }}>🌿</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.forest }}>みらいノート</div>
        <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: 2, marginTop: 2 }}>ADVANCE CARE PLANNING</div>
        <div style={{ fontSize: 12, color: C.forest, fontWeight: 600, marginTop: 12, padding: "5px 14px", background: C.forestPale, borderRadius: 10, display: "inline-block" }}>{CLINIC.facilityName}</div>
      </div>

      {/* Purpose */}
      <Card style={{ marginBottom: 14, borderColor: C.forestGlow }}>
        <div style={{ fontSize: 13, lineHeight: 1.9, color: C.textSoft }}>{DISCLAIMER.purpose}</div>
      </Card>

      {/* Key disclaimers */}
      <DisclaimerSection icon="⚕️" title="医療行為に関する免責" items={DISCLAIMER.notMedical} />
      <DisclaimerSection icon="🔒" title="データの取り扱い" items={DISCLAIMER.dataHandling} />
      <DisclaimerSection icon="⚖️" title="責任の範囲" items={DISCLAIMER.liability} />
      <DisclaimerSection icon="📋" title="ご利用にあたって" items={DISCLAIMER.usage} />

      {/* Consent box */}
      <div style={{ background: C.goldPale, borderRadius: 16, padding: "16px", border: `1.5px solid ${C.gold}30`, marginTop: 8, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, lineHeight: 1.8 }}>{DISCLAIMER.consent}</div>
        </div>
      </div>

      <button onClick={() => setAgreed(true)} style={{
        width: "100%", padding: "18px", borderRadius: 16, border: "none",
        background: `linear-gradient(135deg, ${C.forest}, ${C.forestLight})`,
        color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
        boxShadow: "0 6px 24px rgba(45,90,63,0.25)", letterSpacing: 0.5,
      }}>✅ 同意して利用を開始する</button>

      <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: C.textMuted, lineHeight: 1.6 }}>
        {CLINIC.name}{CLINIC.facilityName !== CLINIC.name ? `（${CLINIC.facilityName}）` : ""}<br/>
        {CLINIC.admin && <>管理者: {CLINIC.admin}　</>}{CLINIC.contact && <>{CLINIC.contact}<br/></>}
        最終更新: {CLINIC.lastUpdated}
      </div>
    </div>
  );

  const renderTerms = () => (
    <div style={{ padding: "16px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
      <button onClick={() => setShowTerms(false)} style={{ border: "none", background: "none", color: C.forest, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 12, padding: 0 }}>← 戻る</button>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.forest, marginBottom: 4 }}>📜 利用規約・免責事項</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>最終更新: {CLINIC.lastUpdated}</div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.forest, marginBottom: 6 }}>本アプリの目的</div>
        <div style={{ fontSize: 13, lineHeight: 1.9, color: C.textSoft }}>{DISCLAIMER.purpose}</div>
      </Card>

      <DisclaimerSection icon="⚕️" title="医療行為に関する免責" items={DISCLAIMER.notMedical} />
      <DisclaimerSection icon="🔒" title="データの取り扱い" items={DISCLAIMER.dataHandling} />
      <DisclaimerSection icon="⚖️" title="責任の範囲" items={DISCLAIMER.liability} />
      <DisclaimerSection icon="📋" title="ご利用にあたって" items={DISCLAIMER.usage} />

      <Card style={{ background: C.warmDark }}>
        <div style={{ fontSize: 12, lineHeight: 1.8, color: C.textSoft, textAlign: "center" }}>
          <div style={{ fontWeight: 700, color: C.text, marginBottom: 4 }}>{CLINIC.name}</div>
          {CLINIC.facilityName !== CLINIC.name && <>{CLINIC.facilityName}<br/></>}
          {CLINIC.admin && <>{CLINIC.admin}</>}{CLINIC.admin && CLINIC.contact && "　"}{CLINIC.contact && <>{CLINIC.contact}</>}
        </div>
      </Card>
    </div>
  );

  // ═══════════════════════════════════════════
  // FEEDBACK PANEL
  // ═══════════════════════════════════════════
  const FeedbackPanel = ({ sectionId }) => {
    const items = getFB(sectionId); const isOpen = feedbackOpen[sectionId]; const reactions = getReactionSummary(sectionId);
    return (
      <div style={{ marginTop: 16, borderRadius: 16, border: `1.5px solid ${C.border}`, background: "#FDFCF9", overflow: "hidden" }}>
        <button onClick={() => setFeedbackOpen(p => ({ ...p, [sectionId]: !p[sectionId] }))}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          <span style={{ fontSize: 16 }}>👥</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text, flex: 1, textAlign: "left" }}>家族のフィードバック</span>
          {items.length > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: C.forest, background: C.forestPale, padding: "2px 8px", borderRadius: 10 }}>{items.length}件</span>}
          <span style={{ fontSize: 12, color: C.textMuted, transition: "transform 0.25s", transform: isOpen ? "rotate(180deg)" : "" }}>▼</span>
        </button>
        {isOpen && (
          <div style={{ padding: "0 16px 16px", animation: "fadeSlideIn 0.25s ease" }}>
            {Object.keys(reactions).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {Object.entries(reactions).map(([rid, names]) => { const rt = reactionTypes.find(r => r.id === rid); return rt ? (
                  <div key={rid} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, fontSize: 12 }}>
                    <span style={{ fontSize: 15 }}>{rt.emoji}</span><span style={{ fontWeight: 600 }}>{rt.label}</span><span style={{ color: C.textMuted, fontSize: 11 }}>— {names.join(", ")}</span>
                  </div>) : null; })}
              </div>
            )}
            {items.filter(f => f.type === "comment").map((item, i) => { const mem = familyMembers.find(m => m.id === item.memberId); return (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${mem?.color || C.forest}, ${mem?.color || C.forest}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{mem?.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{mem?.name} <span style={{ fontWeight: 400, color: C.textMuted }}>{mem?.role}</span></div>
                  <div style={{ fontSize: 13, color: C.textSoft, background: C.card, padding: "8px 12px", borderRadius: "4px 14px 14px 14px", border: `1px solid ${C.border}`, marginTop: 3, lineHeight: 1.7 }}>{item.text}</div>
                </div>
              </div>); })}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${C.border}` }}>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                {reactionTypes.map(rt => (
                  <button key={rt.id} onClick={() => addReaction(sectionId, rt.id)} style={{ padding: "5px 10px", borderRadius: 10, fontSize: 11, border: `1px solid ${C.border}`, background: C.card, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>{rt.emoji} {rt.label}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={newComment[sectionId] || ""} onChange={e => setNewComment(p => ({ ...p, [sectionId]: e.target.value }))} onKeyDown={e => e.key === "Enter" && addFBComment(sectionId)}
                  placeholder="コメントを入力..." style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 13, fontFamily: "inherit", outline: "none", background: "#FAFAF6" }} />
                <button onClick={() => addFBComment(sectionId)} style={{ padding: "10px 16px", borderRadius: 12, border: "none", background: C.forest, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>送信</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════
  // VISUAL SUMMARY
  // ═══════════════════════════════════════════
  const VisualSummary = ({ compact, onSectionClick }) => (
    <div>
      {!compact && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}><div style={{ fontSize: 15, fontWeight: 800, color: C.forest }}>📄 わたしのACPプラン</div><div style={{ fontSize: 12, color: C.forest, fontWeight: 700, background: C.forestPale, padding: "3px 10px", borderRadius: 10 }}>{completedCount}/{acpSections.length}</div></div>}
      <div style={{ display: "flex", flexDirection: "column", gap: compact ? 5 : 8 }}>
        {acpSections.map((sec, idx) => {
          const { tags, detail, freeNote, hasContent, color } = getSectionSummary(sec);
          const fc = getFBCount(sec.id);
          return (
            <div key={sec.id} onClick={() => onSectionClick?.(sec.id)} style={{
              background: hasContent ? color.bg : C.card, border: `1.5px solid ${hasContent ? color.glow : C.border}`,
              borderRadius: compact ? 12 : 16, padding: compact ? "8px 12px" : "12px 16px",
              cursor: onSectionClick ? "pointer" : "default", transition: "all 0.25s",
              animation: `fadeSlideIn 0.3s ease ${idx * 0.04}s both`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: compact ? 16 : 20 }}>{sec.icon}</span>
                <span style={{ fontSize: compact ? 11 : 13, fontWeight: 700, color: hasContent ? color.accent : C.textMuted, flex: 1 }}>{sec.summaryLabel}</span>
                {fc > 0 && <span style={{ fontSize: 9, fontWeight: 700, color: C.textSoft, background: "#F0EDE6", padding: "2px 7px", borderRadius: 8 }}>👥{fc}</span>}
                {!hasContent && <span style={{ fontSize: 10, color: C.textMuted, background: C.warmDark, padding: "2px 10px", borderRadius: 8, fontWeight: 500 }}>未回答</span>}
                {onSectionClick && <span style={{ fontSize: 11, color: C.textMuted }}>›</span>}
              </div>
              {hasContent && (
                <div style={{ marginTop: 6, paddingLeft: compact ? 24 : 28 }}>
                  {detail && <div style={{ fontSize: 12, fontWeight: 700, color: color.accent }}>{detail}</div>}
                  {tags.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{tags.map((t, i) => (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 8, background: `${t.badgeColor || color.accent}10`, border: `1px solid ${(t.badgeColor || color.accent) + "18"}`, fontSize: 11, fontWeight: 600, color: t.badgeColor || color.accent }}>
                      {t.emoji && <span>{t.emoji}</span>}{t.label}{t.badge && <span style={{ fontWeight: 800, color: t.badgeColor }}>{t.badge}</span>}
                    </span>))}</div>}
                  {freeNote && <div style={{ fontSize: 11, color: C.textSoft, fontStyle: "italic", marginTop: 3 }}>"{freeNote.length > 40 ? freeNote.slice(0, 40) + "…" : freeNote}"</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // SECTION EDITOR
  // ═══════════════════════════════════════════
  const renderSectionEditor = (section) => {
    if (!section) return null;
    const sc = sectionColors[section.id] || { bg: C.forestPale, accent: C.forest };
    return (
      <div style={{ animation: "fadeSlideIn 0.3s ease" }}>
        <div style={{ background: `linear-gradient(135deg, ${sc.accent}08, ${sc.accent}04)`, borderRadius: 18, padding: "18px", border: `1.5px solid ${sc.accent}18`, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 26, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))" }}>{section.icon}</span>
            <div><div style={{ fontSize: 17, fontWeight: 800, color: sc.accent }}>{section.title}</div>
            <div style={{ fontSize: 12, color: C.textSoft, marginTop: 1 }}>{section.desc}</div></div>
          </div>
        </div>
        {section.type === "multi" && (<div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{section.choices.map(ch => (
          <Chip key={ch.id} selected={(answers[section.id] || []).includes(ch.id)} onClick={() => toggleMulti(section.id, ch.id)} color={sc.accent}>
            <span style={{ fontSize: 20 }}>{ch.emoji}</span><div><div style={{ fontWeight: 600 }}>{ch.label}</div></div></Chip>))}</div>)}
        {section.type === "single" && (<div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{section.choices.map(ch => (
          <Chip key={ch.id} selected={answers[section.id] === ch.id} onClick={() => setSingleAns(section.id, ch.id)} color={sc.accent}>
            <span style={{ fontSize: 20 }}>{ch.emoji}</span><div><div style={{ fontWeight: 600 }}>{ch.label}</div>{ch.desc && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 1 }}>{ch.desc}</div>}</div></Chip>))}</div>)}
        {section.type === "matrix" && (<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{section.items.map(item => (
          <div key={item.id} style={{ background: "#FAFAF6", borderRadius: 14, padding: "12px 14px", border: `1.5px solid ${matrixAnswers[item.id] ? sc.accent + "30" : C.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>{item.desc}</div>
            <div style={{ display: "flex", gap: 6 }}>{section.matrixOptions.map(opt => (
              <button key={opt.id} onClick={() => setMatrixAns(item.id, opt.id)} style={{
                flex: 1, padding: "8px 4px", borderRadius: 10, fontSize: 11, fontWeight: 700,
                border: `2px solid ${matrixAnswers[item.id] === opt.id ? opt.color : C.border}`,
                background: matrixAnswers[item.id] === opt.id ? opt.color + "12" : "white",
                color: matrixAnswers[item.id] === opt.id ? opt.color : C.textMuted,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              }}>{opt.short}<br/><span style={{ fontSize: 9, fontWeight: 500 }}>{opt.label}</span></button>))}</div>
          </div>))}</div>)}
        {section.type === "form" && (<div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>{section.fields.map(f => (
            <div key={f.id}><label style={{ fontSize: 12, fontWeight: 600, color: C.textSoft, marginBottom: 4, display: "block" }}>{f.label}</label>
              <input value={formData[f.id] || ""} onChange={e => setFF(f.id, e.target.value)} placeholder={f.placeholder}
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#FAFAF6", boxSizing: "border-box" }} /></div>))}
          </div>
          {section.subChoices && (<div><div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{section.subChoices.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{section.subChoices.choices.map(ch => (
              <Chip key={ch.id} selected={answers[section.id + "_sub"] === ch.id} onClick={() => setSingleAns(section.id + "_sub", ch.id)}>
                <span style={{ fontSize: 18 }}>{ch.emoji}</span><div>{ch.label}</div></Chip>))}</div></div>)}
        </div>)}
        {section.freeText && (<div style={{ marginTop: 16 }}><label style={{ fontSize: 13, fontWeight: 600, color: C.textSoft, display: "block", marginBottom: 4 }}>✏️ {section.freeTextLabel}</label>
          <textarea value={freeTexts[section.id] || ""} onChange={e => setFT(section.id, e.target.value)} placeholder="自由に書いてください..." rows={section.freeTextLarge ? 5 : 3}
            style={{ width: "100%", padding: "12px 14px", borderRadius: 14, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", background: "#FAFAF6", boxSizing: "border-box", lineHeight: 1.8 }} /></div>)}
        <FeedbackPanel sectionId={section.id} />
      </div>
    );
  };

  // ═══════════════════════════════════════════
  // HOME
  // ═══════════════════════════════════════════
  const renderHome = () => (
    <div style={{ padding: "16px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
      {/* Welcome & progress */}
      <div style={{ textAlign: "center", padding: "20px 0 16px" }}>
        <div style={{ fontSize: 38, marginBottom: 4 }}>🌿</div>
        <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.6 }}>あなたらしい最期を、大切な人と一緒に考える</div>
        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 6 }}>💾 入力内容はこの端末に自動保存されます</div>
      </div>

      {/* Progress ring */}
      {totalPct > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", background: C.forestPale, borderRadius: 18, border: `1.5px solid ${C.forestGlow}`, marginBottom: 16 }}>
          <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
            <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="24" fill="none" stroke={C.border} strokeWidth="5" />
              <circle cx="28" cy="28" r="24" fill="none" stroke={C.forest} strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${totalPct * 1.508} 150.8`} transform="rotate(-90 28 28)" style={{ transition: "stroke-dasharray 0.6s ease" }} /></svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: C.forest }}>{totalPct}%</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.forest }}>{completedCount}/{acpSections.length} セクション回答済み</div>
            <div style={{ fontSize: 12, color: C.textSoft, marginTop: 2 }}>{totalPct === 100 ? "すべて記入しました！" : "あなたのペースで進めましょう"}</div>
          </div>
        </div>
      )}

      {/* Main CTA */}
      <button onClick={() => { setPage("step"); setCurrentStep(totalPct === 0 ? 0 : acpSections.findIndex(s => getSC(s) === 0)); }} style={{
        width: "100%", padding: "18px", borderRadius: 16, border: "none",
        background: `linear-gradient(135deg, ${C.forest}, ${C.forestLight})`,
        color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
        boxShadow: "0 6px 24px rgba(45,90,63,0.25)", marginBottom: 14,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        transition: "transform 0.15s", letterSpacing: 0.5,
      }}>{totalPct === 0 ? "🌱 ステップバイステップで始める" : totalPct === 100 ? "📝 内容を見直す" : "📝 続きから入力する"}</button>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          { p: "learn", icon: "📚", label: "学ぶ", sub: `${eduItems.length}記事`, color: C.gold },
          { p: "feedback", icon: "👥", label: "FB", sub: totalFB > 0 ? `${totalFB}件` : "—", color: C.terra },
          { p: "share", icon: "📤", label: "共有", sub: "出力", color: C.indigo },
        ].map(item => (
          <button key={item.p} onClick={() => nav(item.p)} style={{
            padding: "14px 8px", borderRadius: 14, border: `1px solid ${C.border}`,
            background: C.card, cursor: "pointer", fontFamily: "inherit", textAlign: "center",
            boxShadow: C.shadow, transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 22, marginBottom: 2 }}>{item.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.label}</div>
            <div style={{ fontSize: 10, color: C.textMuted }}>{item.sub}</div>
          </button>
        ))}
      </div>

      {/* ACP Summary */}
      <VisualSummary onSectionClick={(id) => nav("plan", { section: id })} />

      {/* Disclaimer footer */}
      <div style={{ marginTop: 24, padding: "14px 16px", background: C.warmDark, borderRadius: 14, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.7, marginBottom: 8 }}>
          ⚕️ 本アプリは対話支援ツールであり、医療行為・法的文書の代替ではありません。医療上の判断は必ず担当医師にご相談ください。
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setShowTerms(true)} style={{ fontSize: 11, color: C.forest, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, textDecoration: "underline" }}>利用規約・免責事項</button>
          <span style={{ fontSize: 10, color: C.textMuted }}>{CLINIC.facilityName}</span>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  // STEP
  // ═══════════════════════════════════════════
  const renderStep = () => { const s = acpSections[currentStep]; const sc = sectionColors[s.id]; return (
    <div style={{ padding: "12px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
        <button onClick={() => { if (currentStep > 0) setCurrentStep(s => s - 1); else nav("home"); }} style={{ border: "none", background: "none", color: C.forest, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", padding: 0 }}>← 戻る</button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: sc?.accent || C.forest, background: sc?.bg || C.forestPale, padding: "3px 10px", borderRadius: 10 }}>{currentStep + 1} / {acpSections.length}</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: C.border, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ height: "100%", width: `${((currentStep + 1) / acpSections.length) * 100}%`, background: `linear-gradient(90deg,${C.forest},${C.forestLight})`, borderRadius: 2, transition: "width 0.5s ease" }} />
      </div>
      {renderSectionEditor(s)}
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        {currentStep > 0 && <button onClick={() => setCurrentStep(s => s - 1)} style={{ flex: 1, padding: "15px", borderRadius: 14, border: `2px solid ${C.forest}`, background: "transparent", color: C.forest, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>前へ</button>}
        <button onClick={() => { if (currentStep < acpSections.length - 1) setCurrentStep(s => s + 1); else nav("home"); }} style={{ flex: 2, padding: "15px", borderRadius: 14, border: "none", background: `linear-gradient(135deg,${C.forest},${C.forestLight})`, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(45,90,63,0.25)" }}>{currentStep < acpSections.length - 1 ? "次へ →" : "✅ 完了！"}</button>
      </div>
    </div>
  ); };

  // ═══════════════════════════════════════════
  // PLAN / FEEDBACK
  // ═══════════════════════════════════════════
  const renderPlan = () => (
    <div style={{ padding: "16px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
      {activeSection ? (
        <div><button onClick={() => setActiveSection(null)} style={{ border: "none", background: "none", color: C.forest, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 12, padding: 0 }}>← サマリー</button>
        {renderSectionEditor(acpSections.find(s => s.id === activeSection))}</div>
      ) : <VisualSummary onSectionClick={id => setActiveSection(id)} />}
    </div>
  );

  const renderFeedback = () => {
    const all = []; Object.entries(feedback).forEach(([sid, items]) => { const sec = acpSections.find(s => s.id === sid); items.forEach(i => all.push({ ...i, sectionId: sid, sTitle: sec?.title, sIcon: sec?.icon })); });
    all.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    return (
      <div style={{ padding: "16px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.forest, marginBottom: 4 }}>👥 フィードバック一覧</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>家族や医療者からの反応</div>
        {/* Demo member switcher */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {familyMembers.map(m => (
            <button key={m.id} onClick={() => setDemoMember(m.id)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20,
              border: `2px solid ${demoMember === m.id ? m.color : C.border}`,
              background: demoMember === m.id ? m.color + "12" : C.card,
              cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600,
              color: demoMember === m.id ? m.color : C.textMuted,
            }}><span>{m.avatar}</span> {m.name}</button>
          ))}
        </div>
        {all.length === 0 && <div style={{ textAlign: "center", padding: 40, color: C.textMuted, fontSize: 13 }}>まだフィードバックがありません</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {all.map((item, i) => { const mem = familyMembers.find(m => m.id === item.memberId); const sc = sectionColors[item.sectionId]; return (
            <div key={i} onClick={() => nav("plan", { section: item.sectionId })}
              style={{ background: C.card, borderRadius: 16, padding: "14px 16px", border: `1px solid ${C.border}`, cursor: "pointer", animation: `fadeSlideIn 0.25s ease ${i * 0.03}s both`, boxShadow: C.shadow }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${mem?.color}, ${mem?.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{mem?.avatar}</div>
                <span style={{ fontSize: 13, fontWeight: 700, flex: 1 }}>{mem?.name}</span>
                <span style={{ fontSize: 10, color: C.textMuted }}>{item.timestamp}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{item.sIcon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: sc?.accent, background: sc?.bg, padding: "2px 8px", borderRadius: 8 }}>{item.sTitle}</span>
                {item.type === "reaction" && (() => { const rt = reactionTypes.find(r => r.id === item.reactionId); return rt ? <span style={{ fontSize: 12 }}>{rt.emoji} {rt.label}</span> : null; })()}
              </div>
              {item.type === "comment" && <div style={{ fontSize: 13, color: C.textSoft, marginTop: 6, padding: "8px 12px", background: "#FAFAF6", borderRadius: 10, borderLeft: `3px solid ${sc?.accent}30`, lineHeight: 1.6 }}>{item.text}</div>}
            </div>); })}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════
  // LEARN
  // ═══════════════════════════════════════════
  const renderLearn = () => {
    const filteredArticles = learnCat ? eduItems.filter(i => i.cat === learnCat) : eduItems;
    const filteredGlossary = glossarySearch ? glossaryItems.filter(g => g.term.includes(glossarySearch) || g.desc.includes(glossarySearch) || g.reading.includes(glossarySearch)) : glossaryItems;
    const readCount = readArticles.length;
    const quizAnswered = Object.keys(quizState).length;
    const quizCorrect = quizItems.filter(q => quizState[q.id] === q.correct).length;

    if (selectedEdu) return (
      <div style={{ padding: "16px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
        <button onClick={() => setSelectedEdu(null)} style={{ border: "none", background: "none", color: C.forest, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 12, padding: 0 }}>← 一覧に戻る</button>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 40 }}>{selectedEdu.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.forest, lineHeight: 1.3 }}>{selectedEdu.title}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                {selectedEdu.cat && (() => { const cat = learnCategories.find(c => c.id === selectedEdu.cat); return cat ? <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: cat.color + "12", color: cat.color, fontWeight: 600 }}>{cat.icon} {cat.title}</span> : null; })()}
                {selectedEdu.readTime && <span style={{ fontSize: 10, color: C.textMuted }}>⏱ {selectedEdu.readTime}</span>}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 14, color: C.text, lineHeight: 2.1, whiteSpace: "pre-wrap" }}>{selectedEdu.content}</div>
        </Card>
        {!readArticles.includes(selectedEdu.id) ? (
          <button onClick={() => setReadArticles(p => [...p, selectedEdu.id])} style={{
            width: "100%", padding: "14px", borderRadius: 14, border: "none",
            background: `linear-gradient(135deg,${C.forest},${C.forestLight})`,
            color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginTop: 14,
          }}>✅ 読了としてマーク</button>
        ) : (
          <div style={{ textAlign: "center", padding: 14, color: C.forest, fontWeight: 700, fontSize: 13 }}>✅ 読了済み</div>
        )}
      </div>
    );

    return (
      <div style={{ padding: "16px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.forest, marginBottom: 4 }}>📚 学習センター</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>ACPについて深く学びましょう</div>

        {/* Progress */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center" }}>
            <div><div style={{ fontSize: 22, fontWeight: 800, color: C.forest }}>{readCount}</div><div style={{ fontSize: 10, color: C.textMuted }}>/{eduItems.length} 記事</div></div>
            <div style={{ width: 1, background: C.border }} />
            <div><div style={{ fontSize: 22, fontWeight: 800, color: C.gold }}>{quizAnswered}</div><div style={{ fontSize: 10, color: C.textMuted }}>/{quizItems.length} クイズ</div></div>
            <div style={{ width: 1, background: C.border }} />
            <div><div style={{ fontSize: 22, fontWeight: 800, color: quizCorrect === quizItems.length && quizAnswered === quizItems.length ? C.forest : C.indigo }}>{quizCorrect}</div><div style={{ fontSize: 10, color: C.textMuted }}>正解数</div></div>
          </div>
        </Card>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 16, background: C.warmDark, borderRadius: 14, padding: 3 }}>
          {[{ id: "articles", label: "📖 記事" }, { id: "quiz", label: "🧩 クイズ" }, { id: "glossary", label: "📘 用語集" }].map(tab => (
            <button key={tab.id} onClick={() => setLearnTab(tab.id)} style={{
              flex: 1, padding: "10px 6px", borderRadius: 11, border: "none",
              background: learnTab === tab.id ? C.card : "transparent",
              color: learnTab === tab.id ? C.forest : C.textMuted,
              fontSize: 12, fontWeight: learnTab === tab.id ? 700 : 500,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: learnTab === tab.id ? "0 1px 6px rgba(0,0,0,0.06)" : "none",
              transition: "all 0.2s",
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Articles */}
        {learnTab === "articles" && (<div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14, paddingBottom: 4 }}>
            <button onClick={() => setLearnCat(null)} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: `1.5px solid ${!learnCat ? C.forest : C.border}`, background: !learnCat ? C.forestPale : C.card, color: !learnCat ? C.forest : C.textMuted, cursor: "pointer", fontFamily: "inherit" }}>すべて</button>
            {learnCategories.map(cat => (
              <button key={cat.id} onClick={() => setLearnCat(cat.id)} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: `1.5px solid ${learnCat === cat.id ? cat.color : C.border}`, background: learnCat === cat.id ? cat.color + "12" : C.card, color: learnCat === cat.id ? cat.color : C.textMuted, cursor: "pointer", fontFamily: "inherit" }}>{cat.icon} {cat.title}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredArticles.map((item, idx) => { const cat = learnCategories.find(c => c.id === item.cat); const isRead = readArticles.includes(item.id); return (
              <button key={item.id} onClick={() => setSelectedEdu(item)} style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 16px",
                background: C.card, borderRadius: 16, border: `1px solid ${isRead ? C.forestGlow : C.border}`,
                boxShadow: C.shadow, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                animation: `fadeSlideIn 0.3s ease ${idx * 0.03}s both`, opacity: isRead ? 0.8 : 1,
              }}>
                <span style={{ fontSize: 28 }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{item.title}</span>
                    {isRead && <span style={{ fontSize: 10, color: C.forest }}>✅</span>}
                  </div>
                  <div style={{ fontSize: 12, color: C.textSoft, marginBottom: 3 }}>{item.summary}</div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {cat && <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 6, background: cat.color + "12", color: cat.color, fontWeight: 600 }}>{cat.title}</span>}
                    <span style={{ fontSize: 10, color: C.textMuted }}>⏱ {item.readTime}</span>
                  </div>
                </div>
                <span style={{ color: C.textMuted, fontSize: 13 }}>›</span>
              </button>); })}
          </div>
        </div>)}

        {/* Quiz */}
        {learnTab === "quiz" && (<div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {quizItems.map((q, idx) => { const answered = quizState[q.id] !== undefined; const isCorrect = quizState[q.id] === q.correct; return (
              <Card key={q.id} style={{ borderColor: answered ? (isCorrect ? C.forestGlow : C.terra + "30") : C.border, animation: `fadeSlideIn 0.3s ease ${idx * 0.05}s both` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.forest, background: C.forestPale, width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>Q{idx + 1}</span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, flex: 1, lineHeight: 1.5 }}>{q.question}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {q.options.map((opt, oi) => {
                    const isSelected = quizState[q.id] === oi; const isThisCorrect = oi === q.correct;
                    let bc = C.border, bg = "#FAFAF6", tc = C.textSoft;
                    if (answered && isThisCorrect) { bc = C.forest; bg = C.forestPale; tc = C.forest; }
                    else if (answered && isSelected && !isThisCorrect) { bc = C.terra; bg = C.terraPale; tc = C.terra; }
                    return (
                      <button key={oi} onClick={() => { if (!answered) setQuizState(p => ({ ...p, [q.id]: oi })); }}
                        style={{ padding: "11px 14px", borderRadius: 12, fontSize: 13, fontWeight: 600, border: `2px solid ${bc}`, background: bg, color: tc, cursor: answered ? "default" : "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${bc}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 800, background: (isSelected || (answered && isThisCorrect)) ? bc : "transparent", color: (isSelected || (answered && isThisCorrect)) ? "#fff" : "transparent" }}>
                          {answered && isThisCorrect ? "○" : answered && isSelected ? "✕" : ""}
                        </span>{opt}
                      </button>);
                  })}
                </div>
                {answered && (
                  <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 12, background: isCorrect ? C.forestPale : C.terraPale, fontSize: 12, lineHeight: 1.7, color: isCorrect ? C.forest : C.terra, animation: "fadeSlideIn 0.3s ease" }}>
                    <span style={{ fontWeight: 700 }}>{isCorrect ? "✅ 正解！" : "❌ 不正解"}</span><br/>{q.explanation}
                  </div>)}
              </Card>); })}
          </div>
          {quizAnswered === quizItems.length && (
            <div style={{ textAlign: "center", padding: 24, marginTop: 12 }}>
              <div style={{ fontSize: 40 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.forest, marginTop: 4 }}>全問回答完了！</div>
              <div style={{ fontSize: 13, color: C.textSoft, marginTop: 4 }}>正解率: {Math.round((quizCorrect / quizItems.length) * 100)}%（{quizCorrect}/{quizItems.length}問）</div>
              <button onClick={() => setQuizState({})} style={{ marginTop: 12, padding: "10px 24px", borderRadius: 12, border: `2px solid ${C.forest}`, background: "transparent", color: C.forest, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>もう一度チャレンジ</button>
            </div>)}
        </div>)}

        {/* Glossary */}
        {learnTab === "glossary" && (<div>
          <input value={glossarySearch} onChange={e => setGlossarySearch(e.target.value)} placeholder="🔍 用語を検索..."
            style={{ width: "100%", padding: "11px 16px", borderRadius: 14, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: "inherit", outline: "none", background: "#FAFAF6", marginBottom: 14, boxSizing: "border-box" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {filteredGlossary.map((g, idx) => (
              <Card key={g.term} style={{ padding: "12px 16px", animation: `fadeSlideIn 0.2s ease ${idx * 0.02}s both` }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: C.forest }}>{g.term}</span>
                  {g.reading && <span style={{ fontSize: 11, color: C.textMuted }}>（{g.reading}）</span>}
                </div>
                <div style={{ fontSize: 13, color: C.textSoft, marginTop: 3, lineHeight: 1.6 }}>{g.desc}</div>
              </Card>))}
          </div>
        </div>)}
      </div>
    );
  };

  // ═══════════════════════════════════════════
  // SHARE
  // ═══════════════════════════════════════════
  const renderShare = () => (
    <div style={{ padding: "16px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.forest, marginBottom: 4 }}>📤 共有・エクスポート</div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>プランを家族や医療者と共有</div>
      <Card style={{ marginBottom: 12 }}><VisualSummary compact /></Card>
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.forest, marginBottom: 10 }}>👥 共有メンバー</div>
        {familyMembers.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < familyMembers.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{m.avatar}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div><div style={{ fontSize: 11, color: C.textMuted }}>{m.role}</div></div>
          </div>))}
      </Card>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.forest, marginBottom: 10 }}>📥 エクスポート</div>
        {["📄 PDFで保存", "🖨️ 印刷する", "📧 メールで送る"].map((l, i) => (
          <button key={i} onClick={() => { setShowExportDone(true); setTimeout(() => setShowExportDone(false), 2500); }} style={{
            width: "100%", padding: "13px", borderRadius: 12, marginBottom: 8,
            border: i === 0 ? "none" : `2px solid ${C.forest}`,
            background: i === 0 ? `linear-gradient(135deg,${C.forest},${C.forestLight})` : "transparent",
            color: i === 0 ? "#fff" : C.forest, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            boxShadow: i === 0 ? "0 4px 16px rgba(45,90,63,0.2)" : "none",
          }}>{l}</button>))}
        {showExportDone && <div style={{ textAlign: "center", padding: 10, color: C.forest, fontWeight: 700, fontSize: 12, background: C.forestPale, borderRadius: 10, animation: "fadeSlideIn 0.2s ease" }}>✅ 完了しました（デモ）</div>}
      </Card>

      {/* Disclaimer in export context */}
      <div style={{ marginTop: 14, padding: "12px 14px", background: C.warmDark, borderRadius: 12, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.7 }}>
          ⚠️ エクスポートされた記録は法的拘束力のある文書ではありません。ACPの内容は担当医師との対話を通じて確認してください。内容はいつでも変更できます。
        </div>
        <button onClick={() => setShowTerms(true)} style={{ fontSize: 11, color: C.forest, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, marginTop: 4, textDecoration: "underline" }}>利用規約・免責事項を確認</button>
      </div>

      {/* Data management */}
      <Card style={{ marginTop: 14, borderColor: C.terra + "30" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.terra, marginBottom: 6 }}>🗑️ データ管理</div>
        <div style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.7, marginBottom: 10 }}>
          入力データはこの端末に自動保存されています。すべてのデータを消去して初期状態に戻すことができます。
        </div>
        {!showResetConfirm ? (
          <button onClick={() => setShowResetConfirm(true)} style={{ padding: "10px 16px", borderRadius: 12, border: `2px solid ${C.terra}`, background: "transparent", color: C.terra, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>データをリセット</button>
        ) : (
          <div style={{ background: C.terraPale, borderRadius: 12, padding: "14px", border: `1.5px solid ${C.terra}30`, animation: "fadeSlideIn 0.2s ease" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.terra, marginBottom: 6 }}>⚠️ 本当にすべてのデータを削除しますか？</div>
            <div style={{ fontSize: 12, color: C.textSoft, marginBottom: 10, lineHeight: 1.6 }}>この操作は取り消せません。ACP入力、学習進捗、フィードバックがすべて消去されます。</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowResetConfirm(false)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `2px solid ${C.border}`, background: C.card, color: C.textSoft, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>キャンセル</button>
              <button onClick={resetAllData} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: C.terra, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>削除する</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  // ═══════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════
  const navItems = [
    { id: "home", label: "ホーム", icon: "🏠" },
    { id: "plan", label: "プラン", icon: "💗" },
    { id: "feedback", label: "FB", icon: "👥", badge: totalFB > 0 },
    { id: "learn", label: "学ぶ", icon: "📚", badge: readArticles.length > 0 },
    { id: "share", label: "共有", icon: "📤" },
  ];

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif", background: C.warm, minHeight: "100vh", color: C.text }}>
      {/* Loading screen */}
      {!loaded ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 12 }}>
          <div style={{ fontSize: 48, animation: "fadeIn 0.5s ease" }}>🌿</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.forest }}>データを読み込み中...</div>
        </div>
      ) : !agreed ? (
        <div>
          <div style={{ background: `linear-gradient(135deg, ${C.forest}, ${C.forestLight})`, color: "#fff", padding: "14px 20px 12px", boxShadow: "0 2px 20px rgba(45,90,63,0.2)" }}>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 0.5 }}>🌿 みらいノート</div>
            <div style={{ fontSize: 9, opacity: 0.5, letterSpacing: 2.5, marginTop: 1 }}>ADVANCE CARE PLANNING</div>
          </div>
          {renderConsent()}
        </div>
      ) : showTerms ? (
        <div>
          <div style={{ background: `linear-gradient(135deg, ${C.forest}, ${C.forestLight})`, color: "#fff", padding: "14px 20px 12px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 20px rgba(45,90,63,0.2)" }}>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 0.5 }}>🌿 みらいノート</div>
            <div style={{ fontSize: 9, opacity: 0.5, letterSpacing: 2.5, marginTop: 1 }}>ADVANCE CARE PLANNING</div>
          </div>
          {renderTerms()}
        </div>
      ) : (
        <div>
          {/* Header with facility branding */}
          <div style={{ background: `linear-gradient(135deg, ${C.forest}, ${C.forestLight})`, color: "#fff", padding: "14px 20px 12px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 20px rgba(45,90,63,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ cursor: "pointer" }} onClick={() => nav("home")}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: 0.5 }}>🌿 みらいノート</div>
                    <div style={{ fontSize: 9, opacity: 0.5, letterSpacing: 2.5, marginTop: 1 }}>ADVANCE CARE PLANNING</div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {saveStatus === "saving" && <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>保存中…</span>}
                  {saveStatus === "saved" && <span style={{ fontSize: 9, color: "#90EE90", animation: "fadeIn 0.3s ease" }}>✓ 保存済み</span>}
                  {saveStatus === "error" && <span style={{ fontSize: 9, color: "#FFB4B4" }}>⚠ 保存失敗</span>}
                  {totalFB > 0 && <span onClick={() => nav("feedback")} style={{ fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.18)", padding: "4px 10px", borderRadius: 16, cursor: "pointer", backdropFilter: "blur(4px)" }}>👥 {totalFB}</span>}
                  <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: 16 }}>{totalPct}%</span>
                </div>
                <div style={{ fontSize: 9, opacity: 0.45 }}>{CLINIC.facilityName}</div>
              </div>
            </div>
          </div>

          {/* Pages */}
          {page === "home" && renderHome()}
          {page === "step" && renderStep()}
          {page === "plan" && renderPlan()}
          {page === "feedback" && renderFeedback()}
          {page === "learn" && renderLearn()}
          {page === "share" && renderShare()}

          {/* Bottom Nav */}
          {page !== "step" && (
            <div style={{ display: "flex", justifyContent: "space-around", background: C.card, borderTop: `1px solid ${C.border}`, padding: "6px 0 14px", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, boxShadow: "0 -2px 12px rgba(0,0,0,0.03)" }}>
              {navItems.map(n => (
                <button key={n.id} onClick={() => nav(n.id)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, border: "none", background: page === n.id ? C.forestPale : "transparent", color: page === n.id ? C.forest : C.textMuted, fontSize: 9, fontWeight: page === n.id ? 800 : 500, cursor: "pointer", padding: "5px 10px", borderRadius: 12, fontFamily: "inherit", position: "relative", transition: "all 0.2s" }}>
                  <span style={{ fontSize: 18 }}>{n.icon}</span><span>{n.label}</span>
                  {n.badge && <span style={{ position: "absolute", top: 2, right: 4, width: 7, height: 7, borderRadius: "50%", background: n.id === "feedback" ? C.terra : C.forest }} />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{margin:0}
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        input:focus,textarea:focus{border-color:${C.forest}!important;box-shadow:0 0 0 3px ${C.forest}10}
        button:active{transform:scale(0.97)}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
      `}</style>
    </div>
  );
}

// ============================================================
// SCENE DATA
// Each scene is keyed by a unique ID and contains:
//   image    – path to character image
//   depth    – progress value (0 = start, 10 = end)
//   body     – array of paragraphs (strings) or { dialogue: "..." }
//   question – the decision prompt (null for endings)
//   choices  – array of { text, next } (empty for endings)
//   feedback – optional { type: "warn"|"good"|"bad", text }
//   outcome  – optional { type: "best"|"good"|"bad", icon, title, text }
//   continueBtn – optional { text, next } for mid-story transitions
//   isEnd    – true if this is a terminal scene
// ============================================================

const scenes = {

  // ---- INTRO ----
  intro: {
    image: "images/IMG_4823.png",
    depth: 0,
    body: [
      "It's Monday morning at the contact centre. Sarah has just logged in and is settling into her shift with a coffee when the phone rings.",
      "The screen shows an incoming call from Margaret Thompson, a Home &amp; Road Assist customer."
    ],
    question: "How should Sarah answer the call?",
    choices: [
      { text: "Warm greeting: \"Good morning, thanks for calling. My name's Sarah — how can I help you today?\"", next: "call_greeting" },
      { text: "Get straight to business: \"Hello, can I take your policy number please?\"", next: "call_abrupt" },
      { text: "Finish her coffee first — it can ring for a bit longer", next: "bad_ignore" }
    ]
  },

  // ---- GOOD GREETING ----
  call_greeting: {
    image: "images/IMG_4827.png",
    depth: 1,
    body: [
      "Margaret sounds relieved to speak to someone.",
      { dialogue: "\"Oh hello love. My car won't start this morning — it's just making a clicking sound when I turn the key. I'm at home and I really need to get it sorted.\"" },
      "She's flustered but friendly."
    ],
    question: "What should Sarah do next?",
    choices: [
      { text: "Verify Margaret's details and check her policy on the system", next: "check_policy" },
      { text: "Promise to send a mechanic right away to reassure her", next: "bad_promise" },
      { text: "Start asking Margaret technical questions about the car", next: "bad_troubleshoot" }
    ]
  },

  // ---- ABRUPT GREETING (RECOVERABLE) ----
  call_abrupt: {
    image: "images/IMG_4829.png",
    depth: 1,
    feedback: { type: "warn", text: "Starting without a warm greeting can make customers feel like just a number. The tone of the call is set in the first few seconds." },
    body: [
      "Margaret pauses, a little taken aback by the abruptness. She gives her policy number but sounds less at ease.",
      { dialogue: "\"Oh, right. It's... hold on... 7-7-4-2-9-8. My car won't start, you see.\"" }
    ],
    question: "Sarah senses the call hasn't started well. What should she say?",
    choices: [
      { text: "\"Thank you, Margaret. I'm sorry — let me start again properly. Tell me what's happened and I'll do my best to help.\"", next: "check_policy" },
      { text: "\"Right, what's the problem then?\"", next: "check_policy_cold" },
      { text: "\"I can see your policy. What's happened with the vehicle?\"", next: "check_policy" }
    ]
  },

  // ---- COLD RESPONSE (RECOVERABLE) ----
  check_policy_cold: {
    image: "images/IMG_4821.png",
    depth: 2,
    feedback: { type: "warn", text: "The tone is still quite abrupt. Building rapport early makes difficult conversations much easier later on." },
    body: [
      "Margaret explains the problem — her car won't start at home. Sarah pulls up the account and sees Margaret has Roadside Assistance only. There's no Home Start cover.",
      "Since Margaret's car has broken down at her home address, her current policy doesn't cover this situation."
    ],
    question: "How should Sarah explain this to Margaret?",
    choices: [
      { text: "Explain empathetically that her cover is for roadside breakdowns only, not at home", next: "explain_empathy" },
      { text: "Tell her directly she doesn't have the right cover", next: "explain_blunt" },
      { text: "Don't mention the cover gap — just try to arrange recovery anyway", next: "bad_skip_cover" }
    ]
  },

  // ---- CHECK POLICY ----
  check_policy: {
    image: "images/IMG_4821.png",
    depth: 2,
    body: [
      "Sarah pulls up Margaret's account. She can see that Margaret has Roadside Assistance cover — but no Home Start.",
      "Since Margaret's car has broken down at her home address, this isn't covered under her current policy."
    ],
    question: "How should Sarah explain this to Margaret?",
    choices: [
      { text: "Explain empathetically that her cover is for roadside breakdowns only, not at home", next: "explain_empathy" },
      { text: "Tell her directly she doesn't have the right cover", next: "explain_blunt" },
      { text: "Don't mention the cover gap — just try to arrange recovery anyway", next: "bad_skip_cover" }
    ]
  },

  // ---- EMPATHETIC EXPLANATION ----
  explain_empathy: {
    image: "images/IMG_4828.png",
    depth: 3,
    body: [
      "Sarah explains gently that Margaret's policy covers breakdowns at the roadside, but unfortunately doesn't include Home Start — which covers breakdowns at the customer's home.",
      "Margaret is upset.",
      { dialogue: "\"But nobody told me that when I took out the policy! The man on the phone said I'd be covered if my car broke down — he didn't say anything about it being different at home!\"" }
    ],
    question: "How should Sarah respond?",
    choices: [
      { text: "Acknowledge her frustration and ask more about what happened during the sale", next: "acknowledge_frustration" },
      { text: "Explain that the cover levels are set out in the terms and conditions", next: "bad_tcs" },
      { text: "Apologise and tell Margaret there's nothing she can do", next: "bad_nothing" }
    ]
  },

  // ---- BLUNT EXPLANATION (RECOVERABLE) ----
  explain_blunt: {
    image: "images/IMG_4828.png",
    depth: 3,
    feedback: { type: "warn", text: "Being direct is fine, but delivering bad news without empathy often escalates the situation." },
    body: [
      "Margaret's voice rises immediately.",
      { dialogue: "\"What do you mean I'm not covered?! I'm paying for breakdown cover! Nobody explained any of this to me!\"" }
    ],
    question: "The customer is getting upset. What now?",
    choices: [
      { text: "Acknowledge her frustration and listen to her concerns", next: "acknowledge_frustration" },
      { text: "Repeat that her policy doesn't cover home breakdowns", next: "bad_repeat" },
      { text: "Offer to transfer her to the complaints department", next: "bad_transfer" }
    ]
  },

  // ---- ACKNOWLEDGE FRUSTRATION ----
  acknowledge_frustration: {
    image: "images/IMG_4819.png",
    depth: 4,
    body: [
      "Sarah responds warmly:",
      { dialogue: "\"I completely understand your frustration, Margaret. If you feel this wasn't explained to you properly, that's something we take very seriously. Can you tell me a bit more about when you took out the policy?\"" },
      "Margaret explains she bought the cover over the phone about six months ago. She's getting more emotional now.",
      { dialogue: "\"I've got a hospital appointment this afternoon and I really can't miss it. I don't have anyone who can give me a lift. Please — you have to help me.\"" }
    ],
    question: "Margaret has disclosed a vulnerability. What should Sarah do?",
    choices: [
      { text: "Note the vulnerability, reassure Margaret, and escalate to her manager", next: "escalate_prep" },
      { text: "Sympathise but explain she can't override the policy", next: "bad_no_override" },
      { text: "Offer to help Margaret book a taxi to the hospital instead", next: "taxi_option" }
    ]
  },

  // ---- TAXI OPTION (PARTIAL) ----
  taxi_option: {
    image: "images/IMG_4829.png",
    depth: 5,
    feedback: { type: "warn", text: "Thinking creatively is good, but a taxi doesn't address the core complaint about the sale or the car repair. Keep going." },
    body: [
      "Margaret appreciates the thought, but it doesn't solve the problem.",
      { dialogue: "\"I can't really afford a taxi to the hospital and back, love. And what about my car? It still needs fixing. I shouldn't have to pay extra when I was told I had breakdown cover.\"" }
    ],
    question: "What should Sarah try now?",
    choices: [
      { text: "Escalate to her manager James about the full situation", next: "escalate_prep" },
      { text: "Tell Margaret she'll need to arrange her own transport for now", next: "bad_own_transport" }
    ]
  },

  // ---- ESCALATION PREP ----
  escalate_prep: {
    image: "images/IMG_4822.png",
    depth: 6,
    body: [
      "Sarah reassures Margaret and places her on a brief hold.",
      { dialogue: "\"Margaret, I want to help you with this. Let me speak to my manager and see what we can do. I'll be as quick as I can.\"" },
      "Sarah finds James in the break area."
    ],
    question: "How does Sarah present the case to James?",
    choices: [
      { text: "Explain the full picture: vulnerability, complaint about the sale, and cover gap", next: "james_full_picture" },
      { text: "Keep it brief: \"A customer wants an exception to her cover level\"", next: "james_vague" },
      { text: "Ask James to take over the call entirely", next: "bad_handoff" }
    ]
  },

  // ---- JAMES: FULL PICTURE ----
  james_full_picture: {
    image: "images/IMG_4836.png",
    depth: 7,
    body: [
      "Sarah explains everything: Margaret has Roadside only, she's broken down at home, she says Home Start wasn't explained during the original sale, and she has a hospital appointment she can't miss.",
      "James listens carefully.",
      { dialogue: "\"Okay. If she's saying the sale was misleading, we need to take that seriously — we'll pull the call recording. And with the hospital appointment, she's clearly a vulnerable customer right now.\"" }
    ],
    question: "What should James recommend?",
    choices: [
      { text: "Approve a goodwill exemption now, and arrange for the sales call to be reviewed", next: "good_ending_best" },
      { text: "Suggest upgrading Margaret's policy first, then sending help", next: "upgrade_path" },
      { text: "Say they need to wait for the call review before doing anything", next: "bad_wait" }
    ]
  },

  // ---- JAMES: VAGUE (RECOVERABLE) ----
  james_vague: {
    image: "images/IMG_4834.png",
    depth: 7,
    feedback: { type: "warn", text: "When escalating, always give your manager the full picture — especially vulnerability indicators and the specifics of the complaint." },
    body: [
      "James frowns.",
      { dialogue: "\"I need more detail than that, Sarah. What's the specific situation? Is there a vulnerability? What exactly is the customer complaining about?\"" }
    ],
    question: "Sarah realises she needs to provide more detail. What should she highlight?",
    choices: [
      { text: "The vulnerability (hospital appointment) and the complaint about the sales process", next: "james_full_picture" },
      { text: "Just the complaint about the sales call", next: "james_partial" }
    ]
  },

  // ---- JAMES: PARTIAL INFO (RECOVERABLE) ----
  james_partial: {
    image: "images/IMG_4836.png",
    depth: 7,
    feedback: { type: "warn", text: "Without mentioning Margaret's vulnerability, James doesn't have the full picture to make the best decision." },
    body: [
      "James considers the complaint about the sale.",
      { dialogue: "\"If she's saying the sale was misleading, we'll need to pull the call and review it. But that takes time — I can't just override the policy right now without more justification.\"" }
    ],
    question: "What should Sarah do?",
    choices: [
      { text: "Mention Margaret's hospital appointment and vulnerability", next: "james_full_picture" },
      { text: "Accept James's answer and go back to Margaret", next: "bad_delay" }
    ]
  },

  // ---- UPGRADE PATH ----
  upgrade_path: {
    image: "images/IMG_4829.png",
    depth: 8,
    body: [
      "James suggests upgrading Margaret's policy to include Home Start, then dispatching a mechanic. Sarah returns to the call and explains the option.",
      "Margaret hesitates.",
      { dialogue: "\"So I have to pay more money to get help today? Even though nobody told me I needed this in the first place?\"" }
    ],
    question: "How should Sarah handle this?",
    choices: [
      { text: "Go back to James and explain that an upgrade feels like an upsell in this situation", next: "james_full_picture" },
      { text: "Offer the upgrade at no cost as a goodwill gesture while they investigate", next: "good_ending_upgrade" },
      { text: "Explain the upgrade is only a small additional cost", next: "bad_upsell" }
    ]
  },

  // ---- GOOD ENDING: BEST ----
  good_ending_best: {
    image: "images/IMG_4827.png",
    depth: 9,
    outcome: { type: "best", icon: "⭐", title: "Best Outcome", text: "Excellent work! You identified the vulnerability, took the complaint seriously, and found a solution that protects both the customer and the company." },
    body: [
      "Sarah returns to Margaret:",
      { dialogue: "\"Margaret, I've spoken to my manager. We're going to arrange for a mechanic to come to you today as a goodwill gesture while we investigate your concerns about the original sale. We take these things very seriously. Can you confirm your hospital appointment time so we can prioritise getting you back on the road?\"" },
      "Margaret is visibly relieved.",
      { dialogue: "\"Oh thank you so much, love. You've been wonderful. My appointment is at 2pm.\"" }
    ],
    question: null,
    choices: [],
    continueBtn: { text: "See what happens next →", next: "dave_arrives" }
  },

  // ---- DAVE ARRIVES ----
  dave_arrives: {
    image: "images/IMG_4856.png",
    depth: 10,
    outcome: { type: "best", icon: "🎉", title: "Scenario Complete — Best Outcome", text: "You navigated empathy, policy, vulnerability, and escalation to reach the best possible result for Margaret and the company." },
    body: [
      "Dave the mechanic arrives within the hour. After a quick look under the bonnet, he identifies a flat battery and gets Margaret's car running again.",
      "Margaret makes her hospital appointment with time to spare.",
      "Meanwhile, the sales call recording is flagged for review. The investigation later confirms that Home Start cover wasn't clearly explained during the original sale — and Margaret's policy is upgraded at no additional cost."
    ],
    question: null,
    choices: [],
    isEnd: true
  },

  // ---- GOOD ENDING: UPGRADE ----
  good_ending_upgrade: {
    image: "images/IMG_4854.png",
    depth: 9,
    outcome: { type: "good", icon: "👍", title: "Good Outcome", text: "You reached a positive resolution, but the upgrade approach initially felt like an upsell. The goodwill exemption route would have been smoother." },
    body: [
      "Sarah confirms the upgrade will be applied at no cost while they investigate the original sale. Dave is dispatched and arrives to fix the flat battery.",
      "Margaret makes her hospital appointment, though the conversation took longer than it needed to and briefly risked losing her trust.",
      "The sales call review later confirms the sale was misleading, validating the decision to help."
    ],
    question: null,
    choices: [],
    isEnd: true
  },

  // ---- BAD ENDINGS ----

  bad_ignore: {
    image: "images/IMG_4837.png",
    depth: 1,
    outcome: { type: "bad", icon: "📞", title: "Poor Outcome", text: "Every call matters. Customers are often already stressed when they ring, and delays make things worse. The call was flagged as an abandoned contact." },
    body: [
      "Sarah lets the phone ring while she finishes her coffee. The customer hangs up and calls back two minutes later — this time much more frustrated.",
      "The call is flagged in the system as an abandoned contact, and Sarah's team leader asks why it wasn't answered promptly."
    ],
    question: null, choices: [], isEnd: true
  },

  bad_promise: {
    image: "images/IMG_4820.png",
    depth: 2,
    outcome: { type: "bad", icon: "⚠️", title: "Poor Outcome", text: "Always check the policy before making promises. Having to take back a commitment is far worse than managing expectations from the start." },
    body: [
      "Sarah tells Margaret not to worry — she'll send a mechanic straight away. But when she checks the system, Margaret doesn't have Home Start cover.",
      "Now Sarah has to call Margaret back and withdraw the help she just promised.",
      { dialogue: "\"You just told me someone was coming! This is absolutely disgraceful!\"" }
    ],
    question: null, choices: [], isEnd: true
  },

  bad_troubleshoot: {
    image: "images/IMG_4829.png",
    depth: 2,
    outcome: { type: "bad", icon: "🔧", title: "Poor Outcome", text: "Your role is to arrange professional help, not troubleshoot vehicles remotely. Focus on what you can actually do for the customer." },
    body: [
      "Sarah starts asking technical questions: \"Have you checked the battery terminals? Is there fuel in the tank?\"",
      "Margaret is confused and frustrated. She called for professional help, not a DIY guide.",
      { dialogue: "\"I don't know anything about engines, love. That's why I'm ringing you!\"" }
    ],
    question: null, choices: [], isEnd: true
  },

  bad_skip_cover: {
    image: "images/IMG_4820.png",
    depth: 3,
    outcome: { type: "bad", icon: "🚫", title: "Poor Outcome", text: "Arranging service outside a customer's cover creates false expectations and policy violations. Be transparent about what's covered." },
    body: [
      "Sarah tries to arrange a mechanic without mentioning the cover gap. The system flags that Home Start isn't included and blocks the booking.",
      "Now Sarah has to explain the situation anyway — but Margaret feels she's been messed around.",
      { dialogue: "\"Why did you waste my time trying to book it if you knew it wasn't covered?\"" }
    ],
    question: null, choices: [], isEnd: true
  },

  bad_tcs: {
    image: "images/IMG_4828.png",
    depth: 4,
    outcome: { type: "bad", icon: "📋", title: "Poor Outcome", text: "Pointing to T&Cs when a customer feels misled doesn't resolve the issue — it escalates it. Listen first, then investigate the root cause." },
    body: [
      "Sarah tells Margaret that the cover levels are clearly explained in the terms and conditions sent with her policy.",
      "Margaret's voice breaks.",
      { dialogue: "\"I didn't understand all that small print. The man who sold it to me said I'd be covered! I trusted him!\"" },
      "The call ends with Margaret making a formal complaint. She feels dismissed and unheard."
    ],
    question: null, choices: [], isEnd: true
  },

  bad_nothing: {
    image: "images/IMG_4828.png",
    depth: 4,
    outcome: { type: "bad", icon: "😔", title: "Poor Outcome", text: "\"There's nothing I can do\" should never be your final answer. There are always options: escalation, goodwill, creative solutions. Especially with a vulnerable customer." },
    body: [
      "Sarah apologises but tells Margaret there's nothing she can do about the cover level.",
      "Margaret starts to cry, explaining about her hospital appointment and having no one to help her.",
      "Margaret ends the call and makes a formal complaint. The investigation later reveals the sale was misleading — and that Sarah missed clear vulnerability signals."
    ],
    question: null, choices: [], isEnd: true
  },

  bad_repeat: {
    image: "images/IMG_4828.png",
    depth: 4,
    outcome: { type: "bad", icon: "🔁", title: "Poor Outcome", text: "Repeating the same information louder doesn't help. When a customer pushes back, listen to understand why — don't just restate the position." },
    body: [
      "Sarah repeats that Margaret's policy only covers roadside breakdowns, not breakdowns at home.",
      { dialogue: "\"I heard you the first time! I'm telling you — the man who sold me this never explained that. I want to speak to your manager!\"" },
      "The call spirals into a heated complaint."
    ],
    question: null, choices: [], isEnd: true
  },

  bad_transfer: {
    image: "images/IMG_4820.png",
    depth: 4,
    outcome: { type: "bad", icon: "↪️", title: "Poor Outcome", text: "Transferring to complaints too early can feel like you're passing the problem. Try to resolve the situation first — the customer rang for help, not a complaints process." },
    body: [
      "Sarah offers to transfer Margaret to the complaints department. Margaret feels pushed aside.",
      { dialogue: "\"I don't want to make a complaint — I want someone to help me! My car's broken down and I've got a hospital appointment!\"" },
      "Margaret hangs up in frustration."
    ],
    question: null, choices: [], isEnd: true
  },

  bad_no_override: {
    image: "images/IMG_4828.png",
    depth: 5,
    outcome: { type: "bad", icon: "🚧", title: "Poor Outcome", text: "When a customer discloses vulnerability, your priority shifts. Sticking rigidly to policy without escalating or exploring options can cause real harm." },
    body: [
      "Sarah sympathises but says she can't override the policy. Margaret becomes increasingly distressed about her hospital appointment.",
      "Margaret misses her appointment. A formal complaint follows, and the investigation finds both a misleading sale and a failure to recognise vulnerability."
    ],
    question: null, choices: [], isEnd: true
  },

  bad_own_transport: {
    image: "images/IMG_4828.png",
    depth: 6,
    outcome: { type: "bad", icon: "🚌", title: "Poor Outcome", text: "Telling a vulnerable customer to sort their own transport ignores your duty of care. Always escalate when vulnerability is identified." },
    body: [
      "Sarah tells Margaret she'll need to arrange her own transport to the hospital for now.",
      "Margaret, who has no family nearby and limited funds, misses her appointment. She makes a formal complaint citing both the misleading sale and the lack of support."
    ],
    question: null, choices: [], isEnd: true
  },

  bad_handoff: {
    image: "images/IMG_4834.png",
    depth: 7,
    outcome: { type: "bad", icon: "🤷", title: "Poor Outcome", text: "Escalation means seeking guidance and authority, not passing the problem to someone else. Own the customer relationship — your manager is there to support you, not replace you." },
    body: [
      "James is surprised that Sarah wants him to take over the call entirely.",
      { dialogue: "\"Sarah, this is your call — I need you to handle it with my support. I can't take over every difficult conversation. Tell me the details and I'll guide you.\"" },
      "Meanwhile, Margaret has been on hold for several minutes and is growing more anxious."
    ],
    question: null, choices: [], isEnd: true
  },

  bad_wait: {
    image: "images/IMG_4829.png",
    depth: 8,
    outcome: { type: "bad", icon: "⏳", title: "Poor Outcome", text: "When vulnerability is identified, act now to protect the customer. Investigations can happen alongside immediate support — don't make a vulnerable person wait." },
    body: [
      "James says they should wait for the call recording to be reviewed before making any exceptions.",
      "Sarah goes back to Margaret and explains they'll investigate, but can't help today. Margaret misses her hospital appointment.",
      "A formal complaint follows. The investigation confirms the sale was misleading, and the company faces regulatory scrutiny for failing to support a vulnerable customer."
    ],
    question: null, choices: [], isEnd: true
  },

  bad_delay: {
    image: "images/IMG_4830.png",
    depth: 8,
    outcome: { type: "bad", icon: "⏳", title: "Poor Outcome", text: "Without the full picture — especially vulnerability — your manager can't make the best decision. Always share all relevant information when escalating." },
    body: [
      "Sarah accepts James's decision and returns to Margaret with no solution. Margaret is told to wait for the investigation.",
      "Margaret misses her hospital appointment and makes a formal complaint. The review later shows the sale was misleading and that vulnerability was disclosed but not acted upon."
    ],
    question: null, choices: [], isEnd: true
  },

  bad_upsell: {
    image: "images/IMG_4828.png",
    depth: 9,
    outcome: { type: "bad", icon: "💰", title: "Poor Outcome", text: "Asking a customer to pay more when they believe they were mis-sold is tone-deaf. It damages trust and strengthens their complaint." },
    body: [
      "Sarah explains the upgrade is only a small additional cost. Margaret is incredulous.",
      { dialogue: "\"You want me to pay MORE? When I was told I already had this cover? I want to speak to a manager right now. And I'm going to the ombudsman about this.\"" },
      "The situation has escalated beyond easy recovery."
    ],
    question: null, choices: [], isEnd: true
  }
};

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type ResourceType =
  | "Protocol guide"
  | "Partner referral"
  | "Internal resource"
  | "Risk assessment"
  | "Crisis accommodation"
  | "Legal guidance"
  | "Financial guidance";

export interface ClassificationTag {
  id: string;
  label: string;
  value: string;
  confidence: number; // 61–93, never 100
  isLowConfidence: boolean; // true if < 70 — renders "?" state
  appearsAtStage: number;
  updatedAtStage?: number;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  reason: string;
  appearsAtStage: number;
  isElevated?: boolean;
  mockDetail?: string;
  actionLabel: "View" | "Copy referral details";
}

export interface GuidanceCard {
  id: string;
  prompt: string;
  citation: string;
  isOutsideKnowledgeBase?: boolean;
}

export interface TranscriptLine {
  id: string;
  speaker: "caller" | "handler";
  text: string;
  stageIndex: number;
}

export interface Stage {
  index: number;
  label: string;
  transcriptLines: TranscriptLine[];
  guidanceCards: GuidanceCard[];
  newClassificationTags: ClassificationTag[];
  classificationUpdates: Array<{
    id: string;
    newValue: string;
    newConfidence: number;
  }>;
  newResources: Resource[];
  toastSummary: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

export const CASE_REF = "#LDN-4471";
export const TOTAL_STAGES = 7;

export const KNOWLEDGE_BASE_DOMAINS = [
  "Trauma-informed communication",
  "Coercive control",
  "Safety planning",
  "Housing pathways",
  "Child safeguarding",
  "Financial abuse",
] as const;

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────

export const STAGES: Stage[] = [
  // ── STAGE 1: Hesitant introduction ──────────────────────────────────────────
  {
    index: 0,
    label: "Hesitant introduction",
    toastSummary:
      "Geography and caller profile classified. Expert guidance loaded for first contact.",
    transcriptLines: [
      {
        id: "t1-1",
        speaker: "handler",
        text: "Thank you for calling the National Domestic Abuse Helpline. You're through to a support worker — this line is confidential. Take your time.",
        stageIndex: 0,
      },
      {
        id: "t1-2",
        speaker: "caller",
        text: "Hi... I'm not sure if I should be calling. I don't know if this is the right place.",
        stageIndex: 0,
      },
      {
        id: "t1-3",
        speaker: "handler",
        text: "You've called exactly the right place. There's no wrong reason to call. Can you tell me a little about what's going on at home?",
        stageIndex: 0,
      },
      {
        id: "t1-4",
        speaker: "caller",
        text: "Things at home just... don't feel right. I don't feel safe. But I don't really know how to explain it.",
        stageIndex: 0,
      },
    ],
    guidanceCards: [
      {
        id: "g1-1",
        prompt:
          "Acknowledge her uncertainty before asking more — she may not yet identify as a victim of abuse. Avoid labelling her situation before she does.",
        citation:
          "Refuge Trauma-Informed Communication Guide, 2024 ed. — Section 3: First Contact",
      },
      {
        id: "g1-2",
        prompt:
          "Use open, non-leading questions. Ask: 'Can you tell me a little about what home is like for you at the moment?' rather than naming abuse types.",
        citation:
          "SafeLives DASH Risk Identification Framework v4 — Principles of Sensitive Enquiry",
      },
      {
        id: "g1-3",
        prompt:
          "Establish basic safety immediately: is she able to speak freely? Is anyone else in earshot? Offer the option to call back if needed.",
        citation:
          "Refuge National Helpline Protocol — Call Safety Assessment Checklist, 2023",
      },
    ],
    newClassificationTags: [
      {
        id: "tag-geo",
        label: "Geography",
        value: "East London",
        confidence: 88,
        isLowConfidence: false,
        appearsAtStage: 0,
      },
      {
        id: "tag-profile",
        label: "Caller profile",
        value: "Adult woman, est. 25–35",
        confidence: 82,
        isLowConfidence: false,
        appearsAtStage: 0,
      },
    ],
    classificationUpdates: [],
    newResources: [
      {
        id: "r1-1",
        name: "Refuge National Helpline Protocol Card",
        type: "Protocol guide",
        reason:
          "Recommended because: First contact established — caller location East London",
        appearsAtStage: 0,
        actionLabel: "View",
      },
    ],
  },

  // ── STAGE 2: Coercive control disclosed ─────────────────────────────────────
  {
    index: 1,
    label: "Coercive control disclosed",
    toastSummary:
      "Coercive control, financial abuse, and phone monitoring classified. Guidance updated.",
    transcriptLines: [
      {
        id: "t2-1",
        speaker: "caller",
        text: "He checks my phone. Every message, every call. I had to delete WhatsApp because he went through it.",
        stageIndex: 1,
      },
      {
        id: "t2-2",
        speaker: "caller",
        text: "He controls all our money. I don't have access to the account. If I need something, I have to ask him.",
        stageIndex: 1,
      },
      {
        id: "t2-3",
        speaker: "caller",
        text: "He's told my friends not to contact me. I haven't spoken to anyone properly in months.",
        stageIndex: 1,
      },
      {
        id: "t2-4",
        speaker: "handler",
        text: "That sounds incredibly isolating. What you're describing — the phone monitoring, the money, the contact with friends — these are things we hear about a lot. You don't have to face this alone.",
        stageIndex: 1,
      },
    ],
    guidanceCards: [
      {
        id: "g2-1",
        prompt:
          "Name coercive control clearly but gently — many callers do not recognise their experience as 'abuse'. Frame it as a pattern of behaviour, not just individual incidents.",
        citation:
          "Refuge Understanding Coercive Control — Practice Guide, 2024 ed.",
      },
      {
        id: "g2-2",
        prompt:
          "Ask about financial access carefully: does she have any money she can access independently? A cash amount she controls? A bank card in her name?",
        citation:
          "Surviving Economic Abuse — Financial Safety Assessment Framework, 2023",
      },
      {
        id: "g2-3",
        prompt:
          "Digital safety check: is this call being made from a monitored device? Advise on call history deletion or use of a safer device if appropriate.",
        citation:
          "Refuge Trauma-Informed Communication Guide, 2024 ed. — Section 7: Digital Safety",
      },
    ],
    newClassificationTags: [
      {
        id: "tag-abuse-type",
        label: "Abuse type",
        value: "Coercive control",
        confidence: 91,
        isLowConfidence: false,
        appearsAtStage: 1,
      },
      {
        id: "tag-financial",
        label: "Financial abuse",
        value: "Detected",
        confidence: 89,
        isLowConfidence: false,
        appearsAtStage: 1,
      },
      {
        id: "tag-tech",
        label: "Tech-facilitated",
        value: "Phone monitoring",
        confidence: 93,
        isLowConfidence: false,
        appearsAtStage: 1,
      },
    ],
    classificationUpdates: [],
    newResources: [
      {
        id: "r2-1",
        name: "Coercive Control Recognition Guide",
        type: "Internal resource",
        reason:
          "Recommended because: Coercive control detected — isolation and financial control indicators",
        appearsAtStage: 1,
        actionLabel: "View",
      },
    ],
  },

  // ── STAGE 3: Physical violence disclosed ─────────────────────────────────────
  {
    index: 2,
    label: "Physical violence disclosed",
    toastSummary:
      "Physical violence added to abuse type. DASH checklist and IDVA referral surfaced.",
    transcriptLines: [
      {
        id: "t3-1",
        speaker: "caller",
        text: "Last week... he pushed me. He's never done that before. He pushed me into the wall.",
        stageIndex: 2,
      },
      {
        id: "t3-2",
        speaker: "caller",
        text: "It wasn't that bad. He didn't hit me or anything. I probably made him angry.",
        stageIndex: 2,
      },
      {
        id: "t3-3",
        speaker: "handler",
        text: "Thank you for telling me. Being pushed is never okay — it isn't your fault, and it's important we take this seriously. How are you feeling physically now?",
        stageIndex: 2,
      },
      {
        id: "t3-4",
        speaker: "caller",
        text: "I'm okay. Just... scared it might happen again.",
        stageIndex: 2,
      },
    ],
    guidanceCards: [
      {
        id: "g3-1",
        prompt:
          "Do not minimise alongside her — but do not challenge her minimisation directly. Gently reflect: 'Being pushed, whatever form it takes, is never okay. You don't need to call it anything — but I want you to know it matters.'",
        citation:
          "Refuge Trauma-Informed Communication Guide, 2024 ed. — Section 5: Responding to Minimisation",
      },
      {
        id: "g3-2",
        prompt:
          "First-time physical violence after a period of coercive control is a recognised high-risk escalation indicator. Begin mental DASH risk assessment now.",
        citation:
          "SafeLives DASH Risk Identification Framework v4 — Escalation Pathways",
      },
      {
        id: "g3-3",
        prompt:
          "Ask about injury and medical attention without leading: 'Do you have any pain or marks from last week? Have you seen a GP or anyone at all?'",
        citation:
          "Refuge Housing Pathway Protocol — Greater London, 2023 — Physical Safety Assessment",
      },
    ],
    newClassificationTags: [],
    classificationUpdates: [
      {
        id: "tag-abuse-type",
        newValue: "Coercive control + Physical violence",
        newConfidence: 91,
      },
    ],
    newResources: [
      {
        id: "r3-1",
        name: "SafeLives DASH Risk Identification Checklist",
        type: "Risk assessment",
        reason:
          "Recommended because: Physical violence disclosed — first-time incident with coercive control background",
        appearsAtStage: 2,
        actionLabel: "View",
      },
      {
        id: "r3-2",
        name: "Refuge IDVA Referral Pathway — East London",
        type: "Partner referral",
        reason:
          "Recommended because: Physical violence + Coercive control + East London geography",
        appearsAtStage: 2,
        actionLabel: "Copy referral details",
      },
    ],
  },

  // ── STAGE 4: Child present ───────────────────────────────────────────────────
  {
    index: 3,
    label: "Child present",
    toastSummary:
      "Child safeguarding flag added. NSPCC guidance and Hackney Children's Services surfaced.",
    transcriptLines: [
      {
        id: "t4-1",
        speaker: "caller",
        text: "My daughter is here with me. She's seven. She was in the other room when it happened last week.",
        stageIndex: 3,
      },
      {
        id: "t4-2",
        speaker: "handler",
        text: "Thank you for telling me about her. Is she with you now, in the house?",
        stageIndex: 3,
      },
      {
        id: "t4-3",
        speaker: "caller",
        text: "Yes, she's watching TV. She doesn't know I'm on the phone.",
        stageIndex: 3,
      },
      {
        id: "t4-4",
        speaker: "handler",
        text: "Okay. I want to make sure we're thinking about her safety too, alongside yours. Is that alright?",
        stageIndex: 3,
      },
    ],
    guidanceCards: [
      {
        id: "g4-1",
        prompt:
          "Child safeguarding consideration is now active. Assess whether the child has witnessed any incidents, or whether there are direct concerns about her safety beyond witnessing.",
        citation:
          "Refuge Safeguarding Protocol — Children in Households Experiencing Domestic Abuse, 2024",
      },
      {
        id: "g4-2",
        prompt:
          "Introduce safety planning that includes the child — an exit plan, a trusted adult, school awareness — without using alarming language.",
        citation:
          "NSPCC Child Protection in Domestic Abuse Situations — Practice Guidance, 2023",
      },
      {
        id: "g4-3",
        prompt:
          "A 7-year-old may have witnessed more than the caller knows. Frame the child's welfare as a reason to act — not as a threat or pressure.",
        citation:
          "Refuge Trauma-Informed Communication Guide, 2024 ed. — Section 9: Children and Safeguarding",
      },
    ],
    newClassificationTags: [
      {
        id: "tag-household",
        label: "Household",
        value: "Child present (age ~7)",
        confidence: 97,
        isLowConfidence: false,
        appearsAtStage: 3,
      },
    ],
    classificationUpdates: [],
    newResources: [
      {
        id: "r4-1",
        name: "NSPCC Child Protection Referral Guidance",
        type: "Partner referral",
        reason:
          "Recommended because: Child present (age ~7) — domestic abuse with physical violence in household",
        appearsAtStage: 3,
        actionLabel: "View",
      },
      {
        id: "r4-2",
        name: "Hackney Children's Services — Duty Line",
        type: "Partner referral",
        reason:
          "Recommended because: Child safeguarding flag + East London geography",
        appearsAtStage: 3,
        mockDetail: "020 8356 5500 (mock — for demonstration only)",
        actionLabel: "Copy referral details",
      },
      {
        id: "r4-3",
        name: "Refuge Safeguarding Protocol",
        type: "Internal resource",
        reason:
          "Recommended because: Child present — Refuge internal safeguarding procedure",
        appearsAtStage: 3,
        actionLabel: "View",
      },
    ],
  },

  // ── STAGE 5: Fear about leaving / immigration ─────────────────────────────
  {
    index: 4,
    label: "Fear about leaving",
    toastSummary:
      "Immigration indicator flagged at low confidence. Outside knowledge base state shown in Expert Guidance.",
    transcriptLines: [
      {
        id: "t5-1",
        speaker: "caller",
        text: "I don't know how I would leave. He controls all the money. I have nothing in my name.",
        stageIndex: 4,
      },
      {
        id: "t5-2",
        speaker: "caller",
        text: "My family are in Portugal. I have no one here. I don't know if I'm even allowed to stay in the UK if I leave him.",
        stageIndex: 4,
      },
      {
        id: "t5-3",
        speaker: "handler",
        text: "Those are really important concerns, and we take all of them seriously. Can I ask — are you a UK citizen, or do you have a visa or other status here?",
        stageIndex: 4,
      },
      {
        id: "t5-4",
        speaker: "caller",
        text: "I have a visa through him. I don't know what happens to it if I leave.",
        stageIndex: 4,
      },
    ],
    guidanceCards: [
      {
        id: "g5-1",
        prompt:
          "Reassure her that leaving does not automatically affect her immigration status — but do not advise on specifics. This requires specialist immigration and DV legal advice.",
        citation:
          "Refuge Housing Pathway Protocol — Greater London, 2023 — Immigration Considerations",
      },
      {
        id: "g5-2",
        prompt:
          "Financial safety: Surviving Economic Abuse resources can support her in identifying independent financial pathways even before she leaves.",
        citation:
          "Surviving Economic Abuse — Financial Safety Planning for Survivors, 2024 ed.",
      },
      {
        id: "g5-3",
        prompt:
          "Immigration status and right to remain — visa implications if leaving a sponsoring partner: this falls outside the curated knowledge base. Consider referring to a specialist immigration and DV legal adviser before providing specific guidance.",
        citation:
          "Refer to: Southall Black Sisters immigration legal advice service; Rights of Women DV legal helpline",
        isOutsideKnowledgeBase: true,
      },
    ],
    newClassificationTags: [
      {
        id: "tag-immigration",
        label: "Immigration indicator",
        value: "Possible (unconfirmed)",
        confidence: 61,
        isLowConfidence: true,
        appearsAtStage: 4,
      },
    ],
    classificationUpdates: [],
    newResources: [
      {
        id: "r5-1",
        name: "Surviving Economic Abuse — Financial Safety Planning Guide",
        type: "Financial guidance",
        reason:
          "Recommended because: Financial abuse detected — no independent financial access",
        appearsAtStage: 4,
        actionLabel: "View",
      },
      {
        id: "r5-2",
        name: "Refuge Resettlement Fund Information",
        type: "Internal resource",
        reason:
          "Recommended because: Financial dependence — no family network in UK",
        appearsAtStage: 4,
        actionLabel: "View",
      },
      {
        id: "r5-3",
        name: "Housing Pathway Overview — Greater London",
        type: "Internal resource",
        reason:
          "Recommended because: No independent housing route identified — East London",
        appearsAtStage: 4,
        actionLabel: "View",
      },
    ],
  },

  // ── STAGE 6: Emergency accommodation request ─────────────────────────────
  {
    index: 5,
    label: "Emergency accommodation request",
    toastSummary:
      "ELEVATED: Emergency accommodation options surfaced. 2 spaces available in Newham. DASH prompt added.",
    transcriptLines: [
      {
        id: "t6-1",
        speaker: "caller",
        text: "I'm scared he's going to come home and I don't know what he'll do. Is there... is there anywhere I could go tonight? With my daughter?",
        stageIndex: 5,
      },
      {
        id: "t6-2",
        speaker: "handler",
        text: "Yes. There is. Let me check what we have available right now — can you stay on the line with me?",
        stageIndex: 5,
      },
      {
        id: "t6-3",
        speaker: "caller",
        text: "Yes. Yes, I can.",
        stageIndex: 5,
      },
    ],
    guidanceCards: [
      {
        id: "g6-1",
        prompt:
          "Crisis point: respond with calm certainty. 'Yes, there is somewhere you can go.' Do not leave a silence gap here — the caller needs to hear this is possible before details follow.",
        citation:
          "Refuge Trauma-Informed Communication Guide, 2024 ed. — Section 11: Crisis Response",
      },
      {
        id: "g6-2",
        prompt:
          "Complete or confirm DASH risk assessment before confirming accommodation referral. Ensure risk level is formally assessed and recorded by you as the handler.",
        citation:
          "SafeLives DASH Risk Identification Framework v4 — Mandatory Pre-Referral Steps",
      },
      {
        id: "g6-3",
        prompt:
          "Practical considerations for immediate departure with a child: documents (passport, birth certificate), medications, school contact. Keep this brief — do not overwhelm.",
        citation:
          "Refuge Safety Planning Protocol — Immediate Departure with Children, 2024",
      },
    ],
    newClassificationTags: [],
    classificationUpdates: [],
    newResources: [
      {
        id: "r6-1",
        name: "Refuge East London Network — Bed Availability",
        type: "Crisis accommodation",
        reason:
          "Recommended because: Immediate accommodation request + Child present + East London",
        appearsAtStage: 5,
        isElevated: true,
        mockDetail: "2 spaces available — Newham refuge. Mother and child placement possible.",
        actionLabel: "Copy referral details",
      },
      {
        id: "r6-2",
        name: "DASH Risk Assessment Prompt",
        type: "Risk assessment",
        reason:
          "Recommended because: Immediate departure considered — formal risk assessment required before referral",
        appearsAtStage: 5,
        actionLabel: "View",
      },
      {
        id: "r6-3",
        name: "Crisis Accommodation Referral Form",
        type: "Internal resource",
        reason:
          "Recommended because: Active accommodation placement in progress",
        appearsAtStage: 5,
        actionLabel: "Copy referral details",
      },
    ],
  },

  // ── STAGE 7: Next steps agreed ──────────────────────────────────────────────
  {
    index: 6,
    label: "Next steps agreed",
    toastSummary:
      "Call reaching conclusion. Safety planning call-back agreed with the caller.",
    transcriptLines: [
      {
        id: "t7-1",
        speaker: "handler",
        text: "So to summarise what we've agreed: I'm going to send a referral now to the Newham refuge — they have space tonight for you and your daughter. Someone will call you within the next 30 minutes to confirm and give you the address.",
        stageIndex: 6,
      },
      {
        id: "t7-2",
        speaker: "handler",
        text: "I'm also going to arrange a safety planning call-back for you — ideally tomorrow, or sooner if you need it. Is that okay?",
        stageIndex: 6,
      },
      {
        id: "t7-3",
        speaker: "caller",
        text: "Yes. Yes, that's okay. Thank you. I didn't think anyone could help.",
        stageIndex: 6,
      },
      {
        id: "t7-4",
        speaker: "handler",
        text: "You did the right thing calling. We're here. Please don't delete this number — you can call back any time.",
        stageIndex: 6,
      },
    ],
    guidanceCards: [
      {
        id: "g7-1",
        prompt:
          "Summarise clearly and slowly — the caller is likely in a heightened state. Confirm each agreed action item and allow her to acknowledge each one.",
        citation:
          "Refuge Trauma-Informed Communication Guide, 2024 ed. — Section 12: Call Closure",
      },
      {
        id: "g7-2",
        prompt:
          "Reinforce her agency throughout: she made the call, she agreed to next steps. Avoid language that positions her as a passive recipient.",
        citation:
          "SafeLives DASH Risk Identification Framework v4 — Survivor-Led Approach",
      },
      {
        id: "g7-3",
        prompt:
          "Safety planning call-back: document agreed time, note any digital safety concerns for the call-back worker (monitored phone, safe times to call).",
        citation:
          "Refuge National Helpline Protocol — Call Closure and Follow-Up, 2023",
      },
    ],
    newClassificationTags: [],
    classificationUpdates: [],
    newResources: [],
  },
];

// ─── DERIVED DATA HELPERS ─────────────────────────────────────────────────────

export function getTagsAtStage(stageIndex: number): ClassificationTag[] {
  const tags = new Map<string, ClassificationTag>();

  for (let i = 0; i <= stageIndex; i++) {
    const stage = STAGES[i];
    for (const tag of stage.newClassificationTags) {
      tags.set(tag.id, tag);
    }
    for (const update of stage.classificationUpdates) {
      const existing = tags.get(update.id);
      if (existing) {
        tags.set(update.id, {
          ...existing,
          value: update.newValue,
          confidence: update.newConfidence,
          updatedAtStage: i,
        });
      }
    }
  }

  return Array.from(tags.values());
}

const RESOURCE_TYPE_PRIORITY: Record<ResourceType, number> = {
  "Crisis accommodation": 0,
  "Risk assessment": 1,
  "Partner referral": 2,
  "Legal guidance": 3,
  "Financial guidance": 4,
  "Protocol guide": 5,
  "Internal resource": 6,
};

export function getResourcesAtStage(stageIndex: number): Resource[] {
  const resources = STAGES.slice(0, stageIndex + 1).flatMap((s) => s.newResources);
  return resources.sort((a, b) => {
    if (a.isElevated && !b.isElevated) return -1;
    if (!a.isElevated && b.isElevated) return 1;
    const pa = RESOURCE_TYPE_PRIORITY[a.type];
    const pb = RESOURCE_TYPE_PRIORITY[b.type];
    if (pa !== pb) return pa - pb;
    return a.appearsAtStage - b.appearsAtStage;
  });
}

export function getTranscriptAtStage(stageIndex: number): TranscriptLine[] {
  return STAGES.slice(0, stageIndex + 1).flatMap((s) => s.transcriptLines);
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

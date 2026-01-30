
export interface Module {
  id: string;
  title: string;
  content: string;
  starterPrompt: string;
}

export interface Phase {
  id: number;
  name: string;
  hours: string;
  deliveredBy: string;
  goal: string;
  modules: Module[];
}

export const COURSE_BLUEPRINT = {
  title: "The World of TEXTS",
  subtitle: "12-Hour Intensive Linguistic Mastery",
  architect: "Rajib Singh, CTO",
  mentor: "Dr. Tilak Chatterjee",
  phases: [
    {
      id: 1,
      name: "Phase 1: The Academic Gateway",
      hours: "1-2",
      deliveredBy: "Dr. Tilak Chatterjee",
      goal: "Bridge academic brilliance with AI potential. Establishing the 'Why'.",
      modules: [
        { 
          id: '1.1', 
          title: 'The Opening Address', 
          content: 'AI as a Cognitive Co-pilot in modern education.',
          starterPrompt: "[[PHASE_1.1]] Initiate Opening Address simulation. Explain the concept of AI as a 'Cognitive Co-pilot' and its role in transforming modern pedagogy. How should educators perceive this shift?"
        },
        { 
          id: '1.2', 
          title: 'The Genesis Narrative', 
          content: 'The "Burn of AI" - moving from search to reasoning.',
          starterPrompt: "[[PHASE_1.2]] Narrative Mode: Genesis. Describe the evolution from 'Search Engines' to 'Reasoning Engines'. What does it mean for a system to possess latent logic rather than just an index?"
        },
        { 
          id: '1.3', 
          title: 'Bridge to Technology', 
          content: 'Case Study: The CU-module AI chatbot proof-of-concept.',
          starterPrompt: "[[PHASE_1.3]] Technical Audit: CU-Module. Provide a detailed case study of the AI chatbot developed for CU. What were the logic gates, the user feedback loops, and the ultimate ROI?"
        },
        { 
          id: '1.4', 
          title: 'Ethics of Intellect', 
          content: 'Maintaining integrity in a generative world.',
          starterPrompt: "[[PHASE_1.4]] Ethics Seminar: Generative Integrity. How can we ensure academic honesty when 'The World of TEXTS' allows for instant synthesis? Propose 3 structural guardrails for students."
        }
      ]
    },
    {
      id: 2,
      name: "Phase 2: The Swiss Knife",
      hours: "3-8",
      deliveredBy: "Rajib Singh, CTO",
      goal: "Deep technical training on the Linguistic Code.",
      modules: [
        { 
          id: '2.A', 
          title: 'Foundation & Logic', 
          content: 'Mastering R.A.C.E, C.O.T, and Tree-of-Thought.',
          starterPrompt: "[[PHASE_2.A]] Technical Drill: Framework Foundations. Compare and contrast R.A.C.E., Chain-of-Thought (COT), and Tree-of-Thought (ToT). Provide one complex use case where ToT outperforms standard COT."
        },
        { 
          id: '2.B', 
          title: 'Style & Interaction', 
          content: 'Voice cloning (Few-Shot), Reverse Prompting, and Socratic Interviews.',
          starterPrompt: "[[PHASE_2.B]] Workshop: Advanced Stylistics. Teach me the 'Reverse Prompting' framework. How do I deconstruct a masterwork into its underlying DNA using delimiters?"
        },
        { 
          id: '2.C', 
          title: 'Advanced Controls', 
          content: 'CRISPE, Delimiters, Negative Prompting, and Simulation Pattern.',
          starterPrompt: "[[PHASE_2.C]] Control Lab: CRISPE & Constraints. Explain the CRISPE framework and show me how to 'Stack Constraints' to force Gemini into a hyper-specific technical output."
        }
      ]
    },
    {
      id: 3,
      name: "Phase 3: Productivity Alchemist",
      hours: "9-11",
      deliveredBy: "Rajib Singh, CTO",
      goal: "Hands-on implementation of engines into professional life.",
      modules: [
        { 
          id: '3.1', 
          title: 'The Academic Engine', 
          content: 'Automating lesson plans, research synthesis, and grants.',
          starterPrompt: "[[PHASE_3.1]] Efficiency Lab: Academic Automation. Use the Syllabus Architect persona and the R.A.C.E framework to draft a 12-week lesson plan for 'Quantum Ethics' including 3 learning outcomes per week."
        },
        { 
          id: '3.2', 
          title: 'The Professional Pipeline', 
          content: 'SEO Strategy (9/10 skill) and Administrative Growth.',
          starterPrompt: "[[PHASE_3.2]] Professional Audit: SEO Strategy. Act as a 9/10 SEO Strategist. Analyze the prompt DNA for high-converting landing pages. How do we synthesize 'Search Intent' into 'Structural Content'?"
        },
        { 
          id: '3.3', 
          title: 'Zero-Inbox Mastery', 
          content: 'Converting threads into 2-minute actionable drafts.',
          starterPrompt: "[[PHASE_3.3]] Protocol: Zero-Inbox. How do I use the 'Recursive Synthesis' framework to process a 50-email thread into a 3-bullet summary for an executive? Demonstrate the prompt structure."
        }
      ]
    },
    {
      id: 4,
      name: "Phase 4: Graduation & Integration",
      hours: "12",
      deliveredBy: "Dr. Tilak Chatterjee",
      goal: "Synthesis, reflection, and official certification.",
      modules: [
        { 
          id: '4.1', 
          title: 'The Final Synthesis', 
          content: 'Translating frameworks back to academic excellence.',
          starterPrompt: "[[PHASE_4.1]] Capstone: Final Synthesis. Summarize everything learned in the 'World of TEXTS'. How does a Master Operator navigate the balance between human creativity and structural logic?"
        },
        { 
          id: '4.2', 
          title: 'The Human-in-the-Loop', 
          content: 'Education as the essential guardrail for accuracy.',
          starterPrompt: "[[PHASE_4.2]] Guardrail Review: Human-in-the-Loop. Discuss the risks of 'Hallucination' and 'Logic Gaps' in LLMs. Why is the human mentor the most critical component of the World of TEXTS architecture?"
        },
        { 
          id: '4.3', 
          title: 'The Final Build', 
          content: 'Finalizing your individual "Master Prompt Library".',
          starterPrompt: "[[PHASE_4.3]] Library Architect: Help me design a 'Master Prompt Library' taxonomy. How should I categorize my frameworks and personas for instant retrieval in a high-speed work environment?"
        },
        {
          id: 'ROADMAP_2025',
          title: 'Future Implementation Roadmap',
          content: 'Evolutionary Features for the World of TEXTS Ecosystem.',
          starterPrompt: "[[ROADMAP_PROMPT]] Act as a Lead Systems Architect. Analyze the following 2025 Roadmap and provide a feasibility study for each Tier:\n\n" +
          "TIER 1: THE NEURAL KERNEL\n" +
          "- Automated DNA Extraction: A 'Scanner' mode where you paste text and it automatically generates the reverse-prompt Registry Item.\n" +
          "- Live Multi-Model Grounding: Simultaneous reasoning across Gemini, Claude, and GPT to find the 'Logic Consensus'.\n" +
          "- Persona Memory Injection: Allowing personas to 'remember' specific user preferences across sessions via a persistent Vector DB.\n\n" +
          "TIER 2: THE COLLABORATION HUB\n" +
          "- Public Registry Sync: A community-driven marketplace for Frameworks and Personas (Logic-as-a-Service).\n" +
          "- The 'Linguistic Heatmap' Upgrade: Visualizing real-time word-cliché patterns as you type, not just post-response.\n" +
          "- Collaborative Synthesis: Multi-user live document editing with integrated Persona comments.\n\n" +
          "TIER 3: HARDWARE INTEGRATION\n" +
          "- WOT Ambient: An OS-level 'Whisper' interface that listens to meetings and injects high-density summaries directly into your workspace.\n" +
          "- Augmented Reality Logic-Flow: Visualizing Tree-of-Thought branches in a 3D VR/AR environment for complex problem solving."
        }
      ]
    }
  ]
};

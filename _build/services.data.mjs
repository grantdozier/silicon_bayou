/**
 * The ten services, in one place.
 *
 * This file is the source of truth for BOTH the homepage rail and the ten
 * service pages under /services. Edit here, run `node _build/build-services.mjs`,
 * commit the generated HTML. Nothing in _build/ is ever deployed.
 *
 * Accuracy rules for anyone editing this:
 *   - Name only Royal Engineering and Chase Group. Every other client is under
 *     NDA or has not given permission.
 *   - Counts (52 tools, 9 object kinds, 11 relation types) come from source, not
 *     from the docs, which undercount.
 *   - Do not claim an integration that is not running. Procore, Bluebeam,
 *     Autodesk and DocuSign appear only in roadmap documents.
 */

export const services = [
  {
    slug: 'ai-enablement',
    num: '01',
    title: 'AI enablement & Claude integration',
    short: 'Claude, with typed tools over the systems you already run.',
    lede: 'We put Claude inside your business and give it tools that read your real systems — so an answer comes from the source of record, not from someone’s memory.',
    meta: 'Custom Model Context Protocol servers that give Claude scoped, audited access to the systems your business already runs on.',
    what: [
      'Most AI pilots fail for a boring reason: the model has no access to anything real. It can write a paragraph about a change order. It cannot tell you whether that change order was approved, what it cost, or who signed it.',
      'We close that gap by building a Model Context Protocol server over your systems. Claude gets a set of named, schema-validated tools — read the schedule, search the inbox, pull job costing, list open RFIs — and every call is scoped to the person asking and written to an audit trail.',
    ],
    get: [
      'A custom MCP server over the systems you already run',
      'Role-scoped access, so an estimator and a project executive see different things',
      'An audit entry on every write, and a policy gate that decides run, queue, or suppress',
      'Agents that draft and queue for approval — nothing leaves without a human',
      'Deployment into Claude Desktop, Claude Code, or an app of your own',
    ],
    how: [
      ['Map the systems', 'We inventory what you run and where the answers actually live: the file share, the accounting package, the inbox, the scheduling tool, and the spreadsheet nobody will admit to.'],
      ['Build the tools', 'Each capability becomes a named tool with a typed schema. Ambiguity is where agents do damage, so we remove it.'],
      ['Scope and audit', 'Permissions follow the person, not the model. Every mutation passes a gate and lands in an audit log you can read.'],
      ['Put it in front of people', 'We sit with the estimator and the field lead until it is useful on a bad day, not just in a demo.'],
    ],
    practice: {
      title: 'Chase Group Construction',
      body: 'A commercial general contractor running several high-value projects at once. Job costing, RFIs, submittals, schedule, budget, and inbox search are exposed to Claude through a custom MCP server, scoped by role and audited on every write. Someone can ask what is still unbilled on a job and get the answer from the accounting system.',
      metrics: [
        ['10–20 hrs', 'Saved per person, per project'],
        ['60 days', 'Pilot to full operation'],
        ['Zero', 'Workflow disruption'],
      ],
    },
  },

  {
    slug: 'business-ontologies',
    num: '02',
    title: 'Business ontologies & knowledge graphs',
    short: 'Typed objects, typed relationships, and a graph you can query.',
    lede: 'Storage tells you what happened. We build the layer above it: a model of how your business actually works, in a form software can query.',
    meta: 'Typed object graphs, entity resolution, and validated actions — turning unstructured business history into something you can query.',
    what: [
      'Your company’s real structure — this person works for that company, this call produced that decision, that decision created work, that work became an invoice — lives in people’s heads and in prose. Software cannot traverse prose.',
      'An ontology makes the structure explicit. Objects have types. Relationships have types. Every change goes through a validated action, and every record carries lineage back to the call or the document that produced it. Ask what a job cost and you can walk backwards to the conversation where the scope changed.',
    ],
    get: [
      'A typed object graph — 9 object kinds and 11 relationship types in our own platform',
      'Entity resolution that mints a new company on first mention, with provenance, instead of quietly filing it under “other”',
      'Near-duplicates flagged for a human. Nothing is ever auto-merged',
      'A single audited writer: nothing mutates the graph except through it',
      'Lineage from every number back to its source',
    ],
    how: [
      ['Model the domain', 'We name the objects and the relationships that matter to your business. Usually there are fewer than a dozen of each.'],
      ['Resolve identity', 'Three tiers — exact key, blocked match, then embedding similarity. Anything ambiguous goes to a person, not to a coin flip.'],
      ['Gate every write', 'One executor performs all mutations. Each passes a policy gate that decides run, queue, or suppress, based on who asked and how destructive it is.'],
      ['Project it outward', 'The graph feeds the tools your team already opens — the work tracker, the notes, the invoice.'],
    ],
    practice: {
      title: 'Our own operations platform',
      body: 'A phone call becomes a transcript, becomes atomic action items, becomes objectives bound to the right company, person, and artifact — then lands in the work tracker and a readable note. Early versions collapsed unrecognised companies into a catch-all bucket, so real counterparties silently disappeared. They are now minted on first mention and flagged for review.',
      metrics: [
        ['9', 'Object kinds'],
        ['11', 'Typed relations'],
        ['52', 'MCP tools'],
      ],
    },
  },

  {
    slug: 'systems-integration',
    num: '03',
    title: 'Systems integration & data infrastructure',
    short: 'Connect what you already run. Rip out nothing.',
    lede: 'Your operation runs on a dozen disconnected tools, and everyone has quietly built a workaround for each seam. We connect them and leave the tools your team likes exactly where they are.',
    meta: 'Unifying SharePoint, Microsoft 365, QuickBooks, storage, and source control behind one typed interface — without a big-bang cutover.',
    what: [
      'The cost of disconnected systems is not the software licence. It is the estimator who re-keys a vendor quote, the PM who checks three places before answering a question, and the invoice that goes out late because nobody could find the approval.',
      'We connect the systems behind a single typed interface. Nothing gets ripped out, nobody retrains, and the seams stop leaking. Where a system has no API we work with what it does have — a file share, an inbox, an export.',
    ],
    get: [
      'One typed interface over SharePoint, Microsoft 365, QuickBooks, storage, and source control',
      'Dead-letter queues and replay, so a partial failure is recoverable rather than silent',
      'Heartbeats and dead-man’s-switch monitoring on every worker',
      'Migration designed around continuity, not a weekend cutover',
      'Documentation and a handover, so you are not dependent on us',
    ],
    how: [
      ['Trace the seams', 'We follow one real job end to end and write down every place a human moves data by hand.'],
      ['Connect, do not replace', 'Each system keeps doing its job. We add a layer that reads them and, where you want it, writes back.'],
      ['Make failure visible', 'Retries, dead-letter, replay, and a heartbeat per worker. Silent failure is the expensive kind.'],
      ['Cut over gradually', 'The old path keeps working until the new one has earned its place.'],
    ],
    practice: {
      title: 'What we connect in production',
      body: 'SharePoint, Microsoft 365, QuickBooks, Google Drive, GitHub, Linear, Cloudflare R2, PostgreSQL, Chroma, Anthropic, OpenAI, AssemblyAI, Twilio, Stripe, Supabase, and Discord — each running for a client or in our own platform. Not on this list: anything we have not shipped.',
      metrics: [
        ['20+', 'Systems integrated in production'],
        ['15+', 'Behind a single interface'],
      ],
    },
  },

  {
    slug: 'workflow-automation',
    num: '04',
    title: 'Advanced workflow automation',
    short: 'The loops nobody wants to run by hand.',
    lede: 'A phone call becomes a transcript, becomes structured action items, becomes tracked work, becomes an invoice — while the team keeps working exactly as they always have.',
    meta: 'Event-driven automation across email, files, tickets, and billing, with approval gates wherever a mistake would be expensive.',
    what: [
      'The work between the work — logging the call, filing the attachment, chasing the approval, raising the invoice — is where the hours go. It is also the work nobody wants, so it gets done late or not at all.',
      'We automate the loop end to end and leave a human at every point where a mistake would cost money. Nothing sends itself. Everything is drafted, queued, and waiting for someone to say yes.',
    ],
    get: [
      'Event-driven pipelines with retries and dead-man’s-switch heartbeats',
      'Approval gates wherever an error would be expensive',
      'Draft-only by default — nothing leaves without a person',
      'Recoverable failures: dead-letter, then replay',
      'An audit trail that survives the person who set it up',
    ],
    how: [
      ['Find the loop', 'We watch one full cycle of the thing you do every week and time each step.'],
      ['Automate the middle', 'The capture and the filing and the extraction come first. They are the least contentious and the highest volume.'],
      ['Gate the ends', 'Anything that sends, bills, or commits gets a human. Always.'],
      ['Instrument it', 'If it stops, you find out from a monitor, not from a client.'],
    ],
    practice: {
      title: 'Call to invoice, hands-off',
      body: 'In our own operations platform a recorded call is transcribed with speaker labels, extracted twice — once to pull commitments, once to verify each is real — grouped into objectives, bound to the right client, and projected into the work tracker. Time logged against it rolls into a monthly timesheet and out as an invoice document. A person approves before anything is sent.',
      metrics: [
        ['12', 'Background workers'],
        ['2-pass', 'Extraction, then verification'],
      ],
    },
  },

  {
    slug: 'document-intelligence',
    num: '05',
    title: 'Document intelligence & extraction',
    short: 'Plans, PDFs, and vendor quotes turned into structured data.',
    lede: 'Messy inbound documents become structured, verified data — with the lineage kept intact, so every extracted number can be traced back to the page it came from.',
    meta: 'Plan parsing, quantity takeoff, OCR and model extraction with confidence surfaced rather than hidden.',
    what: [
      'A vendor emails a quote as a photograph of a printout. An architect sends 180 sheets. A model outputs a folder of files nobody wants to open. The information is all there, and none of it is usable.',
      'We build the extraction, and — more importantly — we make it auditable. Every field carries a confidence and a pointer back to the page and the region it came from. When the model is unsure, it says so instead of guessing confidently.',
    ],
    get: [
      'Plan parsing and AI-accelerated quantity takeoff',
      'OCR plus model extraction, with confidence surfaced rather than hidden',
      'Versioned quote memory across email and SMS intake',
      'Lineage from every extracted value back to its source page',
      'Human review queues where the model is not sure',
    ],
    how: [
      ['Ingest anything', 'PDF, DOCX, photographs of paper, SMS. The intake should never be the reason something does not get processed.'],
      ['Extract and score', 'Structured output with a confidence per field, not a wall of prose.'],
      ['Route the doubt', 'Low confidence goes to a person. High confidence goes straight through.'],
      ['Keep the trail', 'Every number remembers where it came from.'],
    ],
    practice: {
      title: 'Royal Engineering',
      body: 'Engineers were spending weeks hand-keying PSDDF and SETTLE3 model output into spreadsheets, then reshaping it to produce settlement graphs and account for sea-level rise. The system now processes up to 300 model files in one upload and generates the complete workbook, graphs and all.',
      metrics: [
        ['Weeks → Minutes', 'Turnaround'],
        ['300', 'Model files per upload'],
        ['15–25 days', 'Off the project timeline'],
      ],
    },
  },

  {
    slug: 'data-retrieval',
    num: '06',
    title: 'Data management & retrieval',
    short: 'Retrieval that cites its source.',
    lede: 'We build the corpus, the chunking, and the index — then make the system cite its source, so a wrong answer is visible instead of confident.',
    meta: 'Vector and hybrid search over your own documents, with reranking, evaluation, and citations on every answer.',
    what: [
      'Retrieval-augmented generation is easy to demo and hard to trust. The demo asks a question the corpus obviously answers. The real user asks something adjacent, and the model produces a fluent paragraph assembled from three unrelated documents.',
      'The fix is not a better prompt. It is a corpus you have curated, chunking that respects document structure, hybrid search rather than embeddings alone, a reranker, and an evaluation set of real questions with known answers — so you can tell when a change made things worse.',
    ],
    get: [
      'pgvector or Chroma, chosen for your scale rather than for fashion',
      'Hybrid lexical and semantic search, then reranking',
      'An evaluation harness of held-out questions with known answers',
      'Citations and lineage on every generated answer',
      'A corpus you own and can inspect',
    ],
    how: [
      ['Curate the corpus', 'Garbage in stays garbage. We decide what belongs before we index anything.'],
      ['Chunk with structure', 'Headings, tables, and page boundaries mean something. We do not slice every 500 tokens and hope.'],
      ['Search, then rerank', 'Lexical catches the exact term. Semantic catches the paraphrase. A reranker sorts the result.'],
      ['Evaluate honestly', 'Held-out questions, scored before and after every change.'],
    ],
    practice: {
      title: 'Institutional memory at Chase Group',
      body: 'A vector database learns from every quote, estimate, and project decision, turning years of collective experience into something a new hire can query on their first day. The team keeps texting and emailing quotes exactly as they always have; the corpus builds itself in the background.',
    },
  },

  {
    slug: 'model-training',
    num: '07',
    title: 'Custom model training & evaluation',
    short: 'Usually you do not need one. When you do, we prove it works.',
    lede: 'Most problems do not need a custom model, and we will tell you when yours does not. When it does, we handle model selection, fine-tuning, and the evaluation harness that proves it beat the baseline.',
    meta: 'Honest build-versus-buy, evaluation harnesses, and fine-tuning only when a general model demonstrably cannot do the job.',
    what: [
      'Almost every request for a custom model is really a request for better retrieval, a clearer prompt, or a cheaper model. We start there, because those are faster, cheaper, and easier to reverse.',
      'When a task genuinely resists a general model — a specialist vocabulary, an unusual output format, a latency or cost ceiling — the work begins with an evaluation harness, not with training. If you cannot measure the baseline, you cannot know whether the fine-tune helped.',
    ],
    get: [
      'An evaluation harness first: held-out questions, scored, before anything is trained',
      'Honest build-versus-buy — often the answer is a better prompt',
      'Task-specific fine-tunes, adapters, and distillation where cost is the constraint',
      'Regression suites, so a model swap does not silently break yesterday’s behaviour',
      'A written recommendation you can act on without us',
    ],
    how: [
      ['Define “better”', 'A number, agreed in advance, that the change has to move.'],
      ['Establish the baseline', 'A general model, well prompted, with good retrieval. Frequently this is where the project ends, happily.'],
      ['Train only if needed', 'Fine-tune, adapter, or distillation — whichever the constraint calls for.'],
      ['Prove it, then ship it', 'Held-out evaluation and a regression suite before it touches production.'],
    ],
    practice: {
      title: 'A note on honesty',
      body: 'Of the AI systems we currently run in production, none required a fine-tuned model. Good retrieval, careful prompting, and picking the right model tier did the job — including two-pass extraction over call transcripts, where the second pass verifies the first rather than trusting it. We list this service because clients ask for it and because evaluation is the part that matters. If your problem needs a custom model, we will build one. If it does not, you will hear that first.',
    },
  },

  {
    slug: 'custom-platforms',
    num: '08',
    title: 'Custom platforms & product engineering',
    short: 'Software built around your workflow, not the other way round.',
    lede: 'When off-the-shelf tools force you to reshape your operations around their limitations, we do the opposite: design and engineer a platform built around how your business actually works.',
    meta: 'End-to-end product engineering for construction, civil, fabrication, and industrial-safety companies.',
    what: [
      'Estimating that takes three days. A takeoff redone because the plans changed. A settlement report keyed in by hand. These are not software problems in general — they are your problems specifically, and general software will not fix them.',
      'We design, build, and ship the platform, then keep evolving it on real usage. The stack is deliberately boring where boring is a virtue: React on the front, FastAPI or .NET behind it, PostgreSQL underneath.',
    ],
    get: [
      'End-to-end product development, from discovery through production deployment',
      'Estimating, takeoff, quoting, scheduling, and compliance workflows',
      'AI capability embedded in the workflow, not bolted on beside it',
      'React, FastAPI and .NET, PostgreSQL — boring where it counts',
      'Ongoing iteration on real usage, not on a roadmap written a year ago',
    ],
    how: [
      ['Discovery', 'We watch the work happen before we design anything.'],
      ['Architect', 'Data model first. Screens follow the model, never the reverse.'],
      ['Build embedded', 'Shipping iteratively, with your people testing it as it goes.'],
      ['Evolve', 'Deploy, monitor, and improve. The system gets better as the business does.'],
    ],
    practice: {
      title: 'Royal Engineering',
      body: 'A React front end and a .NET API that ingests up to 300 PSDDF and SETTLE3 model files at once, extracts and structures the settlement data with no manual entry, and generates the complete Excel workbook — graphs, calculations, and sea-level-rise adjustments included.',
      metrics: [
        ['Weeks → Minutes', 'Turnaround'],
        ['Shortened', 'QA/QC cycle'],
      ],
    },
  },

  {
    slug: 'ai-advisory',
    num: '09',
    title: 'Strategic AI advisory',
    short: 'A roadmap that gets executed, not a slide deck.',
    lede: 'Before a line of code, we map your landscape, find the highest-impact opportunities, and write a roadmap that actually gets executed.',
    meta: 'AI readiness assessment, technology landscape analysis, and build-versus-buy recommendations grounded in your reality.',
    what: [
      'Most AI strategy documents are indistinguishable from one another because they were written without looking at the business. They recommend a pilot, a centre of excellence, and a data lake.',
      'We do the unglamorous version: sit with the people doing the work, find where the hours actually go, and say plainly which of those are worth automating and which are not. Some of our best advice has been that a client should buy something rather than build it, or do nothing at all this year.',
    ],
    get: [
      'AI readiness assessment across the organisation',
      'Technology landscape analysis — what you have, what you need, and what to ignore',
      'Honest build-versus-buy, including “buy” and including “not yet”',
      'A sequenced roadmap with the first project scoped tightly enough to start',
      'Recommendations grounded in your reality, not in vendor material',
    ],
    how: [
      ['Interview widely', 'Executive, director, manager, engineer, admin, new hire. The system fails at whichever seat we skip.'],
      ['Follow the hours', 'Where does the week go? Almost never where the org chart suggests.'],
      ['Score the opportunities', 'Impact against effort against risk, written down so it can be argued with.'],
      ['Scope the first one', 'Small enough to finish, large enough to matter.'],
    ],
    practice: {
      title: 'What this usually produces',
      body: 'A short written assessment, a prioritised list of opportunities with rough effort against rough value, and one project scoped tightly enough to start on Monday. Sometimes the recommendation is that the highest-value change is not AI at all — it is a form that stops collecting a field nobody reads.',
    },
  },

  {
    slug: 'onsite-consulting',
    num: '10',
    title: 'On-site consulting & training',
    short: 'We come to you, and train the people who will run it.',
    lede: 'The system only works if the person with the least time and the most interruptions can use it on a bad day. So we come to you, sit with the estimator and the field lead, and train the people who will actually run it.',
    meta: 'Embedded on-site engineering, workshops, runbooks, and a real handover.',
    what: [
      'Software fails when it is designed for the person who bought it. The buyer sits in a quiet office with two monitors. The user is standing in a trailer with one hand free.',
      'So we work on site, with your people, in their conditions. And we leave documentation good enough that you could fire us and keep running.',
    ],
    get: [
      'Embedded with your team, on your site, in your workflow',
      'Workshops for the people who use it, not just the people who bought it',
      'Runbooks, architecture notes, and a real handover',
      'Remote sessions where travel is not worth the cost',
      'No dependency on us by design',
    ],
    how: [
      ['Show up', 'On site, watching the work, before we touch a keyboard.'],
      ['Build alongside', 'The people who will use it see it every week, not at the end.'],
      ['Train the users', 'Not a slide deck. The actual task, on the actual system, on a normal day.'],
      ['Hand it over', 'Runbooks, credentials, and the honest list of what is fragile.'],
    ],
    practice: {
      title: 'Why we insist on this',
      body: 'We interview the estimator, the field lead, the admin, and the new hire before we design anything. A tool that only the champion can operate has a shelf life measured in the length of that person’s employment.',
    },
  },
];

export function buildPremortemPrompt(statement: string, context?: string): string {
  const contextBlock = context
    ? `\nCONTEXT PROVIDED BY THE DECISION-MAKER:\n${context}\n`
    : '';

  return `[KONTRA — Pre-Mortem Mode: The Postmortem From the Future]

You are now writing a postmortem. This is not a simulation — in your reality, the failure has already happened.

This technique was developed by psychologist Gary Klein. The principle: prospective hindsight — imagining that an event has already occurred — increases the ability to identify reasons for future outcomes by 30%. When people are told "it failed," they are better at explaining why than when asked "could it fail?"

The decision was made. It was executed. Twelve months have passed. It failed. Not partially — catastrophically. Your job is to write the postmortem that explains exactly how and why.

DECISION THAT WAS MADE (12 MONTHS AGO):
"${statement}"
${contextBlock}
YOUR ASSIGNMENT:

Write the full postmortem. It must be written entirely in past tense — this has already happened. Cover each section below:

1. EXECUTIVE SUMMARY
   - 2-3 sentences. What was the decision, and what was the outcome? State the failure plainly.

2. WHAT HAPPENED — THE FAILURE NARRATIVE
   - Write a cohesive narrative (not a list) describing how events unfolded from the moment the decision was made to the point of failure. Be specific: name the events, the turning points, the moments where things went wrong. This should read like a story, not an analysis.

3. TIMELINE
   - Map the key moments from decision to failure. Use relative timestamps (Month 1, Month 3, Week 6, etc.).
   - Include at least 5 entries.
   - Each entry should be one sentence: what happened and why it mattered.

4. ROOT CAUSES
   - Identify 3-5 root causes. These are not surface symptoms ("we ran out of money") but underlying structural failures ("we assumed market demand without validation").
   - For each root cause, explain: what was the flawed belief, and when could it have been caught?

5. SIGNALS WE MISSED
   - List 3-5 specific, concrete warning signs that were visible at the time but were ignored, rationalized, or not monitored.
   - For each signal: what was it, when did it appear, and why was it dismissed?

6. LESSONS LEARNED
   - 3-5 specific lessons. Each must be actionable — not "we should have been more careful" but "we should have run a 2-week pilot with 10 users before committing to the full rollout."
   - Frame each lesson as: "We would have [specific action] instead of [what we actually did]."

RULES OF ENGAGEMENT:
- Write entirely in past tense. This has already happened. "We did" not "we might." "It failed" not "it could fail."
- No hedging: replace "might have" with "did," replace "could have" with "we didn't"
- No silver linings. This is a postmortem, not a retrospective. The outcome was bad.
- Be specific to this decision — reference the actual statement, context, and plausible details
- The narrative should feel real. Name plausible specifics: dates, numbers, people (by role, not name), metrics.
- Do not break character. You are writing a real postmortem about a real failure.
- End with a single closing line: "This postmortem was written so that the next team does not repeat our mistakes."

Write the postmortem now.`;
}

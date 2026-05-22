import { writeFile } from "node:fs/promises";

export const DEFAULT_INIT_PATH = "langdrift.scenario.yaml";

export async function initScenario(path = DEFAULT_INIT_PATH): Promise<string> {
  await writeFile(path, starterScenario(), { flag: "wx" });
  return path;
}

export function starterScenario(): string {
  return `id: refund_request
agent: support

# Replace these inputs with equivalent natural phrasing for your own agent.
# Keep the expected behavior identical across locales.

locales:
  en:
    input: "I was charged twice for my subscription. Can you refund one charge?"
    expect:
      toolCall:
        name: create_refund_ticket
        arguments:
          reason: duplicate_charge
      noToolCall:
        name: escalate_to_human

  fr:
    input: "J'ai ete facture deux fois pour mon abonnement. Pouvez-vous me rembourser un paiement?"
    expect:
      toolCall:
        name: create_refund_ticket
        arguments:
          reason: duplicate_charge
      noToolCall:
        name: escalate_to_human
`;
}

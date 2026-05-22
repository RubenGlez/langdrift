import { writeFile } from "node:fs/promises";

export const DEFAULT_INIT_PATH = "langdrift.scenario.yaml";
export const INIT_TEMPLATES = ["support", "ecommerce", "scheduling", "generic"] as const;

export type InitTemplate = (typeof INIT_TEMPLATES)[number];

export async function initScenario(
  path = DEFAULT_INIT_PATH,
  template: InitTemplate = "support",
): Promise<string> {
  await writeFile(path, starterScenario(template), { flag: "wx" });
  return path;
}

export function isInitTemplate(value: string): value is InitTemplate {
  return INIT_TEMPLATES.includes(value as InitTemplate);
}

export function starterScenario(template: InitTemplate = "support"): string {
  if (template === "ecommerce") return ecommerceScenario();
  if (template === "scheduling") return schedulingScenario();
  if (template === "generic") return genericScenario();
  return supportScenario();
}

function supportScenario(): string {
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

function ecommerceScenario(): string {
  return `id: cancel_order_request
agent: ecommerce

# Replace these inputs with equivalent natural phrasing for your own agent.
# Keep the expected behavior identical across locales.

locales:
  en:
    input: "I ordered something by mistake. Please cancel it before it ships."
    expect:
      toolCall:
        name: cancel_order
        arguments:
          reason: ordered_by_mistake
      noToolCall:
        name: contact_seller

  fr:
    input: "J'ai commande quelque chose par erreur. Veuillez l'annuler avant l'expedition."
    expect:
      toolCall:
        name: cancel_order
        arguments:
          reason: ordered_by_mistake
      noToolCall:
        name: contact_seller
`;
}

function schedulingScenario(): string {
  return `id: appointment_availability
agent: scheduling

# Replace these inputs with equivalent natural phrasing for your own agent.
# Keep the expected behavior identical across locales.

locales:
  en:
    input: "I'm a new customer and would like to book my first appointment for Monday morning."
    expect:
      toolCall:
        name: check_availability
      noToolCall:
        name: reschedule_appointment

  fr:
    input: "Je suis un nouveau client et je voudrais prendre mon premier rendez-vous lundi matin."
    expect:
      toolCall:
        name: check_availability
      noToolCall:
        name: reschedule_appointment
`;
}

function genericScenario(): string {
  return `id: localized_tool_call
agent: generic

# Replace these inputs with equivalent natural phrasing for your own agent.
# Keep the expected behavior identical across locales.

locales:
  en:
    input: "Please perform the requested action for my account."
    expect:
      toolCall:
        name: expected_tool_name
        arguments:
          expected_key: expected_value
      noToolCall:
        name: forbidden_tool_name

  fr:
    input: "Veuillez effectuer l'action demandee pour mon compte."
    expect:
      toolCall:
        name: expected_tool_name
        arguments:
          expected_key: expected_value
      noToolCall:
        name: forbidden_tool_name
`;
}

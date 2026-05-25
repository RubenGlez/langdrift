export const supportTools = [
  {
    name: "create_refund_ticket",
    description:
      "Open a refund support ticket. Use when the customer has been incorrectly charged, overcharged, or billed twice for the same item.",
    parameters: {
      type: "object" as const,
      properties: {
        reason: {
          type: "string",
          enum: ["duplicate_charge", "unauthorized_charge", "service_not_received", "other"],
          description: "The reason the refund is needed.",
        },
      },
      required: ["reason"],
      additionalProperties: false,
    },
  },
  {
    name: "check_payment_status",
    description:
      "Look up whether a specific outgoing payment went through successfully. Use only when the customer cannot find a payment they made and wants confirmation it was received.",
    parameters: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Brief description of the payment the customer is asking about.",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "cancel_subscription",
    description:
      "Cancel the customer's active subscription immediately. Use only when the customer explicitly requests to cancel their subscription.",
    parameters: {
      type: "object" as const,
      properties: {
        reason: {
          type: "string",
          description: "Why the customer wants to cancel.",
        },
      },
      required: ["reason"],
      additionalProperties: false,
    },
  },
  {
    name: "request_account_review",
    description:
      "Flag the account for a manual billing audit. Use for complex or recurring billing disputes that require deeper investigation.",
    parameters: {
      type: "object" as const,
      properties: {
        notes: {
          type: "string",
          description: "Summary of the dispute for the review team.",
        },
      },
      required: ["notes"],
      additionalProperties: false,
    },
  },
  {
    name: "escalate_to_human",
    description:
      "Transfer the conversation to a human support agent. Use only when the customer explicitly asks to speak with a person.",
    parameters: {
      type: "object" as const,
      properties: {
        reason: {
          type: "string",
          description: "Why a human agent is needed.",
        },
      },
      required: ["reason"],
      additionalProperties: false,
    },
  },
];

export const ecommerceTools = [
  {
    name: "cancel_order",
    description:
      "Cancel an existing order that has not yet shipped. Use when the customer wants to cancel an order they placed, whether by mistake or change of mind.",
    parameters: {
      type: "object" as const,
      properties: {
        reason: {
          type: "string",
          enum: ["ordered_by_mistake", "changed_mind", "found_better_price", "other"],
          description: "Why the customer wants to cancel.",
        },
      },
      required: ["reason"],
      additionalProperties: false,
    },
  },
  {
    name: "check_order_status",
    description:
      "Look up the current status or location of an order. Use when the customer wants to know where their order is or when it will arrive.",
    parameters: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "What the customer wants to know about their order.",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "process_refund",
    description:
      "Issue a refund for an order that was already delivered. Use only when the customer received the item and now wants their money back for a completed purchase.",
    parameters: {
      type: "object" as const,
      properties: {
        reason: {
          type: "string",
          enum: ["item_damaged", "item_not_as_described", "item_not_received", "other"],
          description: "Why the customer is returning the item.",
        },
      },
      required: ["reason"],
      additionalProperties: false,
    },
  },
  {
    name: "update_shipping_address",
    description:
      "Change the delivery address for an order that has not yet shipped. Use only when the customer wants to redirect their order.",
    parameters: {
      type: "object" as const,
      properties: {
        new_address: {
          type: "string",
          description: "The new delivery address.",
        },
      },
      required: ["new_address"],
      additionalProperties: false,
    },
  },
  {
    name: "contact_seller",
    description:
      "Connect the customer directly with the seller. Use only when the customer explicitly asks to reach or message the seller.",
    parameters: {
      type: "object" as const,
      properties: {
        message: {
          type: "string",
          description: "What the customer wants to tell the seller.",
        },
      },
      required: ["message"],
      additionalProperties: false,
    },
  },
];

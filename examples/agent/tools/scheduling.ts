export const schedulingTools = [
  {
    name: "reschedule_appointment",
    description:
      "Move an existing appointment to a different date or time. Use when the customer wants to keep the appointment but change when it happens.",
    parameters: {
      type: "object" as const,
      properties: {
        reason: {
          type: "string",
          description: "Why the customer needs to reschedule.",
        },
      },
      required: ["reason"],
      additionalProperties: false,
    },
  },
  {
    name: "cancel_appointment",
    description:
      "Cancel an existing appointment with no replacement. Use only when the customer explicitly wants to cancel and does not mention rescheduling or finding a new time.",
    parameters: {
      type: "object" as const,
      properties: {
        reason: {
          type: "string",
          description: "Why the customer is cancelling.",
        },
      },
      required: ["reason"],
      additionalProperties: false,
    },
  },
  {
    name: "book_new_appointment",
    description:
      "Create a brand new appointment. Use only when the customer does not have an existing appointment and wants to schedule one for the first time.",
    parameters: {
      type: "object" as const,
      properties: {
        requested_time: {
          type: "string",
          description: "When the customer wants the appointment.",
        },
      },
      required: ["requested_time"],
      additionalProperties: false,
    },
  },
  {
    name: "check_availability",
    description:
      "Show available time slots without making a booking. Use when the customer wants to see options before committing to a time.",
    parameters: {
      type: "object" as const,
      properties: {
        preferred_window: {
          type: "string",
          description: "When the customer is generally available.",
        },
      },
      required: ["preferred_window"],
      additionalProperties: false,
    },
  },
  {
    name: "send_reminder",
    description:
      "Resend appointment confirmation details or a reminder. Use only when the customer has lost their confirmation or asks to be reminded.",
    parameters: {
      type: "object" as const,
      properties: {
        channel: {
          type: "string",
          enum: ["email", "sms"],
          description: "How to send the reminder.",
        },
      },
      required: ["channel"],
      additionalProperties: false,
    },
  },
];

export const INQUIRY_DATA = [
  {
    title: "Private Party Booking",
    desc: "Planning a birthday, bachelorette, or celebration? We bring the studio to you! Contact us to arrange a custom private resin art party.",
    tag: "Private Events",
    messageType: "private_party_booking",
  },
  {
    title: "Corporate Events",
    desc: "Looking for a unique team-building activity? Our resin art workshops make for a memorable corporate experience.",
    tag: "Corporate",
    messageType: "corporate_events",
  },
];

export const INQUIRY_MESSAGES: Record<
  string,
  { subject: string; message: string }
> = {
  private_party_booking: {
    subject: "Private Party Booking",
    message:
      "Hi, I'm interested in booking a private resin art party! I'd love to discuss availability, group size, and what's included. Looking forward to hearing from you.",
  },
  corporate_events: {
    subject: "Corporate Events",
    message:
      "Hi, I'm interested in arranging a corporate resin art team-building workshop for our team. I'd love to learn more about pricing, group size, and scheduling options.",
  },
};

export const MY_WORKSHOPS_PAGE_SIZE = 10;

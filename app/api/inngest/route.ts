import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client.js";
import { functions } from "../../../inngest/functions.js";

// Create the Inngest API route handler
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});

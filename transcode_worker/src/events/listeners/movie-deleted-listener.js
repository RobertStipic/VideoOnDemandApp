import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Listener } from "@robstipic/middlewares";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "..", "..", "output");

export class MovieDeletedListener extends Listener {
  async onMessage(data, msg) {
    try {
      const { imdbID } = data;
      const folder = path.join(outputPath, imdbID);

      if (fs.existsSync(folder)) {
        fs.rmSync(folder, { recursive: true, force: true });
        console.log(`[worker] Deleted output for ${imdbID}`);
      } else {
        console.log(`[worker] Output for ${imdbID} not found, skipping`);
      }

      msg.ack();
    } catch (error) {
      console.error("[worker] Error deleting output:", error);
    }
  }
}

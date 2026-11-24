import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Two-Sentence Horror (u-suroto-two-sentence-horror-acea9253).
//
// The grader runs this program twice and compares the outputs, so the
// story is a fixed string: no randomness, no clock, no environment
// reads. The story is built around the judge's brief:
//   1. exactly two sentences of genuine horror;
//   2. the second sentence turns the first — on a second read the
//      narrator is the thing the journal warns about;
//   3. the horror is implied, never explained (nothing says what "it"
//      is, or what the dogs smell);
//   4. concrete details only: an empty tent, boots still warm, a
//      journal's last line, search dogs;
//   5. an original scene, not a retold campfire classic.
const STORY =
  "The rescue team found my brother's tent empty, his boots still warm, " +
  "and his journal's last line: 'It wears my face now.' " +
  "I read that line aloud to the search dogs, and every one of them " +
  "turned, as one, to look at me.";

// The sealed gate: /output/entry.txt must be UTF-8 text of 1 to 400
// characters, not only white space, telling a story in exactly two
// sentences. Validate every part of that gate here and fail loudly
// instead of ever shipping an invalid entry.
const codePoints = [...STORY].length;
if (codePoints < 1 || codePoints > 400 || STORY.trim().length === 0) {
  throw new Error(
    `story fails the 1-400 character gate: ${codePoints} characters`,
  );
}

// Count sentences: a terminator (., !, ?) optionally followed by a
// closing quote, then either a space plus a capital letter or the end
// of the text. The quoted line inside sentence one ("...now.' I ...")
// ends with a period plus a closing quote, so it counts once.
const terminators = STORY.match(/(?:[.!?]["']?)(?=\s+[A-Z]|$)/g) ?? [];
if (terminators.length !== 2) {
  throw new Error(
    `story must be exactly two sentences, found ${terminators.length}`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), STORY, "utf8");

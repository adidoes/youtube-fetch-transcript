import { fetchTranscript } from "./index";
import { describe, it, expect } from "vitest";

describe("Youtube Transcript", () => {
  describe("fetchTranscript", () => {
    it("should fetch transcript for a valid video id", async () => {
      const videoId = "dQw4w9WgXcQ"; // Rick Astley - Never Gonna Give You Up
      const transcript = await fetchTranscript(videoId);
      // console.log("transcript", transcript);
      expect(transcript).toBeDefined();
      expect(transcript?.length).toBeGreaterThan(0);
      const fullText = transcript!
        .filter((t) => t.text !== "[Music]")
        .map((t) => t.text)
        .join(" ");
      // console.log("fullText", fullText);
      expect(fullText).toContain("you know the rules");
    });

    it("should throw an error for an invalid video id", async () => {
      const videoId = "invalid-id";
      await expect(fetchTranscript(videoId)).rejects.toThrow();
    });
  });
});

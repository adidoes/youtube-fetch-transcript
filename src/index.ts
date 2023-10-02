export class YoutubeTranscriptError extends Error {
  constructor(message: string) {
    super(`[YoutubeTranscript] 🚨 ${message}`);
  }
}

export interface TranscriptConfig {
  lang?: string;
  country?: string;
}

export interface TranscriptResponse {
  text: string;
  duration: number;
  offset: number;
}

/**
 * Fetch transcript from YTB Video
 * @param videoId Video url or video identifier
 * @param config Get transcript in another country and language ISO
 */
export async function fetchTranscript(
  videoId: string,
  config?: TranscriptConfig,
): Promise<TranscriptResponse[] | undefined> {
  try {
    const videoPageBody = await fetch(
      `https://www.youtube.com/watch?v=${videoId}`,
    ).then((res) => res.text());
    const innerTubeApiKey = videoPageBody
      ?.split('"INNERTUBE_API_KEY":"')[1]
      ?.split('"')[0];

    if (innerTubeApiKey && innerTubeApiKey.length > 0) {
      const response = await fetch(
        `https://www.youtube.com/youtubei/v1/get_transcript?key=${innerTubeApiKey}`,
        {
          method: "POST",
          body: JSON.stringify(
            generateRequest(videoPageBody.toString(), config),
          ),
          headers: { "Content-Type": "application/json" },
        },
      );
      const body = await response.json();

      if (body.responseContext) {
        if (!body.actions) {
          throw new Error("Transcript is disabled on this video");
        }
        const transcripts: any[] =
          body.actions[0].updateEngagementPanelAction.content.transcriptRenderer
            .body.transcriptBodyRenderer.cueGroups;

        return transcripts.map((cue) => ({
          text: cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer.cue
            .simpleText,
          duration: parseInt(
            cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer
              .durationMs,
          ),
          offset: parseInt(
            cue.transcriptCueGroupRenderer.cues[0].transcriptCueRenderer
              .startOffsetMs,
          ),
        }));
      }
    }
  } catch (e) {
    throw new YoutubeTranscriptError(e as string);
  }
}

function generateRequest(page: string, config?: TranscriptConfig) {
  const params = page.split('"serializedShareEntity":"')[1]?.split('"')[0];
  const visitorData = page.split('"VISITOR_DATA":"')[1]?.split('"')[0];
  const sessionId = page.split('"sessionId":"')[1]?.split('"')[0];
  const clickTrackingParams = page
    ?.split('"clickTrackingParams":"')[1]
    ?.split('"')[0];
  return {
    context: {
      client: {
        hl: config?.lang || "en",
        gl: config?.country || "US",
        visitorData,
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)",
        clientName: "WEB",
        clientVersion: "2.20200925.01.00",
        osName: "Macintosh",
        osVersion: "10_15_4",
        browserName: "Chrome",
        browserVersion: "85.0f.4183.83",
        screenWidthPoints: 1440,
        screenHeightPoints: 770,
        screenPixelDensity: 2,
        utcOffsetMinutes: 120,
        userInterfaceTheme: "USER_INTERFACE_THEME_LIGHT",
        connectionType: "CONN_CELLULAR_3G",
      },
      request: {
        sessionId,
        internalExperimentFlags: [],
        consistencyTokenJars: [],
      },
      user: {},
      clientScreenNonce: generateNonce(),
      clickTracking: {
        clickTrackingParams,
      },
    },
    params,
  };
}

function generateNonce(): string {
  const rnd = Math.random().toString();
  const alphabet =
    "ABCDEFGHIJKLMOPQRSTUVWXYZabcdefghjijklmnopqrstuvwxyz0123456789";
  const jda = [
    alphabet + "+/=",
    alphabet + "+/",
    alphabet + "-_=",
    alphabet + "-_.",
    alphabet + "-_",
  ];
  const b = jda[3] ?? "";
  const a = [];
  for (let i = 0; i < rnd.length - 1; i++) {
    a.push(rnd[i]?.charCodeAt(i));
  }
  let c = "";
  let d = 0;
  let m, n, q, r, f, g;
  while (d < a.length) {
    f = a[d];
    g = d + 1 < a.length;

    if (g) {
      m = a[d + 1];
    } else {
      m = 0;
    }
    n = d + 2 < a.length;
    if (n) {
      q = a[d + 2];
    } else {
      q = 0;
    }
    r = f ?? 0 >> 2;
    f = ((f ?? 0 & 3) << 4) | (m ?? 0 >> 4);
    m = ((m ?? 0 & 15) << 2) | (q ?? 0 >> 6);
    q = q ?? 0 & 63;
    if (!n) {
      q = 64;
      if (!q) {
        m = 64;
      }
    }
    c += b[r]! + b[f] + b[m] + b[q];
    d += 3;
  }
  return c;
}

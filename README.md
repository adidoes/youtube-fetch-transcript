# youtube-fetch-transcript

[![npm version](https://badge.fury.io/js/youtube-fetch-transcript.svg)](https://badge.fury.io/js/youtube-fetch-transcript)

Fetch transcript from a YouTube video.

This package uses internal APIs so it can be broken over the time if no update appears.

## Usage

```js
import { fetchTranscript } from "youtube-fetch-transcript";

const segments = await fetchTranscript("dQw4w9WgXcQ");

// segments [
//   { text: '[Music]', duration: 14650, offset: 0 },
//   { text: 'thank you', duration: 5701, offset: 16699 },
//   { text: "we're no strangers to love", duration: 7401, offset: 18779 },
//   ...
// ]
```

### Methods

- fetchTranscript(videoId: string [,options: TranscriptConfig]): Promise<TranscriptResponse[] | undefined>;

## License

Distributed under MIT License (`The MIT License`).

See [LICENSE](LICENSE) for more information.

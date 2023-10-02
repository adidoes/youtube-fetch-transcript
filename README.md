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

## Contribution

PRs are welcome. Testing and coding guidlines are still in the works so I will try to get those created at a later point. Try to keep similar code syntax to the rest of the code.

## Credits

This is a fork of the `youtube-transcript` module created by @Kakulukian but uses native `fetch` for requests.

View the original project on [NPM](https://www.npmjs.com/package/youtube-transcript).

## License

Distributed under MIT License (`The MIT License`).

See [LICENSE](LICENSE) for more information.

import emojisDataJson from "./emojisData.json"

export const emojisData = emojisDataJson;

const defaultOptions = {
  // emojis: {        // required param
  // "emoji1": {
  //     "altText": "..someAlt Emoji1 Grapheme Cluster..",
  //     "url": "..emoji1 URL .."
  //      },
  // "emoji2": {
  //     "altText": "..someAlt Emoji2 Grapheme Cluster..",
  //     "url": "..emoji2 URL .."
  //      }, etc..
  // },
  unicode: false
};

export function markedEmoji(options) {
  options = {
    ...defaultOptions,
    ...options
  };

  if (!options.emojis) {
    throw new Error('Must provide emojis to markedEmoji');
  }

  return {
    extensions: [{
      name: 'emoji',
      level: 'inline',
      start(src) { return src.indexOf(':'); },
      tokenizer(src, tokens) {
        const rule = /^:(.+?):/;
        const match = rule.exec(src);
        if (!match) {
          return;
        }

        const shortName = match[1]; //markdown shortcode

        if ( // not found :short_code: emojis or mkdocs defined emojis
          !(shortName in options.emojis)
          || !("altText" in options.emojis[shortName])
          || !("url" in options.emojis[shortName])
          ) {
          return;
        }

        var altText;
        altText = options.emojis[shortName]["altText"];

        const emojiUrl = options.emojis[shortName].url;
        if (!emojiUrl) {
          return;
        }

        return {
          type: 'emoji',
          raw: match[0],
          shortName,
          emojiUrl,
          altText
        };
      },
      renderer(token) {
        if (options.unicode) {
          return token.emoji;
        } else {
          return `<img class="emoji twemoji" alt="${token.altText}" title=":${token.shortName}:" src="${token.emojiUrl}"${this.parser.options.xhtml ? ' /' : ''}>`;
        }
      }
    }]
  };
}

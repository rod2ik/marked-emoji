import emojisData from "./rawEmojisData.js";
import fs from "fs";

// This File Builds emojisData.json File from rawEmojisData.js, 
// rawEmojisData.js is a local copy of emojis-data data from the github project :
// Raw Emoji Data from "https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji.json"

const baseUrl = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/";
const exportFilename = "emojisData.json";

const buildEmojisUrlObject = (emojisData) => {
    let emojisObject = {};
    const skinShortName = {
        "1F3B": "light", 
        "1F3C": "medium_light", 
        "1F3D": "medium", 
        "1F3E": "medium_dark", 
        "1F3F": "dark" 
    }

    emojisData.forEach( emoji => {
        // emojisObject[emoji.short_name] = baseUrl + stripLast_FE0F_from(emoji.image);
        emojisObject[emoji.short_name] = {
            "altText": getEmojiGrapheme(emoji.unified),
            "url": baseUrl + stripLast_FE0F_from(emoji.image)
        };

        if (emoji.skin_variations) { // if skin tones exist for this emoji, add them
            Array.from(Object.keys(emoji.skin_variations)).forEach( (skin,i)  => {
                emojisObject[emoji.short_name+"_"+skinShortName[Object.keys(skinShortName)[i]]] = {
                    "altText": getEmojiGrapheme(emoji.skin_variations[`${skin}`].unified),
                    "url": baseUrl + stripLast_FE0F_from(emoji.skin_variations[`${skin}`].image)
                };
            });
        }
        emoji.short_names.forEach( shortname => { // Add any additional shortname aliases
                emojisObject[shortname] = {
                    "altText": getEmojiGrapheme(emoji.unified),
                    "url": baseUrl + stripLast_FE0F_from(emoji.image)
                };
            });
    });
    return emojisObject
}

const getEmojiGrapheme = (codePointString) => { 
    // Translates string "1F600" to emoji grapheme "😀"
    // Translates string "1F600" to emoji grapheme "😀"
    return codePointString.split('-')
                    .map((codePoint) => (
                        String.fromCodePoint(`0x${codePoint}`)
                        ))
                    .join('');                     
}

const stripLast_FE0F_from = (image) => { 
    // fix 'xxxx-fe0f.svg' image name to just 'xxxx.svg'
    // to be coherent with the cdn page : https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/
    const nbOccurences = (image.match(/-/g) || []).length;
    const n = image.length;
    if (nbOccurences == 1 && n >= 9 && image.substring(n-9,n) == "-fe0f.svg") {
        image = image.substring(0,n-9) + ".svg";
    }
    return image
}

const emojis = buildEmojisUrlObject(emojisData);

// console.log("emojis=", emojis);

const emojisString = JSON.stringify(emojis);
fs.writeFile(exportFilename, emojisString, (err, result) => {
    if(err) { 
        console.log('error', err);
    }
});

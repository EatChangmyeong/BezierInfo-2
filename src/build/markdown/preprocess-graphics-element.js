import path from "path";
import paths from "../../project-paths.js";
import generateFallbackImage from "./generate-fallback-image.js";

/**
 * Convert a series of `data-blah="val"` into a dataset object.
 * @param {*} data
 */
function formDataSet(data) {
  if (!data) return;
  let dataset = {};
  data.replace(/data-([\w-]+)="([^"]+)"\s*/g, (_, name, value) => {
    dataset[name.replace(/-([a-z])/g, (_, g) => g.toUpperCase())] = value;
  });
  return dataset;
}

/**
 * ...docs go here...
 */
async function preprocessGraphicsElement(chapter, localeStrings, markdown) {
  const translate = localeStrings.translate;

  let pos = -1,
    data = markdown,
    startmark = `<graphics-element`,
    endmark = `</graphics-element>`;

  do {
    pos = data.indexOf(startmark, pos);
    if (pos !== -1) {
      // extract a <graphics-element...>...</graphics-element> segment
      let endpos = data.indexOf(endmark, pos) + endmark.length;
      let slice = data.slice(pos, endpos);
      let updated = slice;

      // if there are no width/height attributes, inject them

      // FIXME: This will not work if there is UI html that uses the
      // TODO:  width/height attributes, but the graphics-element
      //        does not,  of course! [known bug]

      if (updated.indexOf(`width=`) === -1)
        updated = updated.replace(
          /title="([^"]+)"\s*/,
          `title="$1" width="275" `
        );

      if (updated.indexOf(`height=`) === -1)
        updated = updated.replace(
          /width="(\d+)"\s*/,
          `width="$1" height="275" `
        );

      // Then add in the fallback code
      const terms = updated.match(
        /width="([^"]+)"\s+height="([^"]+)"\s+src="([^"]+)"\s*([^>]*)>/
      );

      if (!terms) {
        throw new Error(
          `Bad markup for <graphics-element> while parsing:\n${updated}`
        );
      }

      const [original, width, height, _, remainder] = terms;

      let src = terms[3];

      if (src.indexOf(`../`) === 0) src = `./chapters/${chapter}/${src}`;
      else {
        if (src[0] !== `.`) src = `./${src}`;
        src = src.replace(`./`, `./chapters/${chapter}/`);
      }

      // ======================================
      //   this is super fancy functionality:
      // ======================================

      let imageHash = await generateFallbackImage(
        chapter,
        localeStrings,
        src,
        width,
        height,
        // Including the markup-dataset means we can generate distinct images for distinct "instances".
        formDataSet(remainder.trim())
      );

      // Note: this is a URL, _not_ a file system location.
      let imgUrl = path.join(
        path.dirname(src.replace(`./`, `./images/`)),
        `${imageHash}.png`
      );

      const replacement = `width="${width}" height="${height}" src="${src}" ${remainder}>
        <fallback-image>
          <img width="${width}px" height="${height}px" src="${imgUrl}">
          ${translate`disabledMessage`}
        </fallback-image>`;

      updated = updated.replace(original, replacement);
      data = data.replace(slice, updated);
      pos += updated.length;
    }
  } while (pos !== -1);

  return data;
}

export default preprocessGraphicsElement;

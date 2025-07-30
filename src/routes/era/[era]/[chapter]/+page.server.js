import { error } from '@sveltejs/kit';

import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import contentfulFetch from '$lib/contentful-fetch';

import story from '$lib/data/story.json';

export async function load({ params }) {
  const query = `
  {
    chapterCollection(where: {slug:"${params.era}/${params.chapter}"}, limit: 1) {
      items{
        id
        name
        headlineImage {
          url
          title
          description
        }
        era {
          id
          name
          slug
        }
        content {
          json
            # all referenced assets/entries
          # links { ... }
          links {
            assets {
              block {
                  title
                  description
                  url
                  sys {
                      id
                  }
              }
            },
            entries {
              block {
                sys {
                  id
                }
                sys {
                  id
                }
                __typename
                ... on SpecialImage {
                  name
                    imagesCollection {
                      items {
                        title
                        description
                        url
                      }
                    }
                }
              }
            }
          }
        }
      }
    }
  }`;

  const response = await contentfulFetch(query);

  if (!response.ok) {
    console.log(response);
    throw error(404, {
      message: response.statusText,
    })
  };

  const { data } = await response.json();
  const { items } = data.chapterCollection;

  if (!items[0]){
    // throw error(404, {
    //   message: "Content not found in the CMS",
    // })
    console.log(`WARNING: No content found in CMS, for era: ${params.era}; chapter: ${params.chapter}`)
    return {chapter: {era: {name: `${params.era}`}, name: `${params.era}/${params.chapter}`, content: `No content found in CMS, for era: ${params.era}; chapter: ${params.chapter}`}};
  };

  const chapterData = items[0];

    // from https://www.contentful.com/blog/rendering-linked-assets-entries-in-contentful/
    // Create a bespoke renderOptions object to target BLOCKS.EMBEDDED_ENTRY (linked block entries e.g. code blocks)
    // INLINES.EMBEDDED_ENTRY (linked inline entries e.g. a reference to another blog post)
    // and BLOCKS.EMBEDDED_ASSET (linked assets e.g. images)

    function renderOptions(links) {
        
        // create an asset map
        const assetMap = new Map();
        // loop through the assets and add them to the map
        for (const asset of links.assets.block) {
          assetMap.set(asset.sys.id, asset);
        }
      
        // create an entry map
        const entryBlockMap = new Map();
        // loop through the block linked entries and add them to the map
        for (const entry of links.entries.block) {
          entryBlockMap.set(entry.sys.id, entry);
        }
      
        // const entryMap = new Map();
        // //  // loop through the inline linked entries and add them to the map
        // for (const entry of links.entries.inline) {
        //   entryMap.set(entry.sys.id, entry);
        // }
      
        return {
          // other options...
      
          renderNode: {
            // other options...
            //  [INLINES.EMBEDDED_ENTRY]: (node, children) => {
            //   // find the entry in the entryMap by ID
            //   const entry = entryMap.get(node.data.target.sys.id);
      
            //   // render the entries as needed
            //   if (entry.__typename === "BlogPost") {
            //     return <a href={`/blog/${entry.slug}`}>{entry.title}</a>;
            //   }
            // },
            [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
              // find the entry in the entryMap by ID
              const entry = entryBlockMap.get(node.data.target.sys.id);
              // render the entries as needed by looking at the __typename 
              // referenced in the GraphQL query
              if (entry.__typename === "SpecialImage") {
                return (
                  `<div class="side-by-side-image">
                    ${entry.imagesCollection.items.map((item) =>{
                      return(
                        `<figure class="figure">
                          <img src="${item.url}" class="figure-img" alt="${item.title}">
                          <figcaption class="figure-caption">${item.description}</figcaption>
                         </figure>
                      `)
                    }).join('')
                    }
                  </div>`
                );
              }
            },
            [BLOCKS.EMBEDDED_ASSET]: (node, next) => {
              // find the asset in the assetMap by ID
              const asset = assetMap.get(node.data.target.sys.id);
      
              // render the asset accordingly
              return (
                `<figure class="figure">
                  <img src="${asset.url}" class="figure-img" alt="${asset.title}">
                  <figcaption class="figure-caption">${asset.description}</figcaption>
                </figure>`
              );
            },
          },
        };
    };


  // convert content to HTML
  if (chapterData.content)
    chapterData.content = documentToHtmlString(chapterData.content.json, renderOptions(chapterData.content.links));

  // Get the previous and next chapter (if they exist)
  // Get the current era in the context of the "story"
  const thisEra = story.eras[params.era];
  const thisChapter = thisEra.chapters[params.chapter];
  let thisChapterIndexInStory = null;
  const thisEraChapterArray = Object.values(thisEra.chapters);
  thisEraChapterArray.forEach((chapter, index) => {
      console.log(`chapter: ${JSON.stringify(chapter)}, index: ${index}`);
      if (chapter.id == thisChapter.id) 
          thisChapterIndexInStory = index;
  });
  //console.log(`thisChapterIndexInStory: ${thisChapterIndexInStory}`);
  const lastChapter = thisChapterIndexInStory == 0 ? null : thisEraChapterArray[thisChapterIndexInStory-1];
  const nextChapter = thisChapterIndexInStory == thisEraChapterArray.length - 1 ? null : thisEraChapterArray[thisChapterIndexInStory+1];




  return {
    chapter: chapterData,
    lastChapter: lastChapter,
    nextChapter: nextChapter
  };

};


/** @type {import('./$types').EntryGenerator} */
export function entries() {

  //Get all of the chapters from the story so their pages can be pre-rendered
  const chapters = [];
  Object.values(story.eras).forEach((era) => {
    Object.values(era.chapters).forEach((chapter) => {
      chapters.push({ era: `${era.id}`, chapter: `${chapter.id}` });
    })
  });

	return chapters;
  
}

export const prerender = true;

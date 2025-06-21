import { MAPBOX_STYLES_AND_TILESETS_TOKEN } from '$env/static/private'

import { error } from '@sveltejs/kit';

import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

import contentfulFetch from '$lib/contentful-fetch';

//https://github.com/mapbox/mapbox-sdk-js/tree/main
//https://docs.mapbox.com/api/maps/styles/
import Style from '@mapbox/mapbox-sdk/services/styles';
import Tilesets from '@mapbox/mapbox-sdk/services/tilesets';

import story from '$lib/data/story.json';

export async function load({ params }) {

    const tilesetsService = Tilesets({ accessToken: MAPBOX_STYLES_AND_TILESETS_TOKEN});
    let tilesets;
    await tilesetsService.listTilesets()
        .send()
        .then(
            response => {
                // console.log(response.body);
                tilesets = response.body;

                const stylesService = Style({ accessToken: MAPBOX_STYLES_AND_TILESETS_TOKEN});
    
                Object.values(story.views).forEach(async view => {
                    if (view.mapbox) {
                        console.log(`For FBIP view: ${view.id}, looking up Mapbox layers for Mapbox style: ${view.mapbox.style}...`)
                        await stylesService.getStyle({styleId: view.mapbox.style})
                            .send()
                            .then(
                                response => {
                                    // console.log(response.body);
                                    const layers = response.body.layers;
                                    layers.forEach(layer => {
                                        if (layer.source === 'composite'){
                                            //lookup the layer in the list of tilesets
                                            for (const tileset of tilesets) { //use this version of for so we can break
                                                if (tileset.name == layer['source-layer']){
                                                    layer.sourceId = tileset.id;
                                                    console.log(`For FBIP view: ${view.id}, Mapbox style: ${view.mapbox.style},  found a tileset for layer: name: ${layer['source-layer']}, id: ${tileset.id}`)
                                                    break;
                                                };
                                            };
                                        };
                                    });
                                    view.mapbox.layers = layers;
                                }, 
                                error => {console.log(`Error: ${error}`)}
                            );
                    }
                });



            }, 
            error => {}
        );

    //Look up the content for Intro and each Era into contentful
    const eraCollectionIntroContentQuery = `
        {
            eraCollection(limit: 10) {
                items{
                    id
                    name
                    introContent {
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
                            }
                        }
                    }
                }
            }
        }`;


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
      
        // // create an entry map
        // const entryBlockMap = new Map();
        // // loop through the block linked entries and add them to the map
        // for (const entry of links.entries.block) {
        //   entryBlockMap.set(entry.sys.id, entry);
        // }
      
        //  // loop through the inline linked entries and add them to the map
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




    const eraCollectionIntroContentResponse = await contentfulFetch(eraCollectionIntroContentQuery);
    console.log(eraCollectionIntroContentResponse);

    if (!eraCollectionIntroContentResponse.ok) {
        console.log(eraCollectionIntroContentResponse);
        throw error(404, {
        message: eraCollectionIntroContentResponse.statusText,
        })
    };
    //const eraIntroContent = await eraCollectionIntroContentResponse.json();
    const { data } = await eraCollectionIntroContentResponse.json();
    const { items } = data.eraCollection;
    //update the story with eraIntroContent
    items.forEach(era => {
        console.log(`era: id: ${era.id}`);
        // story.views[era.id].introContent = era.introContent;
        // convert content to HTML
        if (era.introContent){
            story.views[era.id].introContent = documentToHtmlString(era.introContent.json, renderOptions(era.introContent.links));
            // story.views[era.id].introContent = documentToHtmlString(era.introContent.json);
        };

    });

    // console.log(items);

    return {
		story : story
	};
}
 

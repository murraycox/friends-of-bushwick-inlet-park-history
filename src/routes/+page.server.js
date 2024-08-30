import { MAPBOX_STYLES_AND_TILESETS_TOKEN } from '$env/static/private'

//https://github.com/mapbox/mapbox-sdk-js/tree/main
//https://docs.mapbox.com/api/maps/styles/
import Style from '@mapbox/mapbox-sdk/services/styles';
import Tilesets from '@mapbox/mapbox-sdk/services/tilesets';

import story from '$lib/data/story.json';

export function load({ params }) {

    const tilesetsService = Tilesets({ accessToken: MAPBOX_STYLES_AND_TILESETS_TOKEN});
    let tilesets;
    tilesetsService.listTilesets()
        .send()
        .then(
            response => {
                console.log(response.body);
                tilesets = response.body;

                const stylesService = Style({ accessToken: MAPBOX_STYLES_AND_TILESETS_TOKEN});
    
                // List tilesets.
                // stylesService.listStyles()
                //     .send()
                //     .then(response => {console.log(response.body)}, error => {});
                Object.values(story.views).forEach(view => {
                    if (view.mapbox) {
                        stylesService.getStyle({styleId: view.mapbox.style})
                            .send()
                            .then(
                                response => {
                                    console.log(response.body);
                                    const layers = response.body.layers;
                                    layers.forEach(layer => {
                                        if (layer.source === 'composite'){
                                            //lookup the layer in the list of tilesets
                                            for (const tileset of tilesets) { //use this version of for so we can break
                                                if (tileset.name == layer['source-layer']){
                                                    layer.sourceId = tileset.id;
                                                    console.log(`Found layer: name: ${layer['source-layer']}, id: ${tileset.id}`)
                                                    break;
                                                };
                                            };
                                        };
                                    });
                                    view.mapbox.layers = layers;
                                }, 
                                error => {}
                            );
                    }
                });



            }, 
            error => {}
        );
    return {
		story : story
	};
}
 

const e={mapbox:{style:"mapbox://styles/fbip/cm03wuvt700av01qve4td1x0q"}},t="intro",i={"nyc-region-land":{id:"nyc-landline",type:"shapefile",url:"/gis/NYC_region_land_cropped_4326_topo.json",topoJson:!0,topoJsonObjectsName:"nyc_region_land"},"nyc-historical-waterline":{id:"nyc-historical-waterline",type:"shapefile",url:"/gis/historical_water_polygons_final_4326_topo.json",topoJson:!0,topoJsonObjectsName:"historical_water"},"seventeenseventysix-shoreline":{id:"seventeenseventysix-shoreline",type:"shapefile",url:"/gis/1776_shoreline_polylines_4326_topo.json",topoJson:!0,topoJsonObjectsName:"1776_shoreline"},pluto:{id:"pluto",type:"tile",urlPath:"/gis/pluto/",urlExtension:"png"},"indian-paths-kings-county":{id:"indian-paths-kings-county",type:"shapefile",url:"/gis/Indian_villages_ponds_paths_kings_cty_4326.geojson"},"indian-paths-ny":{id:"indian-paths-nyc",type:"shapefile",url:"/gis/Indian_paths_of_great_metropolis_NYC_bolton_1912_4326.geojson"},"oyster-historic-beds":{id:"oyster-historic-beds",type:"shapefile",url:"/gis/historic_oyster_beds_HEP.geojson"},"oyster-restoration-sites":{id:"oyster-restoration-sites",type:"shapefile",geometryType:"polygons",url:"/gis/recent_restoration_sites_oysters_2018_HEP.geojson"},"era-1-polys":{id:"era-1-polys",type:"shapefile",geometryType:"polygons",url:"/gis/era_1_polys_4326_topo.json",topoJson:!0,topoJsonObjectsName:"era_1_polys",interactive:!0},"era-1-lines-the-strand":{id:"era-1-lines-the-strand",type:"shapefile",geometryType:"polygons",url:"/gis/era_1_lines_the_strand_4326.geojson"},"bip-lots":{id:"bip-lots",type:"shapefile",url:"/gis/BIP_FinalLots.geojson",interactive:!1},"era3-story-polygons":{id:"era3-story-polygons",type:"shapefile",url:"/gis/era_3_1855-1950s_story_polys_sorted.geojson",interactive:!0},"fbip-labels":{id:"fbip-labels",type:"label",path:"/gis/fbip_labels.geojson",interactive:!1,filterOnContext:!0},"era-1-labels":{id:"era-1-labels",type:"label",labelField:"label_2",path:"/gis/era_1_labels.geojson",interactive:!0}},n={intro:{id:"intro",name:"Bushwick Inlet Park History Project",extent:{nwLng:-73.98,nwLat:40.74,seLng:-73.94,seLat:40.695},maps:["nyc-landline","nyc-historical-waterline","seventeenseventysix-shoreline","pluto","bip-lots","fbip-labels"],mapbox:{style:"cm0cny38k004s01qrec87exar"},story:[{type:"p",text:"Bushwick Inlet Park is a 28-acre piece of land that sits along the East River at the juncture of Greenpoint and Williamsburg. The park was created in 2005, a giveback from the City of New York to the residents of North Brooklyn as part of a massive waterfront rezoning that so far has added more than 50,000 new residents to these neighborhoods[WD1] . The design of the park is guided by a master plan design prepared by Donna Walcavage of Stantec and endorsed through a community process in 2007."},{type:"h",stop:"when-it-is-completed",text:"When it is completed"},{type:"p",text:"When it is completed, Bushwick Inlet Park will be the crown jewel set in the midst of 5 miles of almost continuous waterfront esplanades running from the Wallabout Creek to Newtown Creek. Set between Marsha P. Johnson East River State Park to the south and the Greenpoint Monitor Museum to the north, BIP and its immediate neighbors will provide close to 36 acres of contiguous public open space [WD2] directly on the East River. But almost 20 years after the rezoning, the park is still more of a concept than a reality. As of 2023, less than a third of the park has been constructed, and it was only in the past few years that the City acquired – at great expense – the final piece of the puzzle that makes up Bushwick Inlet Park. Completion of the full park is likely decades away."},{type:"p",text:"The Bushwick Inlet Park “puzzle” consists of 5 pieces of property[WD3] , acquired at various times between 2007 and 2016 and scheduled to be developed in phases."},{type:"h",text:"Motiva site (2-acres)"},{type:"p",text:"At the north end of the park, wrapping the inlet itself on three sides is the 2-acre Motiva site, the only part of the park within Greenpoint."},{type:"h",text:"Bayside Oil site (10.4-acres)"},{type:"p",text:"On the south side of the inlet is the 10.4-acre Bayside Oil site, whose large oil tanks were a stark reminder of the environmental degradation of waterfront until their demolition in 2019."},{type:"h",stop:"50-kent-st",text:"50 Kent Avenue (2-acres)"},{type:"p",text:"South of the Bayside property on Kent Avenue is a 2-acre, half-block parcel known as 50 Kent Avenue that opened in 2021 as the newest piece of green space to be added to the Park. The western half of this block and the full block to the south comprise the CitiStorage property, 8.5 acres in total."},{type:"h",text:"Soccer Field site (4.6-acres)"},{type:"p",text:"The southernmost block of Bushwick Inlet Park is the 4.6-acre soccer field site, also home to the North Brooklyn Parks headquarter/community house."}],stops:{"when-it-is-completed":{extent:{nwLng:-73.96480845,nwLat:40.72729899,seLng:-73.95572544,seLat:40.71944572},maps:["nyc-landline","historical-waterline","seventeenseventysix-shoreline","pluto","bip-lots","fbip-labels"]},"50-kent-st":{extent:{nwLng:-73.96480845,nwLat:40.72729899,seLng:-73.95572544,seLat:40.71944572},maps:["nyc-landline","historical-waterline","seventeenseventysix-shoreline","pluto","bip-lots","fbip-labels"]}}},"pre-1600s":{id:"pre-1600s",name:"Pre 1600s",extent:{nwLng:-73.99610077,nwLat:40.74185405,seLng:-73.91023564,seLat:40.68369957},maps:["nyc-landline","nyc-historical-waterline","indian-paths-kings-county","pluto","era-1-polys","era-1-lines-the-strand","era-1-labels"],mapbox:{style:"cm0zxu12h00nv01p49jjk6e94"}},"early-european-settlement":{id:"early-european-settlement",name:"Early European Settlement",extent:{nwLng:-73.98,nwLat:40.74,seLng:-73.94,seLat:40.695},maps:["nyc-landline","nyc-historical-waterline"],mapbox:{style:"clyhpvk0l01mp01qohk3w15tr"}},"urban-industrial":{id:"urban-industrial",name:"Urban + Industrial Era",extent:{nwLng:-73.96621568,nwLat:40.729,seLng:-73.9415892,seLat:40.7110097},maps:["nyc-landline","nyc-historical-waterline","seventeenseventysix-shoreline","pluto","fbip-labels","era3-story-polygons"],mapbox:{style:"clzueqw2v00ry01qg5dj71ddj"},story:[{type:"h",text:"Introduction"},{type:"p",text:"First envisioned as a suburb for growing Manhattan across the river, Williamsburgh quickly became a center for manufacture. In the 1850s, two industries that would transform north Brooklyn – sugar refining and petroleum distillation – were established on the Williamsburgh waterfront."},{type:"p",text:"By 1900, the Williamsburg and Greenpoint waterfronts were fully given over to industrial and distribution operations. At the head of Manhattan Avenue was the Chelsea Manufacturing Co., maker of ropes and ships stores (and a successor to the early history of rope walks). South of there was the Gleason-Tiebot Glass Works (now Glasserie). Clay Street south to Java Street was mostly given over to lumber yards, bringing bulk wood products in via the waterfront for distribution throughout the city. These yards continued in operation through the late 20th century and much of the property is now developed as Greenpoint Landing. South of Greenpoint Avenue was the American Manufacturing Company (better known now as Greenpoint Terminal Market), another rope and ship’s stores manufacturing company. And south of there was the Continental Iron Works, still in operation in 1900. South of the inlet in Williamsburg, Standard Oil and the Williamsburg Gas Light Company continued to operate as described above. Cooperages (barrel factories – barrels were the preferred containers for bulk sugar and other products), distilleries, coal pockets (coal transfer stations) and sugar refineries occupied the waterfront south of North 4th Street. The American Sugar Refining Company (previously Havemeyers, later Domino Sugar) occupied the blocks from Grand Street to South 6th Street (the Williamsburg Bridge was under construction at this time); Mollenhauer’s sugar refinery was located between South 7thStreet and Division Avenue."}]},deindustrialization:{id:"deindustrialization",name:"Deindustrialization"},"the-future":{id:"the-future",name:"The Future"}},a={"pre-1600s":{id:"pre-1600s",name:"Pre 1600s",shortLabel:"Pre 1620",longLabel:"Before 1620",link:null,view:"pre-1600s",chapters:{"the-creek":{id:"the-creek",name:"The Creek",link:"/era/pre-1600s/the-creek"},"salt-marshes":{id:"salt-marshes",name:"Salt Marshes",link:"/era/pre-1600s/salt-marshes"},"the-waterfront":{id:"the-waterfront",name:"The Waterfront",link:"/era/pre-1600s/the-waterfront"},"indigenous-population":{id:"indigenous-population",name:"Indigenous Population",link:"/era/pre-1600s/indigenous-population"}}},"early-european-settlement":{id:"early-european-settlement",name:"Early European Settlement",link:null,view:"early-european-settlement",chapters:{"bushwick-patent":{id:"bushwick-patent",name:"Bushwick Patent",link:"/era/early-european-settlement/bushwick-patent"},"bushwick-village":{id:"bushwick-village",name:"Bushwick Village",link:"/era/early-european-settlement/bushwick-village"},"the-founding-of-williamsburgh":{id:"the-founding-of-williamsburgh",name:"The Founding of Williamsburgh",link:"/era/early-european-settlement/the-founding-of-williamsburgh"},"greenpoint-urbanizes":{id:"greenpoint-urbanizes",name:"Greenpoint Urbanizes",link:"/era/early-european-settlement/greenpoint-urbanizes"},"changing-the-creek":{id:"changing-the-creek",name:"Changing the Creek",link:"/era/early-european-settlement/changing-the-creek"},"early-industrialization":{id:"early-industrialization",name:"Early Industrialization",link:"/era/early-european-settlement/early-industrialization"},"williamsburgh-becomes-a-city":{id:"williamsburgh-becomes-a-city",name:"Williamsburgh Becomes a City",link:"/era/early-european-settlement/williamsburgh-becomes-a-city"}}},"urban-industrial":{id:"urban-industrial",name:"Urban + Industrial Era",shortLabel:"1850-1950",longLabel:"Urban and Industrial Era",link:null,view:"urban-industrial",chapters:{"williamsburg-industrialize":{id:"williamsburg-industrialize",name:"Williamsburg Industrialize",link:"/era/urban-industrial/williamsburg-industrializes"},demographics:{id:"demographics",name:"Demographics",link:"/era/urban-industrial/demographics"},"the-creek-disappears":{id:"the-creek-disappears",name:"The Creek Disappears",link:"/era/urban-industrial/the-creek-disappears"},"eastern-district-terminal":{id:"eastern-district-terminal",name:"Eastern District Terminal",link:"/era/urban-industrial/eastern-district-terminal"},"williamsburg-bridge":{id:"williamsburg-bridge",name:"Williamsburg Bridge",link:"/era/urban-industrial/williamsburg-bridge"}}},deindustrialization:{id:"deindustrialization",name:"Deindustrialization",link:null,view:"deindustrialization",chapters:{"williamsburg-deindustrializes":{id:"williamsburg-deindustrializes",name:"Williamsburg Deindustrializes",link:"/era/deindustrialization/williamsburg-deindustrializes"},"community-plans-and-other-plans":{id:"community-plans-and-other-plans",name:"Community Plans and Other Plans",link:"/era/deindustrialization/community-plans-and-other-plans"}}},"the-future":{id:"the-future",name:"The Future",link:null,view:"the-future",chapters:{}}},s={baseMap:e,intialView:t,maps:i,views:n,eras:a};export{s};
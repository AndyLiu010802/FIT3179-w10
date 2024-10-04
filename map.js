var mapSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "width": 1500,
    "height": 600,
    "padding": 50,
    "autosize": {
      "type": "fit",
      "contains": "padding"
    },
    "background": "#feecc2",
    "params": [
      {
        "name": "statusFilter",
        "value": "Operating mine",
        "bind": {
          "input": "select",
          "options": [
            "Operating mine",
            "Mineral deposit",
            "Mine - care and maintenance",
            "Mine - under development"
          ],
          "name": "Status: "
        }
      },
      {
        "name": "commodityFilter",
        "value": "All",
        "bind": {
          "input": "select",
          "options": [
            "All",
            "Antimony",
            "Cobalt",
            "Heavy mineral sands - Titanium, Zirconium",
            "Lithium +\/- Tantalum +\/- Niobium",
            "Magnesium",
            "Manganese Ore",
            "Molybdenum +\/- Rhenium",
            "Nickel +\/- Cobalt +\/- PGE",
            "Rare Earth Elements (REE)",
            "Silicon (High purity silica\/quartz)",
            "Titanium, Vanadium",
            "Tungsten",
            "Vanadium"
          ],
          "name": "Commodity Group: "
        }
      }
      
    ],
    "layer": [
      {
        "data": {
          "url": "https://raw.githubusercontent.com/AndyLiu010802/FIT3179/main/georef-australia-state@public.json",
          "format": {
            "type": "topojson",
            "feature": "georef-australia-state@public"
          }
        },
        "mark": {
          "type": "geoshape",
          "stroke": "black",
          "strokeWidth": 1,
          "fill": "#a68746"
        },
        "encoding": {
          "shape": {
            "field": "geometry",
            "type": "geojson"
          },
          "tooltip": [
            {
              "calculate": "stateAbbreviations[datum['properties.ste_iso3166_code']]",
              "as": "StateFullName"
            },
    
            {"field": "properties.ste_iso3166_code", "type": "nominal", "title": "State"}
          ]
        }
      },
      {
        "mark": {
          "type": "text",
          "fontSize": 12,
          "dy": -10,  
          "dx": 5,  
          "align": "center"
        },
        "encoding": {
          "longitude": {"field": "properties.centroid[0]", "type": "quantitative"},
          "latitude": {"field": "properties.centroid[1]", "type": "quantitative"},
          "text": {
            "field": "properties.NAME",
            "type": "nominal",
            "title": "State Name"
          }
        }
      },
      {
        "data": {
          "url": "https://raw.githubusercontent.com/AndyLiu010802/FIT3179/main/GeoScience_AUS.json",
          "format": {
            "type": "json"
          }
        },
        "transform": [
          {"filter": "datum.Status == statusFilter"},
          {
            "filter": "commodityFilter == 'All' || datum['Commodity Group'] == commodityFilter"
          }
        ],
        "mark": {
          "type": "circle",
          "size": 50,
          "clip": false
        },
        "encoding": {
          "longitude": {
            "field": "Longitude",
            "type": "quantitative"
          },
          "latitude": {
            "field": "Latitude",
            "type": "quantitative"
          },
          "color": {
            "field": "Commodity Group",
            "type": "nominal",
            "scale": {
              "domain": [
                "Antimony",
                "Cobalt",
                "Heavy mineral sands - Titanium, Zirconium",
                "Lithium +\/- Tantalum +\/- Niobium",
                "Magnesium",
                "Manganese Ore",
                "Molybdenum +\/- Rhenium",
                "Nickel +\/- Cobalt +\/- PGE",
                "Rare Earth Elements (REE)",
                "Silicon (High purity silica\/quartz)",
                "Titanium, Vanadium",
                "Tungsten",
                "Vanadium"
              ],
              "range": [
                "#00bfff",  
                "#ffa500",  
                "#32cd32",  
                "#ff4500",  
                "#9400d3",  
                "#ff69b4",  
                "#ffff00",  
                "#00ffff",  
                "#ff00ff",  
                "#00ff00",  
                "#ff6347",  
                "#ffd700",  
                "#ff00ff"   
                ]
            },
            "legend": {
              "orient": "left",  
              "title": "Commodity Group",
              "offset": 20,  
              "padding": 20  
            }
          },
          "tooltip": [
            {"field": "Name", "type": "nominal", "title": "Site"},
            {"field": "State", "type": "nominal"},
            {"field": "Commodity Group", "type": "nominal"},
            {"field": "Status", "type": "nominal"}
          ]
        }
      }
      
    ]
  };
  
  vegaEmbed('#vis', mapSpec).then(function(result) {
  
  }).catch(console.error);
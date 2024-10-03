const chart = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "Radar chart",
    "width": 500,
    "height": 500,
    "padding": 60,
    "autosize": {"type": "none", "contains": "padding"},
    "signals": [
      {"name": "radius", "update": "width / 2"}
    ],
    "data": [
      {
        "name": "table",
        "url": "https://raw.githubusercontent.com/AndyLiu010802/FIT3179-w10/main/data.json",
        "format": {"type": "json"},
        "transform": [
          {
            "type": "filter",
            "expr": "datum['Employment_at_end_of_June'] != null"
          }
        ]
      },
      {
        "name": "keys",
        "source": "table",
        "transform": [
          {
            "type": "aggregate",
            "groupby": ["Region"]
          }
        ]
      }
    ],
    "scales": [
      {
        "name": "angular",
        "type": "point",
        "range": {"signal": "[-PI, PI]"},
        "padding": 0.5,
        "domain": {"data": "table", "field": "Region"}
      },
      {
        "name": "radial",
        "type": "linear",
        "range": {"signal": "[0, radius]"},
        "zero": true,
        "nice": false,
        "domain": {"data": "table", "field": "Employment_at_end_of_June"},
        "domainMin": 0
      },
      {
        "name": "color",
        "type": "ordinal",
        "domain": {"data": "table", "field": "Year"},
        "range": {"scheme": "category10"}
      }
    ],
    "encode": {
      "enter": {
        "x": {"signal": "radius"},
        "y": {"signal": "radius"}
      }
    },
    "marks": [
      {
        "type": "group",
        "name": "categories",
        "zindex": 1,
        "from": {
          "facet": {"data": "table", "name": "facet", "groupby": ["Year"]}
        },
        "marks": [
          {
            "type": "line",
            "name": "category-line",
            "from": {"data": "facet"},
            "encode": {
              "enter": {
                "interpolate": {"value": "linear-closed"},
                "x": {"signal": "scale('radial', datum['Employment_at_end_of_June']) * cos(scale('angular', datum.Region))"},
                "y": {"signal": "scale('radial', datum['Employment_at_end_of_June']) * sin(scale('angular', datum.Region))"},
                "stroke": {"scale": "color", "field": "Year"},
                "strokeWidth": {"value": 1},
                "fill": {"scale": "color", "field": "Year"},
                "fillOpacity": {"value": 0.1}
              }
            }
          },
          {
            "type": "symbol",
            "name": "category-point",
            "from": {"data": "facet"},
            "encode": {
              "enter": {
                "size": {"value": 50},
                "x": {"signal": "scale('radial', datum['Employment_at_end_of_June']) * cos(scale('angular', datum.Region))"},
                "y": {"signal": "scale('radial', datum['Employment_at_end_of_June']) * sin(scale('angular', datum.Region))"},
                "fill": {"scale": "color", "field": "Year"},
                "stroke": {"value": "black"},
                "strokeWidth": {"value": 1},
                "tooltip": {
                  "signal": "{'Region': datum.Region, 'Year': datum.Year, 'Employment': datum['Employment_at_end_of_June']}"
                }
              }
            }
          }
        ]
      },
      {
        "type": "rule",
        "name": "radial-grid",
        "from": {"data": "keys"},
        "zindex": 0,
        "encode": {
          "enter": {
            "x": {"value": 0},
            "y": {"value": 0},
            "x2": {"signal": "radius * cos(scale('angular', datum.Region))"},
            "y2": {"signal": "radius * sin(scale('angular', datum.Region))"},
            "stroke": {"value": "lightgray"},
            "strokeWidth": {"value": 1}
          }
        }
      },
      {
        "type": "text",
        "name": "key-label",
        "from": {"data": "keys"},
        "zindex": 1,
        "encode": {
          "enter": {
            "x": {"signal": "(radius + 5) * cos(scale('angular', datum.Region))"},
            "y": {"signal": "(radius + 5) * sin(scale('angular', datum.Region))"},
            "text": {"field": "Region"},
            "align": [
              {
                "test": "abs(scale('angular', datum.Region)) > PI / 2",
                "value": "right"
              },
              {
                "value": "left"
              }
            ],
            "baseline": [
              {
                "test": "scale('angular', datum.Region) > 0", "value": "top"
              },
              {
                "test": "scale('angular', datum.Region) == 0", "value": "middle"
              },
              {
                "value": "bottom"
              }
            ],
            "fill": {"value": "black"},
            "fontWeight": {"value": "bold"}
          }
        }
      },
      {
        "type": "line",
        "name": "outer-line",
        "from": {"data": "radial-grid"},
        "encode": {
          "enter": {
            "interpolate": {"value": "linear-closed"},
            "x": {"field": "x2"},
            "y": {"field": "y2"},
            "stroke": {"value": "lightgray"},
            "strokeWidth": {"value": 1}
          }
        }
      }
    ]
  }
  
  
  vegaEmbed('#chart', chart);

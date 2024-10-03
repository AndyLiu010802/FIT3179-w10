const chart=
{
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "Radar chart for Mining Sector Employment at end June, with each sector represented as a radial point.",
    "width": 400,
    "height": 400,
    "padding": 40,
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
            "expr": "datum['Employment at end June'] != null"
          }
        ]
      },
      {
        "name": "keys",
        "source": "table",
        "transform": [
          {
            "type": "aggregate",
            "groupby": ["Sector"]
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
        "domain": {"data": "table", "field": "Sector"}
      },
      {
        "name": "radial",
        "type": "linear",
        "range": {"signal": "[0, radius]"},
        "zero": true,
        "nice": false,
        "domain": {"data": "table", "field": "Employment at end June"},
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
                "x": {"signal": "scale('radial', datum['Employment at end June']) * cos(scale('angular', datum.Sector))"},
                "y": {"signal": "scale('radial', datum['Employment at end June']) * sin(scale('angular', datum.Sector))"},
                "stroke": {"scale": "color", "field": "Year"},
                "strokeWidth": {"value": 1},
                "fill": {"scale": "color", "field": "Year"},
                "fillOpacity": {"value": 0.1}
              }
            }
          },
          {
            "type": "text",
            "name": "value-text",
            "from": {"data": "category-line"},
            "encode": {
              "enter": {
                "x": {"signal": "datum.x"},
                "y": {"signal": "datum.y"},
                "text": {"signal": "datum.datum['Employment at end June']"},
                "align": {"value": "center"},
                "baseline": {"value": "middle"},
                "fill": {"value": "black"}
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
            "x2": {"signal": "radius * cos(scale('angular', datum.Sector))"},
            "y2": {"signal": "radius * sin(scale('angular', datum.Sector))"},
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
            "x": {"signal": "(radius + 5) * cos(scale('angular', datum.Sector))"},
            "y": {"signal": "(radius + 5) * sin(scale('angular', datum.Sector))"},
            "text": {"field": "Sector"},
            "align": [
              {
                "test": "abs(scale('angular', datum.Sector)) > PI / 2",
                "value": "right"
              },
              {
                "value": "left"
              }
            ],
            "baseline": [
              {
                "test": "scale('angular', datum.Sector) > 0", "value": "top"
              },
              {
                "test": "scale('angular', datum.Sector) == 0", "value": "middle"
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
  
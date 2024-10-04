const chart = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "description": "Radar chart with key data points for various regions",
    "width": 500,
    "height": 500,
    "padding": 100,
    "autosize": { "type": "none", "contains": "padding" },
    "signals": [{ "name": "radius", "update": "width / 2" }],
    
    "scales": [
        {
            "name": "angular",
            "type": "point",
            "range": { "signal": "[-PI, PI]" },
            "padding": 0.5,
            "domain": { "data": "table", "field": "key" }
        },
        {
            "name": "radial",
            "type": "linear",
            "range": { "signal": "[0, radius]" },
            "zero": true,
            "nice": false,
            "domain": { "data": "table", "field": "value" },
            "domainMin": 0
        },
        {
            "name": "color",
            "type": "ordinal",
            "domain": ["2020-21", "2021-22", "2022-23"],  
            "range": ["#3b7dc4", "#cf4730", "#6ca13b"]
        }
    ],
    "legends": [
        {
            "fill": "color", 
            "title": "Year",
            "orient": "right",
            "labelFontSize": 12,  
            "titleFontSize": 14  
        }
    ],
    "encode": { "enter": { "x": { "signal": "radius" }, "y": { "signal": "radius" } } },
    "marks": [
        {
            "type": "group",
            "name": "categories",
            "zindex": 1,
            "from": { "facet": { "data": "table", "name": "facet", "groupby": ["Year"] } },
            "marks": [
                {
                    "type": "line",
                    "name": "category-line",
                    "from": { "data": "facet" },
                    "encode": {
                        "enter": {
                            "interpolate": { "value": "linear-closed" },
                            "x": { "signal": "scale('radial', datum.value) * cos(scale('angular', datum.key))" },
                            "y": { "signal": "scale('radial', datum.value) * sin(scale('angular', datum.key))" },
                            "stroke": { "scale": "color", "field": "Year" },
                            "strokeWidth": { "value": 1 },
                            "fill": { "scale": "color", "field": "Year" },
                            "fillOpacity": { "value": 0.2 }
                        }
                    }
                },
                {
                    "type": "symbol",
                    "name": "category-point",
                    "from": { "data": "facet" },
                    "encode": {
                        "enter": {
                            "size": { "value": 50 },
                            "x": { "signal": "scale('radial', datum.value) * cos(scale('angular', datum.key))" },
                            "y": { "signal": "scale('radial', datum.value) * sin(scale('angular', datum.key))" },
                            "fill": { "scale": "color", "field": "Year" },
                            "stroke": { "value": "black" },
                            "strokeWidth": { "value": 1 },
                            "tooltip": { "signal": "{'Region': datum.Region, 'Year': datum.Year, 'Metric': datum.key, 'Value': datum.value}" }
                        }
                    }
                }
            ]
        },
        {
            "type": "line",
            "name": "hex-grid",
            "from": { "data": "keys" },
            "encode": {
                "enter": {
                    "interpolate": { "value": "linear-closed" },
                    "x": { "signal": "radius * cos(scale('angular', datum.key))" },
                    "y": { "signal": "radius * sin(scale('angular', datum.key))" },
                    "stroke": { "value": "darkgray" },
                    "strokeWidth": { "value": 1 }
                }
            }
        },
        {
            "type": "rule",
            "name": "radial-grid",
            "from": { "data": "keys" },
            "zindex": 0,
            "encode": {
                "enter": {
                    "x": { "value": 0 },
                    "y": { "value": 0 },
                    "x2": { "signal": "radius * cos(scale('angular', datum.key))" },
                    "y2": { "signal": "radius * sin(scale('angular', datum.key))" },
                    "stroke": { "value": "darkgray" },
                    "strokeWidth": { "value": 1 }
                }
            }
        },
        {
            "type": "text",
            "name": "key-label",
            "from": { "data": "keys" },
            "zindex": 1,
            "encode": {
                "enter": {
                    "x": { "signal": "(radius + 5) * cos(scale('angular', datum.key))" },
                    "y": { "signal": "(radius + 5) * sin(scale('angular', datum.key))" },
                    "text": { "field": "key" },
                    "align": [
                        { "test": "abs(scale('angular', datum.key)) > PI / 2", "value": "right" },
                        { "value": "left" }
                    ],
                    "baseline": [
                        { "test": "scale('angular', datum.key) > 0", "value": "top" },
                        { "test": "scale('angular', datum.key) == 0", "value": "middle" },
                        { "value": "bottom" }
                    ],
                    "fill": { "value": "black" },
                    "fontWeight": { "value": "bold" }
                }
            }
        },
    ],
};

function updateChart(year, region) {
    const updatedSpec = { ...chart };

    updatedSpec.data = [
        {
            "name": "table",
            "url": "https://raw.githubusercontent.com/AndyLiu010802/FIT3179-w10/main/data.json",
            "format": { "type": "json" },
            "transform": [
                { "type": "filter", "expr": `datum['Year'] == '${year}' && datum['Region'] == '${region}'` },
                {
                    "type": "formula",
                    "as": "Employment_at_end_of_June",
                    "expr": "datum['key Data'].Employment_at_end_of_June"
                },
                {
                    "type": "formula",
                    "as": "Wages_and_salaries",
                    "expr": "datum['key Data'].Wages_and_salaries"
                },
                {
                    "type": "formula",
                    "as": "Sales_and_service_income",
                    "expr": "datum['key Data'].Sales_and_service_income"
                },
                {
                    "type": "fold",
                    "fields": ["Employment_at_end_of_June", "Wages_and_salaries", "Sales_and_service_income"],
                    "as": ["key", "value"]
                }
            ]
        },
        {
            "name": "keys",
            "source": "table",
            "transform": [{ "type": "aggregate", "groupby": ["key"] }]
        }
    ];

    vegaEmbed('#chart', updatedSpec).catch(console.error);
}

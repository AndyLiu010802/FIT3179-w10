const chartSpec2 = (selectedKey, selectedRegion2) => {
    let domainMax;
    if  (selectedKey === 'Employment at end of June') {
        domainMax = 86000; 
    } else if (selectedKey === 'Wages and salaries') {
        domainMax = 15000; 
    } else if (selectedKey === 'Sales and service income') {
        domainMax = 300000;  
    } 

    return {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "Radar chart using keys as radial points and values as radial distances",
        "width": 460,
        "height": 350,
        "padding": { "top": 150, "left": 200, "right": 50, "bottom": 50 },
        "autosize": { "type": "none", "contains": "padding" },
        "signals": [{ "name": "radius", "update": "width / 2" }],
        "data": [
            {
                "name": "table",
                "url": "https://raw.githubusercontent.com/AndyLiu010802/FIT3179-w10/main/data.json",
                "format": {"type": "json"},
                "transform": [
                    {
                        "type": "filter",
                        "expr": (selectedKey === "All" ? 
                                `datum.Region === '${selectedRegion2}'` :
                                `datum.key === '${selectedKey}' && datum.Region === '${selectedRegion2}'`)
                    }
                ]
            },
            {
                "name": "years",
                "source": "table",
                "transform": [
                    {
                        "type": "aggregate",
                        "groupby": ["Year"]
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
                "domain": {"data": "years", "field": "Year"}  
            },
            {
                "name": "radial",
                "type": "linear",
                "range": {"signal": "[0, radius]"},
                "zero": true,
                "nice": false,
                "domain": {"data": "table", "field": "value"}, 
                "domainMin": 0,
                "domainMax": domainMax
            },
            {
                "name": "color",
                "type": "ordinal",
                "domain": ["Employment at end of June", "Wages and salaries", "Sales and service income"],  
                "range": ["#3b7dc4", "#cf4730", "#6ca13b"]  
            }
        ],
        "marks": [
            
            // Radar chart points and lines
            {
                "type": "group",
                "name": "categories",
                "zindex": 1,
                "from": { "facet": { "data": "table", "name": "facet", "groupby": ["key"] } },
                "marks": [
                    {
                        "type": "line",
                        "name": "category-line",
                        "from": { "data": "facet" },
                        "encode": {
                            "enter": {
                                "interpolate": { "value": "linear-closed" },
                                "x": { "signal": "scale('radial', datum.value) * cos(scale('angular', datum.Year))" },
                                "y": { "signal": "scale('radial', datum.value) * sin(scale('angular', datum.Year))" },
                                "stroke": { "scale": "color", "field": "key" },
                                "strokeWidth": { "value": 1 },
                                "fill": { "scale": "color", "field": "key" },
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
                                "x": { "signal": "scale('radial', datum.value) * cos(scale('angular', datum.Year))" },
                                "y": { "signal": "scale('radial', datum.value) * sin(scale('angular', datum.Year))" },
                                "fill": { "scale": "color", "field": "key" },
                                "stroke": { "value": "black" },
                                "strokeWidth": { "value": 1 },
                                "tooltip": { "signal": "{'Region': datum.Region, 'Sector': datum.key, 'Value': datum.value}" }
                            }
                        }
                    }
                ]
            },
            // Concentric circular grid lines
            {
                "type": "rule",
                "name": "radial-grid",
                "from": { "data": "years" },
                "zindex": 0,
                "encode": {
                    "enter": {
                        "x": { "value": 0 },
                        "y": { "value": 0 },
                        "x2": { "signal": "radius * cos(scale('angular', datum.Year))" },
                        "y2": { "signal": "radius * sin(scale('angular', datum.Year))" },
                        "stroke": { "value": "darkgray" },
                        "strokeWidth": { "value": 1 }
                    }
                }
            },
            // Radial grid lines
            {
                "type": "line",
                "name": "hex-grid",
                "from": { "data": "years" },
                "encode": {
                    "enter": {
                        "interpolate": { "value": "linear-closed" },
                        "x": { "signal": "radius * cos(scale('angular', datum.Year))" },
                        "y": { "signal": "radius * sin(scale('angular', datum.Year))" },
                        "stroke": { "value": "black" },
                        "strokeWidth": { "value": 1 }
                    }
                }
            },
            // Labels for the radial axes
            {
                "type": "text",
                "name": "key-label",
                "from": { "data": "years" },
                "zindex": 1,
                "encode": {
                    "enter": {
                        "x": { "signal": "(radius + 5) * cos(scale('angular', datum.Year))" },
                        "y": { "signal": "(radius + 5) * sin(scale('angular', datum.Year))" },
                        "text": { "field": "Year" },
                        "align": [
                            { "test": "abs(scale('angular', datum.Year)) > PI / 2", "value": "right" },
                            { "value": "left" }
                        ],
                        "baseline": [
                            { "test": "scale('angular', datum.Year) > 0", "value": "top" },
                            { "test": "scale('angular', datum.Year) == 0", "value": "middle" },
                            { "value": "bottom" }
                        ],
                        "fill": { "value": "black" },
                        "fontWeight": { "value": "bold" }
                    }
                }
            }
        ]
    };
};


let selectedRegion2 = "Victoria";

function renderChart2() {
    vegaEmbed('#chartSpec2', chartSpec2(selectedKey, selectedRegion2)).catch(console.error);
}

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        selectedKey = e.target.getAttribute('data-sector');
        renderChart2();
    });
});

document.getElementById('region2').addEventListener('change', (e) => {
    selectedRegion2 = e.target.value;
    renderChart2();
});

renderChart2();

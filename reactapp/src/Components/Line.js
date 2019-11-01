import React from 'react'
import { ResponsiveLine } from '@nivo/line'


const data = [
    {
        "id": "japan",
        "color": "hsl(315, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 200
            },
            {
                "x": "helicopter",
                "y": 237
            },
            {
                "x": "boat",
                "y": 54
            },
            {
                "x": "train",
                "y": 160
            },
            {
                "x": "subway",
                "y": 48
            },
            {
                "x": "bus",
                "y": 271
            },
            {
                "x": "car",
                "y": 247
            },
            {
                "x": "moto",
                "y": 238
            },
            {
                "x": "bicycle",
                "y": 250
            },
            {
                "x": "horse",
                "y": 270
            },
            {
                "x": "skateboard",
                "y": 113
            },
            {
                "x": "others",
                "y": 128
            }
        ]
    },
    {
        "id": "france",
        "color": "hsl(323, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 72
            },
            {
                "x": "helicopter",
                "y": 79
            },
            {
                "x": "boat",
                "y": 267
            },
            {
                "x": "train",
                "y": 98
            },
            {
                "x": "subway",
                "y": 80
            },
            {
                "x": "bus",
                "y": 179
            },
            {
                "x": "car",
                "y": 13
            },
            {
                "x": "moto",
                "y": 293
            },
            {
                "x": "bicycle",
                "y": 101
            },
            {
                "x": "horse",
                "y": 233
            },
            {
                "x": "skateboard",
                "y": 64
            },
            {
                "x": "others",
                "y": 65
            }
        ]
    },
    {
        "id": "us",
        "color": "hsl(64, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 221
            },
            {
                "x": "helicopter",
                "y": 198
            },
            {
                "x": "boat",
                "y": 91
            },
            {
                "x": "train",
                "y": 64
            },
            {
                "x": "subway",
                "y": 109
            },
            {
                "x": "bus",
                "y": 263
            },
            {
                "x": "car",
                "y": 34
            },
            {
                "x": "moto",
                "y": 195
            },
            {
                "x": "bicycle",
                "y": 78
            },
            {
                "x": "horse",
                "y": 154
            },
            {
                "x": "skateboard",
                "y": 288
            },
            {
                "x": "others",
                "y": 154
            }
        ]
    },
    {
        "id": "germany",
        "color": "hsl(146, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 232
            },
            {
                "x": "helicopter",
                "y": 278
            },
            {
                "x": "boat",
                "y": 150
            },
            {
                "x": "train",
                "y": 283
            },
            {
                "x": "subway",
                "y": 280
            },
            {
                "x": "bus",
                "y": 126
            },
            {
                "x": "car",
                "y": 262
            },
            {
                "x": "moto",
                "y": 259
            },
            {
                "x": "bicycle",
                "y": 206
            },
            {
                "x": "horse",
                "y": 119
            },
            {
                "x": "skateboard",
                "y": 62
            },
            {
                "x": "others",
                "y": 208
            }
        ]
    },
    {
        "id": "norway",
        "color": "hsl(202, 70%, 50%)",
        "data": [
            {
                "x": "plane",
                "y": 1
            },
            {
                "x": "helicopter",
                "y": 262
            },
            {
                "x": "boat",
                "y": 138
            },
            {
                "x": "train",
                "y": 73
            },
            {
                "x": "subway",
                "y": 4
            },
            {
                "x": "bus",
                "y": 299
            },
            {
                "x": "car",
                "y": 97
            },
            {
                "x": "moto",
                "y": 223
            },
            {
                "x": "bicycle",
                "y": 33
            },
            {
                "x": "horse",
                "y": 90
            },
            {
                "x": "skateboard",
                "y": 237
            },
            {
                "x": "others",
                "y": 289
            }
        ]
    }
]


// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export class Line extends React.Component {
    render() {
        return (
            <ResponsiveLine
                data={data}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', stacked: true, min: 'auto', max: 'auto' }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'transportation',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'count',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                colors={{ scheme: 'nivo' }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabel="y"
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
        );
    }
}

export default Line
import "purecss/build/pure.css";
import * as React from "react";
import "../styles.scss";

import SendIcon from "@mui/icons-material/Send";
import {
    Box,
    Button,
    Container,
    Grid, Stack,
    TextField,
    Typography
} from "@mui/material";
import { Chart as ChartJS, Colors, Legend, LinearScale, LineElement, PointElement, Tooltip } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import { Scatter } from "react-chartjs-2";

import CircularProgress from "@mui/material/CircularProgress";
import { getLocaleText, I18nText } from "../data/I18n";
import API from "../utils/API";

ChartJS.register(Colors, LinearScale, PointElement, LineElement, Tooltip, Legend, zoomPlugin);

export const options = {
    scales: {
        x: {
            ticks: {
                callback: (val: number) => (Math.round(val * 10000) / 10000).toExponential(),
            },
        },
        y: {
            ticks: {
                callback: (val: number) => (Math.round(val * 10000) / 10000).toExponential(),
            },
        },
    },
    plugins: {
        zoom: {
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
                mode: "xy" as const,
                drag: {
                    enabled: true,
                },
            },
        },
    },
};

interface Paras {
    // Define the masses of the three stars
    m1: number;
    m2: number;
    m3: number;
    // Define the initial positions and velocities of the three stars
    x1: number;
    y1: number;
    vx1: number;
    vy1: number;
    x2: number;
    y2: number;
    vx2: number;
    vy2: number;
    x3: number;
    y3: number;
    vx3: number;
    vy3: number;
    years: number;
    steps: number;
    display_steps: number;
}

export default function Home(props: { lang: keyof I18nText }) {
    const { lang } = props;
    const [data, setData] = React.useState({
        datasets: [
            {
                label: "A dataset",
                data: [{ x: 0, y: 0 }],
            },
        ],
    });
    const [fetching, setFetching] = React.useState(false);
    const defaultParas: Paras = {
        m1: 1.989e30,
        m2: 9.945e29,
        m3: 4.972e29,
        x1: 0,
        y1: 0,
        vx1: 0,
        vy1: 0,
        x2: 149.6e9,
        y2: 0,
        vx2: 0,
        vy2: 29.78e3,
        x3: -149.6e9,
        y3: 0,
        vx3: 0,
        vy3: -29.78e3,
        years: 500,
        steps: 100000,
        display_steps: 1000,
    };
    const [paras, setParas] = React.useState(defaultParas);

    const solve = async () => {
        setFetching(true);
        let display_steps = paras["display_steps"];
        if (display_steps == 0) display_steps = 1;
        const response = await API.get(
            "/api/threebody?query=" +
                JSON.stringify(
                    Object.entries(paras)
                        .filter(([k, v]) => k != "display_steps")
                        .map(([k, v]) => v)
                )
        );
        console.log(response.data.ans);
        const [x1, y1, x2, y2, x3, y3] = response.data.ans;
        console.log(x1);
        const data = {
            datasets: [
                {
                    label: "Star 1",
                    data: x1
                        .filter((x: number, i: number) => i % display_steps == 0)
                        .map((x: number, i: number) => ({ x: x, y: y1[i] })),
                },
                {
                    label: "Star 2",
                    data: x2
                        .filter((x: number, i: number) => i % display_steps == 0)
                        .map((x: number, i: number) => ({ x: x, y: y2[i] })),
                },
                {
                    label: "Star 3",
                    data: x3
                        .filter((x: number, i: number) => i % display_steps == 0)
                        .map((x: number, i: number) => ({ x: x, y: y3[i] })),
                },
            ],
        };
        console.log("reached???");
        setData(data);
        setFetching(false);
    };

    return (
        <Container maxWidth="md">
            <Stack spacing={2} alignItems="flex-start">
                <Typography variant="h3">
                    {getLocaleText(
                        {
                            "en": "The Three-Body Problem",
                            "zh-Hant": "三體问题",
                            "zh-Hans": "三体问题",
                            "tto-bro": "CRVmae2 VFH3D8ae",
                            "tto": "ALCe7Z D AoKhFC Y-W",
                            "ja": "三体問題",
                            "de": "Das Dreikörperproblem",
                        },
                        lang
                    )}
                </Typography>
                <Typography variant="body1">
                    {getLocaleText(
                        {
                            "en": "Adjust the parameters below to simulate.",
                            "zh-Hant": "調整下方的參數以模擬。",
                            "zh-Hans": "调整下方的参数以模拟。",
                            "tto-bro": "D8aFTeLZ2 X8QR2bvRZ DaA ciVWvo3 Ed2 VoZd2.",
                            "tto": "RAAoVoDRKa X hRKRVamKFV aH eHNKR cs CeVFSRKa.",
                            "ja": "以下のパラメーターを調整してシミュレートしてください。",
                            "de": "Passen Sie die Parameter unten an, um zu simulieren.",
                        },
                        lang
                    )}
                </Typography>

                <Scatter options={options} data={data} />

                <Button onClick={solve} variant="contained" endIcon={<SendIcon />}>
                    {getLocaleText(
                        {
                            "en": "Simulate",
                            "zh-Hant": "模擬",
                            "zh-Hans": "模拟",
                            "tto-bro": "VoZd2",
                            "tto": "CeVFKRKa",
                            "ja": "シミュレート",
                            "de": "Simulieren",
                        },
                        lang
                    )}
                </Button>
                <Grid xs item>
                    {fetching && <CircularProgress />}
                </Grid>

                <Box sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}>
                    <div>
                        {["m1", "m2", "m3"].map(k => (
                            <TextField
                                key={k}
                                label={k}
                                defaultValue={paras[k as keyof Paras].toExponential()}
                                onChange={e => {
                                    let p = paras;
                                    p[k as keyof Paras] = Number(e.target.value);
                                    setParas(p);
                                }}
                            />
                        ))}
                    </div>
                    <div>
                        {["x1", "y1", "vx1", "vy1"].map(k => (
                            <TextField
                                key={k}
                                label={k}
                                defaultValue={paras[k as keyof Paras].toExponential()}
                                onChange={e => {
                                    let p = paras;
                                    p[k as keyof Paras] = Number(e.target.value);
                                    setParas(p);
                                }}
                            />
                        ))}
                    </div>
                    <div>
                        {["x2", "y2", "vx2", "vy2"].map(k => (
                            <TextField
                                key={k}
                                label={k}
                                defaultValue={paras[k as keyof Paras].toExponential()}
                                onChange={e => {
                                    let p = paras;
                                    p[k as keyof Paras] = Number(e.target.value);
                                    setParas(p);
                                }}
                            />
                        ))}
                    </div>
                    <div>
                        {["x3", "y3", "vx3", "vy3"].map(k => (
                            <TextField
                                key={k}
                                label={k}
                                defaultValue={paras[k as keyof Paras].toExponential()}
                                onChange={e => {
                                    let p = paras;
                                    p[k as keyof Paras] = Number(e.target.value);
                                    setParas(p);
                                }}
                            />
                        ))}
                    </div>
                    <div>
                        {["years", "steps", "display_steps"].map(k => (
                            <TextField
                                key={k}
                                label={k}
                                defaultValue={paras[k as keyof Paras].toExponential()}
                                onChange={e => {
                                    let p = paras;
                                    p[k as keyof Paras] = Number(e.target.value);
                                    setParas(p);
                                }}
                            />
                        ))}
                    </div>
                </Box>
            </Stack>
        </Container>
    );
}

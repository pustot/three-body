import "purecss/build/pure.css";
import * as React from "react";
import "../styles.scss";

import { Box, Button, Container, Grid, IconButton, Link as MuiLink, Stack, TextField, Typography } from "@mui/material";
import { Chart as ChartJS, Colors, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Scatter } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";

import { getLocaleText, I18nText } from "../data/I18n";
import API from "../utils/API";

ChartJS.register(Colors, LinearScale, PointElement, LineElement, Tooltip, Legend, zoomPlugin);

export const options = {
    scales: {
        y: {
            beginAtZero: true,
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
            },
        },
    },
};

interface Paras {
    m1: number;
    m2: number;
    m3: number;
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
    // Define the masses of the three stars
    let m1 = 1.989e30;
    let m2 = 9.945e29;
    let m3 = 4.972e25;

    // Define the initial positions and velocities of the three stars
    let x1_0 = 0;
    let y1_0 = 0;
    let vx1_0 = 0;
    let vy1_0 = 0;

    let x2_0 = 149.6e9;
    let y2_0 = 0;
    let vx2_0 = 0;
    let vy2_0 = 29.78e3;

    let x3_0 = -149.6e9;
    let y3_0 = 0;
    let vx3_0 = 0;
    let vy3_0 = -29.78e3;

    let years = 500;
    let steps = 100000;
    let display_steps = 1000;

    const solve = async () => {
        // let params = [
        //     m1,
        //     m2,
        //     m3,
        //     x1_0,
        //     y1_0,
        //     vx1_0,
        //     vy1_0,
        //     x2_0,
        //     y2_0,
        //     vx2_0,
        //     vy2_0,
        //     x3_0,
        //     y3_0,
        //     vx3_0,
        //     vy3_0,
        //     years,
        //     steps,
        // ];
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
                    data: x1.filter((x: number, i: number) => i % display_steps == 1).map((x: number, i: number) => ({ x: x, y: y1[i] })),
                },
                {
                    label: "Star 2",
                    data: x2.filter((x: number, i: number) => i % display_steps == 1).map((x: number, i: number) => ({ x: x, y: y2[i] })),
                },
                {
                    label: "Star 3",
                    data: x3.filter((x: number, i: number) => i % display_steps == 1).map((x: number, i: number) => ({ x: x, y: y3[i] })),
                },
            ],
        };
        console.log("reached???");
        setData(data);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
                {Object.entries(defaultParas).map(([k, v]) => (
                    <TextField
                        key={k}
                        label={k}
                        defaultValue={v.toExponential()}
                        onChange={e => {
                            let p = paras;
                            p[k as keyof Paras] = Number(e.target.value);
                            setParas(p);
                        }}
                    />
                ))}
            </Box>
            <Button onClick={solve}>Solve</Button>
            <Scatter options={options} data={data} />
        </Container>
    );
}

import React, {useEffect, useRef, useState} from 'react'
import {Col, Icon, Row, Tooltip} from "antd";
import moment from "moment";
import Chart from "chart.js"
import api from "../../request";
import './index.scss'
async function initData() {
    return await api.dashboard.repositoryInfos()
        // .then(res => {
        // this.stargazers_count = res.data.stargazers_count;
        // this.subscribers_count = res.data.subscribers_count;
        // this.forks = res.data.forks;
        // this.open_issues_count = res.data.open_issues_count
        // return res
    // })
}
export default function (props) {
    console.log(props)
    const [repoData, setRepoData] = useState({
        stargazers_count: 0,
        subscribers_count: 0,
        forks: 0,
        open_issues_count: 0
    });
    const [chartInstance, setChartInstance] = useState({});
    const lineChart = useRef(null);
    const barChart = useRef(null);
    const radarChart = useRef(null);
    const pieChart = useRef(null);
    const bubbleChart = useRef(null);
    useEffect( ()  => {
        initChart(lineChart, 'line');
        initChart(barChart, 'bar');
        initChart(bubbleChart, 'bubble');
        initChart(pieChart, 'pie', {scales: null});
        initChart(radarChart, 'radar', {scales: null});
        initData().then(res => {
            const { stargazers_count, subscribers_count, forks, open_issues_count} = res.data;
            setRepoData({stargazers_count, subscribers_count, forks, open_issues_count});
        });
        for (let instance in chartInstance) {
            generateData(chartInstance[instance])
        }
    }, [chartInstance]);
    function updateScale (chart, head) {
        chart.options.scales.xAxes[0].ticks.min = head.x;
    }
    function generateData (chart) {
        const type = chart.config.type;
        const fn = function () {
            let head = chart.data.datasets[0].data;
            if (type === 'pie' || type === 'radar') {
                chart.data.labels.push(moment(new Date()).format('h:mm:ss'));
                if (chart.data.labels.length > 7) {
                    chart.data.labels.shift()
                };
                chart.data.datasets.map(dataset => {
                    dataset.data.push(Math.round(Math.random()*200));
                    if (dataset.data.length > 7) {
                        dataset.data.shift();
                    }
                });
            } else {
                chart.data.datasets.map(dataset => {
                    dataset.data.push({x: moment(new Date()), y:Math.round(Math.random()*200)});
                    if (dataset.data.length > 19) {
                        dataset.data.shift();
                    }
                });
                updateScale(chart, head[0]);
            }
            chart.update();
        }.bind(this);
        fn();
        chart.timer = setInterval(fn, 2000);
    }

    function initChart(ref, type = 'line', config = {}) {
        const salesData = {
            labels: type === 'pie' || type === 'radar' ? [] : ["Front", "Middle", "Back"],
            datasets: [
                {
                    barPercentage: 0.5,
                    barThickness: 6,
                    maxBarThickness: 8,
                    minBarLength: 2,
                    label: "Front",
                    backgroundColor: "rgba(195, 40, 96, 0.2)",
                    borderColor: "rgba(195, 40, 96, 1)",
                    pointBackgroundColor: "rgba(195, 40, 96, 1)",
                    pointBorderColor: "rgba(2,0,4,0.38)",
                    pointHoverBorderColor: "rgba(225,225,225,0.9)",
                    data: []
                },
                {
                    barPercentage: 0.5,
                    barThickness: 6,
                    maxBarThickness: 8,
                    minBarLength: 2,
                    label: "Middle",
                    backgroundColor: "rgba(255, 172, 100, 0.2)",
                    borderColor: "rgba(255, 172, 100, 1)",
                    pointBackgroundColor: "rgba(255, 172, 100, 1)",
                    pointBorderColor: "rgba(2,0,4,0.38)",
                    pointHoverBorderColor: "rgba(225,225,225,0.9)",
                    data: []
                },
                {
                    barPercentage: 0.5,
                    barThickness: 6,
                    maxBarThickness: 8,
                    minBarLength: 2,
                    label: "Back",
                    backgroundColor: "rgba(19, 71, 34, 0.2)",
                    borderColor: "rgba(88, 188, 116, 1)",
                    pointBackgroundColor: "rgba(88, 188, 116, 1)",
                    pointBorderColor: "rgba(2,0,4,0.38)",
                    pointHoverBorderColor: "rgba(225,225,225,0.9)",
                    data: []
                }
            ]
        };
        const ctx = ref.current.getContext("2d");
        const options = {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Time ( UTC )'
                    },
                    type: 'time',
                    time: {
                        displayFormats: {
                            second: 'h:mm:ss'
                        }
                    },
                    ticks: {
                        source: 'data',
                        min: moment(new Date()).subtract(3, 's'),
                        maxRotation: 90,
                        minRotation: 0
                    }
                }],
            },
            pointDotRadius: 6,
            pointDotStrokeWidth: 2,
            datasetStrokeWidth: 3,
            scaleShowVerticalLines: false,
            scaleGridLineWidth: 2,
            scaleShowGridLines: true,
            scaleGridLineColor: "rgba(225, 255, 255, 0.02)",
            scaleOverride: true,
            scaleSteps: 9,
            scaleStepWidth: 500,
            scaleStartValue: 0,
            responsive: true
        };
        chartInstance[type] = undefined;
        chartInstance[type] = new Chart(ctx, {
            type: type,
            data: salesData,
            options: Object.assign(options, config)
        });

    }

    function jumpToAntdRepo() {
        window.open('https://github.com/vueComponent/ant-design-vue')
    }

    return (
        <section className="dashboard-wrapper">
            <Row className="row-top">
                <Col className="wrapper" lg={6} md={6} sm={12} xl={6} xs={12}>
                    <Tooltip mouseEnterDelay={0.5} title="Stars of ant-design-vue">
                        <div onClick={() => jumpToAntdRepo} className="block-wrapper">
                            <Icon className="star" type="star"/>
                            <span>{repoData.stargazers_count}</span>
                        </div>
                    </Tooltip>
                </Col>
                <Col className="wrapper" lg={6} md={6} sm={12} xl={6} xs={12}>
                    <Tooltip mouseEnterDelay={0.5} title="Watch count of ant-design-vue">
                        <div onClick={() => jumpToAntdRepo} className="block-wrapper">
                            <Icon className="eye" type="eye"/>
                            <span>{repoData.subscribers_count}</span>
                        </div>
                    </Tooltip>
                </Col>
                <Col className="wrapper" lg={6} md={6} sm={12} xl={6} xs={12}>
                    <Tooltip mouseEnterDelay={0.5} title="Forks of ant-design-vue">
                        <div onClick={() => jumpToAntdRepo} className="block-wrapper">
                            <Icon className="save" type="save"/>
                            <span>{repoData.forks}</span>
                        </div>
                    </Tooltip>
                </Col>
                <Col className="wrapper" lg={6} md={6} sm={12} xl={6} xs={12}>
                    <Tooltip mouseEnterDelay={0.5} title="Issues of ant-design-vue">
                        <div onClick={() => jumpToAntdRepo} className="block-wrapper">
                            <Icon className="message" type="message"/>
                            <span>{repoData.open_issues_count}</span>
                        </div>
                    </Tooltip>
                </Col>
            </Row>
            <Row className="row-mid">
                <Col className="chart-wrapper" span={24}>
                    <canvas className="line-chart" style={{position: 'relative', height: '60vh', width: '95%'}}
                            ref={lineChart}/>
                </Col>
            </Row>
            <Row className="row-bottom">
                <Col className="chart-wrapper" span={6}>
                    <canvas className="bar-chart" style={{position: 'relative', height: '40vh', width: '95%'}}
                            ref={barChart}/>
                </Col>
                <Col className="chart-wrapper" span={6}>
                    <canvas className="bubble-chart" style={{position: 'relative', height: '40vh', width: '95%'}}
                            ref={bubbleChart}/>
                </Col>
                <Col className="chart-wrapper" span={6}>
                    <canvas className="pie-chart" style={{position: 'relative', height: '40vh', width: '95%'}}
                            ref={pieChart}/>
                </Col>
                <Col className="chart-wrapper" span={6}>
                    <canvas className="radar-chart" style={{position: 'relative', height: '40vh', width: '95%'}}
                            ref={radarChart}/>
                </Col>
            </Row>

        </section>
    )
}

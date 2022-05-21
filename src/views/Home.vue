<template>
    <div class="content">

        <div style="font-size: 30px; text-align: center; ">智能停车管理系统数据中心</div>

        <div>
            <div class="item">
                <p class="item_title">总用户数</p>
                <p class="item_number" >{{UserCount}}</p>
            </div>
            <div class="item">
                <p class="item_title">订单总数</p>
                <p class="item_number">{{BillCount}}</p>
            </div>
            <div class="item">
                <p class="item_title">预定总数</p>
                <p class="item_number">{{ReserveCount}}</p>
            </div>
            <div class="item">
                <p class="item_title" >总停车场数</p>
                <p class="item_number">{{ParkingCount}}</p>
            </div>
            <div class="item">
                <p class="item_title">总停车位数</p>
                <p class="item_number">{{SpaceCount}}</p>
            </div>
            <div class="item">
                <p class="item_title">当前空闲停车位数</p>
                <p class="item_number">{{AvailableCount}}</p>
            </div>

        </div>

        <div class="block" style="margin-left: 10%; margin-top: 20px; margin-bottom: 20px" >
            <el-date-picker
                    v-model="value"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    value-format="yyyyMMdd"
                    clearableang
                    @change="searchTimeSpan">
            </el-date-picker>
        </div>

        <div id="Charts" ref="Echarts" class="myChart"></div>

    </div>
</template>

<script>
    import Aside from "../components/Aside";
    import Header from "../components/Header";
    import * as echarts from "echarts";


    export default {
        name: "Home",
        data() {
            return {
                collapseBtnClass: 'el-icon-s-fold',
                isCollapse: false,
                sideWidth: 200,
                logoTextShow: true,
                chart: null,
                UserCount:0,
                ParkingCount:0,
                SpaceCount:0,
                AvailableCount:0,
                ReserveCount:0,
                BillCount:0,
                value: '',
                arr1:[],
                arr2:[],
                arr3:[],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近半个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
            }
        },
        components: {
            Aside,
            Header,
        },
        mounted() {
            this.init();
            this.getChart()
        },

        methods: {
            init(){
                this.request.get("http://localhost:80/users", {
                }).then(res => {
                    this.UserCount = res.data.length;
                });
                this.request.get("http://localhost:80/parkings", {
                }).then(res => {
                    this.ParkingCount = res.data.length;
                });
                this.request.get("http://localhost:80/spaces/parkingId", {
                }).then(res => {
                    this.SpaceCount = res.length;
                });
                this.request.get("http://localhost:80/spaces/available", {
                }).then(res => {
                    this.AvailableCount = res;
                });
                this.request.get("http://localhost:80/reserves", {
                }).then(res => {
                    this.ReserveCount = res.data.length;
                });
                this.request.get("http://localhost:80/bills", {
                }).then(res => {
                    this.BillCount = res.data.length;
                });
                this.searchTimeSpan();
            },
            searchTimeSpan(){
                this.request.get("http://localhost:80/bills/search/billCount", {
                    params: {
                        start:this.value[0],
                        end:this.value[1],
                    },
                }).then(res => {
                    this.arr1=[];
                    this.arr2=[];
                    this.arr3=[];
                    for(let i=0; i<res.length; i++){
                        let items1={
                            name:res[i].date,
                            value:res[i].billSum,
                        };
                        let items2={
                            name:res[i].date,
                            value:res[i].billCount,
                        };
                        let items3={
                            name:res[i].date,
                            value:res[i].date,
                        };
                        this.arr1.push(items1);
                        this.arr2.push(items2);
                        this.arr3.push(items3);

                    }
                    this.getChart();
                });
            },
            getChart(){
                //3.定义图标对象myChart，初始化echarts实例
                let myChart=echarts.init(this.$refs.Echarts);

                // 4.添加配置项
                let options = {
                    title: {
                        text: '订单信息统计表',
                        x:'center',
                        y:'top',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { type: 'cross' }
                    },
                    legend: {
                        orient: 'horizontal',
                        x:'center',
                        y:'bottom',
                        padding:[0,0,20,0],
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {
                                alignWithLabel: true
                            },
                            data:this.arr3,
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '收益',
                            position: 'right',
                            max:100,
                            minInterval: 10,
                            interval:10,
                            axisLabel: {
                                formatter: '{value} 元'
                            }
                        },
                        {
                            type: 'value',
                            name: '订单数量',
                            position: 'left',
                            max:10,
                            minInterval: 1,
                            interval:1,
                            axisLabel: {
                                formatter: '{value} 个'
                            }
                        }
                    ],
                    series: [
                        {
                            name: '当日收益总额',
                            type: 'bar',
                            yAxisIndex: 0,
                            data: this.arr1,
                        },
                        {
                            name: '当日订单数量',
                            type: 'line',
                            smooth: true,
                            yAxisIndex: 1,
                            data: this.arr2,
                        }
                    ]
                };
                // 5.将配置给myChart
                myChart.setOption(options)
            }

        },
    }
</script>

<style scoped>
    .content{
        height: 100%;
        width: 100%;
        margin: 0;
    }
    .item{
        margin-top: 30px;
        display: inline-block;
        text-align:center;
        width: 210px;
        height: 100px;
    }

    .item_title{
        font-size: 15px;
        font-weight:bold;

    }
    .item_number{
        margin-top: 10px;
        font-size: 40px;
    }
    .myChart{
        width: 100%;
        height: 60%;
    }

</style>
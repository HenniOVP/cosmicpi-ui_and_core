window.Dashboard = Vue.component('dashboard', {
    template: `
    <div>
        <div class="col-lg-4 col-md-6">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    <div class="row">
                        <div class="col-xs-3">
                            <i class="fa fa-thermometer-quarter fa-5x"></i>
                        </div>
                        <div class="col-xs-9 text-right">
                            <div class="huge">{{ temperatureValue }}</div>
                            <div>Temperature</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="col-lg-4 col-md-6">
            <div class="panel panel-success">
                <div class="panel-heading">
                    <div class="row">
                        <div class="col-xs-3">
                            <i class="fa fa-thermometer-full fa-5x"></i>
                        </div>
                        <div class="col-xs-9 text-right">
                            <div class="huge">{{ pressureValue }}</div>
                            <div>Pressure</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div>
        <div class="col-lg-4 col-md-6">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    <div class="row">
                        <div class="col-xs-3">
                            <i class="fa fa-microchip fa-5x"></i>
                        </div>
                        <div class="col-xs-9 text-right">
                            <div class="huge">{{ serialValue }}</div>
                            <div>Hardware Serial</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    
        <div class="col-lg-6">
            <div class="panel panel-default">
                <div class="panel-heading">
                    Temperature
                </div>
                <!-- /.panel-heading -->
                <div class="panel-body">
                    <canvas ref="temperature" style="width:100%;height:300px"></canvas>
                </div>
            </div>
        </div>
        
        <div class="col-lg-6">
            <div class="panel panel-default">
                <div class="panel-heading">
                    Event Count
                </div>
                <!-- /.panel-heading -->
                <div class="panel-body">
                    <canvas ref="combined_event_count" style="width:100%;height:300px"></canvas>
                </div>
            </div>
        </div>
    
        <div class="col-lg-6">
            <div class="panel panel-default">
                <div class="panel-heading">
                    Location
                </div>
                <!-- /.panel-heading -->
                <div class="panel-body">
                    <div ref="location" style="width: 100%; height: 300px"></div>
                </div>
            </div>
        </div>
    </div>
  `,

    data() {
        return {
            temperatureValue: 'NA',
            pressureValue: 'NA',
            serialValue: 'NA'
        }
    },

    mounted() {
        this.initTemperatureBox();
        this.initTemperatureGraph();
        this.initCombinedEventCountGraph();
        this.initSerialBox();
        this.initLocationMap();
        this.initPressureBox();
    },

    methods: {
        initPressureBox() {
            events.on('pressure', (value) => {
                this.pressureValue = value;
            });
        },

        initSerialBox() {
            events.on('serial', (value) => {
                this.serialValue = value;
            });
        },

        initLocationMap() {
            events.on('location', (value) => {
                let map = khtml.maplib.Map(this.$refs.location);
                map.centerAndZoom(
                    new khtml.maplib.LatLng(
                        value.latitude, value.longitude
                    ), 10
                );

                let marker = new khtml.maplib.overlay.Marker({
                    position: new khtml.maplib.LatLng(value.latitude, value.longitude),
                    map: map,
                    title: 'My Cosmic Pi'
                });
            });
        },

        initTemperatureBox() {
            events.on('temperature', (value) => {
                this.temperatureValue = value;
            });
        },

        initTemperatureGraph() {
            const tempSize = 100;
            let tempData = [];


            let tempChart = new Chart(this.$refs.temperature, {
                type: 'line',
                data: {
                    labels: Array.from(Array(tempSize).keys()),
                    datasets: [{
                        label: 'temperature',
                        data: tempData,
                        backgroundColor: "rgba(153,51,255,0.4)"
                    }]
                }
            });

            events.on('temperature', (value) => {
                // Add data to chart
                if (tempData.length > tempSize) {
                    tempData.splice(0, 1);
                }
                tempData.push(value);
                tempChart.update();
            });
        },

        initCombinedEventCountGraph() {
            const eventSize = 100;
            let eventData = [];


            let eventChart = new Chart(this.$refs.combined_event_count, {
                type: 'line',
                data: {
                    labels: Array.from(Array(eventSize).keys()),
                    datasets: [{
                        label: 'combined_event_count',
                        data: eventData,
                        backgroundColor: "rgba(153,51,255,0.4)"
                    }]
                }
            });

            events.on('combined_event_count', (value) => {
                // Add data to chart
                if (eventData.length > eventSize) {
                    eventData.splice(0, 1);
                }
                eventData.push(value);
                eventChart.update();
            });
        }
    }
});
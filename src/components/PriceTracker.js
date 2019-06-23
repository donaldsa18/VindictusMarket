import React,{Component} from 'react';
import './PriceTracker.css';
import {Line} from 'react-chartjs-2';
import Header from './Header';
import AsyncSelect from 'react-select/async';

import 'react-virtualized/styles.css'
import {Table,Column,AutoSizer} from 'react-virtualized';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

class ItemAutocomplete extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            region: props.region
        };
    }
    async getAutocompleteData(value) {
        try {
            if(!value) {
                value = "a";
            }
            const resp = await fetch("/api/autocomplete/"+value);
            const json = await resp.json();
            const data = await json.data;
            return data;
        }
        catch(err) {
            console.log(err)
        }
    }

    onAutocompleteChange(opt) {
        window.location = "/"+this.state.region+"/prices/"+opt.value;
    }

    render() {
        const select = (
            <AsyncSelect
            cacheOptions
            loadOptions={this.getAutocompleteData}
            defaultOptions
            onChange={this.onAutocompleteChange.bind(this)}
            autoFocus={true}
            />
        )
        return (select)
    }
}

class ItemData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            data: null
        };
    }
    componentDidMount() {
        this.getItemData();
    }
    getItemData() {
        if(this.state.item) {
            fetch("/api/items/"+this.state.item)
            .then(response => response.json())
            .then(data => this.setState({data:data.data}))
        }
    }
    rowClassName({index}) {
        return index % 2 === 0 ? "PriceTracker-evenRow" : "PriceTracker-oddRow";
    }
    render() {
        const header = (<header className="App-header"></header>)
        
        //console.log(this.state.data)
        if(this.state.data !== null) {
            const tableData = [
                {name: "Name", value: this.state.data.sanitized_name},
                {name: "Category", value: this.state.data.trade_category},
                {name: "Subcategory", value: this.state.data.trade_category_sub},
                {name: "Level", value: this.state.data.level},
                {name: "Sell Price", value: this.state.data.sell_price},
            ];
            //console.log(this.state.data.icon)
            const icon_name = this.state.data.icon+".png";
            return (
                <div className="PriceTracker-text">
                    <img src={"/item_icon_upscale/"+icon_name}
                         alt={this.state.data.sanitized_name}
                         className="PriceTracker-icon">
                    </img>
                    <Table
                    width={200}
                    height={150}
                    rowHeight={30}
                    rowCount={tableData.length}
                    rowGetter={({index})=>tableData[index]}
                    rowClassName={this.rowClassName}>
                        <Column dataKey="name" width={3000} className="PriceTracker-headerColumn"/>
                        <Column dataKey="value" width={3000} className="PriceTracker-headerColumn"/>
                    </Table>
                    
                    
                </div>
            );
        }
        else {
            return (header);
        }
    }
}

class TradeData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: props.item,
            data: null
        };
    }
    componentDidMount() {
        this.getTradeData();
    }
    getTradeData() {
        if(this.state.item) {
            //console.log("fetching /api/trades/"+this.state.item);
            fetch("/api/trades/"+this.state.item)
            .then(response => response.json())
            .then(data => this.setupPriceData(data.data))
        }
    }
    setupPriceData(data) {
        //console.log("length: "+data.length+" Data: "+JSON.stringify(data));
        if(!data || data.length === 0) {
            return;
        }
        //console.log("Data[0]: "+JSON.stringify(data[0]));
        const sortByListed = (a, b) => a.Listed < b.Listed;
        const filterByExpire = (item) => item.Expire >= tradeItem.Listed;
        var queue = [];
        var minPriceData = [];
        var first100PriceData = [];
        var avgPriceData = [];
        var useFirst100 = false;
        for(var i=0;i<data.length;i++) {
            var tradeItem = data[i];
            queue.push(tradeItem);
            queue.sort(sortByListed);
            //console.log("tradeItem: "+JSON.stringify(tradeItem));
            //console.log("Queue: "+JSON.stringify(queue));
            queue = queue.filter(filterByExpire);
            //console.log("Queue: "+JSON.stringify(queue));
            var minPrice = queue[0].Price;
            var first100Price = 0;
            var numSeen = 0;
            for(var j = 0;j<queue.length && numSeen < 100;j++) {
                if(numSeen+queue[j].Quantity < 100) {
                    first100Price += queue[j].Price*queue[j].Quantity;
                    numSeen += queue[j].Quantity;
                }
                else {
                    first100Price += queue[j].Price*(100-numSeen);
                    numSeen = 100;
                    useFirst100 = true;
                }
            }
            first100Price /= numSeen;
            var avgPrice = 0;
            numSeen = 0;
            for(j = 0;j<queue.length;j++) {
                avgPrice += queue[j].Price*queue[j].Quantity;
                numSeen += queue[j].Quantity;
            }
            
            avgPrice = avgPrice/numSeen;
            minPriceData.push({x: tradeItem.Listed, y: minPrice});
            first100PriceData.push({x: tradeItem.Listed, y: first100Price});
            avgPriceData.push({x: tradeItem.Listed, y: avgPrice});
        }
        var lastExpire = new Date();
        minPriceData.push({x: lastExpire, y: minPrice});
        first100PriceData.push({x: lastExpire, y: first100Price});
        avgPriceData.push({x: lastExpire, y: avgPrice});

        this.setupData(minPriceData,first100PriceData,avgPriceData,useFirst100);
    }
    setupData(minPriceData,first100PriceData,avgPriceData,useFirst100) {
        var lines = [
            {name:"Min Price",data:minPriceData,color:"rgba(0,255,0,0.4)"},
            {name:"Average Price",data:avgPriceData,color:"rgba(255,0,0,0.4)"},
        ];
        if(useFirst100) {
            lines.push({name:"First 100 Price",data:first100PriceData,color:"rgba(0,0,255,0.4)"});
        }
        var data = {datasets:[]};
        for(var i=0;i<lines.length;i++){
            var line = lines[i];
            data.datasets.push({
                label: line.name,
                fill: false,
                lineTension: 0.1,
                backgroundColor: line.color,
                borderColor: line.color,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                steppedLine: true,
                data: line.data
                }
            );
        }
        this.setState({data:data});
    }
    
    render() {
        if(this.state.data !== null) {
            const options = {
                title: {
                    display: true,
                    text: "Prices"
                },
                spanGaps: true,
                legend: {
                  position: 'right',
                  labels: {
                    boxWidth: 10
                  }
                },
                tooltips: {
                  enabled: false
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  xAxes: [{
                    position: 'bottom',
                    gridLines: {
                      zeroLineColor: "rgba(0,255,0,1)"
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'Time'
                    },
                    type: 'time',
                    ticks: {
                      stepSize: 6,
                      unitStepSize: 5,
                      autoskip: true,
                      autoSkipPadding: 30
                    },
                  }],
              
                }
              };
            return (
                <div >
                    <Line ref="chart" data={this.state.data} options={options}/>
                </div>
            );
        }
        else {
            return (<div></div>);
        }
    }
}


function PriceTracker({match}) {
    const useStyles = makeStyles(theme => ({
        root: {
          flexGrow: 1,
        },
        paper: {
          padding: theme.spacing(2),
          textAlign: 'center',
          color: theme.palette.text.secondary,
        },
      }));
      const classes = useStyles();
	return (
		<div className="App">
			<Header region={match.params.region} />
            <div className="PriceTracker-background">
                <div className="PriceTracker-width">
                    <label className="PriceTracker-header">Pick an item to analyze</label>
                    <br/>
                    <ItemAutocomplete region={match.params.region}/>
                    
                </div>
                <div className={classes.root}>
                <Grid container direction="row" justify="center" alignItems="flex-start" spacing={1}>
                    <Grid item xs={4}>
                        <Paper className={classes.paper}>
                            <ItemData item={match.params.item}/>
                        </Paper>
                    </Grid>
                    <Grid item xs={7}>
                        <Paper className={classes.paper}>
                            <TradeData item={match.params.item}/>
                        </Paper>
                    </Grid>
                </Grid>
                    <header className="App-header"></header>
                </div>
                
            </div>
		</div>
	);
}

export default PriceTracker;
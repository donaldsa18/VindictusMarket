import React,{Component} from 'react';
import './PriceTracker.css';
import {Line} from 'react-chartjs-2';
import Header from './Header';
import AsyncSelect from 'react-select/async';
import Background from './Background';
//import 'react-virtualized/styles.css'
//import {Table,Column,AutoSizer} from 'react-virtualized';

//import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ItemBox from './ItemCard/ItemBox';

import {ReactiveBase} from '@appbaseio/reactivesearch';
import {DataSearch,ReactiveList} from '@appbaseio/reactivesearch';

class Searchbar extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            region: props.region
        };
    }

    onAutocompleteChange(opt) {
        window.location = "/"+this.state.region+"/prices/"+opt;
    }

    makeItemBox(item) {
        var itemBox = ""
        if(item) {
            itemBox = (<ItemBox itemInfo={item}/>)
        }
        return (
            <div>
            {console.log(item)}
            {itemBox}
            </div>
            )
    }
    getItemClass(item) {
        if(item) {
            fetch("/api/itemnames/"+item)
            .then(response => response.json())
            .then(data => this.onAutocompleteChange(data.data.value))
        }
    }

    render() {
        const url = process.env.ELASTICSEARCH_URL || "http://192.168.99.101:32557/"
        const list = (<ReactiveList
            componentID="searchResult"
            dataField="description"
            stream={true}
            pagination={false}
            paginationAt="bottom"
            pages={5}
            sortBy="desc"
            size={10}
            loader="Loading Results.."
            showResultStats={true}
            renderItem={(res) => <div>{res.sanitized_name}</div>}
            renderResultStats={
                function(stats){
                    return (
                        `Showing ${stats.displayedResults} of total ${stats.numberOfResults} in ${stats.time} ms`
                    )
                }
            }
            react={{
                "and": ["search"]
            }}
            />)
            //{data.map(item => <ItemBox itemInfo={item}/>)}
        const reactivebase = (
        <ReactiveBase app="marketquery" type="items" url={url}>
            <DataSearch 
                app="marketquery" 
                componentId="search"
                dataField={['sanitized_name']}
                autosuggest={true}
                onValueSelected={(e) => this.getItemClass(e)}
            />
            
        </ReactiveBase>)
        
        return (reactivebase)
    }
}

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
            itemData: null,
            tradeData: null,
            currentTrades: null
        };
    }
    componentDidMount() {
        this.getItemData();
        this.getTradeData();
    }
    getItemData() {
        if(this.state.item) {
            fetch("/api/items/"+this.state.item)
            .then(response => response.json())
            .then(data => this.setState({itemData:data.data}))
        }
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
        const sortByListed = (a, b) => a.Listed > b.Listed;
        const filterByExpire = (item) => item.Expire >= tradeItem.Listed;
        var queue = [];

        var minPriceData = [];
        var first100PriceData = [];
        var avgPriceData = [];

        var useFirst100 = false;

        var currentTrades = {};
        var now = (new Date()).toISOString();

        for(var i=0;i<data.length;i++) {
            var tradeItem = data[i];
            queue.push(tradeItem);
            queue.sort(sortByListed);
            //console.log(typeof(tradeItem.Expire));
            //console.log("tradeItem: "+JSON.stringify(tradeItem));
            //console.log("Queue: "+JSON.stringify(queue));
            queue = queue.filter(filterByExpire);
            //console.log("Queue: "+JSON.stringify(queue));
            var minPrice = queue[0].Price;
            var first100Price = 0;
            let numSeen = 0;
            for(let j = 0;j<queue.length && numSeen < 100;j++) {
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
            for(let j = 0;j<queue.length;j++) {
                avgPrice += queue[j].Price*queue[j].Quantity;
                numSeen += queue[j].Quantity;
            }
            
            avgPrice = avgPrice/numSeen;
            minPriceData.push({x: tradeItem.Listed, y: minPrice});
            first100PriceData.push({x: tradeItem.Listed, y: first100Price});
            avgPriceData.push({x: tradeItem.Listed, y: avgPrice});
            if(tradeItem.Expire >= now) {
                var key = tradeItem.CID+tradeItem.ItemName+tradeItem.Expire.substring(0,16);
                if(key in currentTrades) {
                    currentTrades[key].Quantity += tradeItem.Quantity;
                    if(currentTrades[key].Expire > tradeItem.Expire) {
                        currentTrades[key].Expire = tradeItem.Expire;
                    }
                }
                else {
                    currentTrades[key] = {
                        CharacterName: tradeItem.CharacterName,
                        Quantity: tradeItem.Quantity,
                        Price: tradeItem.Price,
                        Expire: tradeItem.Expire
                    };
                }
            }
        }
        
        //console.log(now)
        currentTrades = Object.values(currentTrades);
        const sortByPrice = (a, b) => a.Price > b.Price;
        currentTrades.sort(sortByPrice);
        //console.log(data.length,currentTrades.length)
        //var lastExpire = new Date();
        //minPriceData.push({x: lastExpire, y: minPrice});
        //first100PriceData.push({x: lastExpire, y: first100Price});
        //avgPriceData.push({x: lastExpire, y: avgPrice});

        this.setupData(minPriceData,first100PriceData,avgPriceData,useFirst100,currentTrades,data[0]);
    }
    setupData(minPriceData,first100PriceData,avgPriceData,useFirst100,currentTrades,tradeItemData) {
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
        this.setState({tradeData:data,currentTrades:currentTrades,firstTradeItem:tradeItemData});
    }

    getIcon() {
        if(!this.state.itemData) {
            return (<div></div>);
        }
        const icon_name = this.state.itemData.icon+".png";
        const sanitized_name = this.state.itemData.sanitized_name;
        return (
            <img src={"/item_icon_upscale/"+icon_name}
                alt={sanitized_name}
                className="PriceTracker-icon">
            </img>
        );
    }

    toTitleCase(str) {
        return str.replace("_"," ").replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    getItemTable() {
        if(!this.state.itemData) {
            return (<div></div>);
        }
        const tableData = [
            {name: "Name", value: this.state.itemData.sanitized_name},
            {name: "Description", value: this.state.itemData.description},
            {name: "Category", value: this.toTitleCase(this.state.itemData.trade_category)},
            {name: "Subcategory", value: this.toTitleCase(this.state.itemData.trade_category_sub)},
            {name: "Level", value: this.state.itemData.level},
            {name: "Sell Price", value: this.state.itemData.sell_price},
        ];
        return (
            <Table>
                <TableBody>
                    {tableData.map(row => (
                    <TableRow key={row.name}>
                        <TableCell component="th" scope="row">{row.name}</TableCell>
                        <TableCell>{row.value}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    getTimeDiff(expire) {
        var str = [];

        var delta = Math.abs(Date.parse(expire)-new Date())/1000;
        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        if(days !== 0) {
            str.push(days);
            str.push("days");
        }
        // calculate (and subtract) whole hours
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        if(hours !== 0) {
            str.push(hours);
            str.push("hours");
        }

        // calculate (and subtract) whole minutes
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        if(minutes !== 0) {
            str.push(days);
            str.push("minutes");
        }
        //console.log(str);
        return str.join(' ');
    }
    getTradeTable() {
        if(!this.state.currentTrades || this.state.currentTrades.length === 0) {
            return (<div></div>);
        }
        const currentTrades = this.state.currentTrades;
        return (
            <Table>
                <TableHead>
                    <TableRow key={-1}>
                        <TableCell>Seller</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Remaining Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentTrades.map(trade => (
                    <TableRow key={trade.Expire}>
                        <TableCell component="th" scope="row">{trade.CharacterName}</TableCell>
                        <TableCell>{trade.Quantity}</TableCell>
                        <TableCell>{trade.Price}</TableCell>
                        <TableCell>{this.getTimeDiff(trade.Expire)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    getChart() {
        if(!this.state.tradeData) {
            return (<div></div>);
        }
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
                  autoSkipPadding: 50
                },
              }],
            }
        };
        return (
            <Line ref="chart" data={this.state.tradeData} options={options} height={245}/>
        );
    }

    render() {
        const header = (<header className="App-header"></header>)
        
        //console.log(this.state.data)
        if(this.state.data !== null) {
            
            //const icon = this.getIcon();
            //const table = this.getItemTable();
            const chart = this.getChart();
            const tradeTable = this.getTradeTable();
            //const itemName = this.state.itemData ? this.state.itemData.sanitized_name : "";
            let itemBox = (null);
            if(this.state.itemData && this.state.firstTradeItem) {
                console.log(this.state.itemData);
                console.log(this.state.firstTradeItem);
                const itemInfo = {item:this.state.itemData,tradeItem:this.state.firstTradeItem};
                itemBox = (<ItemBox itemInfo={itemInfo}/>);
            }
            
            //<Grid item zeroMinWidth>
            //<label className="PriceTracker-header">{itemName}</label>
            //<Paper className="PriceTracker-paper">
            //    {icon}
            //</Paper>
        //</Grid>
        //<Grid item zeroMinWidth>
            //<Paper className="PriceTracker-paper">
                //{table}
            //</Paper>
        //</Grid>
            return (
                <div className="PriceTracker-itemdata">
                    
                <Grid container direction="row" justify="center" alignItems="flex-start" spacing={1} className="PriceTracker-grid">
                    <Grid item>
                    {itemBox}
                    </Grid>
                    <Grid item xs={5} className="PriceTracker-paper">
                        <Paper>
                            {chart}
                        </Paper>
                    </Grid>
                    <Grid item xs={5} className="PriceTracker-paper">
                        <Paper>
                            {tradeTable}
                        </Paper>
                    </Grid>
                </Grid>
                
                </div>
            );
        }
        else {
            return (header);
        }
    }
}


function PriceTracker({match}) {
    //<ItemAutocomplete region={match.params.region}/>
    const heightclass = match.params.item ? "PriceTracker-height-top" : "PriceTracker-height"
    const label = match.params.item ? "" : (<label className="PriceTracker-header">Pick an item to analyze</label>)
	return (
        <div>
            <Header region={match.params.region} />
            <Background y={17} />
            
            <div className={heightclass}>
            <div className="PriceTracker-width">
                {label}
                <br/>
                <Searchbar region={match.params.region}/>
                <br/>
                
            </div>
            <ItemData item={match.params.item}/>
            </div>
                
        </div>
	);
}

export default PriceTracker;
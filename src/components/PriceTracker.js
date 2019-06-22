import React,{Component} from 'react';
import './App.css';
import { Line, Chart } from 'react-chartjs-2';
import Header from './Header';
import Autocomplete from 'react-autocomplete';
function matchStateToTerm(state, value) {
    return (
      state.toLowerCase().indexOf(value.toLowerCase()) !== -1
    )
  }
function sortStates(a, b, value) {
    const aLower = a.toLowerCase()
    const bLower = b.toLowerCase()
    const valueLower = value.toLowerCase()
    const queryPosA = aLower.indexOf(valueLower)
    const queryPosB = bLower.indexOf(valueLower)
    if (queryPosA !== queryPosB) {
      return queryPosA - queryPosB
    }
    return aLower < bLower ? -1 : 1
  }
class ItemAutocomplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            items: ["Element Stone","Intermediate Element Stone"]
        };
    }

    componentDidMount() {
        fetch("autocomplete.json")
        .then(response => response.json())
        .then(data => this.setState({ items:data.payload }));
    }
    
    render() {
        return (
            <div>
                <label htmlFor="item-autocomplete">Pick an item to analyze</label>
                <br/>
                <Autocomplete
                value={this.state.value}
                inputProps={{ id: 'item-autocomplete' }}
                items={this.state.items}
                shouldItemRender={(item, value) => item.toLowerCase().indexOf(value.toLowerCase()) > -1}
                getItemValue={(item) => item}
                wrapperStyle={{ position: 'relative', display: 'inline-block' }}
                
                onChange={e => this.setState({ value: e.target.value })}
                onSelect={value => this.setState({ value })}

                renderItem={(item, highlighted) =>
                    <div
                    key={item}
                    style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
                    >
                    {item}
                    </div>
                }
                />
            </div>
        )
    }
}

function PriceTracker({match}) {
	return (
		<div className="App">
			<Header region={match.params.region} />
            
			<header className="App-header">
			<ItemAutocomplete />
			</header>
		</div>
	);
}

export default PriceTracker;
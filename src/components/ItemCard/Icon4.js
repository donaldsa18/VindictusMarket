import React,{Component} from 'react';

export default class Icon extends Component {
	strToColor(color) {
		const regex = /rgb\(([0-9]+),([0-9]+),([0-9]+)\)/g;
		const match = regex.exec(color);
		if(match) {
			const red = parseInt(match[1]);
			const green = parseInt(match[2]);
			const blue = parseInt(match[3]);
			return [red,green,blue];
		}
		return [0,0,0];
	}

	strToHSL(color) {
		const [r,g,b] = this.strToColor(color);
		return this.RGBToHSL(r,g,b);
	}

	makeid(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
		   result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	 }

	 getSaturation() {
		if(!this.props.filter) {
			return 1.83;
		}
		const regexExp = /saturate\((\d+)%\)/g;
		const match = regexExp.exec(this.props.filter);
		if(match) {
			return parseInt(match[1])/100.0
		}
		return 1.83;
		//2 stars by default
	}

	 getBrightness() {
		if(!this.props.filter) {
			return 1.28;
		}
		const regexExp = /brightness\((\d+)%\)/g;
		const match = regexExp.exec(this.props.filter);
		if(match) {
			return parseInt(match[1])/100.0
		}
		return 1.28;
		//2 stars by default
	}

	render() {
		const colors = this.props.colors;
		const icon = this.props.icon;
		const iconUrl = "/item_icon_png/"+icon+".png";
		if(icon.startsWith("eq_") && !colors[0]) {
			const style = {
				borderRadius: 2,
				filter: 'grayscale(1)',
			};
			return(<img src={iconUrl} alt={icon} style={style}></img>);
		}
		else if(!colors[0]) {
			const style = {
				borderRadius: 2,
			};
			return(<img src={iconUrl} alt={icon} style={style}></img>);
		}
		
		let filterMatrix = new Array(20).fill(0)
		const brightness = this.getBrightness();
		const saturation = this.getSaturation();
		let filterID = "filter_"+this.props.icon;
		for(let i = 0;i<3;i++) {
			let color = this.strToColor(colors[i]);
			let r = color[0]/255.0;
			let g = color[1]/255.0;
			let b = color[2]/255.0;
			filterMatrix[i] = r;
			filterMatrix[i+5] = g;
			filterMatrix[i+10] = b;
			filterID += "_"+color[0].toString(16)+color[1].toString(16)+color[2].toString(16);
		}
		filterID += this.makeid(10);
		filterMatrix[18] = 1;
		const filterStr = filterMatrix.join(" ");
		let filterURL = 'url(#'+filterID+')';
		//filterURL += " brightness(150%) saturate(300%)";
		//" brightness(128%) saturate(183%)";
		//console.log(filterMatrix.slice(0,5));
		//console.log(filterMatrix.slice(5,10));
		//console.log(filterMatrix.slice(10,15));
		//console.log(filterMatrix.slice(15,20));
		
		let size = 40;
		if(this.props.size) {
			size = this.props.size;
		}
		const style = {
			container: {
				position: 'absolute',
			},
			svg: {
				width:size,
				height:size,
				position: 'absolute',
			},
			img: {
				WebkitFilter: filterURL,
				filter: filterURL,
				borderRadius: 2,
			}
		};
		//console.log(brightness);
		return (
			<div style={style.container}>
				<svg style={style.svg}>
					<filter x="0%" y="0%" width="100%" height="100%" id={filterID}>
						<feColorMatrix result="original" type="matrix" values={filterStr} />
						<feComponentTransfer>
							<feFuncR type="linear" slope={brightness}/>
							<feFuncG type="linear" slope={brightness}/>
							<feFuncB type="linear" slope={brightness}/>
						</feComponentTransfer>
						<feColorMatrix type="saturate" result="original" values={saturation}/>
					</filter>
					<image x="0" y="0" width="100%" height="100%" xlinkHref={iconUrl} style={style.img}/>
				</svg>
			</div>
		);
	}
}
import React,{Component} from 'react';
import './fonts.css'
import Icon from './Icon4'
import BraceletIcon from './BraceletIcon'

export default class ItemBox extends Component {
	constructor(props) {
		super(props);
		this.down = 106;
		
	}
	getSuffix() {
		if(!this.props.itemInfo || !this.props.itemInfo.tradeItem) {
			return "";
		}
		const regexExp = /SUFFIX:([a-z_]+)/g;
		const match = regexExp.exec(this.props.itemInfo.tradeItem.attribute);
		if(match) {
			return this.toTitleCase(match[1].replace("_"," "))
		}
		return "";
	}
	getPrefix() {
		if(!this.props.itemInfo || !this.props.itemInfo.tradeItem) {
			return "";
		}
		const regexExp = /PREFIX:([a-z_]+)/g;
		const match = regexExp.exec(this.props.itemInfo.tradeItem.attribute);
		if(match) {
			return this.toTitleCase(match[1].replace("_"," "))
		}
		return "";
	}
	getEnhance() {
		if(!this.props.itemInfo || !this.props.itemInfo.tradeItem) {
			return 0;
		}
		const regexExp = /ENHANCE:(\d+)/g;
		const match = regexExp.exec(this.props.itemInfo.tradeItem.attribute);
		if(match) {
			return "+"+match[1]
		}
		return 0;
	}
	
	getQuality() {
		if(!this.props.itemInfo.tradeItem) {
			return 2;
		}
		const regexExp = /QUALITY:\((\d+)\)/g;
		const match = regexExp.exec(this.props.itemInfo.tradeItem.attribute);
		if(match) {
			return parseInt(match[1])
		}
		return 2;
		//2 stars by default
	}
	
	getLine2() {
		if(!this.props.itemInfo || !this.props.itemInfo.tradeItem) {
			return (null);
		}
		const style = {
			line2: {
			  position: 'absolute',
			  left: 20,
			  top: this.down+9,
			  width: 300,
			  height: 1,
			  background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, #2D2D2D 5%, #2D2D2D 95%, rgba(0,0,0,0) 100%)',
			  borderBottomWidth: 1,
			  zIndex: 2,
			},
		}
		this.down += 9;
		return (
			<div>
			<div style={style.line2} id="line2real"></div>
			{this.getMarker("line2")}
			</div>
		);
	}
	
	getDescription() {
		if(!this.props.itemInfo || !this.props.itemInfo.item) {
			return (null);
		}
		let description = this.props.itemInfo.item.description;
		let trade_category = this.props.itemInfo.item.trade_category;
		let stat_str = ""
		if (this.props.itemInfo.tradeItem && this.props.itemInfo.tradeItem.Attributes) {
			stat_str = this.props.itemInfo.tradeItem.Attributes.StatStr;
		}
		
		if(!description || trade_category === "Composite Material" || stat_str) {
			return (null);
		}
		const lines = description.split("\n")
		const style = {
			descDiv: {
			  position: 'absolute',
			  left: 16,
			  top: this.down-2,
			  width: 310,
			  zIndex: 3,
			},
			desc: {
			  fontSize: 12,
			  color: '#857C6B',
			},
		};
		this.down += 14*(description.match(/.{1,67}/g).length)+9
		return (
			<div>
				<div style={style.descDiv}>
					<p style={style.desc}>
						{lines.map((item, key) => {
							return <span key={key}>{item}<br/></span>
						})}
					</p>
				</div>
				{this.getMarker("descriptionline")}
			</div>
		);
	}
	getMarker(id) {
		if(!this.props.background) {
			return (null);
		}
		const style = {
			line2: {
			  position: 'absolute',
			  left: 23,
			  top: this.down,
			  width: 281,
			  height: 1,
			  background: 'red',
			  borderBottomWidth: 1,
			  zIndex: 3,
			},
		}
		return (
			<div style={style.line2} id={id}></div>
		);
	} 
	getTradedLine() {
		const height = -2;
		const style = {
			trade: {
			  position: 'absolute',
			  left: 12,
			  top: this.down+10+height,
			},
			traded: {
			  position: 'absolute',
			  left: 36,
			  top: this.down+height,
			  fontSize: 12,
			  color: '#5D7579',
			}
		}
		this.down += 26;
		return (
			<div>
				<img src="/trade.png" alt="scale" style={style.trade}></img>
				<p style={style.traded}>This item can be traded.</p>
				{this.getMarker("tradedline")}
			</div>
		);
	}
	
	getSetLine() {
		if(!this.props.itemInfo || !this.props.itemInfo.item) {
			return (null);
		}
		const set = this.props.itemInfo.item.set
		if(!set) {
			return (null);
		}
		const setName = set.set_name
		const setItems = set.set_items
		const lines = set.lines
		
		const numItems = setItems.length
		const startDown = this.down+29;
		this.down += -2;
		const style = {
			setTitle: {
			  position: 'absolute',
			  left: 12,
			  top: this.down+12,
			  fontSize: 12,
			  color: '#999999',
			  zIndex: 2,
			  letterSpacing: 1,
			  wordSpacing: -0.5,
			},
			curNum: {
			  fontSize: 12,
			  color: '#C4C4C4',
			  zIndex: 2,
			},
			maxNum: {
			  fontSize: 12,
			  color: '#4E4E4E',
			  zIndex: 2,
			},
		};
		let elements = []
		this.down += 12;
		let key = 0;
		let listDown = [0,0];
		for(let i = 0;i<numItems;i++) {
			let leftOffset = 154;
			if(i % 2 === 0) {
				leftOffset = 0;
			}
			let cStyle = {
				circle: {
					position: 'absolute',
					left: 20+leftOffset,
			  		top: this.down+listDown[i%2]+4,
					fontSize: 18,
					color: '#2C2C2C',
				},
				itemText: {
					fontSize: 11,
					color: '#7E7E7E',
					letterSpacing: 0.5,
					lineHeight: 1,
				},
				itemDiv: {
					position: 'absolute',
					left: 30+leftOffset,
					top: this.down+14+listDown[i%2],
					width: 148,
				}
			};
			listDown[i%2] += 12*Math.floor(setItems[i].length/29.0);
			elements.push(<p style={cStyle.circle} key={key++}>{"•"}</p>);
			elements.push(<div style={cStyle.itemDiv} key={key++}>
				<p style={cStyle.itemText} key={key++}>{setItems[i]}</p>
				</div>)
			if(i % 2 === 1) {
				this.down += 14;
			}
		}
		if(listDown[0] > listDown[1]) {
			this.down += Math.ceil(listDown[0]*1.2);
		}
		else {
			this.down += Math.ceil(listDown[1]*1.2);
		}
		//this.down += Math.max(listDown);
		this.down += 32;
		const bonusBoxStyle = {
			position: 'absolute',
			left: 21,
			top: this.down,
			width: 300,
			height: 14,
			borderStyle: 'solid',
			borderColor: '#212629',
			borderWidth: 1,
			zIndex: 1,
			borderRadius: 2,
		};
		const bonusTextStyle = {
			position: 'absolute',
			left: 24,
			top: this.down-9,
			fontSize: 10,
			color: '#7E7E7E',
			letterSpacing: -0.2,
		};
		this.down -= 5;
		for(let i = 0; i < lines.length; i++) {
			let aStyle = {
				circle: {
					position: 'absolute',
					left: 20,
			  		top: this.down,
					fontSize: 20,
					color: '#2C2C2C',
				},
				itemText: {
					position: 'absolute',
					left: 30,
					top: this.down+14,
					fontSize: 11,
					color: '#7E7E7E',
					letterSpacing: 0.35,
				},
			};
			elements.push(<p style={aStyle.circle} key={key++}>{"•"}</p>);
			const line = (i-lines.length+numItems+1)+" : "+lines[i];
			elements.push(<p style={aStyle.itemText} key={key++}>{line}</p>)
			this.down += 14;
		}
		
		const boxStyle = {
			width: 320,
			left: 11,
			top: startDown,
			height: this.down+25-startDown,
			background: "#04090C",
			position: 'absolute',
			borderStyle: 'solid',
			borderColor: '#212121',
			borderWidth: 1,
			borderRadius: 5,
		};
		this.down += 29;
		return (
			<div>
				<div style={boxStyle}></div>
				<div style={style.setTitle}> 
				<span>{setName}</span>
				<span style={style.curNum}> 0</span>
				<span style={style.maxNum}>/{numItems}</span>
				</div>
				<div style={bonusBoxStyle}></div>
				<p style={bonusTextStyle}>Set Bonus</p>
				
				{elements}
				{this.getAbilityLine("setline")}
			</div>
		);
	}
	
	getCompositeLine() {
		if(!this.props.itemInfo || !this.props.itemInfo.tradeItem || !this.props.itemInfo.tradeItem.Attributes) {
			return (null);
		}
		const composite = this.props.itemInfo.tradeItem.Attributes.Composite;
		if(!composite) {
			return (null)
		}
		const startDown = this.down+14;
		let elementArr = [];
		this.down += 23;
		let key = 0;
		for(let i = 0;i<composite.length;i++) {
			let statStr = composite[i].StatStr;
			let message = composite[i].Message;
			let iconUrl = "/item_icon_png/"+composite[i].Icon+".png";
			let ability = composite[i].Ability;
			let itemClass = composite[i].ItemClass;
			let compStyle = {
				statDiv: {
					position: 'absolute',
					left: 43,
					top: this.down-11,
					width: 310,
					lineHeight: 1.1,
				},
				messageDiv: {
					position: 'absolute',
					left: 40,
					top: this.down-11,
					width: 310,
					lineHeight: 1.1,
				},
				stat: {
					fontSize: 12,
					color: '#E4CE82',
					wordSpacing: 1.45,
					zIndex: 3,
				},
				message: {
					fontSize: 12,
					color: '#7E7E7E',
					zIndex: 3,
				},
				icon: {
					position: 'absolute',
					left: 18,
					top: this.down,
					width: 16,
				},
				abilityDiv: {
					position: 'absolute',
					left: 41,
					top: this.down+2,
					width: 280,
					lineHeight: 1.1,
				},
				ability: {
					fontSize: 12,
					color: '#7AA780',
				},
			};
			this.down += 22;
			elementArr.push(<img src={iconUrl} style={compStyle.icon} alt={itemClass} key={key++}></img>);
			if(statStr) {
				elementArr.push(
					<div style={compStyle.statDiv} key={key++}>
						<p style={compStyle.stat} key={key++}>{statStr.replace("MATT","M.ATT")}</p>
					</div>
				);
			}
			if(message) {
				elementArr.push(
					<div style={compStyle.messageDiv} key={key++}>
						<p style={compStyle.message} key={key++}>{message}</p>
					</div>
				);
			}
			if(ability) {
				elementArr.push(
					<div style={compStyle.abilityDiv} key={key++}>
						<p style={compStyle.ability} key={key++}>{ability}</p>
					</div>);
				this.down += 12.5*Math.ceil(ability.length/62.0)+3;
			}
		}
		const style = {
			box: {
			  width: 320,
			  left: 10,
			  top: startDown,
			  height: this.down-startDown,
			  position: 'absolute',
			  borderStyle: 'solid',
			  borderColor: '#212121',
			  borderWidth: 1,
			  borderRadius: 4,
			  boxShadow: '0 0 7px #212121, inset 0 0 2px #04090C',
			},
		};
		this.down += 2;
		return (
			<div>
			<div style={style.box} id="compositebox"></div>
			{elementArr}
			{this.getMarker("compositeline")}
			</div>
		);
	}
	
	isEquipable() {
		if(!this.props.itemInfo || !this.props.itemInfo.item) {
			return false;
		}
		const trade_category = this.props.itemInfo.item.trade_category;
		const trade_category_sub = this.props.itemInfo.item.trade_category_sub;
		return (trade_category === "Weapon" || trade_category_sub.includes("Armor") || trade_category === "Accessory");
	}
	
	getDurabilityLine() {
		if(!this.props.itemInfo || !this.props.itemInfo.tradeItem || !this.props.itemInfo.tradeItem.Attributes) {
			return (null);
		}
		let durability = this.props.itemInfo.tradeItem.Attributes.Durability;
		if(!durability && this.isEquipable()) {
			durability = 100;
		}
		if(!durability) {
			return (null);
		}
		const height = 0;
		const style = {
			barContainer: {
			  position: 'absolute',
			  left: 11,
			  top: this.down+42+height,
			  zIndex: 2,
			},
			bar: {
			  position: 'absolute',
			  left: 11,
			  top: this.down+42+height,
			  zIndex: 2,
			  width: 165,
			  height: 6,
			  filter: 'drop-shadow(2px 1px 0px #191E00)',
			},
			bar2: {
				position: 'absolute',
				left: 11,
				top: this.down+42+height,
				zIndex: 2,
				width: 165,
				height: 6,
				filter: 'drop-shadow(-2px -1px 0px #191E00)',
			  },
			  bar3: {
				position: 'absolute',
				left: 11,
				top: this.down+42+height,
				zIndex: 2,
				width: 165,
				height: 6,
				filter: 'drop-shadow(0px 0px 1px #777)',
			  },
			durability: {
			  position: 'absolute',
			  left: 20,
			  top: this.down+6+height,
			  fontSize: 12,
			  color: '#999999',
			  zIndex: 2,
			},
			curDurability: {
			  position: 'absolute',
			  left: 69,
			  top: this.down+6+height,
			  fontSize: 12,
			  color: '#C4C4C4',
			  zIndex: 2,
			},
			maxDurability: {
			  position: 'absolute',
			  left: 87,
			  top: this.down+6+height,
			  fontSize: 12,
			  color: '#4E4E4E',
			  zIndex: 2,
			},
			line: {
			  position: 'absolute',
			  left: 16,
			  top: this.down+9+height,
			  width: 300,
			  height: 1,
			  background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, #2D2D2D 5%, #2D2D2D 95%, rgba(0,0,0,0) 100%)',
			  borderBottomWidth: 1,
			  zIndex: 2,
			},
		}
		this.down += 48;
		return (
			<div>
				<img src="/durability.png" alt="durability" style={style.bar3}></img>
				<img src="/durability.png" alt="durability" style={style.bar}></img>
				
				<img src="/durability.png" alt="durability" style={style.bar2}></img>
				<p style={style.durability}>Durability</p>
				<p style={style.curDurability}>{durability}</p>
				<p style={style.maxDurability}>/{durability}</p>
				<div style={style.line}></div>
				{this.getMarker("durability")}
			</div>
		);
	}
	
	getAbilityLine() {
		let ability = "";
		if(this.props.itemInfo && this.props.itemInfo.tradeItem && this.props.itemInfo.tradeItem.Attributes) {
			ability = this.props.itemInfo.tradeItem.Attributes.Stat.Ability;
		}
		if(!ability) {
			return (null);
		}
		//ability = ability.replace(" ","\xa0\xa0");
		const styles = {
			abilityDiv: {
			  position: 'absolute',
			  left: 8,
			  top: this.down-9,
			  width: 300,
			  lineHeight: 1.1,
			},
			ability: {
			  fontSize: 12,
			  color: '#7AA780',
			},
		};
		this.down += 12.5*Math.ceil(ability.length/62.0)+3;
		return (
			<div>
			<div style={styles.abilityDiv}>
				<p style={styles.ability}>{ability}</p>
			</div>
			{this.getMarker("abilityline")}
			</div>
		);
	}
	
	getStatLine() {
		let statStr = "";
		if(this.props.itemInfo) {
			if(this.props.itemInfo.tradeItem && this.props.itemInfo.tradeItem.Attributes) {
				statStr = this.props.itemInfo.tradeItem.Attributes.StatStr;
			}
			if(!statStr && this.props.itemInfo.item) {
				statStr = this.props.itemInfo.item.stat_str
			}
		}
		
		if(!statStr) {
			return (null);
		}
		statStr = statStr.replace("MATT","M.ATT");
		const styles = {
			statDiv: {
			  position: 'absolute',
			  left: 8,
			  top: this.down,
			  width: 310,
			  lineHeight: 1.1,
			},
			stat: {
			  fontSize: 12,
			  color: '#E4CE82',
			  textJustify: 'none',
			  wordSpacing: 2,
			},
		};
		const rowsToPx = {
			1:23,
			2:37,
			3:51,
			4:64,
		};

		const statLength = statStr.match(/.{1,60}/g).length;
		//console.log(statLength);
		this.down += rowsToPx[statLength];
		return (
			<div>
				<div ref={this.addHeight} style={styles.statDiv}>
					<p style={styles.stat}>&nbsp;{statStr}</p>
				</div>
				{this.getMarker("statline")}
			</div>
		);
	}
	
	getInfusionLine() {
		let SpiritInjection = "";
		if(this.props.itemInfo && this.props.itemInfo.tradeItem && this.props.itemInfo.tradeItem.Attributes) {
			SpiritInjection = this.props.itemInfo.tradeItem.Attributes.SpiritInjection;
		}
		if(!SpiritInjection) {
			return (null);
		}
		
		let style = {
			icon: {
			  position: 'absolute',
			  left: 15,
			  top: this.down+10,
			},
			infusion: {
			  position: 'absolute',
			  left: 43,
			  top: this.down,
			  fontSize: 12,
			  color: '#9D5B43',
			}
		}
		if(SpiritInjection.includes("+")) {
			style.infusion.color = '#5D7579';
		}
		this.down += 28;
		
		return (
			<div>
				<img style={style.icon} src="\spirit_injection.png" alt="infusion"></img>
				<p style={style.infusion}>{SpiritInjection}</p>
				{this.getMarker("spiritinjection")}
			</div>
		);
	}
	
	getUnbindLine() {
		let antibind = 0;
		if(this.props.itemInfo && this.props.itemInfo.tradeItem && this.props.itemInfo.tradeItem.Attributes) {
			antibind = this.props.itemInfo.tradeItem.Attributes.AntiBind;
		}
		if(this.isEquipable()) {
			if(!antibind) {
				antibind = 0;
			}
		}
		else {
			return (null);
		}
		
		antibind = 3-antibind;
		const height = -4;
		const style = {
			unbind: {
			  position: 'absolute',
			  left: 36,
			  top: this.down+height,
			  fontSize: 12,
			  color: '#5D7579',
			  wordSpacing: -0.6,
			}
		}
		this.down += 26;
		return (
			<div>
				<p style={style.unbind}>Remaining Unbind Count : {antibind}</p>
				{this.getMarker("tradedline")}
			</div>
		);
	}
	
	getLevelLine() {
		if(!this.props.itemInfo) {
			return (null);
		}
		let maxEnhance = "";
		if(this.props.itemInfo.tradeItem && this.props.itemInfo.tradeItem.Attributes) {
			maxEnhance = this.props.itemInfo.tradeItem.Attributes.MaxEnhance;
		}
		let required = "";
		if(this.props.itemInfo.item) {
			required = this.props.itemInfo.item.required;
		}
		const list = [required,maxEnhance]
		const line = list.filter(Boolean).join(", ").replace("armor","");
		if(line.length === 0) {
			return (null);
		}
		const height = 3;
		const style = {
			helmIcon: {
				position: 'absolute',
				left: 16,
				top: height+10+this.down,
			},
			levelDiv: {
				position: 'absolute',
				left: 34,
				top: height+this.down,
				width: 285,
			},
			level: {
			  fontSize: 11,
			  color: '#5D7579',
			  lineHeight: 1.2,
			  letterSpacing: 0.44,
			},
		};
		const lines = Math.ceil(line.length/55.0);
		if(lines === 1) {
			this.down += 32;
		}
		else {
			this.down += 15*Math.ceil(line.length/55.0)+10;
		}
		return (
			<div>
				<img src="/helmet.png" alt="helmet" style={style.helmIcon}></img>
				<div style={style.levelDiv}>
					<p style={style.level}>{line}</p>
				</div>
				{this.getMarker("levelline")}
			</div>
		);
	}
	
	toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }
	
	getColors() {
		if(!this.props.itemInfo || !this.props.itemInfo.tradeItem) {
			return (null);
		}
		if(!this.props.itemInfo.tradeItem.Attributes) {
			return (null)
		}
		const {Color1,Color2,Color3} = this.props.itemInfo.tradeItem.Attributes;
		if(!Color1) {
			return (null);
		}
		const height = 0;
		const style = {
			color1: {
				position: 'absolute',
				left: 16,
				top: this.down+height,
				fontSize: 11,
				color: "#898874",
				letterSpacing: 0.4,
			},
			color2: {
				position: 'absolute',
				left: 83,
				top: this.down+height,
				fontSize: 11,
				color: "#898874",
				letterSpacing: 0.4,
			},
			color3: {
				position: 'absolute',
				left: 150,
				top: this.down+height,
				fontSize: 11,
				color: "#898874",
				letterSpacing: 0.4,
			},
			color1Box: {
				position: 'absolute',
				left: 57,
				top: this.down+13+height,
				width: 8,
				height: 8,
				backgroundColor: Color1,
				zIndex: 2,
			},
			color2Box: {
				position: 'absolute',
				left: 123,
				top: this.down+13+height,
				width: 8,
				height: 8,
				backgroundColor: Color2,
				zIndex: 2,
			},
			color3Box: {
				position: 'absolute',
				left: 190,
				top: this.down+13+height,
				width: 8,
				height: 8,
				backgroundColor: Color3,
				zIndex: 2,
			},
			slash1: {
				position: 'absolute',
				left: 74,
				top: this.down+height,
				fontSize: 11,
				color: "#2D2D2D",
			},
			slash2: {
				position: 'absolute',
				left: 140,
				top: this.down+height,
				fontSize: 11,
				color: "#2D2D2D",
			},
		};
		this.down += 23+height;
		
		return (
			<div>
				<p style={style.color1}>Color 1:</p>
				<p style={style.color2}>Color 2:</p>
				<p style={style.color3}>Color 3:</p>
				<div style={style.color1Box}></div>
				<div style={style.color2Box}></div>
				<div style={style.color3Box}></div>
				<p style={style.slash1}>{'/'}</p>
				<p style={style.slash2}>{'/'}</p>
				{this.getMarker("colors")}
			</div>
		);
	}
	
	getCategory() {
		if(!this.props.itemInfo || !this.props.itemInfo.item) {
			return (null);
		}
		const {trade_category,trade_category_sub} = this.props.itemInfo.item;
		let categoryStr = "";
		if(trade_category === "Accessory") {
			categoryStr = trade_category+", "+trade_category_sub;
		}
		else if(trade_category === "Weapon") {
			categoryStr = trade_category_sub+", "+trade_category;
		}
		else if(trade_category === "Composite Material") {
			categoryStr = trade_category_sub
		}
		else if(trade_category_sub.includes("Armor")){
			categoryStr = trade_category_sub+", "+trade_category
		}
		const categoryStyle = {
			  position: 'absolute',
			  left: 65,
			  top: 43,
			  fontSize: 11,
			  color: '#7E7E7E',
		};
		
		return (
			<p style={categoryStyle}>{categoryStr}</p>
		);
	}

	toPrice(price) {
		if(price < 0) {
			return "Undefined";
		}
		return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	getQualityLine() {
		if(!this.isEquipable()) {
			return (null)
		}
		let stars = []
		const quality = this.getQuality()
		for(let i = 0; i< quality; i++) {
			let starStyle = {
				position: 'absolute',
				left: 86+13*i,
				top: 11+this.down,
			}
			stars.push(<img src="/star.png" alt="star" style={starStyle} key={i}></img>)
		}
		const style = {
			anvilIcon: {
				position: 'absolute',
				left: 14,
				top: 5+this.down,
			},
			quality: {
				position: 'absolute',
				left: 39,
				top: this.down-1,
				fontSize: 12,
				color: "#7C8282",
			},
			line: {
			  position: 'absolute',
			  left: 25,
			  top: 34+this.down,
			  width: 300,
			  height: 1,
			  background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, #2D2D2D 5%, #2D2D2D 95%, rgba(0,0,0,0) 100%)',
			  borderBottomWidth: 1,
			  zIndex: 2,
			},
		};
		this.down += 33;
		return (
			<div>
				<img src="/anvil.png" alt="anvil" style={style.anvilIcon}></img>
				<p style={style.quality}>Quality</p>
				{stars}
				<div style={style.line}></div>
				{this.getMarker("qualityline")}
			</div>
		);
	}
	getIcon() {
		let icon = "";
		let trade_category_sub = "";
		if(this.props.itemInfo && this.props.itemInfo.item) {
			icon = this.props.itemInfo.item.icon;
			trade_category_sub = this.props.itemInfo.item.trade_category_sub;
		}
		let colors = [0,0,0];
		if(this.props.itemInfo && this.props.itemInfo.tradeItem && this.props.itemInfo.tradeItem.Attributes) {
			colors[0] = this.props.itemInfo.tradeItem.Attributes.Color1;
			colors[1] = this.props.itemInfo.tradeItem.Attributes.Color2;
			colors[2] = this.props.itemInfo.tradeItem.Attributes.Color3;
		}
		const style = {
			icon: {
				position: 'absolute',
				left: 13,
				top: 27,
				zIndex: 1,
				//borderRadius: 2,
			},
			iconBox: {
				position: 'absolute',
				left: 10,
				top: 24,
				width: 44,
				height: 43,
				borderStyle: 'solid',
				borderColor: '#1C2427',
				borderWidth: 1,
				borderRadius: 2,
				boxShadow: '0 0 7px #212121, inset 0 0 2px #04090C',
			},
			iconBox2: {
				position: 'absolute',
				left: 11,
				top: 25,
				width: 42,
				height: 41,
				borderStyle: 'solid',
				borderColor: '#2D2D2D',
				borderWidth: 1,
				boxShadow: 'inset 0 0 10px #04090C',
			},
		};
		
		let iconElement = (null);
		if(trade_category_sub === "Bracelet") {
			iconElement = (<BraceletIcon itemInfo={this.props.itemInfo}/>);
		}
		else if(icon) {
			iconElement = (<Icon colors={colors} icon={icon} left={style.icon.left} top={style.icon.top}/>)
		}
		//<img src={iconUrl} alt={icon} style={style.icon}></img>
		return (
			<div>
				<div style={style.iconBox2}></div>
				<div style={style.iconBox}></div>
				<div style={style.icon}>
					{iconElement}
				</div>
			</div>
		);
	}

	getPrices() {
		let sell_price = -1;
		let mp_price = -1;
		if(this.props.itemInfo) {
			if(this.props.itemInfo.item) {
				sell_price = this.props.itemInfo.item.sell_price;
			}
			if(this.props.itemInfo.tradeItem) {
				mp_price = this.props.itemInfo.tradeItem.Price;
			}
		}
		sell_price = this.toPrice(sell_price);
		mp_price = this.toPrice(mp_price);
		const style = {
			priceDiv: {
				position: 'absolute',
				left: 217,
				top: 45,
				width: 100,
				right: 0,
				textAlign: 'right',
				letterSpacing: 0.2,
			  },
			  priceText: {
				fontSize: 10,
				color: '#C2A056',
			  },
			  undefinedText: {
				fontSize: 10,
				color: '#C2A056',
			  },
			  undefinedDiv: {
				position: 'absolute',
				left: 217,
				top: 64,
				width: 100,
				right: 0,
				textAlign: 'right',
				letterSpacing: 0.2,
			  },
			  gold1: {
				position: 'absolute',
				left: 318,
				top: 50,
				zIndex: 2,
			  },
			  gold2: {
				position: 'absolute',
				left: 318,
				top: 69,
				zIndex: 2,
			  },
		};
		return (
			<div>
				<div style={style.priceDiv}>
					<p style={style.priceText}>{sell_price}</p>
				</div>
				<div style={style.undefinedDiv}>
					<p style={style.undefinedText}>{mp_price}</p>
				</div>
				<img src="/gold.png" alt="gold" style={style.gold1}></img>
				<img src="/gold.png" alt="gold" style={style.gold2}></img>
			</div>
		);
	}
	getTitleAndRarity() {
		let rarityNum = 0;
		let sanitized_name = "";
		if(this.props.itemInfo) {
			if(this.props.itemInfo.tradeItem && this.props.itemInfo.tradeItem.Attributes) {
				rarityNum = this.props.itemInfo.tradeItem.Attributes.Rarity;
				if(!rarityNum && this.props.itemInfo.item) {
					rarityNum = this.props.itemInfo.item.rarity;
				}
			}
			if(this.props.itemInfo.item) {
				sanitized_name = this.props.itemInfo.item.sanitized_name;
			}
		}
		

		const modifiers = [this.getEnhance(),this.getPrefix(),this.getSuffix(),sanitized_name];
		const item_name = modifiers.filter(Boolean).join(" ");
		
		const rarity = {
			0: {name: "", color: "#9D9DA0"},
			1: {name: "Regular", color: "#FFFFFF"},
			2: {name: "Beginners", color: "#8DEA9A"},
			3: {name: "Intermediate", color: "#90AADD"},
			4: {name: "Advanced", color: "#9C66C0"},
			5: {name: "Rare", color: "#ECAC90"},
		};
		
		const rarityName = rarity[rarityNum].name;
		const rarityColor = rarity[rarityNum].color;
		const style = {
			regular: {
				position: 'absolute',
				left: 65,
				top: 80,
				fontSize: 11,
				color: rarityColor,
			},
			titleDiv: {
				position: 'absolute',
				left: 61,
				top: 9,
				width: 267,
			},
			title: {
				fontSize: 13,
				color: rarityColor,
				letterSpacing: 0.55,
				
			},
		};
		return (
			<div>
				<div style={style.titleDiv}>
					<p style={style.title}>{item_name}</p>
				</div>
				<p style={style.regular}>{rarityName}</p>
			</div>
		);
	}

	getStaticText() {
		const style = {
			sellPrice: {
				position: 'absolute',
				left: 203,
				top: 42,
				fontSize: 11,
				color: '#7E7F81',
			},
			marketplace: {
				position: 'absolute',
				left: 65,
				top: 61,
				fontSize: 11,
				color: '#7E7E7E',
			},
		};
		return (
			<div>
				<p style={style.sellPrice}>Sell Price</p>
				<p style={style.marketplace}>Marketplace Standard Price</p>
			</div>
		);
	}

	getBoxes() {
		const style = {
			box1: {
				position: 'absolute',
				left: 61,
				top: 53,
				width: 270,
				height: 14,
				borderStyle: 'solid',
				borderColor: '#212629',
				borderWidth: 1,
				borderRadius: 2,
			  },
			  box2: {
				position: 'absolute',
				left: 61,
				top: 72,
				width: 270,
				height: 14,
				borderStyle: 'solid',
				borderColor: '#212629',
				borderWidth: 1,
				borderRadius: 2,
			  },
			  box3: {
				position: 'absolute',
				left: 61,
				top: 91,
				width: 270,
				height: 14,
				borderStyle: 'solid',
				borderColor: '#212629',
				borderWidth: 1,
				borderRadius: 2,
			  },
		};
		return (
			<div>
				<div style={style.box1}></div>
				<div style={style.box2}></div>
				<div style={style.box3}></div>
			</div>
		);
	}

	render() {
		this.down = 106;
		let components = [];
		components.push(this.getIcon());
		components.push(this.getPrices());
		components.push(this.getCategory());
		components.push(this.getTitleAndRarity());
		components.push(this.getStaticText());
		components.push(this.getBoxes());
		components.push(this.getMarker("startline"));
		components.push(this.getStatLine());
		components.push(this.getInfusionLine());
		components.push(this.getAbilityLine());
		components.push(this.getLevelLine());
		components.push(this.getQualityLine());
		components.push(this.getDescription());
		components.push(this.getColors());
		components.push(this.getDurabilityLine());
		components.push(this.getCompositeLine());
		components.push(this.getLine2());
		components.push(this.getSetLine());
		components.push(this.getTradedLine());
		components.push(this.getUnbindLine());
		this.down = Math.ceil(this.down);
		let rectStyle = {
			height: 35+this.down,
			width: 350,
			borderRadius: 8,
			position: 'relative',
			WebkitFontSmoothing: "antialiased",
			MozOsxFontSmoothing: "grayscale",
			fontFamily: 'ITC Goudy Sans Std Medium',
			boxShadow: 'inset 0 0 15px #575C5F',
			
		};
		if(this.props.background) {
			rectStyle.backgroundPosition = this.props.background.offset;
			rectStyle.backgroundImage = 'url(/'+this.props.background.img+')';
			rectStyle.opacity = 0.9
		}
		else {
			rectStyle.background = "#070C10";
		}
		return (
			<div style={rectStyle}>
				{components.map((component,index) =>
					<div key={index}>
						{component}
					</div>)}
			</div>
		);
	}
}

export function ItemBoxExample() {
	var brahaItemInfoMissing = {
		item: {"_id":"5d19b32a4686a579c81cfb0d","unique":0,"icon":"eq_kaiser_upper","required":"For levels 90 and above, Rank Heavyarmor Armor Proficiency 7 or above","rarity":3,"item_class":"upper_braha_male","required_level":90,"trade_category_sub":"Heavy Armor","bind":"zhCN","set":{"set_items":["Braha Weapon","Braha Head Armor","Braha Chest Armor","Braha Leg Armor","Braha Hand Armor","Braha Feet Armor"],"lines":["DEF +165, STR +60, INT +81, HP +120, STA +5","DEF +220, STR +80, INT +108, HP +160, STA +6","DEF +275, STR +100, INT +135, HP +200, STA +7","DEF +330, STR +120, INT +162, HP +240, STA +10"],"set_name":"Braha Set"},"trade_on_bind":"Disable","trade_category":"Tunic","sell_price":4000,"sanitized_name":"Braha Mail"},
	};
	var brahaItemInfo = {
		item: {"_id":"5d19b32a4686a579c81cfb0d","unique":0,"icon":"eq_kaiser_upper","required":"For levels 90 and above, Rank Heavyarmor Armor Proficiency 7 or above","rarity":3,"item_class":"upper_braha_male","required_level":90,"trade_category_sub":"Heavy Armor","bind":"zhCN","set":{"set_items":["Braha Weapon","Braha Head Armor","Braha Chest Armor","Braha Leg Armor","Braha Hand Armor","Braha Feet Armor"],"lines":["DEF +165, STR +60, INT +81, HP +120, STA +5","DEF +220, STR +80, INT +108, HP +160, STA +6","DEF +275, STR +100, INT +135, HP +200, STA +7","DEF +330, STR +120, INT +162, HP +240, STA +10"],"set_name":"Braha Set"},"trade_on_bind":"Disable","trade_category":"Tunic","sell_price":4000,"sanitized_name":"Braha Mail"},
		tradeItem: {
			"_id": "5d187446e3c181bb8a2e0f68",
			"TID": "65",
			"CID": "636952907412210660",
			"CharacterName": "charname",
			"ItemName": "upper_braha_male",
			"Quantity": "1",
			"Price": "35000",
			"Expire": "2019-07-08T08:35:11.830Z",
			"Listed": "2019-06-28T08:35:11.981Z",
			"Attribute": "COMBINATION:0;89;1;65;2;66,PS_0:2;109;18;0(89)<2000104>,PS_1:18;0;3;9;4;5;5;12;6;4(65),PS_2:2;42(66),SPIRIT_INJECTION:WILL(-3)",
			"Attributes": {
				"Durability": 100,
				"Color1": "rgb(114,114,111)",
				"Color2": "rgb(88,83,85)",
				"Color3": "rgb(53,53,53)",
				"Composite": [
					{
						"DEF": 902,
						"Critical Resistance": 3,
						"ItemClass": "combine_apart1_upper_lv90_braha_5_3",
						"Icon": "combine_apart1_upper_lv90_braha",
						"Ability": "Instant Protection Lv. 4 (Ben Chenner): When hit, grants a 20% chance to create a shield that absorbs up to 3000 damage for 21 sec. Reactivation cooldown: 5 min (Only works in Ben Chenner)",
						"StatStr": "DEF+902 Critical Resistance+3"
					},
					{
						"Critical Resistance": 9,
						"STR": 135,
						"AGI": 68,
						"INT": 182,
						"WIL": 60,
						"ItemClass": "combine_apart2_lv90_4_1",
						"Icon": "combinecraft_armorpart2_grade1",
						"StatStr": "STR+135 AGI+68 INT+182 WIL+60 Critical Resistance+9"
					},
					{
						"DEF": 597,
						"Critical Resistance": 3,
						"ItemClass": "combine_apart3_lv90_4_1",
						"Icon": "combinecraft_armorpart3_grade1",
						"StatStr": "DEF+597 Critical Resistance+3"
					}
				],
				"Rarity": 4,
				"MaxEnhance": "Max Enhance Level 15, Max Quality 5 Star, Max Enchant Rank 7",
				"SpiritInjection": "WIL-3",
				"Stat": {
					"DEF": 1499,
					"Critical Resistance": 15,
					"STR": 135,
					"AGI": 68,
					"INT": 182,
					"WIL": 57
				},
				"StatStr": "DEF+1499 STR+135 AGI+68 INT+182 WIL+57 Critical Resistance+15"
			}
		},
	};
	var reginaItemInfo = {
		item: {
			"_id":"5d17ef4421cd72be7b96bcb0",
			"trade_category_sub":"Weapon Combination Material",
			"trade_category":"Composite Material",
			"bind":"zhCN",
			"icon":"combine_wpart1_lv90_regina",
			"rarity":5,
			"sanitized_name":"Regina's Sealed Power: Weapon",
			"item_class":"combine_wpart1_lv90_regina_5_3",
			"unique":0,
			"required":"",
			"description":"Can be composited.",
			"trade_on_bind":"S3EP1",
			"required_level":1,
			"sell_price":800
		},
		tradeItem: {
			"_id":"5d17df70e3c181bb8a2dd44c",
			"TID":"69",
			"CID":"636952907412210660",
			"CharacterName":"charname",
			"ItemName":"combine_wpart1_lv90_regina_5_3",
			"Quantity":"1",
			"Price":"800",
			"Expire":"2019-07-08T08:35:57.272Z",
			"Listed":"2019-06-28T08:35:57.365Z",
			"Attribute":"VARIABLESTAT:0;323;14;0;1;281(1000804)",
			"Attributes":{
				"MaxEnhance":"Max Enhance Level 15, Max Quality 5 Star, Max Enchant Rank 7",
				"Stat":{
					"ATT":6907,
					"Attack Speed":3,
					"MATT":6865,
					"Ability":"Forceful Weapon Lv. 4 (Ben Chenner): Each successful attack grants a 5% chance to increase Critical Rate by 5 for 1 minute. Reactivation cooldown: 3 min (Only works in Ben Chenner)"
				},
				"StatStr":"ATT+6907 M.ATT+6865 Attack Speed+3"
			}
		},
	}
	const goldBraceletItemInfo = {
		item: {
			"_id":"5d17ef4421cd72be7b96dae3",
			"trade_category_sub":"Bracelet",
			"trade_category":"Accessory",
			"bind":"zhCN",
			"icon":"bracelet_gold",
			"rarity":2,
			"sanitized_name":"Gold Bracelet",
			"item_class":"bracelet_gold",
			"unique":0,
			"required":"For levels 90 and above",
			"description":"A bracelet that brims with arcane power. Can be fitted with up to 4 gems. Visit the Colhen General Store to change or replace gems.",
			"trade_on_bind":"Enable",
			"required_level":90,
			"sell_price":48000
		},
		tradeItem: {"_id":"5d19c1accdc98472d18ba9d7","TID":"71","CID":"636952907412210660","CharacterName":"charname","ItemName":"bracelet_gold","Quantity":"1","Price":"48000","Expire":"2019-07-09T08:18:54.858Z","Listed":"2019-06-29T08:18:54.916Z","Attribute":"GEMSTONEINFO:0;3;1;3;2;3;3;3,GS_2:0;18;1;18;2;28;8;237(3)<7>,GS_1:0;36;1;243;2;24;8;29(3)<4>,GS_0:0;192;1;29;2;29;8;20(3)<1>,GS_3:0;10;1;24;2;286;8;10(3)<10>,ANTIBIND:1","Attributes":{"Composite":[{"ATT":442,"MATT":54,"DEF":54,"HP":45,"ItemClass":"gemstone_diamond_rank3","Icon":"gemstone_diamond_rank3","StatStr":"ATT+442 MATT+54 DEF+54 HP+45"},{"ATT":61,"MATT":493,"DEF":59,"HP":64,"ItemClass":"gemstone_sapphire_rank3","Icon":"gemstone_sapphire_rank3","StatStr":"ATT+61 MATT+493 DEF+59 HP+64"},{"ATT":43,"MATT":43,"DEF":53,"HP":537,"ItemClass":"gemstone_ruby_rank3","Icon":"gemstone_ruby_rank3","StatStr":"ATT+43 MATT+43 DEF+53 HP+537"},{"ATT":35,"MATT":49,"DEF":561,"HP":35,"ItemClass":"gemstone_emerald_rank3","Icon":"gemstone_emerald_rank3","StatStr":"ATT+35 MATT+49 DEF+561 HP+35"}],"Stat":{"ATT":581,"MATT":639,"DEF":727,"HP":681},"StatStr":"ATT+581 MATT+639 DEF+727 HP+681","AntiBind":1}},
	};
	const silverBraceletItemInfo = {
		item: {
			"_id":"5d19b32a4686a579c81cd825",
			"unique":0,
			"icon":"bracelet_silver",
			"required":"For levels 85 and above",
			"rarity":2,
			"item_class":"bracelet_silver","required_level":85,"trade_category_sub":"Bracelet","bind":"zhCN","trade_on_bind":"Disable","trade_category":"Accessory","sell_price":35000,"description":"A bracelet that brims with arcane power. Can be fitted with up to 3 gems. Visit the Colhen General Store to change or replace gems.","sanitized_name":"Silver Bracelet"},
		tradeItem: {
			"_id":"5d19d087cdc98472d18baeb0",
			"TID":"72",
			"CID":"636952907412210660",
			"CharacterName":"charname",
			"ItemName":"bracelet_silver",
			"Quantity":"1",
			"Price":"35000",
			"Expire":"2019-07-09T08:19:11.910Z",
			"Listed":"2019-06-29T08:19:11.929Z",
			"Attribute":"GEMSTONEINFO:1;0;2;5;3;0,GS_1:0;16;1;21;2;15;8;86(5)<9>,ANTIBIND:1",
			"Attributes":{
				"Composite":[
					{"Icon":"gemstone_sapphire_rank5","Message":"Sapphires will fit."},
					{"ATT":21,"MATT":26,"DEF":20,"HP":161,
					"ItemClass":"gemstone_ruby_rank5",
					"Icon":"gemstone_ruby_rank5",
					"StatStr":"ATT+21 MATT+26 DEF+20 HP+161"},
					{"Icon":"gemstone_emerald_rank5","Message":"Emeralds will fit."}],
					"Stat":{"ATT":21,"MATT":26,"DEF":20,"HP":161},"StatStr":"ATT+21 MATT+26 DEF+20 HP+161","AntiBind":1}},
	};
	const termItemInfo = {
		item: {"_id":"5d19b32a4686a579c81cdac9","unique":0,"icon":"eq_border_guardian_male_upper","required":"For levels 90 and above, Rank Lightarmor Armor Proficiency 7 or above","rarity":3,"item_class":"upper_border_guardian_male","required_level":90,"trade_category_sub":"Light Armor","bind":"zhCN","set":{"set_items":["Terminus Sentinel Weapon","Terminus Sentinel Head Armor","Terminus Sentinel Chest Armor","Terminus Sentinel Leg Armor","Terminus Sentinel Hand Armor","Terminus Sentinel Feet Armor"],"lines":["DEF +165, STR +60, INT +81, HP +120, STA +5","DEF +220, STR +80, INT +108, HP +160, STA +6","DEF +275, STR +100, INT +135, HP +200, STA +7","DEF +330, STR +120, INT +162, HP +240, STA +10"],"set_name":"Terminus Sentinel Set"},"trade_on_bind":"Disable","trade_category":"Tunic","sell_price":4000,"sanitized_name":"Terminus Sentinel Mail"},
		tradeItem: {"_id":"5d1c0580cdc98472d18c12ab","TID":"73","CID":"636952907412210660","CharacterName":"charname","ItemName":"upper_border_guardian_male","Quantity":"1","Price":"35000","Expire":"2019-07-13T01:30:26.268Z","Listed":"2019-07-03T01:30:26.357Z","Attribute":"COMBINATION:0;201;1;19;2;20,PS_0:2;23;18;0(201),PS_1:18;1;3;13;4;1;5;21;6;1(19),PS_2:2;39;18;0(20),SPIRIT_INJECTION:Res_Critical(-2)","Attributes":{"Color1":"rgb(135,106,60)","Color2":"rgb(62,45,31)","Color3":"rgb(67,58,53)","Composite":[{"DEF":629,"Critical Resistance":2,"ItemClass":"combine_apart1_upper_lv90_border_guardian_3_1","Icon":"combine_apart1_upper_lv90_border_guardian","StatStr":"DEF+629 Critical Resistance+2"},{"Critical Resistance":11,"STR":157,"AGI":73,"INT":215,"WIL":65,"ItemClass":"combine_apart2_lv90_5_1","Icon":"combinecraft_armorpart2_grade1","StatStr":"STR+157 AGI+73 INT+215 WIL+65 Critical Resistance+11"},{"DEF":668,"Critical Resistance":3,"ItemClass":"combine_apart3_lv90_5_1","Icon":"combinecraft_armorpart3_grade1","StatStr":"DEF+668 Critical Resistance+3"}],"Rarity":3,"MaxEnhance":"Max Enhance Level 5, Max Quality 2 Star, Max Enchant Rank A","SpiritInjection":"Critical Resistance-2","Stat":{"DEF":1297,"Critical Resistance":14,"STR":157,"AGI":73,"INT":215,"WIL":65},"StatStr":"DEF+1297 STR+157 AGI+73 INT+215 WIL+65 Critical Resistance+14"}},
	};

	const sharpshooterItemInfo = {
		item: {"_id":"5d1d2d42b7d1ca538f95cf41","rarity":3,"stat_str":"DEF +230, STR +16, AGI +34, INT +30, WIL +8, HP +27, Critical Resistance +6","set":{"set_name":"Sharpshooter Leather Armor Set","lines":["DEF +20, AGI +3","DEF +40, AGI +4","DEF +60, AGI +5","DEF +80, AGI +7"],"set_items":["Sharpshooter Leather Armor Gloves","Sharpshooter Leather Armor Boots","Sharpshooter Leather Armor Helm","Sharpshooter Leather Armor Pants","Sharpshooter Leather Armor Tunic"]},"required":"For levels 20 and above, Rank Lightarmor Armor Proficiency E or above","item_class":"sharpshooter_foot","unique":0,"sanitized_name":"Sharpshooter Leather Armor Boots","sell_price":0,"required_level":20,"trade_category":"Boots","trade_category_sub":"Light Armor","trade_on_bind":"Disable","icon":"eq_sharpshooter_foot","bind":"Disable"},
		tradeItem: {"_id":"5d19d083cdc98472d18bae9d","TID":"47","CID":"636952907412210660","CharacterName":"charname","ItemName":"sharpshooter_foot","Quantity":"1","Price":"157","Expire":"2019-07-07T22:04:18.604Z","Listed":"2019-06-30T22:04:18.608Z","Attribute":"SUFFIX:sprout","Attributes":{"Color1":"rgb(105,73,58)","SUFFIX":{"Enchant":"sprout","Buff":"enchant_buff_stamina_recovery_1"},"Stat":{"DEF":230,"Critical Resistance":5,"STR":15,"AGI":30,"INT":15,"WIL":7},"StatStr":"DEF+230 STR+15 AGI+30 INT+15 WIL+7 Critical Resistance+5"}},
	};

	const termBackground = {
		img: "test/term.png",
		offset: "2px 0px",
	}

	const reginaBackground = {
		img: "test/regina.png",
		offset: "2px 4px",
	}
	const brahaBackground = {
		img: "test/braha.png",
		offset: "2px 0px",
	}
	const goldBraceletBackground = {
		img: "test/goldbracelet.png",
		offset: "2px 0px",
	}
	const silverBraceletBackground = {
		img: "test/silverbracelet.png",
		offset: "1px 2px",
	}
	const emptyItemInfo = {
		item: null,
		tradeItem: null,
	}
	return (
	<div>
		<ItemBox itemInfo={sharpshooterItemInfo}/>
		<br/>
		<ItemBox/>
		<br/>
		<ItemBox itemInfo={emptyItemInfo}/>
		<br/>
		<ItemBox itemInfo={termItemInfo}/>
		<br/>
		<ItemBox itemInfo={termItemInfo} background={termBackground}/>
		<br/>
		<ItemBox itemInfo={brahaItemInfoMissing}/>
		<br/>
		<ItemBox itemInfo={silverBraceletItemInfo}/>
		<br/>
		<ItemBox itemInfo={brahaItemInfo}/>
		<br/>
		<ItemBox itemInfo={goldBraceletItemInfo}/>
		<br/>
		<ItemBox itemInfo={reginaItemInfo}/>
		<br/>
		<ItemBox itemInfo={silverBraceletItemInfo} background={silverBraceletBackground}/>
		<br/>
		<ItemBox itemInfo={brahaItemInfo} background={brahaBackground}/>
		<br/>
		<ItemBox itemInfo={goldBraceletItemInfo} background={goldBraceletBackground}/>
		<br/>
		<ItemBox itemInfo={reginaItemInfo} background={reginaBackground}/>
		
	</div>
	);
}

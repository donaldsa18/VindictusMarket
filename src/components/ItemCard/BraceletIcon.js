import React,{Component} from 'react';

export default class BraceletIcon extends Component {
    render() {
      if(this.props.itemInfo.item.trade_category_sub !== "Bracelet") {
        return(null);
      }
      const bracelet = this.props.itemInfo.item.item_class;
      const icon = this.props.itemInfo.item.icon;
      const composite = this.props.itemInfo.tradeItem.Attributes.Composite;
      const offsets = {
        "bracelet_supply": [{x:13,y:23}],
        "bracelet_skin": [{x:13,y:23}],
        "bracelet_copper": [{x:7,y:23},{x:19,y:23}],
        "bracelet_silver": [{x:2,y:21},{x:12,y:23},{x:22,y:21}],
        "bracelet_gold": [{x:-1,y:19},{x:7,y:23},{x:18,y:23},{x:26,y:18}]
      }
      const gemOffsetFine = {
        "diamond": 0,
        "sapphire": 14*1,
        "ruby": 14*2,
        "emerald": 14*3,
      };
      const gemOffsetReg = {
        "sapphire": 14*4,
        "diamond": 14*5,
        "ruby": 14*6,
        "emerald": 14*7,
      };
      const offset = offsets[bracelet];
      const url = "/item_icon_png/"+icon+".png";
      let gems = [];
  
      for(let i = 0; i<offset.length;i++) {
        let gemInfo = composite[i].Icon.split("_");
        let gemOffset = 0;
        let gem = gemInfo[1];
        let rank = gemInfo[2];
        if(rank === "rank5") {
          gemOffset = gemOffsetReg[gem];
        }
        else {
          gemOffset = gemOffsetFine[gem];
        }
        //console.log(icon+" "+gem+" "+rank)
        let gemStyle = {
          position: 'absolute',
          left: offset[i].x,
          top: offset[i].y,
          backgroundImage: "url('/gems.png')",
          backgroundPosition: (gemOffset)+"px 0px",
          width: 14,
          height: 12,
        };
        gems.push(
          <div style={gemStyle} key={i}/>
        )
      }
      const divStyle = {
        position: 'absolute',
      }
      return(
        <div style={divStyle}>
          <img src={url} alt={bracelet}/>
          {gems}
        </div>
      );
    }
  }
import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import './Background.css'


function Background({y}) {
    //const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)
    const updateDims = () => {
        setHeight(window.innerHeight);
        //setWidth(window.innerWidth);
      };

    React.useEffect(() => {
        window.addEventListener("resize", updateDims);
        return () => window.removeEventListener("resize", updateDims);
    });
    




    const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2]
    const trans1 = (x, y) => `translate3d(${-x / 50}px,${-y / 50}px,0)`
    const trans2 = (x, y) => `blur(${Math.sqrt(x*x+y*y)/300}px)`
    const [prop, set] = useSpring(() => ({ xy: [0, 0], config: { mass: 10, tension: 550, friction: 140 } }))
    var h = height - 27 - y
    const marginTop = 30
    const marginLeft = 30
    const styles = {
        background: {
            position: 'relative',
            width: "120vw",
            height: h,
            //width: (document.documentElement.clientWidth+2*marginLeft),
            //height: (window.innerHeight-57+marginTop),
            marginLeft: -marginLeft,
            marginRight: -marginLeft,
            marginTop: -marginTop,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundSize: "cover",
            backgroundImage: 'url(http://nxcache.nexon.net/cms/2019/q4/1445/01_belle_main_banner.jpg)',
            transform: prop.xy.interpolate(trans1),
            filter: prop.xy.interpolate(trans2),
        }
    }
    return (
        <div className="Background-container" onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>
            <animated.div style={styles.background}/>
        </div>)
}
    




export default Background
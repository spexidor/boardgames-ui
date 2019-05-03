import React, { Component } from 'react';
import s1 from './images/s1_c.jpg';
import Draggable from 'react-draggable';

export default class DragTest extends Component 
{

    render(){
        return (
            <Draggable
              axis="both"
              handle=".handle"
              defaultPosition={{x: -400, y: -400}}
              position={null}
              grid={[1, 1]}
              scale={1}
              onStart={this.handleStart}
              onDrag={this.handleDrag}
              onStop={this.handleStop}>
                <div className="handle">
                    <img src={s1} alt="test"  style={{position: 'absolute', height: 50, width: 50}}/>
                </div>
            </Draggable>
          );
        
    }
}

/*
return(<div>
            <img src={s1} onDragEnd={this.onDragEnd.bind(this)} alt="test" style={{position: 'absolute', height: 50, width: 50, top: this.state.y, left: this.state.x}}/>
        </div>);
*/
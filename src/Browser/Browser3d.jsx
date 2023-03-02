import React from "react";
import ReactPlayer from "react-player";

export default function Browser3d(props){
    return(
        <div>
            <div id="3dBrowser">
                <ReactPlayer 
                controls={true}
                url='https://files.docking.org/idg-images/video_L1-M1-TAM_12-27-22.avi' />
            </div>
        </div>
    )
}

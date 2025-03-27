import {React,useState} from 'react'
import { MdOutlineCancel } from 'react-icons/md';
import { SiOpenai } from "react-icons/si";
import { useStateContext } from '../contexts/ContextProvider';


const OpenAIConfig = () => {
  const { setColor, setMode, currentMode, currentColor, setConfigSettings,handleClick,configurationSettings} = useStateContext();
  const [percentageTemp,setPercentageTemp] = useState(35)
  const [maxToken,setMaxToken] = useState(350)
  const [topP,setTopP] = useState(50)
  const [frequencyPenalty,setFrequencyPenalty] = useState(0)
  const [presencePenalty,setPresencePenalty] = useState(0)
  const [bestOf,setBestOf] = useState(10)
  return (
    <div
   
    onClick={(e) => {
      console.log(e.target.className)
      if (e.target.className === "bg-half-white w-screen fixed nav-item top-0 right-1"){ 
        console.log("raju",e.target.className);
        setConfigSettings(false)
     } }}
  >
 
    <div className="bg-half-white w-screen fixed nav-item top-0 right-1">
      <div className="float-right h-screen dark:text-gray-200  bg-white dark:bg-[#484B52] w-550" style={{border:'1px solid #DADADA',borderCollapse:'separate',borderRadius:"10px"}}>
      
        <div className="flex  p-4 ml-4 mt-4">
          <div className=' flex whitespace-nowrap'>
        <SiOpenai style={{height:"25px",width:"25px",color:'black'}} />
          <p className="font-semibold text-lg ml-2">OpenAI Configuration</p>
        </div>
          <button
            type="button"
              onClick={() => setConfigSettings(false)}
            style={{ color: 'rgb(153, 171, 180)', borderRadius: '50%',marginLeft:"60%", marginTop:'-12px'}}
            className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
          >
            <MdOutlineCancel />
          </button>

        </div>
        <div style={{marginLeft:'6%',marginTop:'2px'}}>
     
     <p style={{marginTop:'15px'}}>Api Key</p> 
     <input type="password" style={{width:'95%',height:'45px',backgroundColor:'#F5F5F5',border:'1px solid #DADADA',borderCollapse:'separate',borderRadius:'10px'}}></input>
   <div> <p style={{marginTop:'15px'}}>Temprature</p> 
    <input style={{width:'95%'}} className='cursor-pointer' type="range" min="1" max="100"  value={percentageTemp} onChange={(ev) => setPercentageTemp(ev.target.value)
    }/>
    <div className='flex'>
    <p>0.0</p>
    <p style={{marginLeft:'88%'}}>1.0</p>
    </div>
    </div>  <div> <p style={{marginTop:'15px'}}>Max Token</p> 
    <input style={{width:'95%'}} className='cursor-pointer' type="range" min="100" max="1000"  value={maxToken} onChange={(ev) => setMaxToken(ev.target.value)
    }/>
    <div className='flex'>
    <p>100</p>
    <p style={{marginLeft:'87%'}}>1000</p>
    </div>
    </div> 
    <div> <p style={{marginTop:'15px'}}>Top P</p> 
    <input style={{width:'95%'}} type="range" className='cursor-pointer' min="1" max="100"  value={topP} onChange={(ev) => setTopP(ev.target.value)
    }/>
    <div className='flex'>
    <p>0.0</p>
    <p style={{marginLeft:'88%'}}>1.0</p>
    </div>
    </div> 
    <div> <p style={{marginTop:'15px'}}>Frequency Penalty</p> 
    <input style={{width:'95%'}} className='cursor-pointer' type="range" min="1" max="100"  value={frequencyPenalty} onChange={(ev) => setFrequencyPenalty(ev.target.value)
    }/>
    <div className='flex'>
    <p>0.0</p>
    <p style={{marginLeft:'88%'}}>1.0</p>
    </div>
    </div> 
    <div> <p style={{marginTop:'15px'}}>Presence Penalty</p> 
    <input style={{width:'95%'}} className='cursor-pointer' type="range" min="1" max="100"  value={presencePenalty} onChange={(ev) => setPresencePenalty(ev.target.value)
    }/>
    <div className='flex'>
    <p>0.0</p>
    <p style={{marginLeft:'88%'}}>1.0</p>
    </div>
    </div> 
    <div> <p style={{marginTop:'15px'}}>Best Of</p> 
    <input style={{width:'95%'}} className='cursor-pointer' type="range" min="1" max="100"  value={bestOf} onChange={(ev) => setBestOf(ev.target.value)
    }/>
    <div className='flex'>
    <p>1</p>
    <p style={{marginLeft:'90%'}}>10</p>
    </div>
    </div> 
 
<button type='button' className='h-10' style={{display:'block',marginTop:'15px',marginLeft:'0px',width:'25%',border:'1px solid #DADADA',borderRadius:'10px',color:'black'}}  >
  Submit
</button>
   </div>     
      </div>
    </div>
    </div>
  )
}

export default OpenAIConfig

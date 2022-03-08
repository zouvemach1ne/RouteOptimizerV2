import React, {useEffect} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';

//import ReactFileReader from 'react-file-reader';
//import UploadFile from './FileParser'
import TransferList from '../../utils/custom/TransferList'
import SecondPageStepper from '../../utils/custom/SecondPage'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonProgress: {
    //color: 'green',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

function getSteps() {
    return ['Inserir arquivo Excel com dados dos veículos', 'Informe as colunas de latitude e longitude'];
};

function getStepText(stepIndex) {
    switch (stepIndex) {
      case 0:
        return 'Dados dos serviços';
      case 1:
        return 'Dados de coordenadas';
  
      default:
        return 'Unknown stepIndex';
    }
  }

const initData = [{
  "username": null,
  'values'   : null,
  'columns': null,
  "filename": null
}]

export default function HorizontalStepper(props) {
  const classes = useStyles();
  
  const [activeStep, setActiveStep] = React.useState(0);
  const [data1, setData1] = React.useState(initData);
  const [data1SelectedColumns, setData1SelectedColumns] = React.useState([])
  const [data1Loaded, setData1Loaded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [left, setLeft] = React.useState([])//props.values);
  const [right, setRight] = React.useState([]);
  //const [columns1, setColumns1] = React.useState(null);

  const [lat, setLat] = React.useState(null)
  const [lng, setLng] = React.useState(null)
  const [key, setKey] = React.useState(null)

  const steps = getSteps();


  useEffect(() => {
    console.log(props.fileData[0].filename)
    if (props.fileData[0].filename != null){
      setData1(props.fileData)
      setLeft( Object.values(Object.keys(JSON.parse(props.fileData[0]["values"]))) )  
      setData1Loaded(true);
    }
    
  }, [props.fileData]);
  
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  function handleSave(e, data) {
    /* This save function is special for the first step, it will process inputs
    and the selected columns by the client. It will then take the sub object
    with the columns selected. Then store on database of values and of files*/ 
    e.preventDefault();
    setLoading(true);

    let ph = []
    data.forEach(i => {
      let tempData = {}
      right.forEach(key => {
        tempData[key] = JSON.parse(i.values)[key]
      });
      tempData = {
        ...i,
        values: JSON.stringify(tempData),
        columns: JSON.stringify(Object.assign({}, Object.keys(tempData)) )
      }
      ph.push( tempData )
    });    
    data = ph

    console.log(data)

    fetch('http://localhost:8000/api/ins-vehicles/?username='+props.username, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        //console.log(res.status)
        let json = res.json()//.then(json => console.log(Object.keys(json)))
        setLoading(false);
        }
      )

    fetch('http://localhost:8000/api/ins-fileinfo/?username='+props.username, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data[0],
        filetype: 'vehicle_input',
        coords_columns: JSON.stringify({'lat':lat, 'lng':lng}),
        key_column: JSON.stringify({'key':key})
      })
    })
      .then(res => {
        //console.log(res.status)
        let json = res.json()//.then(json => console.log(Object.keys(json)))
        setLoading(false);
        }
      )
    
    //console.log("SELECTED COLUMNS = " + data1SelectedColumns)
  };


  function handleColumnsTable() {
    setLoading(true);
    return fetch('http://localhost:8000/api/get-serv/?username='+props.username, {
      method: 'GET',
    })
      .then(res => {
        console.log(res.status)
        let json = res.json().then(json => {
          
          //Object.keys(JSON.parse(json[0]["values"]))  
          setLeft( Object.keys(JSON.parse(json[0]["values"]))  )
          setData1Loaded(true);
          
          setLoading(false);
          //console.log(json)
        })
        
        
        }
      )
  }



  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
        <div >
          {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
          {data1Loaded && <TransferList left={left} right={right} setLeft={setLeft} setRight={setRight}/>}
        </div>
        
        );
      case 1:
        console.log("RIGHT = "+right)
        return (
          <div>
            {data1Loaded && <SecondPageStepper list={right} setLat={setLat} setLng={setLng} setKey={setKey} keys={key} lat={lat} lng={lng}/>}
          </div>
        );
  
      default:
        return 'Unknown stepIndex';
    }
  };


  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>All steps completed</Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            {getStepContent(activeStep)}
            <Typography className={classes.instructions}>{getStepText(activeStep)}</Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              {activeStep < steps.length - 1 ?  
              <Button variant="contained" color="primary" onClick={handleNext}>Next</Button> :
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<SaveIcon />} 
                disabled={loading}
                onClick={(e) => handleSave(e, data1)}
                >
                  Save
              </Button>
              }
              
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
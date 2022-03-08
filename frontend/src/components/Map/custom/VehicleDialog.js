import React, {useState, Fragment, useCallback, useEffect  } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ColorPicker from '../../utils/custom/ColorPicker'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Grid } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FaTrashAlt } from 'react-icons/fa'; 
import { Icon, Typography, IconButton } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


export default function VehicleDialogWindow(props){
  const [color, setColor] = useState(props.currentContext.color)
  //const [vehicles, setVehicles] = useState[props.vehicles]
  const [vehicleSelector, setVehicleSelector] = useState(props.currentContext.vehicle)

  const classes = useStyles();

  const handleVehicleSelectorChange = (event) => {
    setVehicleSelector(event.target.value);
  };

  const handleFinishRegister = () => {
    const ctx = {
      ...props.currentContext,
      vehicle: vehicleSelector,
      color: color
    } 
    props.currentContext.finishFunction(
      ctx
    )
    props.close()
  }

  const handleDeleteButton = () => {
    props.deleteFunc()
    props.close()
  }

  function vehicleBindPopup() {
      return(
        <Grid container spacing={1}>
          <Grid item xs={9}>
              <InputLabel id="vehicle-selector-label">Equipe</InputLabel>
              <Select
                labelId="vehicle-selector-label"
                id="vehicle-selector"
                value={vehicleSelector}
                onChange={handleVehicleSelectorChange}
                style={{width:'100%'}}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {props.vehicles.map((element,i) => (
                  <MenuItem key={i} value={element.popup}>{element.popup}</MenuItem>
                ))}
              </Select>
              <FormHelperText>Escolha a equipe para esta rota</FormHelperText>
                
              <ColorPicker color={color} setColor={setColor} />
          </Grid>
          
          <Grid item xs={3}>
            <IconButton onClick={handleDeleteButton}>
              <FaTrashAlt size={30} />
            </IconButton>
          </Grid>
          
      
      </Grid>
      
      )
  }


  return(
    <Dialog open={props.open} aria-labelledby="form-dialog-title">
      <div>
        <DialogTitle id="form-dialog-title">Selecionar Equipe</DialogTitle>
        <DialogContent>
          <DialogContentText>  
            Escolha o veículo que deseja associar a esta rota.
          </DialogContentText>
          {vehicleBindPopup()}

          

        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={props.close}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleFinishRegister}>
            Confirmar
          </Button>
        </DialogActions>
      </div>
      
    </Dialog>
  )
}

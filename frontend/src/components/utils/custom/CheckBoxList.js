import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles((theme) => ({
    root: {
      margin: 'auto',
    },
    cardHeader: {
      padding: theme.spacing(1, 2),
    },
    list: {
      width: 200,
      height: 230,

      overflow: 'auto',
    },
    button: {
      margin: theme.spacing(0.5, 0),
    },
  }));



  export default function CheckBoxList(props) {

    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [list, setList] = React.useState(props.list)//props.values);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
    
        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }
    
        setChecked(newChecked);
    };

    const numberOfChecked = (items) => checked.length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
          setChecked([]);
        } else {
          setChecked(items);
        }
      };

    const customList = (title, items) => (
        <Card>
            <CardHeader
            className={classes.cardHeader}
            avatar={
                <Checkbox
                onClick={handleToggleAll(items)}
                checked={numberOfChecked(items) === items.length && items.length !== 0}
                indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                disabled={items.length === 0}
                inputProps={{ 'aria-label': 'all items selected' }}
                />
            }
            title={title}
            subheader={`${numberOfChecked(items)}/${items.length} selecionadas`}
            />
            <Divider />
            <List className={classes.list} dense component="div" role="list">
            {items.map((value) => {
                const labelId = `transfer-list-all-item-${value}-label`;

                return (
                <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                    <ListItemIcon>
                    <Checkbox
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                    />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${value}`} />
                </ListItem>
                );
            })}
            <ListItem />
            </List>
        </Card>
    );
    

    return (
        <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
            {customList('Colunas escolhidas', list) }
        </Grid>
    )

};


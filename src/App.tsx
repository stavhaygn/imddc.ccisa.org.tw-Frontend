import { Fragment, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import logo from './logo.svg';
import './App.css';
import schema from './schema.json';
import uischema from './uischema.json';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  container: {
    padding: '1em',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    padding: '0.25em',
  },
  dataContent: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '0.25em',
    backgroundColor: '#cecece',
    marginBottom: '1rem',
  },
  resetButton: {
    margin: 'auto !important',
    display: 'block !important',
  },
  submitButton: {
    margin: 'auto !important',
    padding: '6px 56px !important',
    display: 'block !important',
  },
  demoform: {
    margin: 'auto',
    padding: '1rem',
  },
  result: {
    marginTop: '2rem',
    textAlign: 'center',
    padding: '0.25em',
  },
});

const initialData = {
  name: '',
  mail: '',
  phone: '',
  company: '',
};

const renderers = [
  ...materialRenderers,
  //register custom renderers
];

const App = () => {
  const classes = useStyles();
  const [data, setData] = useState<any>(initialData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitData = async () => {
    const settings = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(`/api/participant`, settings);
      const _ = await response.json();
      setIsSubmitted(true);
    } catch (e) {
      return e;
    }
  };

  return (
    <Fragment>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>揭密物聯網設備及App行動裝置安全檢測</h1>
          <span className='App-organizer'>主辦單位：經濟部工業局</span>
          <br />
          <span className='App-implementer'>
            執行單位：工業技術研究院、財團法人資訊工業策進會、中華民國資訊安全學會
          </span>
        </header>
      </div>

      <Grid
        container
        justifyContent={'center'}
        spacing={1}
        className={classes.container}
      >
        <Grid item sm={4}>
          <Typography variant={'h4'} className={classes.title}>
            報名表單
          </Typography>
          {isSubmitted ? (
            <Typography className={classes.result}>報名資料已送出</Typography>
          ) : (
            <>
              <div className={classes.demoform}>
                <JsonForms
                  schema={schema}
                  uischema={uischema}
                  data={data}
                  renderers={renderers}
                  cells={materialCells}
                  onChange={({ errors, data }) => setData(data)}
                />
              </div>
              <Button
                className={classes.submitButton}
                onClick={submitData}
                color='primary'
                variant='contained'
              >
                送出
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default App;

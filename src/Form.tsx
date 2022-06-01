import { useState, useEffect, ReactNode } from 'react';
import { JsonForms } from '@jsonforms/react';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ClassNameMap, makeStyles } from '@mui/styles';
import schema from './schema.json';
import uischema from './uischema.json';

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
  form: {
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

type Props = {
  classes: ClassNameMap;
  children?: ReactNode;
};

const GridForm = ({ classes, children }: Props) => (
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
      {children}
    </Grid>
  </Grid>
);

const Form = () => {
  const classes = useStyles();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<any>(initialData);
  const [isSubmitted, setSubmitted] = useState(false);
  const [messageOfSubmission, setMessageOfSubmission] = useState('');
  const [isAvailable, setAvailable] = useState(true);
  const [messageOfUnavailable, setMessageOfUnavailable] = useState('');

  const submitData = async () => {
    const settings = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch('/api/participant', settings);
      const { status, message } = await response.json();
      if (status === 'error') setMessageOfSubmission(message);
      else setMessageOfSubmission('報名成功，資料已送出！');
    } catch (e) {
      setMessageOfSubmission('網頁伺服器連線錯誤，報名資料送出失敗');
    } finally {
      setSubmitted(true);
    }
  };

  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        const response = await fetch('/api/participant/available');
        const { status, message } = await response.json();
        if (status === 'error') {
          setAvailable(false);
          setMessageOfUnavailable(message);
        }
      } catch (e) {
        setAvailable(false);
        setMessageOfUnavailable('無法與網頁伺服器連線');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailable();
  }, []);

  if (isLoading) {
    return <GridForm classes={classes} />;
  }

  return (
    <GridForm classes={classes}>
      {isAvailable ? (
        isSubmitted ? (
          <Typography className={classes.result}>
            {messageOfSubmission}
          </Typography>
        ) : (
          <>
            <div className={classes.form}>
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
        )
      ) : (
        <Typography className={classes.result}>
          {messageOfUnavailable}
        </Typography>
      )}
    </GridForm>
  );
};

export default Form;

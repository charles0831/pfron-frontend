import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(7)
  },

  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(12),
  },
  
  rememberMe: {
    marginTop: '30px',
    '& .MuiTypography-body1': {
      color: theme.palette.gray,
    },
    '& .MuiCheckbox-colorSecondary.Mui-checked' : {
      color: theme.palette.color
    },
  },
  buttonContainer: {
    marginTop: theme.spacing(20),
  },
  input_box_label: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    fontSize: '0.9375em',
  },
  input_box: {
    '& svg': {
			fill: theme.palette.text.secondary
		},
			color: theme.palette.text.primary,
    backgroundColor: theme.palette.black_white,
			border: `1px solid ${theme.palette.text.primary}`,
    padding: '10px 20px',
    width: '360px',
  },
  error_log: {
    color: 'red',
    fontFamily: 'roboto'
  },
  btnLogin: {
    '& .MuiButton-label': {
      textTransform: 'none',
      fontSize: '1.0625em',
    },
    '&:hover': {
      backgroundColor: theme.palette.green
    },
    padding: '4px',
    borderRadius: '0px',
    fontWeight: '300',
    backgroundColor: theme.palette.green,
    color: theme.palette.black_white,
    width: '100%'
  },
  
  progressContainer: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  progress: {
    color: theme.palette.pink
  }
}));

export default useStyles;

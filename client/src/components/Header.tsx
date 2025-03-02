import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
});

export default function Header() {
  const { i18n, t } = useTranslation();
  const classes = useStyles();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <div>
          <Button color="inherit" onClick={() => changeLanguage('en')}>
            en
          </Button>
          <Button color="inherit" onClick={() => changeLanguage('fi')}>
            fi
          </Button>
        </div>
        <Typography variant="h6" className={classes.title}>
          {t('header')}
        </Typography>
        <nav>
          <RouterLink to="/" className={classes.link}>
            <Button color="inherit">{t('home')}</Button>
          </RouterLink>
          <RouterLink to="/board" className={classes.link}>
            <Button color="inherit">{t('board')}</Button>
          </RouterLink>
          <RouterLink to="/login" className={classes.link}>
            <Button color="inherit">{t('login')}</Button>
          </RouterLink>
        </nav>
      </Toolbar>
    </AppBar>
  );
}
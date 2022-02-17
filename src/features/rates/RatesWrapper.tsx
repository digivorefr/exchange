import * as React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { useAppDispatch } from '../../app/hooks';
import { refreshRates } from './ratesSlice';

const propTypes = {
  children: PropTypes.element.isRequired
}

const REFRESH_RATE = 10000;



export default function RatesWrapper(props: InferProps<typeof propTypes>): JSX.Element {
  const { children } = props;

  const dispatch = useAppDispatch();
  const [periodicalFetch, setPeriodicalFetch] = React.useState<number>();


  React.useEffect(() => {
    if (periodicalFetch === undefined) {
      dispatch(refreshRates());
      setPeriodicalFetch(window.setInterval(() => {
        dispatch(refreshRates())
      }, REFRESH_RATE))
    }

    return () => {
      window.clearInterval(periodicalFetch)
    }
  }, [dispatch, periodicalFetch]);

  return (
    <>
      {children}
    </>
  )
}
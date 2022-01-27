import { useEffect, useState } from 'react';
import { interval, Subject, fromEvent } from "rxjs";
import { takeUntil, debounceTime, buffer, map, filter } from "rxjs/operators";
import './App.scss';

function App() {
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const count$ = new Subject();
    const timer = interval(1000);
    timer.pipe(takeUntil(count$)).subscribe(() => {
      if (start) {
        setTime(prevTime => prevTime + 1000);
      }
    });

    return () => {
      count$.next();
      count$.complete();
      count$.unsubscribe();
    }
  }, [start]);

  const start_stop = () => {
    (start) ? setStart(false) || setTime(0) : setStart(true)
  }

  const waitFunc = () => {
    const mouse$ = fromEvent(document.getElementById('wait'), 'click');
    const buffer$ = mouse$.pipe(debounceTime(300));
    const click$ = mouse$.pipe(
      buffer(buffer$),
      map((list) => list.length),
      filter((item) => item >= 2)
    );
    click$.subscribe(() => {
      setStart(false);
    });
  };

  const reset = () => {
    setTime(0) && setStart(true)
  }

  const timerView = () => {
    return ('0' + Math.floor(time / 3600000)).slice(-2) + ':' +
      ('0' + Math.floor(time / 60000) % 60).slice(-2) + ':' +
      ('0' + (time / 1000) % 60).slice(-2)
  };

  return (<>
    <h1>TIMER</h1>
    <div className="App">
      <p>{timerView()}</p>
      <button onClick={start_stop}>{(start) ? 'Stop' : 'Start'}</button>
      <button id='wait' onClick={waitFunc}>Wait</button>
      <button onClick={reset}>Reset</button>
    </div>
  </>
  );
};

export default App;

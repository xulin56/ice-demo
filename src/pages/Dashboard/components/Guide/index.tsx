import * as React from 'react';
import { Button } from '@alifd/next';
import styles from './index.module.scss';
import { history } from 'ice';

const Guide = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to icejs!</h2>

      <p className={styles.description}>This is a awesome project, enjoy it!</p>

      <div className={styles.action}>
        <a
          href="https://ice.work/docs/guide/about"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginRight: 20,
          }}
        >
          <Button type="primary" size="large">
            使用文档
          </Button>
        </a>
        <a
          href="https://github.com/ice-lab/icejs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button type="secondary" size="large">
            GitHub
          </Button>
        </a>
        <Button type="secondary" size="large" onClick={()=>history.push('/login',{id:1,type:'view'})}>
            去登陆
          </Button>
      </div>
    </div>
  );
};

export default Guide;

import React from 'react';
import { ResponsiveGrid } from '@alifd/next';

import styles from './index.module.scss';

const { Cell } = ResponsiveGrid;
const NotFound = () => {
    return (
      <ResponsiveGrid gap={20}>
        <Cell colSpan={12}>
          404
        </Cell>
      </ResponsiveGrid>
    );
  };
  
  export default NotFound;
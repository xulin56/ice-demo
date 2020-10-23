import React, { useState, useEffect } from 'react';
import { Input, Message, Form, Divider, Checkbox, List, Button } from '@alifd/next';
import { store as globalStore } from 'ice';
import { store as pageStore } from 'ice/Login';
import { useRequest, history, logger } from 'ice';
import API from '@/utils/request';
import Other from './components/Other';

import Register from './components/Register';

import { useInterval } from './utils';
import styles from './index.module.scss';
import { config } from 'ice';

const { Item } = Form;
console.log('APP_MODE',config)
export interface IDataSource {
  name: string;
  password: string;
  autoLogin: boolean;
  phone: string;
  code: string;
}

const DEFAULT_DATA: IDataSource = {
  name: '',
  password: '',
  autoLogin: true,
  phone: '',
  code: '',
};

interface LoginProps {
  dataSource?: IDataSource
}

const LoginBlock: React.FunctionComponent<LoginProps> = (props: LoginProps) => {
  const [userInfo, userDispatchers] = globalStore.useModel('user');
  const [taskList, taskDispach] = pageStore.useModel('tasks');
  const { data, loading, error, request } = useRequest({
    url: '/join/ajax/getOrganizationInfoList.do',
    method: 'GET',
    data: {id:11}
  });
  useEffect(()=>{
    logger.info('logger')
    request();
    // API('/join/ajax/getOrganizationInfoList.do','GET',{id:2})
    userDispatchers.getUserInfo();
  },[])
  const { dataSource = DEFAULT_DATA } = props;

  const [postData, setValue] = useState(dataSource);

  const [isRunning, checkRunning] = useState(false);
  const [isPhone, checkPhone] = useState(false);
  const [second, setSecond] = useState(59);

  useInterval(
    () => {
      setSecond(second - 1);
      if (second <= 0) {
        checkRunning(false);
        setSecond(59);
      }
    },
    isRunning ? 1000 : null
  );

  const formChange = (values: IDataSource) => {
    setValue(values);
  };

  const sendCode = (values: IDataSource, errors: []) => {
    if (errors) {
      return;
    }
    // get values.phone
    checkRunning(true);
  };
  
  const handleSubmit = (values: IDataSource, errors: []) => {
    console.log(history.location.state)
    if (errors) {
      console.log('errors', errors);
      return;
    }
    console.log('values:', values);
    Message.success('登录成功');
  };
  const handleface = (values: IDataSource, errors: []) => {
    window.__changeTheme__('@alifd/theme-ice-orange');
  };
  const phoneForm = (
    <>
      <Item format="tel" required requiredMessage="必填" asterisk={false}>
        <Input
          name="phone"
          innerBefore={
            <span className={styles.innerBeforeInput}>
              +86
              <span className={styles.line} />
            </span>
          }
          maxLength={20}
          placeholder="手机号"
        />
      </Item>
      <Item required requiredMessage="必填" style={{ marginBottom: 0 }}>
        <Input
          name="code"
          innerAfter={
            <span className={styles.innerAfterInput}>
              <span className={styles.line} />
              <Form.Submit
                text
                type="primary"
                style={{ width: 64 }}
                disabled={!!isRunning}
                validate={['phone']}
                onClick={sendCode}
                className={styles.sendCode}
              >
                {isRunning ? `${second}秒后再试` : '获取验证码'}
              </Form.Submit>
            </span>
          }
          maxLength={20}
          placeholder="验证码"
        />
      </Item>
    </>
  );

  const accountForm = (
    <>
      <Item required requiredMessage="必填">
        <Input name="name" maxLength={20} placeholder="用户名" />
      </Item>
      <Item required requiredMessage="必填" style={{ marginBottom: 0 }}>
        <Input.Password
          name="password"
          htmlType="password"
          placeholder="密码"
        />
      </Item>
    </>
  );

  const byAccount = () => {
    checkPhone(false);
  };

  const byForm = () => {
    checkPhone(true);
  };

  return (
    <div className={styles.LoginBlock}>
      <div className={styles.innerBlock}>
        <a href="#">
          <img
            className={styles.logo}
            src="https://img.alicdn.com/tfs/TB1KtN6mKH2gK0jSZJnXXaT1FXa-1014-200.png"
            alt="logo"
          />
        </a>
        <div className={styles.desc}>
          <span
            onClick={byAccount}
            className={isPhone ? undefined : styles.active}
          >
            账户密码登录
          </span>
          <Divider direction="ver" />
          <span
            onClick={byForm}
            className={isPhone ? styles.active : undefined}
          >
            手机号登录
          </span>
        </div>

        <Form value={postData} onChange={formChange} size="large">
          {isPhone ? phoneForm : accountForm}

          <div className={styles.infoLine}>
            <Item style={{ marginBottom: 0 }}>
              <Checkbox name="autoLogin" className={styles.infoLeft}>
                自动登录
              </Checkbox>
            </Item>

            <div>
              <a href="/" className={styles.link}>
                忘记密码
              </a>
            </div>
          </div>

          <Item style={{ marginBottom: 10 }}>
            <Form.Submit
              type="primary"
              onClick={handleSubmit}
              className={styles.submitBtn}
              validate
            >
              立即登录{userInfo.userid}
            </Form.Submit>
          </Item>
          <Item style={{ marginBottom: 10 }}>
            <Form.Submit
              type="primary"
              onClick={handleface}
              className={styles.submitBtn}
              validate
            >
              切换皮肤
            </Form.Submit>
          </Item>
        </Form>
        <div className={styles.infoLine}>
          <Other />
          
          <Register />
        </div>
      </div>
      <div>
          <List>
            {taskList.map(({ title, description }, index) => (
              <List.Item key={index} extra={<Button text type="primary" onClick={() => handleRemoveTask(index)}>删除任务</Button>} title={title}>
                <p>{description}</p>
              </List.Item>
            ))}
          </List>
          </div>
          <Button text type="primary" onClick={() => history.goBack()}>返回上一页</Button>
    </div>
  );
};

export default LoginBlock;

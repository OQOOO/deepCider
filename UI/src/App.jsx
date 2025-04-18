import React, { useState } from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Box from '@mui/material/Box';
import { UserOutlined, CalculatorOutlined, GatewayOutlined, BulbOutlined, NodeIndexOutlined  
} from '@ant-design/icons';

import ValidateLogic from './pages/ValidateLogic.jsx'
import Dashboard from './pages/Dashboard.jsx';
import OCR from './pages/OCR.jsx';
import ObjectDetection from './pages/ObjectDetection.jsx';
import DateCalculator from './pages/DateCalculator.jsx';
import logo from './assets/react.svg'
import { Login } from '@mui/icons-material';
import LoginPage from './pages/LoginPage.jsx';

const componentsMap = {
  "dashboard": <Dashboard></Dashboard>,
  "validateLogic": <ValidateLogic/>,
  "OCR": <OCR></OCR>,
  "objectDetection": <ObjectDetection></ObjectDetection>,
  "dateCalculator": <DateCalculator></DateCalculator>,
  "loginPage": <LoginPage></LoginPage>
}



const { Header, Content, Sider } = Layout;
const items1 = [
  {
    key: '1', // 첫 번째 항목의 key
    icon: React.createElement(GatewayOutlined),
    label: 'Tools', // 첫 번째 서브 메뉴 이름
  },
  {
    key: '2', // 두 번째 항목의 key
    icon: React.createElement(NodeIndexOutlined),
    label: '로그인',
  }
];

const pageMenuItems = [
  {
    key: 'sub1', // 첫 번째 항목의 key
    icon: React.createElement(UserOutlined),
    label: '소개', // 첫 번째 서브 메뉴 이름
    children: [
      { key: 'dashboard', label: 'dashboard' }, // 첫 번째 서브 메뉴의 첫 번째 항목
    ]
  },
  {
    key: 'sub2', // 두 번째 항목의 key
    icon: React.createElement(BulbOutlined ),
    label: 'AI 도구',
    children: [
      { key: 'validateLogic', label: '논리적 오류 찾기' },
      { key: 'OCR', label: '글자 추출' },
      { key: 'objectDetection', label: '물체 탐지' },
    ]
  },
  {
    key: 'sub3',
    icon: React.createElement(CalculatorOutlined ),
    label: '일반 도구',
    children: [
      { key: 'dateCalculator', label: '날짜 계산기' },
      { key: 'tempEmail', label: '임시 이메일' },
    ]
  },
  {
    key: 'loginPage', // 두 번째 항목의 key
    icon: React.createElement(NodeIndexOutlined),
    label: '로그인',
  }
];

const App = () => {

  const [selectedComponentKey, setSelectedComponentKey] = useState("dashboard");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between', // 좌우 정렬
        }}
      >
        <div className="demo-logo">
          <Box sx={{ color: 'white', width: 170 }}>
            <h2>deepCider</h2>
          </Box>
        </div>
        {/* 일반 메뉴 */}
        <Menu
          theme="dark"
          mode="horizontal"
          onClick={(e) => setSelectedComponentKey(e.key)}
          items={pageMenuItems.filter(item => item.key !== 'loginPage')} // '로그인' 메뉴 제외
          selectedKeys={[selectedComponentKey]} // 선택된 메뉴 동기화
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
        {/* 로그인 메뉴 */}
        <Menu
          theme="dark"
          mode="horizontal"
          onClick={(e) => setSelectedComponentKey(e.key)}
          items={pageMenuItems.filter(item => item.key === 'loginPage')} // '로그인' 메뉴만 포함
          selectedKeys={[selectedComponentKey]} // 선택된 메뉴 동기화
          style={{
            flex: 0,
          }}
        />
      </Header>
      <Layout>
        {/* <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            onClick={(e) => setSelectedComponentKey(e.key)}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={pageMenuItems.map((item) => item.key)}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={pageMenuItems}
          />
        </Sider> */}
        <Layout
          style={{
            padding: '0 2px 0px',
            backgroundColor: '#919191',
            
          }}
        >
          <Breadcrumb
            // items={[
            //   {
            //     title: 'deepCider',
            //   },
            //   {
            //     title: 'List',
            //   },
            //   {
            //     title: selectedComponentKey,
            //   },
            // ]}
            style={{
              margin: '0px 0',
            }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: '100vh',
              background: colorBgContainer,
            }}
          >
            {
              componentsMap[selectedComponentKey]
            }
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default App;
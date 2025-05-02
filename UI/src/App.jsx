import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
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
import AdminPage from './pages/AdminPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import { jwtDecode } from 'jwt-decode';

function Home() {
  const [selectedComponentKey, setSelectedComponentKey] = useState("validateLogic");
  const componentsMap = {
    "dashboard": <Dashboard></Dashboard>,
    "validateLogic": <ValidateLogic/>,
    "OCR": <OCR></OCR>,
    "objectDetection": <ObjectDetection></ObjectDetection>,
    "dateCalculator": <DateCalculator></DateCalculator>,
    "loginPage": <LoginPage setPage={setSelectedComponentKey}/>,
    "signupPage": <SignUpPage setPage={setSelectedComponentKey}/>,
    "adminPage": <AdminPage/>,
  }

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_CORE_SERVER_URL;

    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const exp = decoded.exp * 1000; // 초 → ms
    const now = Date.now();
    const timeout = exp - now;

    if (timeout <= 0) {
      logout(); // 이미 만료
    } else {
      const timer = setTimeout(() => {
        logout(); // 만료되면 자동 로그아웃
      }, timeout);

      return () => clearTimeout(timer); // 토큰 변경 시 타이머 해제
    }
  }, []);
  
  const logout = () => {
    localStorage.removeItem("token"); // 토큰 제거
    localStorage.removeItem("role"); // 사용자 역할 제거
    window.location.reload(); // 페이지 새로고침
  }
  
  
  const { Header, Content, Sider } = Layout;
  
  const toolNavItems = [
    // {
    //   key: 'sub1', // 첫 번째 항목의 key
    //   icon: React.createElement(UserOutlined),
    //   label: '소개', // 첫 번째 서브 메뉴 이름
    //   children: [
    //     { key: 'dashboard', label: 'dashboard' }, // 첫 번째 서브 메뉴의 첫 번째 항목
    //   ]
    // },
    // {
    //   key: 'sub2', // 두 번째 항목의 key
    //   icon: React.createElement(BulbOutlined ),
    //   label: 'AI 도구',
    //   children: [
    //     { key: 'validateLogic', label: '논리적 오류 찾기' },
    //     { key: 'OCR', label: '글자 추출' },
    //     { key: 'objectDetection', label: '물체 탐지' },
    //   ]
    // },
    // {
    //   key: 'sub3',
    //   icon: React.createElement(CalculatorOutlined ),
    //   label: '일반 도구',
    //   children: [
    //     { key: 'dateCalculator', label: '날짜 계산기' },
    //     { key: 'tempEmail', label: '임시 이메일' },
    //   ]
    // },
    {
      icon: React.createElement(NodeIndexOutlined),
      label: '논리적 오류 찾기',
      key: 'validateLogic', // 두 번째 항목의 key
    },
    {
      icon: React.createElement(NodeIndexOutlined),
      label: '글자 추출',
      key: 'OCR', // 두 번째 항목의 key
    },
    {
      icon: React.createElement(NodeIndexOutlined),
      label: '물체 탐지',
      key: 'objectDetection', // 두 번째 항목의 key
    }
  ];

  const role = localStorage.getItem("role");

  const userNavItems = [
    role
      ? {
          key: 'logout', // 로그아웃 버튼
          icon: React.createElement(NodeIndexOutlined),
          label: '로그아웃',
          onClick: () => {
            logout();
          },
        }
      : {
          key: 'loginPage', // 로그인 버튼
          icon: React.createElement(NodeIndexOutlined),
          label: '로그인',
        },
  ];

  const adminNavItems = [
    {
      key: 'adminPage', // 두 번째 항목의 key
      icon: React.createElement(NodeIndexOutlined),
      label: '관리',
    },
  ]

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
          items={toolNavItems.filter(item => item.key)}
          selectedKeys={[selectedComponentKey]}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
        {
          role === "admin" && 
          <Menu
            theme="dark"
            mode="horizontal"
            onClick={(e) => setSelectedComponentKey(e.key)}
            items={adminNavItems.filter(item => item.key)}
            selectedKeys={[selectedComponentKey]}
            style={{
              flex: 0,
            }}
          />
        }
        <Menu
          theme="dark"
          mode="horizontal"
          onClick={(e) => setSelectedComponentKey(e.key)}
          items={userNavItems.filter(item => item.key)}
          selectedKeys={[selectedComponentKey]}
          style={{
            flex: 0,
          }}
        />
        
      </Header>
      <Layout>
        <Layout
          style={{
            padding: '0 2px 0px',
            backgroundColor: '#919191',
            
          }}
        >
          <Breadcrumb

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
}


const App = () => {

  return (
    <div>
      {/* <Home /> */}

      {/* <nav>
        <Link to="/">홈</Link>
      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
  
};
export default App;
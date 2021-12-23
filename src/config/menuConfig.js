import {
  HomeOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ToolOutlined,
  UserOutlined,
  SafetyOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";

const menuList = [
  {
    title: '首页',
    icon: <HomeOutlined />,
    key: '/home',
    isPublic: true,
  },
  {
    title: '商品',
    icon: <AppstoreOutlined />,
    key: '/products',
    children: [
      {
        title: '品类管理',
        icon: <BarsOutlined />,
        key: '/category',
      },
      {
        title: '商品管理',
        icon: <ToolOutlined />,
        key: '/product',
      }
    ]
  },
  {
    title: '用户管理',
    icon: <UserOutlined />,
    key: '/user',
  },
  {
    title: '角色管理',
    icon: <SafetyOutlined />,
    key: '/role',
  },
  {
    title: '图形图表',
    icon: <AreaChartOutlined />,
    key: '/charts',
    children: [
      {
        title: '柱形图',
        icon: <BarChartOutlined />,
        key: '/charts/bar'
      },
      {
        title: '折线图',
        icon: <LineChartOutlined />,
        key: '/charts/line',
      },
      {
        title: '饼图',
        icon: <PieChartOutlined />,
        key: '/charts/pie'
      }
    ],
  }
];

const defaultSelectedKeys = ['/home'];

export {
  menuList,
  defaultSelectedKeys,
}
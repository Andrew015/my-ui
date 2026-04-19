export type Channel = "idle" | "rent" | "swap" | "give" | "help";
export type IdleCategory =
  | "推荐"
  | "数码"
  | "家居"
  | "服饰"
  | "母婴"
  | "图书"
  | "运动";
export type RentCategory =
  | "推荐"
  | "工具设备"
  | "数码办公"
  | "家电家居"
  | "母婴出行"
  | "户外运动";

export type Item = {
  id: string;
  channel: Channel;
  category?: IdleCategory | RentCategory;
  expectedSwapType?: string;
  imageHeight?: "sm" | "md" | "lg";
  distanceKm?: number;
  publishedAt?: string;
  title: string;
  priceLabel: string;
  location: string;
  owner: string;
  tag: string;
  desc: string;
};

export type HomeEntry = {
  href: string;
  title: string;
  desc: string;
  accent: string;
};

export const homeEntries: HomeEntry[] = [
  {
    href: "/idle",
    title: "淘闲置",
    desc: "附近好物，轻松淘",
    accent: "from-[#F97316] to-[#ea580c]",
  },
  {
    href: "/rent",
    title: "短租用",
    desc: "短期借用，不必囤货",
    accent: "from-[#FACC15] to-[#FDBA74]",
  },
  {
    href: "/swap",
    title: "来置换",
    desc: "以物换物，各取所需",
    accent: "from-[#FDBA74] to-[#F97316]",
  },
  {
    href: "/community",
    title: "邻里公益",
    desc: "免费赠送、互助服务",
    accent: "from-[#fdba74] to-[#92400E]",
  },
];

export const idleCategories: IdleCategory[] = [
  "推荐",
  "数码",
  "家居",
  "服饰",
  "母婴",
  "图书",
  "运动",
];

export const rentCategories: RentCategory[] = [
  "推荐",
  "工具设备",
  "数码办公",
  "家电家居",
  "母婴出行",
  "户外运动",
];

export const items: Item[] = [
  {
    id: "idle-chair-001",
    channel: "idle",
    category: "家居",
    distanceKm: 1.2,
    publishedAt: "2026-04-08T11:20:00.000Z",
    title: "原木折叠椅",
    priceLabel: "￥68",
    location: "华景社区",
    owner: "李阿姨",
    tag: "九成新",
    desc: "阳台闲置，轻微使用痕迹，现场自提。",
  },
  {
    id: "idle-printer-002",
    channel: "idle",
    category: "数码",
    distanceKm: 3.8,
    publishedAt: "2026-04-04T09:10:00.000Z",
    title: "家用喷墨打印机",
    priceLabel: "￥120",
    location: "锦绣里",
    owner: "小周",
    tag: "可验机",
    desc: "功能正常，附带半盒彩色墨盒。",
  },
  {
    id: "idle-jacket-003",
    channel: "idle",
    category: "服饰",
    distanceKm: 0.9,
    publishedAt: "2026-04-09T03:45:00.000Z",
    title: "春秋轻薄夹克",
    priceLabel: "￥89",
    location: "云汐苑",
    owner: "阿周",
    tag: "八五新",
    desc: "尺码 L，通勤百搭，保存良好。",
  },
  {
    id: "idle-stroller-004",
    channel: "idle",
    category: "母婴",
    distanceKm: 2.4,
    publishedAt: "2026-04-07T18:00:00.000Z",
    title: "婴儿折叠推车",
    priceLabel: "￥220",
    location: "金湖里",
    owner: "米米妈",
    tag: "可小刀",
    desc: "轻便款，收纳方便，适合周边出行。",
  },
  {
    id: "idle-books-005",
    channel: "idle",
    category: "图书",
    distanceKm: 4.3,
    publishedAt: "2026-04-01T08:30:00.000Z",
    title: "文学小说 10 本打包",
    priceLabel: "￥45",
    location: "南城里",
    owner: "陈同学",
    tag: "成套出",
    desc: "正版书，书页整洁，适合周末阅读。",
  },
  {
    id: "idle-racket-006",
    channel: "idle",
    category: "运动",
    distanceKm: 1.7,
    publishedAt: "2026-04-06T13:15:00.000Z",
    title: "羽毛球拍双拍",
    priceLabel: "￥76",
    location: "枫林社区",
    owner: "老郑",
    tag: "含拍套",
    desc: "周末运动闲置，拍线状态不错。",
  },
  {
    id: "rent-drill-101",
    channel: "rent",
    category: "工具设备",
    distanceKm: 2.8,
    publishedAt: "2026-04-09T10:30:00.000Z",
    title: "冲击钻短租",
    priceLabel: "￥18/天",
    location: "云栖苑",
    owner: "王师傅",
    tag: "押金100",
    desc: "家装临时使用，支持按天结算。",
  },
  {
    id: "rent-projector-102",
    channel: "rent",
    category: "数码办公",
    distanceKm: 1.1,
    publishedAt: "2026-04-08T17:20:00.000Z",
    title: "便携投影仪",
    priceLabel: "￥36/天",
    location: "荷风里",
    owner: "阿宁",
    tag: "周末可约",
    desc: "适合聚会观影，附 HDMI 线。",
  },
  {
    id: "rent-stroller-103",
    channel: "rent",
    category: "母婴出行",
    distanceKm: 3.2,
    publishedAt: "2026-04-05T09:00:00.000Z",
    title: "婴儿推车日租",
    priceLabel: "￥22/天",
    location: "晴川里",
    owner: "西西妈",
    tag: "押金80",
    desc: "临时出游可租，车况好，支持当面交接。",
  },
  {
    id: "rent-camp-104",
    channel: "rent",
    category: "户外运动",
    distanceKm: 4.6,
    publishedAt: "2026-04-03T13:40:00.000Z",
    title: "露营天幕套装",
    priceLabel: "￥45/天",
    location: "金桥社区",
    owner: "阿森",
    tag: "含地钉",
    desc: "周末露营常用装备，适合 3-5 人活动。",
  },
  {
    id: "swap-book-201",
    channel: "swap",
    expectedSwapType: "摄影器材",
    imageHeight: "md",
    distanceKm: 1.6,
    publishedAt: "2026-04-09T08:10:00.000Z",
    title: "编程书换摄影书",
    priceLabel: "置换",
    location: "溪南社区",
    owner: "老顾",
    tag: "同城换",
    desc: "希望交换内容相近的摄影入门书。",
  },
  {
    id: "swap-baby-202",
    channel: "swap",
    expectedSwapType: "滑板车",
    imageHeight: "lg",
    distanceKm: 2.7,
    publishedAt: "2026-04-08T15:30:00.000Z",
    title: "儿童平衡车换滑板车",
    priceLabel: "置换",
    location: "四季花园",
    owner: "萌萌妈",
    tag: "面交",
    desc: "车况良好，想换同龄段滑板车。",
  },
  {
    id: "swap-headset-203",
    channel: "swap",
    expectedSwapType: "键盘或鼠标",
    imageHeight: "sm",
    distanceKm: 0.8,
    publishedAt: "2026-04-09T12:40:00.000Z",
    title: "蓝牙耳机求置换办公外设",
    priceLabel: "置换",
    location: "青禾里",
    owner: "小麦",
    tag: "九新",
    desc: "耳机功能正常，电池健康，希望换办公外设。",
  },
  {
    id: "swap-coffee-204",
    channel: "swap",
    expectedSwapType: "桌面收纳或台灯",
    imageHeight: "md",
    distanceKm: 3.4,
    publishedAt: "2026-04-07T10:50:00.000Z",
    title: "手冲咖啡套装想换桌面好物",
    priceLabel: "置换",
    location: "澜庭社区",
    owner: "阿喜",
    tag: "成套换",
    desc: "磨豆机+滤杯+壶，想换实用桌面用品。",
  },
  {
    id: "give-pot-301",
    channel: "give",
    title: "赠送绿植花盆一套",
    priceLabel: "免费",
    location: "长虹里",
    owner: "陈叔",
    tag: "先到先得",
    desc: "搬家清理，适合阳台种植。",
  },
  {
    id: "give-toy-302",
    channel: "give",
    title: "闲置儿童拼图",
    priceLabel: "免费",
    location: "嘉悦城",
    owner: "小鹿",
    tag: "适龄3+",
    desc: "拼图块完整，外盒有轻微磨损。",
  },
  {
    id: "help-repair-401",
    channel: "help",
    title: "家电小修互助",
    priceLabel: "互助",
    location: "江畔里",
    owner: "老林",
    tag: "周三晚",
    desc: "可协助排查小家电故障，互帮互助。",
  },
  {
    id: "help-pet-402",
    channel: "help",
    title: "节假日遛狗互助",
    priceLabel: "互助",
    location: "春和苑",
    owner: "阿凯",
    tag: "同小区优先",
    desc: "节假日可相互照看宠物。",
  },
];

export const publishTypes = [
  { key: "sell", title: "出售", desc: "发布闲置商品售卖信息", href: "/publish?type=sell" },
  { key: "rent", title: "租赁", desc: "发布短租借用信息", href: "/publish?type=rent" },
  { key: "swap", title: "置换", desc: "发布互换需求", href: "/publish?type=swap" },
  { key: "community", title: "公益", desc: "发布赠送或互助信息", href: "/publish?type=community" },
] as const;

export const channelMap: Record<Channel, string> = {
  idle: "淘闲置",
  rent: "短租用",
  swap: "来置换",
  give: "免费赠送",
  help: "互助服务",
};

export function getItemsByChannel(channel: Channel) {
  return items.filter((item) => item.channel === channel);
}

export function getItemById(id: string) {
  return items.find((item) => item.id === id);
}

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
  /** 价格（元），与 priceLabel 对应，便于排序与统计 */
  price?: number;
  /** 封面图 URL，空则列表使用渐变占位 */
  image?: string;
  /** 列表图占位色阶 0–5，无 image 时参与渐变 */
  imageTint?: number;
  /** 详情页多标签（成色、服务等） */
  detailTags?: string[];
  /** 卖家信用文案 */
  sellerCredit?: string;
  /** 详情长文案，缺省用 desc */
  detailDesc?: string;
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
    imageTint: 0,
    distanceKm: 1.2,
    publishedAt: "2026-04-08T11:20:00.000Z",
    title: "原木折叠椅",
    price: 68,
    priceLabel: "￥68",
    location: "华景社区",
    owner: "李阿姨",
    tag: "九成新",
    detailTags: ["九成新", "支持面交", "先看后买"],
    sellerCredit: "信用良好 · 极速回复",
    desc: "阳台闲置，轻微使用痕迹，现场自提。",
    detailDesc:
      "长期在阳台收纳，木纹清晰无明显磕碰，折叠顺滑。适合小户型加餐位或书房角落使用。\n\n转让原因：换了更大的餐桌椅组合。建议买家上门先看实物，满意再成交。支持华景社区南门当面验货与自提，工作日晚上或周末全天可约。",
  },
  {
    id: "idle-printer-002",
    channel: "idle",
    category: "数码",
    imageTint: 1,
    distanceKm: 3.8,
    publishedAt: "2026-04-04T09:10:00.000Z",
    title: "家用喷墨打印机",
    price: 120,
    priceLabel: "￥120",
    location: "锦绣里",
    owner: "小周",
    tag: "可验机",
    detailTags: ["可验机", "95新", "当面交易"],
    sellerCredit: "信用优秀 · 实名认证",
    desc: "功能正常，附带半盒彩色墨盒。",
    detailDesc:
      "家用喷墨一体机，打印、扫描、复印均可正常使用。喷头状态良好，最近一次打印测试无断线。\n\n随机附带：电源线、USB 线、半盒原装彩色墨盒（剩余量约 40%）。因升级激光打印机闲置转让。\n\n欢迎当面开机演示，锦绣里小区内可送货上门楼下交接。",
  },
  {
    id: "idle-jacket-003",
    channel: "idle",
    category: "服饰",
    imageTint: 2,
    distanceKm: 0.9,
    publishedAt: "2026-04-09T03:45:00.000Z",
    title: "春秋轻薄夹克",
    price: 89,
    priceLabel: "￥89",
    location: "云汐苑",
    owner: "阿周",
    tag: "八五新",
    detailTags: ["八五新", "L 码", "无污渍"],
    sellerCredit: "信用良好",
    desc: "尺码 L，通勤百搭，保存良好。",
    detailDesc:
      "通勤款轻薄夹克，适合春秋换季。面料挺括不易皱，袖口、领口磨损轻微，整体成色约八五新。\n\n尺码 L，平铺肩宽约 44cm，衣长约 68cm（手工测量仅供参考）。颜色为深灰蓝，百搭不挑场合。\n\n支持云汐苑小区内自提，如需简单熨烫后再取可提前说一声。",
  },
  {
    id: "idle-stroller-004",
    channel: "idle",
    category: "母婴",
    imageTint: 3,
    distanceKm: 2.4,
    publishedAt: "2026-04-07T18:00:00.000Z",
    title: "婴儿折叠推车",
    price: 220,
    priceLabel: "￥220",
    location: "金湖里",
    owner: "米米妈",
    tag: "可小刀",
    detailTags: ["可小刀", "可验车", "支持面交"],
    sellerCredit: "信用良好 · 母婴认证",
    desc: "轻便款，收纳方便，适合周边出行。",
    detailDesc:
      "轻便折叠款婴儿推车，一键收合，后备箱可放。轮子转向灵活，刹车有效，护栏与安全带齐全。\n\n宝宝长大后换高景观车故转让。坐垫可拆洗，已做基础清洁。如需看收合演示欢迎当面验车。\n\n价格可小幅议价，优先金湖里及附近小区当面交易。",
  },
  {
    id: "idle-books-005",
    channel: "idle",
    category: "图书",
    imageTint: 4,
    distanceKm: 4.3,
    publishedAt: "2026-04-01T08:30:00.000Z",
    title: "文学小说 10 本打包",
    price: 45,
    priceLabel: "￥45",
    location: "南城里",
    owner: "陈同学",
    tag: "成套出",
    detailTags: ["成套出", "正版", "不单卖"],
    sellerCredit: "信用良好",
    desc: "正版书，书页整洁，适合周末阅读。",
    detailDesc:
      "文学类小说共 10 本随机语系作家作品，均为正版购入，无缺页、无涂鸦，部分有正常翻阅痕迹。\n\n不拆卖、不议价到单本。适合想集中补货书架的邻居。南城里小区门口可当面点交，如需书单可私聊发图。",
  },
  {
    id: "idle-racket-006",
    channel: "idle",
    category: "运动",
    imageTint: 5,
    distanceKm: 1.7,
    publishedAt: "2026-04-06T13:15:00.000Z",
    title: "羽毛球拍双拍",
    price: 76,
    priceLabel: "￥76",
    location: "枫林社区",
    owner: "老郑",
    tag: "含拍套",
    detailTags: ["含拍套", "可试打", "面交优先"],
    sellerCredit: "信用良好",
    desc: "周末运动闲置，拍线状态不错。",
    detailDesc:
      "入门级合金双拍一对，适合家庭娱乐和周末打野球。拍线张力正常，手柄吸汗带近期可更换（如需要我可送一条新的）。\n\n含原装拍套。因换中端拍闲置出。枫林社区球馆门口可当面试打手感，满意再付款。",
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
  { key: "sell", title: "出售闲置", desc: "转卖闲置物品，快速回血", href: "/publish/sell" },
  { key: "rent", title: "出租闲置", desc: "短期出租，物尽其用", href: "/publish/rent" },
  { key: "swap", title: "置换物品", desc: "以物换物，各取所需", href: "/publish/swap" },
  { key: "community", title: "邻里公益", desc: "免费赠送 / 互助服务", href: "/publish/community" },
] as const;

export type PublishCategory = "数码" | "家居" | "服饰" | "母婴" | "图书" | "运动";
export type PublishType = "sell" | "rent" | "swap" | "community-give" | "community-help";
export type SellTag = "95新" | "可验机" | "面交" | "可小刀";
export type RentTag = "可面交" | "可议价";
export type SwapTag = "同城" | "面交";
export type RentTerm = "按天" | "按周" | "按月";

export type PublishedPost = {
  id: string;
  type: PublishType;
  title: string;
  description: string;
  price?: number;
  rent?: number;
  deposit?: number;
  rentTerm?: RentTerm;
  expectedSwap?: string;
  pickupMethod?: "自取" | "联系";
  serviceTime?: string;
  serviceArea?: string;
  contactNote?: string;
  category: PublishCategory;
  tags: string[];
  location: string;
  images: string[];
};

export const publishCategories: PublishCategory[] = [
  "数码",
  "家居",
  "服饰",
  "母婴",
  "图书",
  "运动",
];

export const sellTagOptions: SellTag[] = ["95新", "可验机", "面交", "可小刀"];
export const rentTagOptions: RentTag[] = ["可面交", "可议价"];
export const swapTagOptions: SwapTag[] = ["同城", "面交"];
export const rentTermOptions: RentTerm[] = ["按天", "按周", "按月"];
/** 兼容旧版发布组件命名 */
export type PublishTag = SellTag;
export const publishTagOptions: PublishTag[] = sellTagOptions;

/** 前端模拟：发布成功后写入内存列表（刷新后重置） */
export const publishedMockItems: PublishedPost[] = [];

export function createPublishedMockItem(input: Omit<PublishedPost, "id">): PublishedPost {
  const item: PublishedPost = {
    id: `published-${Date.now()}`,
    ...input,
  };
  publishedMockItems.unshift(item);
  return item;
}

export type PublishedTypeFilter = "all" | "sell" | "rent" | "swap" | "community";
export type PublishedStatus = "active" | "offline" | "done";
export type MyPublishedType = "sell" | "rent" | "swap" | "community";

export type MyPublishedItem = {
  id: string;
  type: MyPublishedType;
  title: string;
  description: string;
  category?: PublishCategory;
  cover?: string;
  price?: number;
  rentPrice?: number;
  deposit?: number;
  rentTerm?: RentTerm;
  exchangeWish?: string;
  communityMode?: "give" | "help";
  tags: string[];
  contactNote?: string;
  serviceTime?: string;
  serviceArea?: string;
  images: string[];
  location: string;
  status: PublishedStatus;
  createdAt: string;
  /** 查看详情时使用，默认与 id 一致 */
  detailId?: string;
};

const myPublishedSeed: MyPublishedItem[] = [
  {
    id: "idle-printer-002",
    type: "sell",
    title: "家用喷墨打印机",
    description: "功能正常，附带半盒彩色墨盒。",
    category: "数码",
    price: 120,
    tags: ["95新", "可验机", "面交"],
    images: ["seed-sell-1", "seed-sell-2"],
    location: "锦绣里 · 距离 3.8km",
    status: "active",
    createdAt: "2026-04-17 14:12",
  },
  {
    id: "rent-drill-101",
    type: "rent",
    title: "冲击钻短租",
    description: "家装临时使用，支持按天结算。",
    category: "家居",
    rentPrice: 18,
    deposit: 100,
    rentTerm: "按天",
    tags: ["可面交", "可议价"],
    images: ["seed-rent-1"],
    location: "云栖苑 · 距离 2.8km",
    status: "active",
    createdAt: "2026-04-15 09:40",
  },
  {
    id: "swap-headset-203",
    type: "swap",
    title: "蓝牙耳机求置换办公外设",
    description: "耳机功能正常，电池健康。",
    category: "数码",
    exchangeWish: "键盘或鼠标",
    tags: ["同城", "面交"],
    images: ["seed-swap-1"],
    location: "青禾里 · 距离 0.8km",
    status: "offline",
    createdAt: "2026-04-14 21:06",
  },
  {
    id: "give-pot-301",
    type: "community",
    title: "赠送绿植花盆一套",
    description: "搬家清理，适合阳台种植。",
    category: "家居",
    communityMode: "give",
    tags: ["自取"],
    images: ["seed-give-1"],
    location: "长虹里 · 距离 2.1km",
    status: "done",
    createdAt: "2026-04-12 10:20",
  },
  {
    id: "help-repair-401",
    type: "community",
    title: "家电小修互助",
    description: "可协助排查小家电故障，互帮互助。",
    communityMode: "help",
    tags: ["互助服务"],
    serviceTime: "周三晚 19:00 后",
    serviceArea: "江畔里及周边小区",
    contactNote: "请先私信说明故障情况",
    images: [],
    location: "江畔里",
    status: "active",
    createdAt: "2026-04-11 18:35",
  },
];

export function getMyPublishedItems(): MyPublishedItem[] {
  return [...myPublishedSeed];
}

export function getPublishedItemById(id: string): MyPublishedItem | undefined {
  return myPublishedSeed.find((item) => item.id === id);
}

export function updatePublishedItem(id: string, patch: Partial<MyPublishedItem>): MyPublishedItem | null {
  const idx = myPublishedSeed.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  myPublishedSeed[idx] = { ...myPublishedSeed[idx], ...patch };
  return myPublishedSeed[idx];
}

export function removePublishedItem(id: string) {
  const idx = myPublishedSeed.findIndex((item) => item.id === id);
  if (idx === -1) return false;
  myPublishedSeed.splice(idx, 1);
  return true;
}

export function mapPublishedItemToFormState(item: MyPublishedItem) {
  return {
    title: item.title,
    description: item.description,
    category: item.category ?? "数码",
    price: item.price ? String(item.price) : "",
    rentPrice: item.rentPrice ? String(item.rentPrice) : "",
    deposit: item.deposit ? String(item.deposit) : "",
    rentTerm: item.rentTerm ?? "按天",
    exchangeWish: item.exchangeWish ?? "",
    communityMode: item.communityMode ?? "give",
    tags: item.tags ?? [],
    location: item.location,
    images: item.images ?? [],
    serviceTime: item.serviceTime ?? "",
    serviceArea: item.serviceArea ?? "",
    contactNote: item.contactNote ?? "",
  };
}

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

/** 用于排序：优先 item.price，否则从 priceLabel 解析 */
export function getItemSortPrice(item: Item) {
  if (item.price != null) return item.price;
  const m = item.priceLabel.match(/\d+(\.\d+)?/);
  return m ? Number(m[0]) : Number.MAX_SAFE_INTEGER;
}

export function getItemDetailTags(item: Item): string[] {
  if (item.detailTags?.length) return item.detailTags;
  return [item.tag];
}

export function getItemDetailBody(item: Item): string {
  return item.detailDesc ?? item.desc;
}


/**输入提示item */
export interface TipItem {
  /**
   *  adcode: "320114"
      address: "软件大道118号"
      city: []
      district: "江苏省南京市雨花台区"
      id: "B00191445M"
      location: "118.767925,31.975215"
      name: "新华汇"
      typecode: "120201"
   */
  /**区域编码 六位区县编码*/
  adcode: string;
  /**详细地址 */
  address: string;
  /**所属区域 省+市+区（直辖市为“市+区”） */
  district?: string;
  id: string;
  /**tip中心点坐标 */
  location: string | Array<string>;
  /**tip名称 */
  name: string;
  /** */
  typecode: string;
}
/**输入提示列表 */
export type TipList = TipItem[]

/**周边item */
export interface AroundItem {
  /**
   *  adcode: "320114"
      address: "西善桥街道龙西路198-23号"
      adname: "雨花台区"
      citycode: "025"
      cityname: "南京市"
      id: "B0FFFLJFUE"
      location: "118.730804,31.955860"
      name: "马大姐酸菜鱼店"
      pcode: "320000"
      pname: "江苏省"
      export type: "餐饮服务;中餐厅;中餐厅"
      typecode: "050100"
   */
  /**poi所属区域编码 */
  adcode: string;
  /**poi详细地址 */
  address: string;
  /**poi所属区县 */
  adname: string;
  /** poi所属城市编码*/
  citycode: string;
  /** poi所属城市*/
  cityname: string;
  id: string;
  /**poi经纬度 */
  location: string;
  /**poi名称 */
  name: string;
  /**poi所属省份编码 */
  pcode: string;
  /**poi所属省份 */
  pname: string; //"浙江省"
  /**poi所属类型 */
  type: string;
  /**poi分类编码 */
  typecode: string

}
/**周边列表 */
export type ArroundList = AroundItem[]

/**逆地理编码结果 */
export interface ReGeoResult {
  /**
   *  adcode: "320114"
      building: {name: [], export type: []}
      businessAreas: [{location: "118.723007,31.957146", name: "西善桥", id: "320114"}]
      city: "南京市"
      citycode: "025"
      country: "中国"
      district: "雨花台区"
      neighborhood: {name: [], export type: []}
      province: "江苏省"
      streetNumber: {number: "196号", location: "118.730047,31.955747", direction: "南", distance: "56.8357", street: "龙西路"}
      towncode: "320114004000"
      township: "西善桥街道"
   */
  /**地址 */
  addressComponent: {
    /** 行政区编码*/
    adcode: string;
    /** 楼信息列表*/
    building: any;
    /** 经纬度所属商圈列表*/
    businessAreas: any;
    /** 坐标点所在城市名称*/
    city: string;
    /**城市编码 */
    citycode: string;
    /**国家 */
    country: string;
    /**坐标点所在区 */
    district: string;
    /**社区信息列表 */
    neighborhood: any;
    /**坐标点所在省名称 */
    province: string;
    /**门牌信息列表 */
    streetNumber: any;
    /**乡镇街道编码 */
    towncode: string;
    /**坐标点所在乡镇/街道（此街道为社区街道，不是道路信息） */
    township: string;
  };
  /**formatted 位置信息 */
  formatted_address: string;
}

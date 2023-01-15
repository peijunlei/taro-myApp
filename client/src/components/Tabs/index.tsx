import { View, Text } from "@tarojs/components";


import './index.scss';

export type TabsProps = {
  activeColor?: string;
  current: string | number;
  options: {
    label: string;
    key: string | number;
  }[];
  onChange: (v: string | number) => void;
}

function Tabs(props: TabsProps) {
  const { options, onChange, current, activeColor = '#4fc08d' } = props;
  return (
    <View className='tabs'>
      <View className='tabs-wrapper'>
        {
          options.map((v, i) => (
            <View
              className='tab-item'
              key={i}
              style={{
                color: v.key === current ? activeColor : '#333'
              }}
              onClick={() => onChange(v.key)}
            >
              <Text>{v.label}</Text>
              <View className='indicator' style={{ width: v.key === current ? '50%' : 0,backgroundColor:activeColor }}></View>
            </View>
          ))
        }
      </View>
    </View>
  );
}

export default Tabs;
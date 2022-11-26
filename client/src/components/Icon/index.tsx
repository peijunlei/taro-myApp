
import { Text } from "@tarojs/components";


interface IconProps {
  type: string;
}

function Icon(props: IconProps) {
  const { type } = props
  return (
    <Text className={`qi-${type}`}></Text>
  );
}

export default Icon;
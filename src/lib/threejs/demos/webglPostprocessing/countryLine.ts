import { useCountryLine } from "./hooks/useCountry";

const { createCountryFlatLine } = useCountryLine();

/**
 *
 * @param data 所有国家边界线数据
 * @param group 装模型的组
 */
export const initBorderLine = (data: [], group: any) => {
  let lineTop = createCountryFlatLine(
    data,
    {
      color: 0xffffff,
      linewidth: 0.0015,
      transparent: true,
      depthTest: false,
    },
    "Line2"
  );

  lineTop.position.z += 0.305;
  lineTop.name="lineTop"
  let lineBottom = createCountryFlatLine(
    data,
    {
      color: 0x61fbfd,
      linewidth: 0.002,
      // transparent: true,
      depthTest: false,
    },
    "Line2"
  );
  lineBottom.position.z -= 0.1905;
  group.add(lineTop,lineBottom)
//   console.log("是啥样的", lineTop);
};

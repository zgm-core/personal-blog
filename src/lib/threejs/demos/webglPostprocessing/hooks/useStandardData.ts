/*
 * @Descripttion: your project
 * @version: 1.0
 * @Author: 冷水泡茶
 * @Date: 2024-02-27 14:50:19
 * @LastEditors: 冷水泡茶
 * @LastEditTime: 2024-02-27 16:03:19
 */
export const useStandardData = () => {
  const transfromGeoJSON = (data: any) => {
    let features = data.features;
    features.forEach((item: any) => {
      if ((item.geometry.type = "Polygon")) {
        item.geometry.coordinates = [item.geometry.coordinates];
      }
    });

    return features;
  };

  return { transfromGeoJSON };
};

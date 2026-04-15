import React from 'react';

const Recommendation = () => {
  const recommendations = [
    {
      title: '30分钟有氧运动',
      description: '提高心肺功能，燃烧卡路里',
      duration: '30分钟',
      intensity: '中等',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=30%20minute%20aerobic%20exercise%20workout%20routine&image_size=landscape_16_9'
    },
    {
      title: '力量训练计划',
      description: '增强肌肉力量，改善身体线条',
      duration: '45分钟',
      intensity: '高强度',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=strength%20training%20workout%20routine&image_size=landscape_16_9'
    },
    {
      title: '瑜伽放松练习',
      description: '提高柔韧性，减轻压力',
      duration: '20分钟',
      intensity: '低强度',
      image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=yoga%20relaxation%20exercise&image_size=landscape_16_9'
    }
  ];

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">推荐运动</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm transition-transform hover:scale-105">
              <img src={item.image} alt={item.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>时长: {item.duration}</span>
                  <span>强度: {item.intensity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
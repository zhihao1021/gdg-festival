export const Gender = {
    "男": "male",
    "女": "female",
    "其他": "other"
};

export type GenderType = typeof Gender[keyof typeof Gender];

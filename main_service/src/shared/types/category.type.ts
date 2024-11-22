export type CreateCategoryType = {
  name: "mobile_phone" | "tablet";
};

export type UpdateCategoryType = Partial<CreateCategoryType>;

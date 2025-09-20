interface Resume {
  _id: string;
  result: string;
  user: {
    _id: string;
    phone: string;
    createdAt: string;
  };
  type: "Comparison" | "Analysis";
  imageResume: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

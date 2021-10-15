export const convertToJson = (input: any): JSON => {
  return JSON.parse(JSON.stringify(input));
};

export const responseApi = (input: JSON) => {
  return { data: { ...input } };
};

export const responseApiArray = (input: JSON) => {
  return { data: input };
};

export const responseApiAuth = (token: string, user: JSON) => {
  return {
    data: {
      user: { ...user },
      token: token,
    },
  };
};

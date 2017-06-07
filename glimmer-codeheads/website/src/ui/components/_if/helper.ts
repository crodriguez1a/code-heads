export default function _if(params) {
  let [ bool, a, b ] = params;
  return !!bool ? a : b;
};

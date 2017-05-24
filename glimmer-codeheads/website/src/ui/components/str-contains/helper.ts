export default function strContains(params) {
  // REVIEW consider indexOf
  let a = (params[0]).toString();
  let b = (params[1]).toString();
  return (new RegExp(a, 'ig')).test(b);
};

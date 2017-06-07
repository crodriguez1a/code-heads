export default function strContains(params) {
  // REVIEW consider indexOf
  let [a, b] = params;
  return (new RegExp((a).toString(), 'ig')).test((b).toString());
};

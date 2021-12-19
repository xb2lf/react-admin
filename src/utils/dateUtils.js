function fillZero(num) {
  return num >= 10 ? num : '0' + num
}
export function formatDate(time) {
  if (!time) return;
  let date = new Date(time);
  return date.getFullYear() + '-' + fillZero((date.getMonth() + 1)) + '-' + fillZero(date.getDate()) + ' ' + fillZero(date.getHours()) + ':' + fillZero(date.getMinutes()) + ':' + fillZero(date.getSeconds())
}
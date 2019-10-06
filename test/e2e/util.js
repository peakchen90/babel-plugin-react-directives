/**
 * enzyme 返回wrapper.setState的Promise
 * @param wrapper
 * @param val
 * @return {Promise<unknown>}
 */
export function setStatePromisify(wrapper, val) {
  return new Promise((resolve) => {
    wrapper.setState(val, resolve);
  });
}

/**
 * 等待
 * @param ms
 * @return {Promise<unknown>}
 */
export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

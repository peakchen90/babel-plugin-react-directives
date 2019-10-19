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
